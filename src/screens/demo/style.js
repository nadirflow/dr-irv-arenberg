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
  con_bg_loading: [cStyles.full_center, { backgroundColor: 'rgba(0,0,0,.8)', position: 'absolute', top: 0, left: 0, width: Devices.width, height: Devices.height }],

  /** HEADER */
  con_header: { backgroundColor: Colors.WHITE_COLOR },
  con_header_center: [cStyles.column_align_center],
  con_title: cStyles.full_center,

  /** ITEM */
  con_item: {
    width: Devices.sW("44%"),
    marginBottom: 10
  },
  con_item_content: [cStyles.row_align_center, cStyles.row_justify_center, { paddingHorizontal: 10, flex: 1, paddingVertical: 5 }],

  txt_title: [cStyles.txt_base_item, { paddingLeft: 10 }],

  img_item: { height: Devices.sW("44%"), borderRadius: 5, backgroundColor: Colors.BORDER_COLOR, borderColor: Colors.BORDER_COLOR, borderWidth: 1 }
}