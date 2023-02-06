/**
 ** Name: 
 ** Author: 
 ** CreateAt: 
 ** Description: 
**/
import { StatusBar } from 'react-native';
/* COMMON */
import { cStyles } from '~/utils/styles';
import { Colors } from '~/utils/colors';
import { Devices, isIphoneX } from '~/config';
import { layoutWidth } from '~/utils/layout_width';

const MAX_HEIGHT = Devices.sW('80%');
const STATUS_BAR_HEIGHT = Devices.OS === 'android' ? StatusBar.currentHeight : isIphoneX() ? 30 : 20;

export default styles = {
  //HEADER
  con_header: { width: Devices.width, height: MAX_HEIGHT },
  con_icon_back_full: [cStyles.column_align_start, cStyles.column_justify_center,
  { position: "absolute", top: isIphoneX() ? Devices.sW('10%') : Devices.sW('7%'), height: 50, width: 50 }
  ],
  con_icon_bookmark_full: [cStyles.column_align_end, cStyles.column_justify_center,
  { position: "absolute", top: isIphoneX() ? Devices.sW('10%') : Devices.sW('7%'), height: 50, width: 50 }
  ],
  con_icon_share_full: [cStyles.column_align_end, cStyles.column_justify_center,
  { position: "absolute", top: isIphoneX() ? Devices.sW('10%') : Devices.sW('7%'), height: 50, width: 50 }
  ],
  con_header_fixed: [cStyles.row_align_center, {
    height: Devices.sW('23%'), opacity: 1, width: "100%",
    backgroundColor: Colors.WHITE_COLOR, borderBottomWidth: 1, borderBottomColor: Colors.BORDER_COLOR,
    position: "absolute", paddingTop: STATUS_BAR_HEIGHT, zIndex: 1
  }],
  con_btn_back: [cStyles.column_align_start, {
    position: "absolute", top: isIphoneX() ? Devices.sW('13%') : Devices.sW('10%')
  }],
  con_btn_share: [cStyles.column_align_end, {
    position: "absolute", top: isIphoneX() ? Devices.sW('13%') : Devices.sW('10%')
  }],
  con_btn_bookmark: [cStyles.column_align_end, {
    position: "absolute", top: isIphoneX() ? Devices.sW('13%') : Devices.sW('10%')
  }],
  con_content_full: { position: 'absolute', height: Devices.height },
  con_content: [cStyles.pt_15, cStyles.pb_20],
  con_news_time: [cStyles.row_align_center, cStyles.pv_10],
  con_tags: [cStyles.row, cStyles.flex_wrap, cStyles.mt_10, { width: '100%' }],
  con_single_tags: [cStyles.mr_10, cStyles.mb_10, cStyles.br_5, {
    backgroundColor: Colors.BACKGROUND_ITEM_COLOR
  }],
  con_video: [cStyles.mv_10, { height: Devices.sW('60%'), width: Devices.sW(`${layoutWidth.width}%`) }],

  txt_title_header_fixed: [cStyles.txt_title_header,
  { width: Devices.sW('65%'), color: Colors.BLACK_COLOR }
  ],
  txt_title_header_fixed_RTL: [cStyles.txt_title_header,
  { width: Devices.sW('65%'), paddingRight: 50, color: Colors.BLACK_COLOR, textAlign: "right" }
  ],
  txt_title_header: [cStyles.txt_title_group],
  txt_news_time: [cStyles.txt_body_meta_item, cStyles.mt_5],
  txt_author: [cStyles.txt_body_meta_item, cStyles.mt_5],
  txt_title_related: [cStyles.txt_title_group, cStyles.pv_10],
  txt_categories: [cStyles.txt_base_item, cStyles.mt_5],
  txt_tags: [cStyles.txt_body_meta_item, cStyles.pv_15, cStyles.ph_10],
  txt_title_video: [cStyles.txt_base_item, { textAlign: 'center' }],

  img_header: { width: Devices.width, height: MAX_HEIGHT },
  img_content: { height: Devices.sW("100%"), width: "100%" },
  img_category: { height: 40, width: 40, borderRadius: Devices.bR(40), borderColor: Colors.BORDER_COLOR, borderWidth: 1 }
}