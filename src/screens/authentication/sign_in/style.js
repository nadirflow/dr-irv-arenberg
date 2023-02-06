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
  /** HEADER */
  con_btn_back: {
    position: "absolute", 
    top: Devices.sW("2%") + (Devices.OS === 'ios' ? 20 : 100), 
    right: 10, 
    backgroundColor: Colors.WHITE_COLOR, 
    zIndex: 200
  },
  con_icon_back: [cStyles.column_align_center, { width: Devices.fS(40) }],
  con_header: { paddingTop: Devices.OS === 'ios' ? 20 : 100 },

  /** CONTENT */
  con_form_sign_in: [cStyles.column_align_center, cStyles.p_20, cStyles.mt_20, cStyles.br_10,
  { backgroundColor: Colors.WHITE_COLOR }
  ],
  con_btn: [cStyles.mt_20, { backgroundColor: Colors.PRIMARY_COLOR }],
  con_input: cStyles.pv_5,
  con_label: { marginLeft: Devices.OS === 'android' ? -12 : -15 },
  con_forgot_password: [cStyles.column_align_center, cStyles.pv_10],
  con_socials: [cStyles.flex_full, cStyles.column_align_center, cStyles.column_justify_center],
  con_icon_socials: [cStyles.column_align_end, cStyles.pr_20, { flex: .3 }],
  con_sign_up: [cStyles.column_align_center, cStyles.column_justify_center],
  con_btn_sign_up: [cStyles.mt_20, { borderColor: Colors.PRIMARY_COLOR }],
  con_btn_social: [cStyles.row_align_center, cStyles.mt_20],
  con_btn_facebook: { backgroundColor: Colors.FACEBOOK_COLOR },
  con_btn_google: { backgroundColor: Colors.GOOGLE_PLUS_COLOR },
  con_btn_apple: { backgroundColor: Colors.APPLE_COLOR },

  separator: { width: Devices.sW("60%"), borderBottomColor: Colors.BORDER_COLOR, borderBottomWidth: 1 },

  txt_title: [cStyles.txt_body_meta_item, { textAlign: "center" }],
  txt_btn: cStyles.txt_title_button,
  txt_label: cStyles.txt_base_item,
  txt_input: [cStyles.txt_base_item, { marginLeft: -15 }],
  txt_forgot_password: [cStyles.txt_base_item, cStyles.txt_unline],
  txt_sign_up_1: cStyles.txt_base_item,
  txt_sign_up_2: [cStyles.txt_base_item, { color: Colors.PRIMARY_COLOR, marginLeft: 5 }],
  txt_error: [cStyles.txt_base_item, { color: Colors.RED_COLOR }],
  txt_login_social: [cStyles.txt_title_button, { flex: .7 }],

  spi_loading: [cStyles.flex_full, cStyles.mv_10]
}