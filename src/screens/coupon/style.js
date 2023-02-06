/**
 ** Name: 
 ** Author: 
 ** CreateAt: 
 ** Description: 
**/
import { StyleSheet } from "react-native";
/* COMMON */
import { cStyles } from '~/utils/styles';
import { Colors } from '~/utils/colors';
import { Devices } from '~/config';

export default styles = {
  /** COUPON LIST */
  con_info_coupon: { ...StyleSheet.absoluteFill, zIndex: 2 },
  con_coupons_item: cStyles.br_10,
  con_item_coupon: [{ width: Devices.sW('44%') }],
  con_bg_blur: [cStyles.flex_full, {
    ...StyleSheet.absoluteFill, backgroundColor: 'rgba(0,0,0,.3)', zIndex: 1
  }],
  con_col_info: [cStyles.pt_5, { zIndex: 2 }],
  con_list_coupon: cStyles.pt_10,

  txt_row_right_top: [cStyles.txt_base_item, cStyles.pt_5, { color: Colors.WHITE_COLOR }],
  txt_row_right_bottom: [cStyles.txt_base_item, { color: Colors.WHITE_COLOR, fontWeight: '600' }],
  txt_item_coupon_content: [cStyles.txt_title_item, cStyles.pv_10],

  img_coupon: [cStyles.br_10, { width: Devices.sW('44%'), height: Devices.sW('31%') }],
  img_icon_coupon: { width: Devices.sW('8%'), height: Devices.sW('6%') },

}