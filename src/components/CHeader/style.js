/**
 ** Name: 
 ** Author: 
 ** CreateAt: 
 ** Description: 
**/
/* LIBRARY */
import { cStyles } from '~/utils/styles';
import { Colors } from '~/utils/colors';
import { Devices } from '~/config';

export default styles = {
  con_header: { backgroundColor: Colors.WHITE_COLOR },
  con_header_center: [cStyles.column_align_center],
  con_title: cStyles.full_center,
  con_badge: {
    height: Devices.fS(14), width: Devices.fS(14), borderRadius: Devices.bR(Devices.fS(14)),
    position: 'absolute', top: Devices.fS(10), right: Devices.fS(10), backgroundColor: Colors.RED_COLOR,
    alignItems: 'center', justifyCenter: 'center'
  },
  con_badge_RTL: {
    height: Devices.fS(14), width: Devices.fS(14), borderRadius: Devices.bR(Devices.fS(14)),
    position: 'absolute', top: Devices.fS(10), left: Devices.fS(15), backgroundColor: Colors.RED_COLOR,
    alignItems: 'center', justifyCenter: 'center'
  },

  txt_badge: [cStyles.txt_badge],
};