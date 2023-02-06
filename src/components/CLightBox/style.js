/**
 ** Name: 
 ** Author: 
 ** CreateAt: 
 ** Description: 
**/
/* COMMON */
import { Devices, isIphoneX } from "~/config";
import { cStyles } from '~/utils/styles';
import { Colors } from "~/utils/colors";
import { layoutWidth } from '~/utils/layout_width';

export default styles = {
  contain: {
    flex: 1,
    height: Devices.sW('30%'),
  },
  con_swiper: [{ height: Devices.height, width: Devices.width }],
  con_light_box: [cStyles.row_justify_around, { marginLeft: -15, marginRight: -15 }],
  con_light_box_item: { flex: 1 },
  con_bg: [cStyles.full_center, { backgroundColor: 'rgba(0,0,0,.5)', position: 'absolute', top: 0, right: 0, height: Devices.sW('25%'), width: Devices.sW('25%') }],
  con_close: [cStyles.full_center,
  {
    width: Devices.sW('15%'), backgroundColor: Colors.TRANSPARENT, padding: 5, borderColor: Colors.WHITE_COLOR, borderWidth: 1,
    borderRadius: 5
  }
  ],
  con_header: [{ backgroundColor: Colors.BLACK_COLOR }],

  txt_more: [cStyles.txt_title_group, { color: Colors.WHITE_COLOR, fontSize: Devices.fS(30) }],
  txt_close: [cStyles.txt_body_meta_item],

  img_image_single_full: { height: Devices.sW('100%'), width: Devices.sW('100%') },
  img_image_single: { height: Devices.sW('100%'), width: Devices.sW(`${layoutWidth.width}%`) },
  img_three_image: { height: Devices.sW('33.3%'), width: Devices.sW('33.3%'), justifyContent: 'center', alignSelf: 'center' },
  img_two_image: { height: Devices.sW('50%'), width: Devices.sW('50%'), justifyContent: 'center', alignSelf: 'center' },
  img_image: { height: Devices.sW('25%'), width: Devices.sW('25%'), justifyContent: 'center', alignSelf: 'center' },
}