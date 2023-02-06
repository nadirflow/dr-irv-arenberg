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
  con_btn_back: [{
    position: "absolute", right: -10, top: -10,
    backgroundColor: Colors.WHITE_COLOR
  }],
  con_icon_back: [cStyles.column_align_center, { width: Devices.fS(40) }],
  con_header: { paddingTop: Devices.OS === 'ios' ? 20 : 100 },
  /** CONTENT */
  con: cStyles.container,
  con_form_sign_in: [cStyles.p_20, cStyles.mh_20, cStyles.br_10, { backgroundColor: Colors.WHITE_COLOR }],
  con_btn: cStyles.mt_20,
  con_input: [cStyles.row_align_center, cStyles.row_justify_start],
  con_label: { marginLeft: Devices.OS === 'android' ? -12 : -15 },
  con_header_center: [cStyles.column_align_center],
  con_fetch_status: [cStyles.row_align_center, cStyles.row_justify_start, cStyles.mt_15],
  con_name: [cStyles.row_align_center, { flex: 1 }],
  con_phone_input: [cStyles.column_align_start, cStyles.column_justify_center],

  txt_title: [cStyles.txt_base_item, { textAlign: "center" }],
  txt_btn: cStyles.txt_title_button,
  txt_label: cStyles.txt_base_item,
  txt_input: [cStyles.txt_base_item, { marginLeft: -15 }],
  txt_fetch_success: [cStyles.txt_base_item, cStyles.ml_10, { color: Colors.GREEN_COLOR }],
  txt_fetch_failed: [cStyles.txt_base_item, cStyles.ml_10, { color: Colors.RED_COLOR }],
  txt_error: [cStyles.txt_base_item, { color: Colors.RED_COLOR }],
  txt_already_account: [cStyles.txt_base_item, cStyles.mt_20],
  txt_sign_in: [cStyles.txt_base_item, cStyles.mt_20, cStyles.txt_unline],

  spi_loading: cStyles.mr_10
}