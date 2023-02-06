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
  con_separator_option: { height: 1, backgroundColor: Colors.BORDER_COLOR },

  /** CONTENT */
  con_content_row: [cStyles.row_align_center, cStyles.row_justify_between, cStyles.pv_15],
  con_content_left_row: [{ flex: .1 }],
  con_content_center_row: [cStyles.row_align_center],
  con_content_right_row: [cStyles.column_align_end, { flex: .1 }],
  con_list: {},

  txt_row: cStyles.txt_title_item,
}