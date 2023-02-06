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
  con_content: [cStyles.container, { backgroundColor: Colors.BORDER_LARGE_COLOR }],
  con_header_center: [cStyles.column_align_center],
  con_separator: { height: 10, width: '100%', backgroundColor: Colors.BORDER_LARGE_COLOR },
  con_separator_option: { height: 1, backgroundColor: Colors.BORDER_COLOR },

  // PAYMENT
  con_payment: { flex: 1, backgroundColor: Colors.WHITE_COLOR, width: Devices.width },
  con_header: [cStyles.row_justify_between, cStyles.row_align_center, {
    height: Devices.sW("13%"),
  }],
  con_row_item: [cStyles.br_5, cStyles.ph_10, cStyles.pv_10],
  con_border_large: { height: 15, backgroundColor: Colors.BORDER_LARGE_COLOR, marginTop: 10, },

  txt_item_title: [cStyles.txt_title_header],
  txt_item_description: [cStyles.txt_base_item, {width: '90%', color: Colors.PLACEHOLDER_COLOR} ],
  // BUTTON
  con_footer: [cStyles.shadow, {
    backgroundColor: Colors.WHITE_COLOR, paddingHorizontal: 10, paddingVertical: 15
  }],
  con_btn: { backgroundColor: Colors.PRIMARY_COLOR, },

  txt_btn: cStyles.txt_title_button,
}