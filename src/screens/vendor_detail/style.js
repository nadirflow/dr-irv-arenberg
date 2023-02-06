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

  con_banner: { marginBottom: 10 },
  /**TABS */
  con_tab: { width: Devices.width },
  con_tab_bar_item: [cStyles.center, cStyles.p_5, cStyles.mr_10],
  con_tab_bar_last_item: { marginRight: 0 },
  con_tab_bar_active_item: [{ borderBottomColor: Colors.PRIMARY_COLOR, borderBottomWidth: 3 }],

  txt_tab_bar: [cStyles.txt_title_group, { color: Colors.PLACEHOLDER_COLOR }],
  txt_header_tab: [cStyles.txt_title_group, cStyles.ph_10]
}