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
  con: cStyles.container,
  // con_content: [cStyles.container, cStyles.row_justify_center],

  /** */
  con_item: { flex: 1, },
  con_content: [cStyles.column_justify_between, { position: "absolute", width: Devices.width, height: Devices.height }],
  con_group_txt: [cStyles.column_justify_center, cStyles.column_align_center,
  { position: "absolute", width: Devices.width, bottom: Devices.sW('40%'), }
  ],
  con_group_btn: { paddingBottom: 10, position: "absolute", bottom: Devices.sW('10%'), width: Devices.width },
  con_skip: { position: "absolute", top: 40 },
  con_slider_layer: { position: 'absolute', width: '100%', height: '100%', backgroundColor: Colors.BLACK_COLOR, opacity: .29 },
  con_dot_active: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: Colors.PRIMARY_COLOR,
    marginHorizontal: 5
  },
  con_dot_unactive: {
    height: 8,
    width: 8,
    borderRadius: 4,
    backgroundColor: Colors.BORDER_COLOR,
    marginHorizontal: 5
  },
  con_dot: [cStyles.center, { position: "absolute", left: 0, right: 0, bottom: 20 }],

  txt_title_item: [cStyles.xx_large, { color: Colors.WHITE_COLOR, fontFamily: Devices.zsBodyBold, textAlign: "center", paddingVertical: 20 }],
  txt_content_item: [cStyles.txt_title_header, { fontFamily: Devices.zsBodyMedium, color: Colors.WHITE_COLOR, textAlign: "center" }],
  txt_skip: [cStyles.txt_title_item, { color: Colors.WHITE_COLOR, textAlign: "center", paddingVertical: 5 }],

  img_intro: { width: "100%", height: "100%" },
  /** BUTTON */
  con_btn: { backgroundColor: Colors.PRIMARY_COLOR, borderRadius: 5, marginVertical: 5, width: "100%" },
  con_btn_back: { backgroundColor: Colors.WHITE_COLOR, borderRadius: 5, borderWidth: 1, borderColor: Colors.PRIMARY_COLOR, marginVertical: 5 },

  txt_btn_back: [cStyles.txt_title_button, { color: Colors.PRIMARY_COLOR }],
  txt_btn: [cStyles.txt_title_button,],
}