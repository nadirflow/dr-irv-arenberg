/**
 ** Name: 
 ** Author: 
 ** CreateAt: 
 ** Description: 
**/
/* COMMON */
import { Colors } from '~/utils/colors';
import { Configs, Devices } from "~/config";
import { cStyles } from '~/utils/styles';
import { layoutWidth } from "~/utils/layout_width";

export default styles = {
  con_separator: { height: 10, width: '100%', backgroundColor: Colors.BORDER_LARGE_COLOR },
  con_separator_option: { height: 1, backgroundColor: Colors.BORDER_COLOR, marginHorizontal: 10 },
  con_header_center: [cStyles.column_align_center],

  /** HEADER */
  con_header: { backgroundColor: Colors.WHITE_COLOR },

  /** CONTENT */
  con_content_row: [cStyles.pv_15, {
    borderBottomColor: Colors.BORDER_COLOR, borderBottomWidth: 1, marginHorizontal: Devices.pH(layoutWidth.width)
  }],
  con_group_right: [cStyles.column_align_end, { flex: .4 }],
  con_services_content: [cStyles.flex_full, cStyles.pv_10, cStyles.row_justify_around],
  con_services_item_left: [cStyles.row_align_start, { marginTop: 10 }],
  con_services_left: [cStyles.row_align_center, { flex: .6 }],
  con_title_group: [cStyles.pv_10, Configs.supportRTL && cStyles.column_align_end],
  con_subtotal: [cStyles.row_align_center, { flex: .4 }, Configs.supportRTL ? cStyles.row_justify_start : cStyles.row_justify_end],

  txt_title_product: [cStyles.txt_title_item, { flex: .8 }],
  txt_title_group: cStyles.txt_title_group,
  txt_services_option: [cStyles.xxx_small, { color: Colors.PLACEHOLDER_COLOR }],
  txt_group_left: [cStyles.txt_title_item],
  txt_group_right: [cStyles.txt_base_item],
  txt_group_subtotal: [cStyles.txt_title_group, { color: Colors.PRIMARY_COLOR }],
  txt_vat: [cStyles.xxx_small, { color: Colors.PLACEHOLDER_COLOR, marginTop: 10 }],
  txt_status_header: [cStyles.txt_body_meta_item, cStyles.ph_5, { fontWeight: "bold", color: Colors.WHITE_COLOR, textAlign: 'center' }],

  img_service: { height: Devices.sW('20%'), width: Devices.sW('20%'), borderRadius: 5 },
}