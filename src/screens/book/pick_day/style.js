/**
 ** Name: 
 ** Author: 
 ** CreateAt: 
 ** Description: 
**/
/* COMMON */
import { cStyles } from '~/utils/styles';
import { Colors } from '~/utils/colors';
import { Devices, Configs } from '~/config';

export default styles = {
  con: cStyles.container,
  con_content: [cStyles.container],
  con_header_center: [cStyles.column_align_center],
  con_separator: { height: 10, width: '100%', backgroundColor: Colors.BORDER_LARGE_COLOR },
  con_separator_option: { height: 1, backgroundColor: Colors.BORDER_COLOR },

  // PICK DAY
  con_pick_day: { flex: 1, backgroundColor: Colors.WHITE_COLOR, width: Devices.width },
  con_row_item: [cStyles.row_justify_between, cStyles.row_align_center, {
    height: Devices.sW("13%"), borderBottomWidth: 1, borderBottomColor: Colors.BORDER_COLOR,
  }],
  con_input_area: { paddingVertical: 10 },
  con_group_title: [cStyles.row, cStyles.center],
  txt_input: [cStyles.txt_base_item, cStyles.br_5,
  Configs.supportRTL && cStyles.txt_RTL,
  Configs.supportRTL && cStyles.pr_10, {
    marginTop: 0
  }],
  txt_title_item: [cStyles.txt_title_item],
  // BUTTON
  con_footer: [cStyles.shadow, cStyles.row, {
    backgroundColor: Colors.WHITE_COLOR, paddingVertical: 10
  }],
  con_btn: { flex: 1, backgroundColor: Colors.PRIMARY_COLOR, borderRadius: 5 },
  con_btn_back: { flex: 1, backgroundColor: Colors.BORDER_LARGE_COLOR, borderRadius: 5 },

  txt_btn_back: [cStyles.txt_title_button, { color: Colors.PLACEHOLDER_COLOR }],
  txt_btn: cStyles.txt_title_button,

  //POP UP
  con_modal: [cStyles.container, { backgroundColor: "transparent", paddingHorizontal: 20 }],
  con_popup: [cStyles.center, { backgroundColor: Colors.WHITE_COLOR, width: "100%", padding: 20, borderRadius: 5 }],
  con_popup_img: { width: Devices.sW("45%"), height: Devices.sW("45%") },
  con_booking_code: [cStyles.row_align_center],
  con_popup_btn: { marginTop: 10 },

  img_popup: { width: "100%", height: "100%" },

  txt_title_success: [cStyles.txt_title_group, { color: Colors.PRIMARY_COLOR }],
  txt_title_failed: [cStyles.txt_title_group, { color: Colors.RED_COLOR }],
  txt_popup_content: [cStyles.txt_body_meta_item, { textAlign: "center", color: Colors.PLACEHOLDER_COLOR, paddingVertical: 20, }],

  icon_popup: { position: "absolute", top: 20, left: 10 },

  spi_loading: { marginRight: 10 }

}