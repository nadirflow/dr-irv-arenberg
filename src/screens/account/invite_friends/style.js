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
  /** CONTENT */
  img_share: { height: Devices.sW("61.33%"), width: '100%' },
  con_btn: [cStyles.mt_20, { backgroundColor: Colors.PRIMARY_COLOR }],
  txt_btn: cStyles.txt_title_button,
}