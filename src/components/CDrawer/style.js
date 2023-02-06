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
  con_content: [cStyles.container, { paddingTop: Devices.sW('10%') }],
  /** HEADER */
  con_header: { backgroundColor: Colors.WHITE_COLOR },

  /** GROUP */
  con_group: [],
  con_group_2: { marginTop: Devices.sW('10%'), paddingBottom: Devices.sW('10%') },
  con_title_group: cStyles.p_15,
  con_header_accordion: [cStyles.p_15,
  {
    backgroundColor: Colors.WHITE_COLOR, borderBottomWidth: .5,
    borderBottomColor: Colors.BORDER_COLOR,
  }],
  con_accordion: [cStyles.flex_grow, cStyles.column, {
    overflow: 'scroll', flexGrow: 1, flexShrink: 1
  }],
  con_btn_expanded: [cStyles.center, { height: 30, width: 30 }],

  txt_title_group: cStyles.txt_title_group_drawer,
  txt_header_accordion: cStyles.txt_title_item,
  txt_sub_header_accordion: cStyles.txt_title_item,
}