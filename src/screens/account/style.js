/**
 ** Name: 
 ** Author: 
 ** CreateAt: 
 ** Description: 
**/
/* COMMON */
import { cStyles } from '~/utils/styles';
import { Colors } from '~/utils/colors';
import { Devices } from '~/config';

export default styles = {
  con_separator: { height: 10, width: '100%', backgroundColor: Colors.BORDER_LARGE_COLOR },
  con_separator_option: { height: 1, backgroundColor: Colors.BORDER_COLOR },

  /** ACCOUNT */
  con_content_row: [cStyles.row_align_center, cStyles.row_justify_between, cStyles.pv_15],
  con_content_left_row: { flex: .1 },
  con_content_center_row: cStyles.column_align_start,
  con_content_right_row: [cStyles.column_align_end, { flex: .1 }],
  con_icon_social: [{ borderRadius: Devices.bR(30) }, cStyles.center, {
    width: 30, height: 30, borderWidth: 0, borderColor: Colors.BORDER_COLOR
  }],
  con_content_not_login: [cStyles.row_align_center, cStyles.row_justify_between, cStyles.pv_10],
  con_list: cStyles.mt_20,
  con_bottom_socials: [cStyles.row_align_center, cStyles.pt_20],
  con_footer: [cStyles.center, { backgroundColor: Colors.WHITE_COLOR, borderTopWidth: 0, height: 30 }],

  txt_avatar: [cStyles.txt_base_item, cStyles.pl_10],
  txt_name_avatar: [cStyles.txt_base_item, cStyles.pl_5],
  txt_title: [cStyles.txt_body_meta_item, cStyles.pb_5, { textAlign: "center" }],
  txt_row: [cStyles.txt_base_item],
  txt_footer: [cStyles.txt_body_meta_item],

  img_avatar: [cStyles.center, {
    height: Devices.sW('15%'), width: Devices.sW('15%'), borderRadius: Devices.bR(Devices.sW('15%')),
    borderColor: Colors.BORDER_COLOR, borderWidth: 1
  }],
  img_icon_social: { width: "100%", height: "100%" },

  /** BUTTON */
  con_btn_sign_in: [cStyles.flex_full, { borderRadius: 5, borderColor: Colors.PRIMARY_COLOR }],
  con_btn_sign_up: [cStyles.flex_full, { backgroundColor: Colors.WHITE_COLOR, borderColor: Colors.PRIMARY_COLOR, borderRadius: 5 }],

  txt_btn_sign_up: [cStyles.txt_title_button, { color: Colors.PRIMARY_COLOR }],
  txt_btn_sign_in: cStyles.txt_title_button,
}