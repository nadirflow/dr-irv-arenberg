/**
 ** Name: 
 ** Author: 
 ** CreateAt: 
 ** Description: 
**/
/* COMMON */
import { Configs } from "~/config";
import { Colors } from '~/utils/colors';
import { cStyles } from '~/utils/styles';

export default styles = {
  con_separator: { height: 10, width: '100%', backgroundColor: Colors.BORDER_LARGE_COLOR },
  con_separator_option: { height: 1, backgroundColor: Colors.BORDER_COLOR },

  /** AVATAR */
  con_name: [cStyles.row, cStyles.flex_full],
  con_row: [cStyles.row_align_center, cStyles.pv_5,
  { flex: .5, marginLeft: 0 }
  ],
  con_avatar: [cStyles.full_center, { paddingVertical: 10 }],
  con_camera: { backgroundColor: Colors.PRIMARY_COLOR, position: 'absolute', bottom: 0, right: 0, padding: 5, borderRadius: 20 },
  con_row_last_name: [cStyles.flex_full, cStyles.row_align_center, cStyles.pv_5,
  Configs.supportRTL && cStyles.mr_15,
  Configs.supportRTL && { marginLeft: 0 }
  ],
  con_row_left: cStyles.pr_10,
  con_row_right: [cStyles.column_align_start, cStyles.flex_full, cStyles.mr_5,
  Configs.supportRTL && cStyles.column_align_end,
  Configs.supportRTL && cStyles.mr_15,
  ],
  con_input: [cStyles.txt_base_item,
  Configs.supportRTL && cStyles.txt_RTL
  ],
  con_btn: [cStyles.mt_20, { backgroundColor: Colors.PRIMARY_COLOR }],
  con_bordered: { borderBottomWidth: 1, borderBottomColor: Colors.BORDER_COLOR, },
  con_fetch_status: [cStyles.row_align_center, cStyles.row_justify_start, cStyles.mv_15],

  txt_birthday: [cStyles.txt_base_item],
  txt_input: [cStyles.txt_base_item, { marginLeft: -15 }],
  txt_btn: cStyles.txt_title_button,
  txt_error: [cStyles.txt_base_item, { color: Colors.RED_COLOR }],

  spi_loading: { marginRight: 10 }
}