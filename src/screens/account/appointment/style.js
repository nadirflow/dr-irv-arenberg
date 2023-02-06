/**
 ** Name: 
 ** Author: 
 ** CreateAt: 
 ** Description: 
**/
/* COMMON */
import { Configs } from "~/config";
import { Colors } from '~/utils/colors';
import { cStyles } from '~/utils/styles';

export default styles = {
  /** ITEM */
  con_section_list: [cStyles.pv_20, cStyles.ph_10, { borderwidth: 1, borderColor: Colors.BORDER_COLOR, height: 50 }],
  con_content_item: [cStyles.p_10, cStyles.br_5],
  con_header_item: [cStyles.row_align_start, cStyles.row_justify_between],
  con_footer_item: [cStyles.mt_5, Configs.supportRTL && cStyles.column_align_end],
  con_row_item: [cStyles.row_align_center],

  txt_title_item: [cStyles.txt_title_item, { flex: .9 }, Configs.supportRTL && cStyles.txt_RTL],
  txt_status_header: [cStyles.txt_body_meta_item, cStyles.ph_5, { fontWeight: "bold", color: Colors.WHITE_COLOR, textAlign: 'center' }],
  txt_row_item: [cStyles.txt_body_meta_item, { lineHeight: 25 }]
}