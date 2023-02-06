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
  con: { paddingVertical: 10, backgroundColor: Colors.WHITE_COLOR },
  con_content: [cStyles.container, cStyles.row_justify_center],

  // HEADER
  con_header: [cStyles.row_justify_around, cStyles.row_align_center, {
    backgroundColor: Colors.WHITE_COLOR
  }],
  con_item: [cStyles.center, {
    width: Devices.sW("12%"), height: Devices.sW("12%"), borderRadius: Devices.bR(Devices.sW("12%")),
    borderWidth: 1, borderColor: Colors.PRIMARY_COLOR, marginHorizontal: 2
  }],
  con_item_inActive: [cStyles.center, {
    width: Devices.sW("12%"), height: Devices.sW("12%"), borderRadius: Devices.bR(Devices.sW("12%")),
    borderWidth: 1, borderColor: Colors.PLACEHOLDER_COLOR, marginHorizontal: 2
  }],
  con_item_icon: [cStyles.center, {
    width: Devices.sW("10%"), height: Devices.sW("10%"), borderRadius: Devices.bR(Devices.sW("10%")),
    backgroundColor: Colors.PRIMARY_COLOR,
  }],
  con_item_icon_inActive: [cStyles.center, {
    width: Devices.sW("10%"), height: Devices.sW("10%"), borderRadius: Devices.bR(Devices.sW("10%")),
    backgroundColor: Colors.PLACEHOLDER_COLOR,
  }],
  con_dash: { flex: 1 },
  con_content_dash: [{ flex: 1, height: 1.5 }],

  txt_title: [cStyles.txt_base_item, { color: Colors.PRIMARY_COLOR, paddingTop: 5, }],
  txt_title_inActive: [cStyles.txt_base_item, { color: Colors.PLACEHOLDER_COLOR, paddingTop: 5, }],
}