/**
 ** Name: 
 ** Author: 
 ** CreateAt: 
 ** Description: 
**/
/* COMMON */
import { Devices } from '~/config';
import { layoutWidth } from '~/utils/layout_width';
import { cStyles } from '~/utils/styles';

export default styles = {
  txt_content: {
    marginTop: 10, color: '#000',
    fontSize: cStyles.x_small.fontSize, fontFamily: cStyles.x_small.fontFamily,
    paddingHorizontal: Devices.pH(layoutWidth.width)
  },
  txt_h2: { paddingHorizontal: Devices.pH(layoutWidth.width), marginTop: 10 },
}