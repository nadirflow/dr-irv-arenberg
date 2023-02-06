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
  con_form_sign_in: [cStyles.p_20, cStyles.mt_20, cStyles.br_10, {
    width: Devices.width - 40,
    backgroundColor: Colors.WHITE_COLOR
  }],
  con_input: cStyles.pv_5,
  con_btn: [cStyles.mt_20, { backgroundColor: Colors.PRIMARY_COLOR }],
  con_label: { marginLeft: Devices.OS === 'android' ? -12 : -15 },

  txt_title: [cStyles.txt_base_item, { textAlign: "center" }],
  txt_title_step: [cStyles.txt_title_group_drawer, cStyles.mb_10, { textAlign: "center" }],
  txt_input_otp: [cStyles.txt_title_group_drawer, { color: Colors.PRIMARY_COLOR }],
  txt_label: cStyles.txt_base_item,
  txt_btn: cStyles.txt_title_button,
  txt_input: [cStyles.txt_base_item, { marginLeft: -15 }],
  txt_error: [cStyles.txt_base_item, { color: Colors.RED_COLOR }],
  txt_success: [cStyles.txt_base_item, { color: Colors.GREEN_COLOR }],

  underlineStyleBase: [cStyles.txt_title_group, {
    width: Devices.sW("15%"),
    height: 50,
    borderWidth: 0,
    borderBottomWidth: 3,
    borderBottomColor: Colors.BORDER_LARGE_COLOR,
    color: Colors.PRIMARY_COLOR
  }],

  underlineStyleHighLighted: {
    borderBottomColor: Colors.PRIMARY_COLOR,
  },

  spi_loading: { position: "absolute", left: 10 }
}