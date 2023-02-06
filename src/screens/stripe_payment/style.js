/**
 ** FileName: 
 ** FileAuthor: 
 ** FileCreateAt: 
 ** FileDescription: 
**/
/* COMMON */
import { cStyles } from '~/utils/styles';
import { Devices } from '~/config';
import { Colors } from '~/utils/colors';

export default styles = {
  con: cStyles.container,
  con_header_center: [cStyles.column_align_center, { flex: 1 }],
  con_content: { marginVertical: 10 },
  // CONTENT  
  con_invoice: [cStyles.br_10, cStyles.p_15, cStyles.mb_15, {
    borderColor: Colors.BORDER_COLOR, borderWidth: 1, backgroundColor: Colors.BACKGROUND_ITEM_COLOR,
  }],
  con_footer: [cStyles.center, { backgroundColor: Colors.WHITE_COLOR, borderTopWidth: 0 }],
  con_btn: [cStyles.full_center, { backgroundColor: Colors.PRIMARY_COLOR }],
  con_price_item: [cStyles.row_align_center, {}],
  con_input: { marginLeft: 0, borderBottomWidth: 1, marginRight: 10 },

  txt_btn: cStyles.txt_title_button,
  txt_label_card: [cStyles.txt_title_item, { color: Colors.BLACK_COLOR }],
  txt_input_card: [cStyles.txt_base_item, { color: Colors.PLACEHOLDER_COLOR }],
  txt_title: cStyles.txt_title_group,
  txt_title_2: cStyles.txt_base_item,
  txt_result: cStyles.txt_base_item,
}