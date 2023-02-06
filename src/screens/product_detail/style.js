/**
 ** Name: 
 ** Author: 
 ** CreateAt: 
 ** Description: 
**/
import { StatusBar } from 'react-native';
/* COMMON */
import { cStyles } from "~/utils/styles";
import { Devices, isIphoneX } from "~/config";
import { Colors } from "~/utils/colors";

const MAX_HEIGHT = Devices.sW('80%');
const STATUS_BAR_HEIGHT = Devices.OS === 'android' ? StatusBar.currentHeight : isIphoneX() ? 30 : 20;

export default styles = {
  /** HEADER */
  con_header_left: [cStyles.column_align_start, { flex: .1, marginLeft: -5 }],
  con_header_right: [cStyles.column_align_end, { flex: .1 }],
  con_header_title: [cStyles.column_align_center, cStyles.column_justify_center, { flex: .8 }],
  con_header: { width: Devices.width, height: MAX_HEIGHT, },
  con_header_fixed: [cStyles.row_align_center, cStyles.row_justify_start, {
    height: Devices.sW('23%'), width: Devices.width, opacity: 1, backgroundColor: Colors.WHITE_COLOR,
    borderBottomWidth: 1, borderBottomColor: Colors.BORDER_COLOR, position: "absolute",
    paddingTop: STATUS_BAR_HEIGHT, zIndex: 1
  }],
  con_badge: [cStyles.center, {
    height: Devices.fS(14), width: Devices.fS(14), borderRadius: Devices.bR(Devices.fS(14)),
    position: 'absolute', top: 5, right: -5, backgroundColor: Colors.RED_COLOR
  }],

  txt_badge: cStyles.txt_badge,
  txt_title_header_fixed: [cStyles.txt_title_header, { color: Colors.BLACK_COLOR }],

  /** CONTENT */
  con_content_title: cStyles.pv_10,
  con_content_price_2: [cStyles.row_align_center, cStyles.row_justify_center],
  con_content_option: cStyles.pv_10,
  con_list_option: cStyles.mt_10,
  con_content_left_option: [cStyles.row_align_center, { flex: .5 }],
  con_content_right_option: [cStyles.row_align_center, cStyles.row_justify_end, { flex: .5 }],
  con_footer: {
    backgroundColor: Colors.WHITE_COLOR, borderTopWidth: 0, position: 'absolute', bottom: 0,
    width: Devices.width, paddingBottom: isIphoneX() ? 10 : 0
  },
  con_btn: [cStyles.full_center, { borderRadius:5, backgroundColor: Colors.PRIMARY_COLOR }],
  con_content_full: { position: 'absolute', top: 0, height: Devices.height },
  con_sale: [cStyles.row_align_center, cStyles.br_5, cStyles.ph_5, {
    backgroundColor: Colors.SALE_COLOR, paddingVertical: 3
  }],
  con_featured: [cStyles.row_align_center, cStyles.ml_10, cStyles.br_5, cStyles.ph_5, {
    backgroundColor: Colors.PRIMARY_COLOR, paddingVertical: 3
  }],
  con_header_accordion: [cStyles.row_align_center, cStyles.row_justify_between, cStyles.pv_15, {
    backgroundColor: Colors.WHITE_COLOR, borderBottomWidth: 1, borderBottomColor: Colors.BORDER_COLOR
  }],
  con_content_accordion: [cStyles.pv_10, { backgroundColor: Colors.WHITE_COLOR }],
  con_content: [cStyles.pt_10, cStyles.pb_20],
  con_content_short_des: cStyles.mt_10,
  con_content_related_short_des: cStyles.pb_10,
  con_category_star: [cStyles.pv_10, { width: '100%' }],
  con_btn_group: [cStyles.row, cStyles.full_center, cStyles.pt_10],

  txt_content_sku: cStyles.txt_body_meta_item,
  txt_header_accordion: [cStyles.txt_title_item, { fontWeight: 'bold' }],
  txt_sale_tag: [cStyles.txt_body_meta_item, { fontWeight: "bold", color: Colors.WHITE_COLOR }],
  txt_featured_tag: [cStyles.txt_body_meta_item, { fontWeight: "bold", color: Colors.WHITE_COLOR }],
  txt_content_categories: cStyles.txt_body_meta_item,
  txt_content_title: [cStyles.txt_title_group, cStyles.mt_5],
  txt_main_price: cStyles.txt_title_group,
  txt_maint_price_sale: [cStyles.txt_title_group, { color: Colors.SALE_COLOR }],
  txt_maint_regular_price: { color: Colors.PLACEHOLDER_COLOR, textDecorationLine: 'line-through', fontSize: cStyles.txt_base_item.fontSize },
  txt_content_price: cStyles.txt_base_price,
  txt_content_price_sale: [cStyles.txt_base_price, { color: Colors.SALE_COLOR }],
  txt_option_title: [cStyles.txt_base_item, cStyles.pl_10],
  txt_option_title_active: cStyles.txt_base_item,
  txt_option_price: cStyles.txt_base_item,
  txt_option_price_active: cStyles.txt_base_item,
  txt_add_cart: cStyles.txt_title_button,
  txt_regular_price: { color: Colors.PLACEHOLDER_COLOR, textDecorationLine: 'line-through', fontSize: cStyles.txt_body_meta_item.fontSize },
  txt_out_of_stock: [cStyles.txt_base_item, { color: Colors.PLACEHOLDER_COLOR }],
  txt_out_of_stock_2: [cStyles.txt_base_item, { color: Colors.GOOGLE_PLUS_COLOR }],
  txt_options_out_stock: { color: Colors.PLACEHOLDER_COLOR },

  img_header: { height: MAX_HEIGHT, width: Devices.sW('100%') },

  // RELATED
  con_list_store: [cStyles.mt_10, { marginBottom: isIphoneX() ? Devices.sW('23%') : Devices.sW('20%') }],
  con_store_service: [cStyles.column_justify_start, cStyles.br_5, cStyles.mb_10],
  con_info_store: cStyles.pt_10,
  con_title_store: cStyles.mb_5,
  con_cart_service_selected: [cStyles.row_align_end, cStyles.pb_10],
  con_content_price: [cStyles.row_align_center, cStyles.mv_10],
  con_content_image: [cStyles.flex_full, { position: 'absolute' }],
  con_product_new: {
    position: 'absolute', paddingHorizontal: 5, paddingVertical: 2, backgroundColor: Colors.PRIMARY_COLOR, borderRadius: 3
  },
  con_product_sale: {
    position: 'absolute', paddingHorizontal: 5, paddingVertical: 2, backgroundColor: Colors.SALE_COLOR, borderRadius: 3
  },

  txt_title_store: cStyles.txt_title_item,
  txt_price_item: cStyles.txt_base_price,
  txt_title_related: [cStyles.txt_title_group, cStyles.pv_10],
  txt_product_new: [cStyles.txt_body_meta_item, { color: Colors.WHITE_COLOR }],
  txt_product_sale: [cStyles.txt_body_meta_item, { color: Colors.WHITE_COLOR }],

  img_product: { height: Devices.sW('15%'), width: Devices.sW('15%') }
}