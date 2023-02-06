/**
 ** Name: 
 ** Author: 
 ** CreateAt: 
 ** Description: 
**/
/* LIBRARY */
import React from 'react';
import { FlatList, View } from 'react-native';
import {
  Card,
  Container
} from "native-base";
import StarRating from 'react-native-star-rating';
import moment from 'moment';
/* COMPONENTS */
import CHeader from "~/components/CHeader";
import CText from '~/components/CText';
import CLoading from '~/components/CLoading';
import CImage from '~/components/CImage';
/* COMMON */
import { Devices, Configs } from '~/config';
import { Colors } from '~/utils/colors';
import { layoutWidth } from '~/utils/layout_width';
/* STYLES */
import styles from './style';

const renderItem = (item, index) => {
  return (
    <Card style={styles.con_item}>
      <View>
        <CImage style={styles.con_img_item} 
          source={{uri: item.author_image}}
        />
        <CText style={[styles.txt_status,{
          backgroundColor: item.approved === "0" ? Colors.YELLOW_COLOR : Colors.GREEN_COLOR
        }]} 
          i18nKey={item.approved === "0" ? "pending" : "approve"} 
        />
      </View>

      <View style={styles.con_item_content}>
        <View style={styles.con_item_title}>
          <CText style={styles.txt_item_name}>{item.author_name}</CText>
          <StarRating
            starStyle={styles.con_star_item}
            disabled
            maxStars={5}
            rating={Number(item.review_rating)}
            starSize={styles.con_star_size}
            fullStarColor={Colors.YELLOW_COLOR}
            emptyStarColor={Colors.YELLOW_COLOR}
          />
        </View>
        <CText style={styles.txt_item_des} numberOfLines={100}>{item.review_description}</CText>
        <CText style={styles.txt_item_time}>{moment(item.created).format(Configs.formatDate)}</CText>
      </View>
    </Card>
  )
}

export const ViewVendorReviews = ({
  state = null,
  props = null,
  onFunction = {
    onPressBack: () => { },
    onRefresh: () => { },
    onLoadMore: () => { }
  }
}) => {
  return (
    <Container style={styles.con}>
      <CHeader
        title={"reviews"}
        iconLeft_1={Configs.supportRTL ? "angle-right" : "angle-left"}
        iconRight_1={"none"}
        onPressLeft_1={onFunction.onPressBack}
      />
      {state._loading ? 
        <CLoading visible={true} />
      :
        <FlatList contentContainerStyle={{paddingHorizontal: Devices.pH(layoutWidth.width), flexGrow: 1}}
          data={state._reviews}
          renderItem={({item, index}) => renderItem(item, index)}
          keyExtractor={(item, index) => index.toString()}
          refreshing={state._refreshing}
          onRefresh={onFunction.onRefresh}
          onEndReachedThreshold={0.5}
          onEndReached={onFunction.onLoadMore}
        />

      }

    </Container>
  )
}