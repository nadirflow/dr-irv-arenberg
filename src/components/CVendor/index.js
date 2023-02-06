/**
 ** Name: 
 ** Author: 
 ** CreateAt: 
 ** Description: 
**/
/* LIBRARY */
import React from 'react';
import { ImageBackground, View, TouchableOpacity } from 'react-native';
/* COMPONENTS */
import CText from '../CText';
/* COMMON */

/* STYLES */
import styles from './style';
import CImage from '../CImage';
import { CRateStar } from '../CRateStar';

export const CVendor = ({
  data = null,
  isList = null,
  index = null,
  onPress = () => { },
}) => {
  if (data.store_rating === "") {
    data.store_rating = 0;
  }

  return (
    <TouchableOpacity key={index} onPress={() => onPress(data)}>
      <ImageBackground style={styles.con_banner}
        source={{ uri: data.mobile_banner }}
        resizeMode={"cover"}
        imageStyle={{ borderRadius: 10 }}
      >
        <View style={styles.con_banner_opacity} />
        <View style={styles.con_banner_header}>
          <CImage source={{ uri: data.vendor_shop_logo }}
            style={styles.con_vendor_logo}
          />
          <View style={styles.con_banner_content}>
            <CText style={styles.txt_banner_shop_name}>{data.vendor_shop_name}</CText>
            <CRateStar isVendor averageRating={data.store_rating} />
          </View>
          {isList &&
            <View style={styles.con_row_item_right}>
              <CText style={styles.txt_count_product} i18nKey={'visit_store'} />
            </View>
          }
        </View>
      </ImageBackground>
    </TouchableOpacity>
  )
}