/**
 ** Name:
 ** Author:
 ** CreateAt:
 ** Description:
**/
/* LIBRARY */
import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
/* COMPONENTS */
import CText from '~/components/CText';
import CImage from '~/components/CImage';
import CViewRow from "~/components/CViewRow";
/* COMMON */
import { Configs, Assets, Devices } from '~/config';
import { Colors } from '~/utils/colors';
import { cStyles } from '~/utils/styles';
import { layoutWidth } from '~/utils/layout_width';

const styles = {
  /** ITEM */
  con_row_item: [cStyles.flex_full, cStyles.center, { height: "100%", width: "100%" }],
  con_row_item_left: [cStyles.row_align_center, { flex: .7 }],
  con_row_item_right: [cStyles.row_align_center, { flex: .3 }],
  con_count_product: [cStyles.center, {
    height: 25, width: 25, borderRadius: Devices.bR(25),
    backgroundColor: Colors.WHITE_COLOR, marginRight: 10
  }],
  con_content_image: cStyles.flex_full,

  img_item: { height: Devices.sW("23%") - 2 },

  txt_title_item: [cStyles.txt_title_group, { flex: 1, paddingLeft: 10, color: Colors.WHITE_COLOR }],
  txt_count_product: [cStyles.txt_base_item, { color: Colors.PRIMARY_COLOR }]
}

export const CategoryItem = (index, data, onPress) => {
  let source = Assets.image_failed;
  if (data.image) {
    source = { uri: data.image.src };
  }

  return (
    <TouchableOpacity style={[cStyles.center, cStyles.shadow, cStyles.mb_20,
    { height: Devices.sW("23%"), width: "100%", paddingHorizontal: Devices.pH(layoutWidth.width) }]}
      onPress={() => onPress(data)}>
      <CImage style={[styles.img_item, cStyles.br_10,
      { width: Devices.width - (Devices.pH(layoutWidth.width) * 2) }]}
        source={source}
        resizeMode={"cover"}>
        <LinearGradient style={[styles.con_row_item, cStyles.br_10]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
          colors={Colors.CATEGORY_ITEM}>
          <CViewRow style={[styles.con_content_image, { paddingHorizontal: Devices.pH(layoutWidth.width) }]} between
            leftComp={
              <View style={styles.con_row_item_left}>
                <CText style={styles.txt_title_item} numberOfLines={3}>{Configs.html5Entities.decode(data.name)}</CText>
              </View>
            }
            rightComp={
              <View style={[styles.con_row_item_right, Configs.supportRTL ? cStyles.column_align_start : cStyles.column_align_end]}>
                <View style={styles.con_count_product}>
                  <CText style={styles.txt_count_product}>{data.count}</CText>
                </View>
              </View>
            }
          />
        </LinearGradient>
      </CImage>
    </TouchableOpacity>
  )
}