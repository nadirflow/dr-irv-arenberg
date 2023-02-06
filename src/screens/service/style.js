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
  con: cStyles.container,
  con_content: { marginBottom: 10 },
  con_footer_loading: { width: '100%', paddingVertical: 10 },
  /** SEARCH */
  con_search_bar: { flex: 1, backgroundColor: Colors.BORDER_LARGE_COLOR, paddingHorizontal: 10, height: Devices.OS === 'ios' ? '90%' : '80%' },
  con_header_center: [cStyles.column_align_center, { flex: 1 }],
  con_search: [cStyles.shadow, {
    paddingHorizontal: 20,
    marginTop: 10,
    borderRadius: 5,
    height: Devices.sW('10%'),
    backgroundColor: Colors.WHITE_COLOR
  }],
  con_badge: {
    height: Devices.fS(14), width: Devices.fS(14), borderRadius: Devices.bR(Devices.fS(14)), position: 'absolute', top: 5, right: -6,
    backgroundColor: Colors.RED_COLOR, alignItems: 'center', justifyCenter: 'center'
  },
  con_cart: { paddingLeft: 10 },
  con_refine: [cStyles.row_align_center, { paddingRight: 10, paddingLeft: 20 }],

  txt_badge: [cStyles.txt_badge],
  txt_search: [cStyles.txt_base_item],
  con_header: [{
    backgroundColor: Colors.BORDER_LARGE_COLOR, paddingHorizontal: 10, height: Devices.OS === 'ios' ? '90%' : '80%'
  }
  ],
  /** TAB */
  con_tab: { width: Devices.width },
  con_tabbar: { paddingVertical: 5 },
  con_tabbar_item: [cStyles.center, { padding: 10, marginRight: 10 }],
  con_tabbar_last_item: { marginRight: 0 },
  con_tabbar_active_item: { borderBottomColor: Colors.PRIMARY_COLOR, borderBottomWidth: 4 },
  con_separator: { height: 1, backgroundColor: Colors.BORDER_COLOR },

  txt_tabbar: [cStyles.large, { color: Colors.PLACEHOLDER_COLOR }],
  txt_header_tab: [cStyles.small, { paddingHorizontal: 10 }],
  //SLIDER
  con_slider: { position: 'relative' },
  con_item_slider: { width: Devices.sW('100%'), height: Devices.sW('100%') },
  con_slider_content: { position: 'absolute', bottom: 20, left: 10, },
  con_slider_layer: { position: 'absolute', width: '100%', height: '100%', backgroundColor: Colors.WHITE_COLOR, opacity: .29 },
  con_slick: { width: 8, height: 8, borderRadius: 4, backgroundColor: 'red' },
  con_curr_slick: { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.PRIMARY_COLOR },

  img_slider: { width: '100%', height: '100%' },

  txt_slider_title: [cStyles.txt_title_item, { paddingBottom: 10, }],
  txt_slider_content: cStyles.xx_small,

  con_store_info: [{ backgroundColor: Colors.WHITE_COLOR, paddingHorizontal: 10, height: Devices.sH("15%") }, cStyles.column_justify_center],

  txt_store_title: [cStyles.txt_title_group, { paddingVertical: 10, }],
  /** MODAL FILTER */
  con_modal: [cStyles.container],
  con_header_modal: [cStyles.row_align_center, { backgroundColor: Colors.WHITE_COLOR, height: 60 }],
  con_header_title_modal: [cStyles.full_center],
  con_sort_item: [cStyles.row_align_center, cStyles.row_justify_between, {
    paddingVertical: 15
  }],
  con_separator_option: { height: 1, backgroundColor: Colors.BORDER_COLOR },

  txt_title_header_modal: [cStyles.txt_title_header],
}