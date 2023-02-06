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
  con: [cStyles.container],
  con_item: [cStyles.row, { borderRadius: 10, padding: 10 }],
  con_img_item: { width: Devices.sW("13%"), height: Devices.sW("13%"), borderRadius: Devices.bR(Devices.sW("13%")) },
  con_item_title: [ cStyles.row_justify_between, cStyles.row_align_center ],
  con_item_content: [cStyles.flex_full, {paddingLeft: 10}],
  con_star_item: { paddingRight: 3 },
  con_star_size: Devices.fS(10),

  txt_item_name: [cStyles.txt_title_group],
  txt_item_des: [cStyles.txt_base_item, cStyles.flex_full],
  txt_item_time: [cStyles.txt_body_meta_item, { alignSelf: 'flex-end' }],
  txt_status: [cStyles.txt_body_meta_item, { fontFamily: Devices.zsBodyMedium, color: Colors.WHITE_COLOR, borderRadius: 10, 
    paddingHorizontal: 5, paddingVertical: 2, marginTop: 10
  }]
}