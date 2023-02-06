/**
 ** Name: 
 ** Author: 
 ** CreateAt: 
 ** Description: 
**/
/* COMMON */
import { cStyles } from '~/utils/styles';
import { Devices } from '~/config';
import { Colors } from '~/utils/colors';

export default styles = {
  con: [cStyles.flex_full],
  con_bottom_socials: [cStyles.row_align_center],
  con_icon_social: [{ borderRadius: Devices.bR(30) }, cStyles.center, {
    width: 30, height: 30, borderWidth: .5, borderColor: Colors.BORDER_COLOR
  }],
  con_info: [{ paddingVertical: 10 }],
  con_info_item: [cStyles.row, { marginVertical: 10 }],

  img_icon_social: { width: "100%", height: "100%" },

  txt_info: [cStyles.txt_base_item, { paddingLeft: 15, flex: 1 }]
}