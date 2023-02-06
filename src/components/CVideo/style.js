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
import { layoutWidth } from '~/utils/layout_width';

export default styles = {
  con: [cStyles.container],

  con_video: [cStyles.center, { marginVertical: 10, height: Devices.sW('60%'), width: Devices.sW(`${layoutWidth.width}%`) }],
}