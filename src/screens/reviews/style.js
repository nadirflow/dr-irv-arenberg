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
  con_separator: { height: 10, width: '100%', backgroundColor: Colors.BORDER_LARGE_COLOR },
  con_separator_option: { height: 1, backgroundColor: Colors.BORDER_COLOR },
  con_header_center: [cStyles.column_align_center],

  /** HEADER */
  con_header: { backgroundColor: Colors.WHITE_COLOR },

  /** CONTENT */
  con_review_item: [{ paddingVertical: 15 }],
  con_item_top: [cStyles.row_align_start, cStyles.row_justify_between, { flex: 1 }],
  con_item_top_left: [cStyles.row_align_start, { flex: .8 }],
  con_item_top_right: [cStyles.row_align_start, cStyles.row_justify_end, { flex: .2 }],
  con_star_item: { paddingRight: 5 },
  con_star: { marginTop: 10 },
  con_item_bottom: [{ marginTop: 10 }],
  con_input_area: { paddingVertical: 10, },
  con_star_reviewer: [cStyles.column_align_center, { paddingVertical: 20 }],
  con_star_for_review: { paddingRight: 5, paddingTop: 5 },
  con_img_product: [cStyles.center],
  con_top_content: [cStyles.center],
  con_rating_count: [cStyles.center, {
    borderColor: Colors.PRIMARY_COLOR, borderWidth: 2, height: Devices.sW("20%"), width: Devices.sW("20%"), borderRadius: Devices.bR(Devices.sW("20%"))
  }],
  con_middle_content: [cStyles.center],
  con_row_num_star: [cStyles.flex_full, cStyles.ph_10, cStyles.pb_5],

  txt_input: [cStyles.txt_base_item, cStyles.p_10, { borderRadius: 10, marginTop: 0 }],
  txt_tag_content: [cStyles.txt_body_meta_item],
  txt_name_reviewer: [cStyles.txt_title_item],
  txt_time_reviewer: [cStyles.txt_body_meta_item],
  txt_title_tab_star: [cStyles.txt_body_meta_item],
  txt_product_name: [cStyles.txt_title_item, { paddingTop: 10 }],
  txt_rating_count: [cStyles.txt_title_group, { color: Colors.GOOGLE_PLUS_COLOR, fontSize: Devices.fS(25) }],
  txt_num_star: [cStyles.txt_body_meta_item],

  img_avatar: { height: Devices.sW('15%'), width: Devices.sW('15%'), borderRadius: Devices.sW('15%'), borderColor: Colors.BORDER_COLOR, borderWidth: 1 },
  img_product: { height: Devices.sW('35%'), borderRadius: 10, borderWidth: 1, borderColor: Colors.BORDER_COLOR },
  /** FOOTER */
  con_footer: { backgroundColor: Colors.WHITE_COLOR, borderTopWidth: 0, },
  con_btn: [cStyles.full_center, { backgroundColor: Colors.WHITE_COLOR, borderColor: Colors.PRIMARY_COLOR }],

  txt_write: [cStyles.txt_title_button, { color: Colors.PRIMARY_COLOR }],

  spi_loading: { marginRight: 10 }
}