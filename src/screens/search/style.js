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

  /** SEARCH */
  con_history_search: cStyles.pv_15,

  txt_search: [cStyles.txt_base_item, cStyles.pl_10],
  txt_header_cancel: [cStyles.txt_body_meta_item],

  /** HISTORY */
  con_content_history: cStyles.mt_10,
  con_history_item: [cStyles.center, cStyles.br_5, cStyles.ph_10, cStyles.pv_5, cStyles.mr_10, {
    backgroundColor: Colors.BORDER_LARGE_COLOR
  }],

  /** LIST SEARCH */
  con_list_search: [{ flex: 1, borderTopColor: Colors.BORDER_COLOR, borderTopWidth: 1 }],
  con_content_list_search: [cStyles.flex_grow],
  con_star: { marginTop: 0 },
  con_content_price_2: [cStyles.row_align_center, cStyles.row_justify_end],
  con_name_product: [cStyles.column_justify_between, { width: Devices.sW('45%') }],
  con_product_sale: [cStyles.ph_5, cStyles.br_5, { paddingVertical: 2, backgroundColor: Colors.YELLOW_COLOR }],
  con_product_new: [cStyles.mr_10, cStyles.ph_5, cStyles.br_5, { paddingVertical: 2, backgroundColor: Colors.PRIMARY_COLOR }],
  con_tag: [cStyles.row_align_center, cStyles.mt_10, { width: "100%" }],

  txt_product_new: [cStyles.txt_body_meta_item, { color: Colors.WHITE_COLOR }],
  txt_product_sale: [cStyles.txt_body_meta_item, { color: Colors.WHITE_COLOR }],
  txt_content_price_sale: [cStyles.txt_base_item, { color: Colors.SALE_COLOR }],
  txt_name_item: [cStyles.txt_title_item],
  txt_price_item: [cStyles.txt_base_item],
  txt_unit_item: [cStyles.txt_base_item],

  img_product_item: [cStyles.br_5, { height: Devices.sW('20%'), width: Devices.sW('26.6%') }]
}