/**
 ** Name: 
 ** Author: 
 ** CreateAt: 
 ** Description: 
**/
/* COMMON */
import { Devices, isIphoneX } from '~/config';
import { cStyles } from '~/utils/styles';
import { Colors } from '~/utils/colors';

export default styles = {
  con_list_store: [cStyles.container],
  con_store: [cStyles.column_justify_start, { borderRadius: 10, marginBottom: 20 }],
  con_store_category: [cStyles.column_justify_start, cStyles.br_10, { width: Devices.sW("30%") }],
  con_store_vendor: [cStyles.column_justify_start, cStyles.br_10, { backgroundColor: Colors.BACKGROUND_AUTH_COLOR, width: Devices.sW("30%"), padding: 10 }],
  con_info_store: { paddingTop: 5, paddingHorizontal: 5 },
  con_title_store: [cStyles.row_justify_between, cStyles.row_align_center, { paddingTop: 5 }],
  con_address_store: [{ marginTop: 5 }],
  con_review_store: [cStyles.row_align_center, { marginTop: 5 }],
  con_cart_service_selected: [cStyles.row, {}],
  con_content_price: [cStyles.row_align_center, {}],
  con_star: [{ alignItems: 'center' }],
  con_star_item: { paddingLeft: 5 },
  con_content_price_2: [cStyles.row_align_center, cStyles.row_justify_end, { paddingLeft: 10 }],
  con_news_info: [cStyles.column_align_start],
  con_news_time: [cStyles.row_align_start],
  con_fast_add_cart: [cStyles.center,
  {
    position: 'absolute', bottom: isIphoneX() ? Devices.sW('21%') : Devices.sW('23%'), right: 20, backgroundColor: Colors.WHITE_COLOR,
    height: 30, width: 30, borderRadius: 5
  }],
  con_content_image: [cStyles.flex_full, { position: 'absolute' }],
  con_bookmark: { position: 'absolute', top: 10 },
  con_product_new: { position: 'absolute', paddingHorizontal: 5, paddingVertical: 2, backgroundColor: Colors.PRIMARY_COLOR, borderRadius: 3 },
  con_product_sale: { position: 'absolute', paddingHorizontal: 5, paddingVertical: 2, backgroundColor: Colors.SALE_COLOR, borderRadius: 3 },
  con_btn_add: [{ borderRadius: 5, padding: 5 }],
  con_amount_item: [cStyles.row_align_center, cStyles.row_justify_end, { width: '100%', marginTop: 10 }],
  con_amount_right: [cStyles.row_align_center],
  con_input_amount: [cStyles.center, { borderWidth: 1, borderColor: Colors.PRIMARY_COLOR, borderRadius: 5, marginHorizontal: 10, width: Devices.sW('10%') }],
  con_amount: [cStyles.column_justify_end],
  con_button_add: [cStyles.row_align_end, cStyles.row_justify_between, { width: '100%', paddingTop: 10 }],
  con_variations: [cStyles.row_align_center, cStyles.row_justify_center, { paddingTop: 10 }],
  con_picker_variations: { flex: 1, justifyContent: "center", borderWidth: .5, borderColor: Colors.PLACEHOLDER_COLOR, borderRadius: 5, height: Devices.sW('8%') },
  con_content_short_des: cStyles.mt_10,
  con_bg_content: [cStyles.full_center, { backgroundColor: 'rgba(0,0,0,.4)', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }],

  txt_btn: [cStyles.txt_title_button, { color: Colors.WHITE_COLOR }],
  txt_amount_item: [cStyles.xxx_small, { paddingVertical: 2 }],
  txt_amount_title: [cStyles.txt_title_item],
  txt_content_price_sale: [cStyles.txt_base_price, { color: Colors.SALE_COLOR }],
  txt_title_global: [cStyles.txt_title_item, { color: Colors.PLACEHOLDER_COLOR, flex: 1 }],
  txt_title_category: [cStyles.txt_title_item, { textAlign: 'center', color: Colors.BLACK_COLOR }],
  txt_price_item: [cStyles.txt_base_price],
  txt_unit_item: [cStyles.txt_base_price],
  txt_title_new: [cStyles.txt_title_item, { flex: 1, marginTop: 5 }],
  txt_news_description: [cStyles.txt_body_meta_item, { marginTop: 3 }],
  txt_news_time: [cStyles.txt_body_meta_item, { marginTop: 3 }],
  txt_rating_count: [cStyles.txt_body_meta_item],
  txt_author: [cStyles.txt_body_meta_item, { marginTop: 3 }],
  txt_regular_price: { color: Colors.PLACEHOLDER_COLOR, textDecorationLine: 'line-through' },
  txt_out_of_stock: [cStyles.txt_body_meta_item, { color: Colors.GOOGLE_PLUS_COLOR }],
  txt_on_back_order: [cStyles.txt_base_item, { color: Colors.YELLOW_COLOR }],
  txt_product_new: [cStyles.txt_body_meta_item, { fontWeight: "bold", color: Colors.WHITE_COLOR }],
  txt_product_sale: [cStyles.txt_body_meta_item, { fontWeight: "bold", color: Colors.WHITE_COLOR }],

  img_store_service: { height: Devices.sW("30%"), width: Devices.sW("30%"), borderRadius: 10 },
  img_store_vendor: { height: Devices.sW("20%"), width: Devices.sW("20%"), borderRadius: Devices.sW("10%") },

  /** PICKER */
  con_group_picker: [cStyles.row_align_center],
  con_picker: [cStyles.column_justify_center, { borderWidth: .5, flex: 1, borderRadius: 5, height: 40 }],

  txt_title_picker: [cStyles.txt_title_item, { paddingRight: 10 }],


  noBorder: { borderLeftWidth: 0, borderRightWidth: 0, borderTopWidth: 0, borderBottomWidth: 0 },

  rating_star: [cStyles.flex_full, cStyles.row_justify_center, cStyles.mt_10],
  des_vendor: [cStyles.flex_full, cStyles.column]
}