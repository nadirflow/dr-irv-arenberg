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
  /** ITEM */
  con_row_item: [cStyles.flex_full, cStyles.mb_10, cStyles.ph_20, cStyles.br_10,
  cStyles.pv_10, { backgroundColor: Colors.BACKGROUND_ITEM_COLOR, borderRadius: 5, borderWidth: 1, elevation: 1 }],
  con_row_item_left: [cStyles.row_align_center, cStyles.row_justify_start, { flex: .7 }],
  con_row_item_right: [cStyles.row_align_center, cStyles.row_justify_end, { flex: .3 }],
  con_count_product: [cStyles.center,
  {
    height: 25,
    width: 25,
    borderRadius: Devices.bR(25),
    backgroundColor: Colors.BORDER_COLOR,
  }
  ],

  img_item: {
    width: Devices.sW("17%"), height: Devices.sW("17%"), borderRadius: Devices.bR(Devices.sW("17%")), borderWidth: 1,
    borderColor: Colors.BORDER_COLOR
  },

  txt_title_item: [cStyles.txt_title_item, cStyles.pl_10, cStyles.flex_full],
  txt_count_product: cStyles.txt_base_item
}