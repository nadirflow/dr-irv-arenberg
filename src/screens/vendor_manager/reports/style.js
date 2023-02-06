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
  income: [cStyles.row_align_center, {height: Devices.sW("13%"), borderRadius: 5}],
  con_ic_income: [cStyles.center, {
    height: Devices.sW("13%"), width: Devices.sW("13%"), borderTopLeftRadius: 5, borderBottomLeftRadius: 5
  }],
  con_price: [cStyles.row_align_center, { paddingRight: 15 }],
  con_block: [{marginBottom: 15}],

  txt_title_income: [cStyles.txt_base_item, cStyles.flex_full, {paddingHorizontal: 15}],
  txt_income: [cStyles.txt_title_header],
  txt_title_block: [cStyles.txt_title_header, { paddingVertical: 5 }]
}