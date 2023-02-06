/**
 ** Name: 
 ** Author: 
 ** CreateAt: 
 ** Description: 
**/
/* COMMON */
import { Colors } from '~/utils/colors';
import { Devices } from "~/config";
import { cStyles } from '~/utils/styles';

export default styles = {
  con_separator_option: { height: 1, backgroundColor: Colors.BORDER_COLOR },

  /** HEADER */
  con_img_logo: [cStyles.column_align_center, cStyles.column_justify_end],

  /** CONTENT */
  con_content_row: [cStyles.row_align_center, cStyles.row_justify_between, cStyles.pv_15],
  con_content_left_row: [{ flex: .1 }],
  con_content_center_row: cStyles.row_align_center,

  txt_row: cStyles.txt_title_item,

  img_logo: { height: Devices.sW('30%'), width: Devices.sW('50%') },
}