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
  con_img_item: [cStyles.center, { width: Devices.sW("13%"), height: Devices.sW("13%"), borderRadius: Devices.bR(Devices.sW("13%")), 
    backgroundColor: Colors.PRIMARY_COLOR, transform: [{ rotate: "350deg" }]
  }],
  con_item_title: [ cStyles.row_justify_between, cStyles.row_align_end, cStyles.flex_full, { paddingTop: 5 } ],
  con_item_content: [cStyles.flex_full, {paddingLeft: 10}],

  txt_item_name: [cStyles.txt_title_group],
  txt_item_des: [cStyles.txt_base_item, { color: Colors.GREEN_COLOR}],
  txt_item_time: [cStyles.txt_body_meta_item],

}