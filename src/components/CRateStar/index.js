/**
 ** Name: 
 ** Author: 
 ** CreateAt: 
 ** Description: 
**/
/* LIBRARY */
import React from 'react';
import { View } from 'react-native';
import StarRating from 'react-native-star-rating';
/* COMPONENTS */
import CText from '../CText';
/* COMMON */
import { Colors } from '~/utils/colors';
import { Configs } from '~/config';
import { cStyles } from '~/utils/styles';
/* STYLES */
import styles from './style';

export const CRateStar = ({
  isVendor = null,
  containerStyle = {},
  containerStyleStar = {},
  countStyle = {},
  averageRating = 1,
  ratingCount = 0,
  size = styles.con_star_size,
  starStyle = null,
  fullStarColor = null,
  emptyStarColor = null
}) => {
  return (
    <View style={[Configs.supportRTL ? cStyles.row_justify_end : cStyles.row_justify_start, cStyles.row_align_center, containerStyle]}>
      {(isVendor && ratingCount > 0) && <CText style={[styles.txt_rating_count, countStyle]}>{"(" + ratingCount + ") "}</CText>}
      <StarRating containerStyle={containerStyleStar}
        starStyle={starStyle ? starStyle : styles.con_star_item}
        disabled
        maxStars={5}
        rating={Number(averageRating)}
        starSize={size}
        fullStarColor={fullStarColor ? fullStarColor : Colors.YELLOW_COLOR}
        emptyStarColor={emptyStarColor ? emptyStarColor : Colors.YELLOW_COLOR}
      />
      {(!isVendor && ratingCount > 0) && <CText style={[styles.txt_rating_count, countStyle]}>{" (" + ratingCount + ")"}</CText>}
    </View>
  )
}