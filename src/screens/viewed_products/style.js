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
  con_badge: {
    height: Devices.fS(14), width: Devices.fS(14), borderRadius: Devices.bR(Devices.fS(14)), position: 'absolute', top: 5, right: 5,
    backgroundColor: Colors.RED_COLOR, alignItems: 'center', justifyCenter: 'center'
  },

  txt_badge: [cStyles.txt_badge],
}