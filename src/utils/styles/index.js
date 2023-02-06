/**
 ** Name: 
 ** Author: 
 ** CreateAt: 
 ** Description: 
**/
/** COMMON */
import { Colors } from '../colors';
import { Devices } from '~/config';

export const cStyles = {
  flex_full: { flex: 1 },
  custom_margin: {marginLeft: 5, marginRight: 5},
  container: { flex: 1, backgroundColor: Colors.WHITE_COLOR},
  container_auth: { flex: 1, backgroundColor: Colors.BACKGROUND_AUTH_COLOR },
  full_center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  full_absolute: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  center: { alignItems: 'center', justifyContent: 'center' },
  flex_grow: { flexGrow: 1 },
  flex_wrap: { flexWrap: 'wrap' },

  row: { flexDirection: 'row' },
  row_align_center: { flexDirection: 'row', alignItems: 'center' },
  row_align_start: { flexDirection: 'row', alignItems: 'flex-start' },
  row_align_end: { flexDirection: 'row', alignItems: 'flex-end' },
  row_justify_center: { flexDirection: 'row', justifyContent: 'center' },
  row_justify_start: { flexDirection: 'row', justifyContent: 'flex-start' },
  row_justify_end: { flexDirection: 'row', justifyContent: 'flex-end' },
  row_justify_between: { flexDirection: 'row', justifyContent: 'space-between' },
  row_justify_around: { flexDirection: 'row', justifyContent: 'space-around' },

  column: { flexDirection: 'column' },
  column_align_center: { flexDirection: 'column', alignItems: 'center' },
  column_align_start: { flexDirection: 'column', alignItems: 'flex-start' },
  column_align_end: { flexDirection: 'column', alignItems: 'flex-end' },
  column_justify_center: { flexDirection: 'column', justifyContent: 'center' },
  column_justify_start: { flexDirection: 'column', justifyContent: 'flex-start' },
  column_justify_end: { flexDirection: 'column', justifyContent: 'flex-end' },
  column_justify_between: { flexDirection: 'column', justifyContent: 'space-between' },
  column_justify_around: { flexDirection: 'column', justifyContent: 'space-around' },

  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,

    elevation: 7,
  },


  con_header: { backgroundColor: Colors.WHITE_COLOR },

  txt_no_data: { fontSize: Devices.fS(16), fontFamily: Devices.zsHeadlineMedium, color: Colors.BORDER_COLOR, marginTop: 10, textAlign: 'center' },
  txt_no_data_1: { fontSize: Devices.fS(16), fontFamily: Devices.zsHeadlineMedium, color: Colors.PLACEHOLDER_COLOR, marginTop: 10, textAlign: 'center' },
  txt_title_group_drawer: { fontSize: Devices.fS(22), fontFamily: Devices.zsHeadlineSemiBold, color: Colors.TEXT_COLOR, },
  txt_title_header: { fontSize: Devices.fS(16), fontFamily: Devices.zsHeadlineSemiBold, color: Colors.TEXT_COLOR, },
  txt_title_button: { fontSize: Devices.fS(12), fontFamily: Devices.zsHeadlineRegular, color: Colors.WHITE_COLOR, },

  txt_title_item: { fontSize: Devices.fS(14), fontFamily: Devices.zsHeadlineMedium, color: Colors.TEXT_COLOR, },
  txt_base_item: { fontSize: Devices.fS(12), fontFamily: Devices.zsHeadlineRegular, color: Colors.PLACEHOLDER_COLOR, },
  txt_body_meta_item: { fontSize: Devices.fS(13), fontFamily: Devices.zsHeadlineBold, color: Colors.PLACEHOLDER_COLOR, },

  txt_title_group: { fontSize: Devices.fS(16), fontFamily: Devices.zsHeadlineSemiBold, color: Colors.TEXT_COLOR, },

  txt_badge: { fontSize: Devices.fS(10), fontFamily: Devices.zsHeadlineSemiBold, color: Colors.WHITE_COLOR, padding: 0, },

  txt_validate_error: { fontSize: Devices.fS(12), fontFamily: Devices.zsHeadlineRegular, color: Colors.RED_COLOR, marginTop: 2, },

  txt_base_price: { fontSize: Devices.fS(16), fontFamily: Devices.zsHeadlineBold, color: Colors.TEXT_COLOR, fontWeight: "500" },

  txt_unline_italic: { textDecorationLine: 'underline', fontStyle: 'italic' },
  txt_unline: { textDecorationLine: 'underline' },
  txt_italic: { fontStyle: 'italic' },
  txt_RTL: { textAlign: "right" },

  p_5: { padding: 5 },
  p_10: { padding: 10 },
  p_15: { padding: 15 },
  p_20: { padding: 20 },

  pv_5: { paddingVertical: 5 },
  pv_10: { paddingVertical: 10 },
  pv_15: { paddingVertical: 15 },
  pv_20: { paddingVertical: 20 },

  ph_5: { paddingHorizontal: 5 },
  ph_10: { paddingHorizontal: 10 },
  ph_15: { paddingHorizontal: 15 },
  ph_20: { paddingHorizontal: 20 },

  pt_5: { paddingTop: 5 },
  pt_10: { paddingTop: 10 },
  pt_15: { paddingTop: 15 },
  pt_20: { paddingTop: 20 },

  pb_5: { paddingBottom: 5 },
  pb_10: { paddingBottom: 10 },
  pb_15: { paddingBottom: 15 },
  pb_20: { paddingBottom: 20 },

  pl_5: { paddingLeft: 5 },
  pl_10: { paddingLeft: 10 },
  pl_15: { paddingLeft: 15 },
  pl_20: { paddingLeft: 20 },

  pr_5: { paddingRight: 5 },
  pr_10: { paddingRight: 10 },
  pr_15: { paddingRight: 15 },
  pr_20: { paddingRight: 20 },

  m_5: { margin: 5 },
  m_10: { margin: 10 },
  m_15: { margin: 15 },
  m_20: { margin: 20 },

  mv_5: { marginVertical: 5 },
  mv_10: { marginVertical: 10 },
  mv_15: { marginVertical: 15 },
  mv_20: { marginVertical: 20 },

  mh_5: { marginHorizontal: 5 },
  mh_10: { marginHorizontal: 10 },
  mh_15: { marginHorizontal: 15 },
  mh_20: { marginHorizontal: 20 },

  mt_5: { marginTop: 5 },
  mt_10: { marginTop: 10 },
  mt_15: { marginTop: 15 },
  mt_20: { marginTop: 20 },

  mb_5: { marginBottom: 5 },
  mb_10: { marginBottom: 10 },
  mb_15: { marginBottom: 15 },
  mb_20: { marginBottom: 20 },

  ml_5: { marginLeft: 5 },
  ml_10: { marginLeft: 10 },
  ml_15: { marginLeft: 15 },
  ml_20: { marginLeft: 20 },

  mr_5: { marginRight: 5 },
  mr_10: { marginRight: 10 },
  mr_15: { marginRight: 15 },
  mr_20: { marginRight: 20 },

  br_5: { borderRadius: 5 },
  br_10: { borderRadius: 10 },
  br_15: { borderRadius: 15 },
  br_20: { borderRadius: 20 },

  br_tl_5: { borderTopLeftRadius: 5 },
  br_tl_10: { borderTopLeftRadius: 10 },
  br_tl_15: { borderTopLeftRadius: 15 },
  br_tl_20: { borderTopLeftRadius: 20 },

  br_bl_5: { borderBottomLeftRadius: 5 },
  br_bl_10: { borderBottomLeftRadius: 10 },
  br_bl_15: { borderBottomLeftRadius: 15 },
  br_bl_20: { borderBottomLeftRadius: 20 },

  br_tr_5: { borderTopRightRadius: 5 },
  br_tr_10: { borderTopRightRadius: 10 },
  br_tr_15: { borderTopRightRadius: 15 },
  br_tr_20: { borderTopRightRadius: 20 },

  br_br_5: { borderBottomRightRadius: 5 },
  br_br_10: { borderBottomRightRadius: 10 },
  br_br_15: { borderBottomRightRadius: 15 },
  br_br_20: { borderBottomRightRadius: 20 },

  super_x_small: { fontSize: Devices.fS(8), fontFamily: Devices.zsHeadlineRegular, color: Colors.TEXT_COLOR, },
  super_small: { fontSize: Devices.fS(10), fontFamily: Devices.zsHeadlineRegular, color: Colors.TEXT_COLOR, },
  xxx_small: { fontSize: Devices.fS(12), fontFamily: Devices.zsHeadlineRegular, color: Colors.TEXT_COLOR, },
  xx_small: { fontSize: Devices.fS(14), fontFamily: Devices.zsHeadlineRegular, color: Colors.TEXT_COLOR, },
  x_small: { fontSize: Devices.fS(16), fontFamily: Devices.zsHeadlineRegular, color: Colors.TEXT_COLOR, },
  small: { fontSize: Devices.fS(18), fontFamily: Devices.zsHeadlineRegular, color: Colors.TEXT_COLOR, },
  medium: { fontSize: Devices.fS(20), fontFamily: Devices.zsHeadlineRegular, color: Colors.TEXT_COLOR, },
  large: { fontSize: Devices.fS(22), fontFamily: Devices.zsHeadlineRegular, color: Colors.TEXT_COLOR, },
  x_large: { fontSize: Devices.fS(24), fontFamily: Devices.zsHeadlineRegular, color: Colors.TEXT_COLOR, },
  xx_large: { fontSize: Devices.fS(26), fontFamily: Devices.zsHeadlineRegular, color: Colors.TEXT_COLOR, },
  xxx_large: { fontSize: Devices.fS(28), fontFamily: Devices.zsHeadlineRegular, color: Colors.TEXT_COLOR, },
  super_large: { fontSize: Devices.fS(30), fontFamily: Devices.zsHeadlineRegular, color: Colors.TEXT_COLOR, },
  super_x_large: { fontSize: Devices.fS(32), fontFamily: Devices.zsHeadlineRegular, color: Colors.TEXT_COLOR, },

  ic_right_detail: { name: "angle-right", size: Devices.fS(15), color: Colors.BLACK_COLOR, type: "regular" },
  ic_left_detail: { size: Devices.fS(20), color: Colors.ICON_COLOR, type: "regular" },
}