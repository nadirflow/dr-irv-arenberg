/**
 ** Name: File.js
 ** Author: ZiniSoft Ltd
 ** CreatedAt: 2020
 ** Description: Description of File.js
**/
/* LIBRARY */
import { cStyles } from '~/utils/styles';
import { Colors } from '~/utils/colors';
import { Devices } from '~/config';

const styles = {
  con_input: [cStyles.row_align_center, cStyles.row_justify_start, { height: Devices.sW("15%") }],
  con_label: { marginLeft: Devices.OS === 'android' ? -12 : -15 },

  txt_label: [cStyles.txt_base_item, { color: Colors.PLACEHOLDER_COLOR }],
  txt_input: [cStyles.txt_base_item, { marginLeft: -15 }],
  txt_option: [cStyles.txt_body_meta_item]
}

export default styles;