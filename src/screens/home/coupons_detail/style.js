/**
 ** Name: 
 ** Author: 
 ** CreateAt: 
 ** Description: 
**/
import { StatusBar } from 'react-native';
/* COMMON */
import { cStyles } from '~/utils/styles';
import { Colors } from '~/utils/colors';
import { Devices, isIphoneX } from '~/config';

const MAX_HEIGHT = Devices.sW('80%');
const STATUS_BAR_HEIGHT = Devices.OS === 'android' ? StatusBar.currentHeight : isIphoneX() ? 30 : 20;

export default styles = {
  /** HEADER */
  con_header: { width: Devices.width, height: MAX_HEIGHT, },
  con_icon_back_full: [cStyles.column_align_start, cStyles.column_justify_center,
  { position: "absolute", top: Devices.sW('8%'), height: 50, width: 50 }
  ],
  con_header_fixed: [cStyles.row_align_center, cStyles.row_justify_start, {
    height: Devices.sW('20%'), width: Devices.width, opacity: 1,
    backgroundColor: Colors.WHITE_COLOR, borderBottomWidth: 1, borderBottomColor: Colors.BORDER_COLOR,
    position: "absolute", paddingTop: STATUS_BAR_HEIGHT, zIndex: 1
  }],
  con_col_image: [cStyles.column_align_center, cStyles.ph_15, { zIndex: 2 }],
  con_col_info: [cStyles.column_align_start, cStyles.ph_15, { zIndex: 2 }],
  con_bg_blur: [{ position: 'absolute', backgroundColor: 'rgba(0,0,0,.2)', width: '100%', height: '100%', zIndex: 1 }],

  txt_title_header_fixed: [cStyles.flex_full, cStyles.txt_title_item, cStyles.pl_5],
  txt_title_header: [cStyles.txt_title_group],
  txt_row_right_top: [cStyles.txt_title_item, { color: Colors.WHITE_COLOR, paddingTop: Devices.sW('9%') }],
  txt_row_right_bottom: [cStyles.txt_title_group, { color: Colors.WHITE_COLOR }],
  /** CONTENT */
  con_content_full: { position: 'absolute', height: Devices.height },
  con_content: [cStyles.pt_15, cStyles.pb_20],
  con_btn: [cStyles.flex_full, cStyles.row_align_center, cStyles.mv_10, cStyles.br_5,
  { backgroundColor: Colors.PRIMARY_COLOR }
  ],

  txt_btn: [cStyles.txt_title_button, { color: Colors.WHITE_COLOR }],
  txt_description: [cStyles.txt_base_item],
  txt_title_left: [cStyles.txt_title_group, { fontWeight: '600' }],
  txt_title_right: [cStyles.txt_title_group],

  img_header: { width: Devices.width, height: MAX_HEIGHT, },
  img_icon_coupon: { width: Devices.sW('15%'), height: Devices.sW('10%'), marginTop: Devices.sW('10%') },
  img_icon_calendar: { width: Devices.sW('12%'), height: Devices.sW('12%'), marginTop: Devices.sW('10%') }
}