/**
 ** Name: 
 ** Author: 
 ** CreateAt: 
 ** Description: 
**/
/* COMMON */
import { Devices } from '~/config';
import { cStyles } from '~/utils/styles';
import { Colors } from '~/utils/colors';

export default styles = {
  con_separator: { height: 1, width: "100%", backgroundColor: Colors.BORDER_COLOR, marginVertical: 10 },

  con_list_store: [cStyles.container],
  con_store: [cStyles.row_align_start, { borderRadius: 10 }],
  con_title_store: [cStyles.row_justify_between, cStyles.row_align_start],
  con_address_store: [cStyles.column_align_start, { marginTop: 3 }],
  con_info_store: [cStyles.column_align_start, cStyles.flex_full],
  con_review_store: [cStyles.row_align_center, { marginTop: 5 }],
  con_cart_service_selected: [cStyles.row],
  con_news_time: [cStyles.row_align_start],
  con_content_price: [cStyles.row_align_end, {}],
  con_content_price_2: [cStyles.row_align_center, cStyles.row_justify_end],
  con_content_image: [cStyles.flex_full, { position: 'absolute' }],
  con_bookmark: { position: 'absolute', top: 10 },
  con_product_new: { position: 'absolute', paddingHorizontal: 5, paddingVertical: 2, backgroundColor: Colors.PRIMARY_COLOR, borderRadius: 3 },
  con_product_sale: { position: 'absolute', paddingHorizontal: 5, paddingVertical: 2, backgroundColor: Colors.SALE_COLOR, borderRadius: 3 },
  con_btn_delete_bm: [cStyles.column_align_center, { height: 30, width: 30 }],
  con_amount_item: [cStyles.row_align_center, cStyles.row_justify_end, { width: '100%' }],
  con_amount_right: [cStyles.row_align_center, { marginTop: 5 }],
  con_input_amount: [cStyles.center, { borderWidth: 1, borderColor: Colors.PRIMARY_COLOR, borderRadius: 5, marginHorizontal: 10, width: Devices.sW('10%') }],
  con_amount: [cStyles.column_justify_end],
  con_button_add: [cStyles.row_align_end, cStyles.row_justify_between, { width: '100%' }],
  con_btn_add: [{ borderRadius: 5, padding: 5 }],
  con_content_short_des: { marginBottom: 10 },
  con_variations: [cStyles.row_align_center, cStyles.row_justify_start, { marginTop: 10 }],
  con_picker_variations: { borderWidth: .5, borderColor: Colors.PLACEHOLDER_COLOR, flex: 1, borderRadius: 5, height: Devices.sW('8%'), justifyContent: "center" },
  con_content_short_des: { marginTop: 5 },

  txt_btn: [cStyles.txt_title_button, { color: Colors.WHITE_COLOR }],
  txt_amount_item: [cStyles.xxx_small, { paddingVertical: 2 }],
  txt_amount_title: [cStyles.txt_title_item],
  txt_title_new: [cStyles.txt_title_item, { flex: .9 }],
  txt_news_description: [cStyles.txt_body_meta_item, { marginTop: 3 }],
  txt_news_time: [cStyles.txt_body_meta_item, { marginTop: 3 }],
  txt_news_category: [cStyles.txt_body_meta_item, { marginTop: 3 }],
  txt_title_category: [cStyles.txt_title_item, { flex: 1 }],
  txt_title_service: [cStyles.txt_title_item, { flex: 1 }],
  txt_content_price_sale: [cStyles.txt_base_price, { color: Colors.SALE_COLOR }],
  txt_price_item: [cStyles.txt_base_price],
  txt_unit_item: [cStyles.txt_base_price],
  txt_rating_count: [cStyles.txt_body_meta_item],
  txt_author: [cStyles.txt_body_meta_item, { marginTop: 3 }],
  txt_regular_price: { color: Colors.PLACEHOLDER_COLOR, textDecorationLine: 'line-through' },
  txt_out_of_stock: [cStyles.txt_body_meta_item, { color: Colors.GOOGLE_PLUS_COLOR }],
  txt_on_back_order: [cStyles.txt_base_item, { color: Colors.YELLOW_COLOR }],
  txt_product_new: [cStyles.txt_body_meta_item, { fontWeight: "bold", color: Colors.WHITE_COLOR }],
  txt_product_sale: [cStyles.txt_body_meta_item, { fontWeight: "bold", color: Colors.WHITE_COLOR }],

  img_store: { height: Devices.sW('35%'), width: Devices.sW('45%'), borderRadius: 10, borderColor: Colors.BORDER_COLOR, borderWidth: 1 },

  /** PICKER */
  con_group_picker: [cStyles.row_align_center],
  con_picker: [cStyles.column_justify_center, { borderWidth: .5, flex: 1, borderRadius: 10, height: 40 }],

  txt_title_picker: [cStyles.txt_title_item, { paddingRight: 10 }],
}