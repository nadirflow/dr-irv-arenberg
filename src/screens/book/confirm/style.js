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
  con_content: cStyles.container,
  con_header_center: [cStyles.column_align_center],
  con_separator: { height: 10, width: '100%', backgroundColor: Colors.BORDER_LARGE_COLOR },
  con_separator_option: { height: 1, backgroundColor: Colors.BORDER_COLOR },

  //CON CONFIRM
  con_list_item: [cStyles.flex_grow],
  con_confirm: { flex: 1, backgroundColor: Colors.WHITE_COLOR, marginBottom: 15, width: Devices.width },
  con_row_item: [cStyles.row_justify_between, cStyles.row_align_center, {
    height: Devices.sW("13%"), borderBottomWidth: 1, borderBottomColor: Colors.BORDER_COLOR,
  }],
  con_row_item_no_border: [cStyles.row_justify_between, cStyles.row_align_center, {
    height: Devices.sW("13%"),
  }],
  con_group_title: [cStyles.row, cStyles.center],
  con_provisional: [cStyles.row_justify_between, cStyles.row_align_start, {
    marginTop: 15
  }],
  con_price_item: [cStyles.row_align_center, {}],
  con_list_services: {},
  con_services_row_item: { paddingVertical: 10, },
  con_services_content: cStyles.pv_10,
  con_price_service: cStyles.row_align_start,
  con_services_item_left: cStyles.flex_full,
  con_services_item_name: [{ flex: 1, marginHorizontal: 10 }],
  con_shipping_methods: cStyles.row_align_center,

  txt_services_title: [cStyles.txt_title_item,],
  txt_services_price: [cStyles.txt_base_item, { textAlign: 'right' }],
  txt_services_unit_left: [cStyles.txt_base_item, { textAlign: 'left' }],
  txt_services_unit_right: [cStyles.txt_base_item, { textAlign: 'right' }],
  txt_services_option: [cStyles.txt_body_meta_item],

  img_service: { height: Devices.sW('20%'), width: Devices.sW('26.6%'), borderRadius: 5 },

  txt_title_left: [cStyles.txt_title_item, { flex: 1 }],
  txt_title_right: cStyles.txt_base_item,
  txt_title: [cStyles.txt_title_group],
  txt_provisional: [cStyles.txt_title_group, { color: Colors.PRIMARY_COLOR, textAlign: "right" }],
  txt_vat_included: [cStyles.txt_base_item, { textAlign: "right" }],
  txt_unit_left: [cStyles.txt_base_item, { textAlign: 'left' }],
  txt_unit_right: [cStyles.txt_base_item, { textAlign: 'right' }],
  txt_provisional_unit_left: [cStyles.txt_title_group, { color: Colors.PRIMARY_COLOR, textAlign: 'left' }],
  txt_provisional_unit_right: [cStyles.txt_title_group, { color: Colors.PRIMARY_COLOR, textAlign: 'right' }],
  txt_shipping_methods_unit_left: [cStyles.txt_base_item, { textAlign: 'left' }],
  txt_shipping_methods_unit_right: [cStyles.txt_base_item, { textAlign: 'right' }],
  txt_shipping_methods: [cStyles.xx_small, {}],
  txt_shipping_methods_choose_unit_left: [cStyles.txt_base_item, { color: Colors.PLACEHOLDER_COLOR, textAlign: 'left' }],
  txt_shipping_methods_choose_unit_right: [cStyles.txt_base_item, { color: Colors.PLACEHOLDER_COLOR, textAlign: 'right', paddingRight: 10 }],
  txt_address_title: [cStyles.txt_title_group, { color: Colors.BLACK_COLOR, paddingHorizontal: 10 }],
}