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
  con: cStyles.container,
  con_content: [cStyles.container, { backgroundColor: Colors.WHITE_COLOR }],
  con_header_center: [cStyles.column_align_center],
  con_separator: { height: 10, width: '100%', backgroundColor: Colors.BORDER_LARGE_COLOR },
  con_separator_option: { height: 1, backgroundColor: Colors.BORDER_COLOR },

  con_payment: { backgroundColor: Colors.WHITE_COLOR, width: Devices.width, marginTop: 10 },
  con_header: [cStyles.row_justify_between, cStyles.row_align_center, {
    height: Devices.sW("13%"),
  }],
  con_row_item: [cStyles.row_justify_start, cStyles.row_align_center, {
    height: Devices.sW("13%"), borderRadius: 5, marginBottom: 10, paddingHorizontal: 10,
  }],
  con_row_item_inActive: [cStyles.row_justify_between, cStyles.row_align_center, {
    height: Devices.sW("13%"), marginBottom: 10, paddingHorizontal: 10,
  }],
  con_border_large: { height: 15, backgroundColor: Colors.BORDER_LARGE_COLOR, marginTop: 10, },

  txt_item_title: [cStyles.txt_base_item, { flex: 1, paddingHorizontal: 10, }],
  txt_item_title_inActive: [cStyles.txt_base_item, { flex: 1, paddingHorizontal: 10, }],

  // add new address
  con_add_new_address: [cStyles.row_align_center, { paddingLeft: 10, paddingVertical: 15 }],
  con_modal_content: { backgroundColor: Colors.WHITE_COLOR, justifyContent: 'center', borderRadius: 10 },
  con_modal_input: [cStyles.column_align_start],
  con_form: { width: '100%' },
  con_input: [cStyles.row_align_center, cStyles.row_justify_start, { height: Devices.sW("15%") }],
  con_input_modal: [cStyles.pt_20, { width: '100%' }],
  con_label: { marginLeft: Devices.OS === 'android' ? -12 : -15, color: Colors.PLACEHOLDER_COLOR },
  con_label_modal: { marginLeft: Devices.OS === 'android' ? 2 : 0 },
  con_name: [cStyles.row_align_center, { flex: 1, height: Devices.sW("15%") }],
  con_btn_add: { marginTop: 10, backgroundColor: Colors.PRIMARY_COLOR, borderRadius: 5 },
  con_is_same: [cStyles.row_align_center, { width: '100%' }],
  con_row: [cStyles.row_align_center, { flex: 1, paddingTop: 10 }],
  con_col: { flex: .5 },

  txt_label: [cStyles.txt_base_item, { color: Colors.PLACEHOLDER_COLOR }],
  txt_add_new_address: [cStyles.txt_title_item, { paddingLeft: 10 }],
  txt_input: [cStyles.x_small, { marginLeft: -15 }],
  txt_btn_add: cStyles.txt_title_button,
  txt_error: [cStyles.txt_base_item, { color: Colors.RED_COLOR }],
  txt_is_same: [cStyles.txt_base_item, cStyles.pl_10, { width: "90%" }],
  txt_item_content: [cStyles.txt_base_item, { color: Colors.BLACK_COLOR, flex: 1 }],
  txt_address_title: [cStyles.txt_title_group, { color: Colors.BLACK_COLOR, paddingHorizontal: 10 }],
  txt_name_left: { flex: .3, marginRight: 5 },
  txt_name_right: { flex: .7, marginLeft: 5 },
  txt_phone_left: { flex: .4, marginRight: 5 },
  txt_phone_right: { flex: .6, marginLeft: 5 },
  txt_city_left: { flex: .7, marginRight: 5 },
  txt_city_right: { flex: .3, marginLeft: 5 },

  // BUTTON
  con_footer: [cStyles.shadow, {
    backgroundColor: Colors.WHITE_COLOR, paddingHorizontal: 10, paddingVertical: 15
  }],
  con_btn: { backgroundColor: Colors.PRIMARY_COLOR, },

  txt_btn: cStyles.txt_title_button,

  //PICKER
  con_picker: [cStyles.column_align_start, cStyles.column_justify_center, { height: Devices.sW("13%"), backgroundColor: "red" }],
  con_item_picker: { borderWidth: 1, flex: 1, width: "100%", justifyContent: "center", borderColor: Colors.BORDER_COLOR },
}