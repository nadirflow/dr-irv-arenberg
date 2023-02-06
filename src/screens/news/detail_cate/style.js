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
  con_footer_loading: [cStyles.pv_10, { width: '100%' }],

  /** NEWS */
  con_content_news: cStyles.pb_10,

  /**TABS */
  con_tab: { width: Devices.width },
  con_tabbar_item: [cStyles.center, cStyles.p_10, cStyles.mr_10],
  con_tabbar_last_item: { marginRight: 0 },
  con_tabbar_active_item: [cStyles.br_5, { borderBottomColor: Colors.PRIMARY_COLOR, borderBottomWidth: 4 }],

  txt_tabbar: [cStyles.txt_title_group, { color: Colors.PLACEHOLDER_COLOR }],
  txt_header_tab: [cStyles.txt_title_group, cStyles.ph_10]
}