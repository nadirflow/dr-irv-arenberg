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
  con_list_store: [cStyles.container],
  con_store_category: [cStyles.column_justify_start, { width: Devices.sW('33%') }],
  con_store_service: [cStyles.column_justify_start, cStyles.mb_10, { width: Devices.sW('33%') }],
  con_store_news: [cStyles.column_justify_start, cStyles.mb_10, { width: Devices.sW('33%') }],
  con_info_store: [cStyles.flex_full, { padding: 10 }],
  con_title_store: [cStyles.column_align_center],
  con_address_store: [{ marginTop: 5 }],
  con_review_store: [cStyles.row_align_center, { marginTop: 5 }],
  con_icon: { position: 'absolute', top: 10, right: 10 },
  con_content_price: [cStyles.row_align_center, {}],
  con_star: {},
  con_star_item: { paddingRight: 2 },
  con_content_price_2: cStyles.row_align_center,
  con_news_info: [cStyles.column_align_start],
  con_news_time: [cStyles.row_align_start],
  con_content_image: [cStyles.flex_full, { position: 'absolute' }],
  con_bookmark: { position: 'absolute', top: 10 },
  con_product_new: { position: 'absolute', paddingHorizontal: 5, paddingVertical: 2, backgroundColor: Colors.PRIMARY_COLOR, borderRadius: 3 },
  con_product_sale: { position: 'absolute', paddingHorizontal: 5, paddingVertical: 2, backgroundColor: Colors.SALE_COLOR, borderRadius: 3 },
  con_btn_add: [{ borderRadius: 5, padding: 5 }],
  con_amount_item: [cStyles.row_align_center, cStyles.row_justify_end, { width: '100%', marginTop: 10 }],
  con_amount_right: [cStyles.row_align_center],
  con_input_amount: [cStyles.center, { borderWidth: 1, borderColor: Colors.PRIMARY_COLOR, borderRadius: 5, marginHorizontal: 10, width: Devices.sW('10%') }],
  con_amount: [cStyles.column_justify_end],
  con_button_add: [cStyles.row_align_center, { width: '100%', paddingTop: 5 }],
  con_variations: [cStyles.row_align_center, cStyles.row_justify_center, { paddingTop: 10 }],
  con_picker_variations: { flex: 1, justifyContent: "center", borderWidth: .5, borderColor: Colors.PLACEHOLDER_COLOR, borderRadius: 5, height: Devices.sW('8%') },
  con_content_short_des: { marginTop: 5 },

  txt_btn: [cStyles.txt_title_button, { color: Colors.WHITE_COLOR }],
  txt_amount_item: [cStyles.xxx_small, { paddingVertical: 2 }],
  txt_amount_title: [cStyles.txt_title_item],
  txt_content_price_sale: [cStyles.txt_base_price, { color: Colors.SALE_COLOR }],
  txt_title_store: [cStyles.txt_base_item, { color: Colors.PLACEHOLDER_COLOR }],
  txt_title_category: { textAlign: "center", paddingTop: 5, },
  txt_price_item: [cStyles.txt_base_price],
  txt_unit_item: [cStyles.txt_base_price],
  txt_title_new: [cStyles.txt_title_item],
  txt_news_description: [cStyles.txt_body_meta_item],
  txt_news_time: [cStyles.txt_body_meta_item, { marginTop: 3 }],
  txt_rating_count: [cStyles.txt_body_meta_item],
  txt_author: [cStyles.txt_body_meta_item, { marginTop: 3 }],
  txt_regular_price: { color: Colors.PLACEHOLDER_COLOR, textDecorationLine: 'line-through' },
  txt_out_of_stock: [cStyles.txt_body_meta_item, { color: Colors.GOOGLE_PLUS_COLOR }],
  txt_on_back_order: [cStyles.txt_base_item, { color: Colors.YELLOW_COLOR }],
  txt_product_new: [cStyles.txt_body_meta_item, { fontWeight: "bold", color: Colors.WHITE_COLOR }],
  txt_product_sale: [cStyles.txt_body_meta_item, { fontWeight: "bold", color: Colors.WHITE_COLOR }],

  img_store_category: [cStyles.shadow, { height: Devices.sW('28%'), width: Devices.sW('28%'), borderRadius: Devices.bR(Devices.sW("28%")), marginRight: 10 }],
  img_store_service: { height: Devices.sW('15%'), width: Devices.sW('15%'), borderTopLeftRadius: 10, borderTopRightRadius: 10 },
  img_store_news: [cStyles.shadow, { height: Devices.sW('35%'), width: Devices.sW('35%'), borderRadius: 10 }], //minimum width is 90%, width image doesn't > 44%

  /** PICKER */
  con_group_picker: [cStyles.row_align_center],
  con_picker: [cStyles.column_justify_center, { borderWidth: .5, flex: 1, borderRadius: 10, height: 40 }],

  txt_title_picker: [cStyles.txt_title_item, { paddingRight: 10 }],

  noBorder: { borderLeftWidth: 0, borderRightWidth: 0, borderTopWidth: 0, borderBottomWidth: 0 }
}