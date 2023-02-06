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

  con_input: { marginLeft: 0, borderBottomWidth: 1, marginRight: 10 },

  txt_label_card: [cStyles.txt_title_item, { color: Colors.BLACK_COLOR }],
  txt_input_card: [cStyles.txt_base_item, { color: Colors.PLACEHOLDER_COLOR }],
}