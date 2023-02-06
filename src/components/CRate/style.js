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

  con_bg: [cStyles.full_center, { backgroundColor: "rgba(0,0,0,.5)" }],
  con_modal: { width: Devices.sW("80%"), backgroundColor: Colors.WHITE_COLOR, borderRadius: 10 },
  con_modal_content: [cStyles.center],
  con_img: [cStyles.center, { width: "100%", height: Devices.sW("18%") }],
  con_star_for_review: { paddingHorizontal: 5, paddingVertical: 10 },
  con_star: [cStyles.center, { borderTopWidth: .3, borderTopColor: Colors.BORDER_COLOR }],

  img: { width: "100%", height: "100%" },

  txt_content: [cStyles.txt_base_item, { paddingVertical: 10, }],

  /** BUTTON */
  con_btn: [cStyles.row_align_center, cStyles.row_justify_between, {
    borderTopColor: Colors.BORDER_COLOR, borderTopWidth: 0.3, paddingVertical: 7
  }],
  con_btn_left: [cStyles.center, {
    flex: .49, padding: 5, borderRightColor: Colors.BORDER_COLOR, borderRightWidth: 0.3
  }],
  con_btn_right: [cStyles.center, {
    flex: .49, padding: 5, borderLefttColor: Colors.BORDER_COLOR, borderLefttWidth: 0.3
  }],

}