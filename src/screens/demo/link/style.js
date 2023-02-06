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
  con_content: [cStyles.container, cStyles.row_justify_center],

  /** HEADER */
  con_header: { backgroundColor: Colors.WHITE_COLOR },
  con_header_center: [cStyles.column_align_center],
  con_title: cStyles.full_center,

  /** INPUT */
  con_form: { marginLeft: 0 },
  con_input: [cStyles.row_align_center, cStyles.row_justify_start, { height: Devices.sW("13%"), }],
  // con_label: { marginLeft: Devices.OS === 'android' ? -12 : -15 },
  con_btn: { marginTop: 20, backgroundColor: Colors.PRIMARY_COLOR, borderRadius: 5 },

  txt_label: cStyles.xx_small,
  txt_input: [cStyles.txt_base_item, { fontFamily: Devices.zsHeadlineSemiBold, }],
  txt_fetch_success: [cStyles.xx_small, { fontFamily: Devices.zsHeadlineMedium, color: Colors.GREEN_COLOR, marginLeft: 10 }],
  txt_fetch_failed: [cStyles.xx_small, { fontFamily: Devices.zsHeadlineMedium, color: Colors.RED_COLOR, marginLeft: 10 }],
  txt_error: [cStyles.txt_base_item, { color: Colors.RED_COLOR }],
  txt_btn: cStyles.txt_title_button,

  spi_loading: { marginRight: 10 }
}