/**
 ** Name:
 ** Author:
 ** CreateAt:
 ** Description:
 **/
import {StyleSheet} from 'react-native';
/* COMMON */
import {cStyles} from '~/utils/styles';
import {Colors} from '~/utils/colors';
import {Configs, Devices} from '~/config';
import {layoutWidth} from '~/utils/layout_width';

export default {
  con_content: cStyles.container,
  con_title_category: [
    cStyles.pv_5,
    cStyles.pr_10,
    !Configs.supportRTL
      ? [cStyles.br_tr_20, cStyles.br_br_20]
      : [cStyles.br_tl_20, cStyles.br_bl_20],
  ],

  img_header_logo: {height: '60%', width: '50%'},

  /** COUPON LIST */
  con_first_coupon_item: {paddingLeft: Devices.pH(layoutWidth.width)},
  con_last_coupon_item: {paddingRight: Devices.pH(layoutWidth.width)},
  con_coupons_item: cStyles.br_10,
  con_item_coupon: {width: Devices.sW('43%')},
  con_header_group: [
    cStyles.row_justify_between,
    cStyles.row_align_center,
    cStyles.pv_10,
  ],
  con_bg_blur: [
    cStyles.flex_full,
    {
      ...StyleSheet.absoluteFill,
      backgroundColor: 'rgba(0,0,0,.3)',
      zIndex: 1,
    },
  ],
  con_col_info: [cStyles.pt_5, {zIndex: 2}],
  con_info_coupon: {...StyleSheet.absoluteFill, zIndex: 2},

  txt_row_right_top: [
    cStyles.txt_base_item,
    {color: Colors.WHITE_COLOR, paddingTop: 5},
  ],
  txt_row_right_bottom: [
    cStyles.txt_base_item,
    {color: Colors.WHITE_COLOR, fontWeight: '600'},
  ],
  txt_coupon_title: [cStyles.txt_title_group, cStyles.pl_10],
  txt_coupon_show_all: [
    cStyles.txt_body_meta_item,
    cStyles.txt_italic,
    {color: Colors.PLACEHOLDER_COLOR},
    !Configs.supportRTL ? cStyles.pr_10 : cStyles.pl_10,
  ],
  txt_item_coupon_content: [cStyles.txt_title_item, {paddingVertical: 10}],

  img_coupon: [
    cStyles.br_10,
    {width: Devices.sW('43%'), height: Devices.sW('31%')},
  ],
  img_icon_coupon: {width: Devices.sW('8%'), height: Devices.sW('6%')},
  header_top_search:{backgroundColor: 'rgba(255,255,255,0.7)', color: 'rgba(255,255,255,1)', },

  // snap_item: {
  //   width: this.screenWidth - 160,
  //   height: this.screenWidth - 200,
  //   // backgroundColor:Colors.FACEBOOK_COLOR
  // },
  snap_imageContainer: {
    flex: 1,
    // marginBottom: Platform.select({ ios: 0, android: 1 }), // Prevent a random Android rendering issue
    backgroundColor: 'grey',
    borderRadius: 8,
  },
  snap_image: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: 'cover',
  },
  snap_courselContainer: {
    // flex: 1,
    backgroundColor: '#F4511E',//red
    height: 100
  },
  snap_title: {
    height: 20
  },
  // snap_dummyHeight: {
  //   height: this.screenWidth - 200
  // }
};
