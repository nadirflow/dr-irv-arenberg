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
  con_content: cStyles.mv_10,
  con_row_item: [cStyles.pv_15, {
    borderBottomWidth: 1, borderBottomColor: Colors.BORDER_LARGE_COLOR
  }],
  con_no_products: [cStyles.column_align_center, cStyles.ph_10],

  /** Header */
  con_header_center: cStyles.column_align_center,
  con_header: [cStyles.row_justify_between, cStyles.row_align_center, cStyles.pv_20, {
    borderBottomWidth: 1, borderBottomColor: Colors.BORDER_LARGE_COLOR,
  }],

  txt_header_title: cStyles.txt_title_group,
  txt_num_cart_header: cStyles.txt_body_meta_item,

  /** List products */
  con_list: [cStyles.flex_grow, cStyles.pb_20],
  con_products_content: [cStyles.row_justify_between, cStyles.pv_10],
  con_price_product: [cStyles.row_align_start, cStyles.row_justify_end],
  con_products_item_left: [cStyles.row_align_start, { flex: .6 }],
  con_products_item_right: [cStyles.column_justify_between, { flex: .4 }],
  con_products_item_name: [cStyles.column_justify_between, cStyles.mh_10],
  con_amount_item: [cStyles.row_align_center, cStyles.row_justify_between, cStyles.pt_10],
  con_amount_right: [cStyles.row_align_center, cStyles.ph_10, cStyles.br_5, {
    backgroundColor: Colors.BACKGROUND_AUTH_COLOR, paddingVertical: 3
  }],
  con_input_amount: [cStyles.center, { width: 50 }],

  txt_amount_item: [cStyles.txt_base_item, { paddingVertical: 2 }],
  txt_products_title: [cStyles.txt_title_item],
  txt_products_discount_price: [cStyles.txt_body_meta_item, { textAlign: 'right' }],
  txt_products_discount_unit_left: [cStyles.txt_body_meta_item, { textAlign: 'left' }],
  txt_products_discount_unit_right: [cStyles.txt_body_meta_item, { textAlign: 'right' }],
  txt_products_price: [cStyles.txt_base_item, { textAlign: 'right' }],
  txt_products_unit_left: [cStyles.txt_base_item, { textAlign: 'left' }],
  txt_products_unit_right: [cStyles.txt_base_item, { textAlign: 'right' }],
  txt_products_option: cStyles.txt_body_meta_item,

  img_service: [cStyles.br_5, { height: Devices.sW('20%'), width: Devices.sW('26.6%') }],

  /** Discount */
  con_discount: { backgroundColor: Colors.WHITE_COLOR },
  con_discount_child: [cStyles.row_align_center, cStyles.row_justify_between, cStyles.pb_10],
  con_input: { height: Devices.sW("13%") },
  con_coupon: cStyles.pv_10,

  /** Summary */
  con_summary: { backgroundColor: Colors.WHITE_COLOR },

  txt_summary_content: cStyles.txt_title_item,
  txt_total_content: cStyles.txt_title_item,

  /** Button */
  con_footer: [cStyles.center, { backgroundColor: Colors.WHITE_COLOR, borderTopWidth: 0 }],
  con_btn: [cStyles.full_center, { backgroundColor: Colors.PRIMARY_COLOR }],
  con_btn_apply: { backgroundColor: Colors.WHITE_COLOR, borderWidth: 1, marginTop: 10 },
  con_group_right: { flex: .4 },

  txt_btn: cStyles.txt_title_button,
  txt_no_products: cStyles.txt_no_data_1,
  txt_products_unit_coupon_left: [cStyles.txt_base_item, { textAlign: 'left' }],
  txt_products_unit_coupon_right: [cStyles.txt_base_item, { textAlign: 'right' }],
  txt_summary_coupon_content: cStyles.txt_base_item,
  txt_coupon_input: [cStyles.xx_small, { paddingLeft: 0 }],
  txt_btn_apply: { color: Colors.PRIMARY_COLOR },
  txt_group_left: [cStyles.txt_title_group, { flex: .6 }],
  txt_group_right: cStyles.txt_title_group,
  txt_group_subtotal: [cStyles.txt_title_group_drawer, { color: Colors.PRIMARY_COLOR }],

  img_no_products: [cStyles.mb_20, { height: Devices.sW("50%"), width: Devices.sW("50%"), marginTop: Devices.sW("30%") }]
}