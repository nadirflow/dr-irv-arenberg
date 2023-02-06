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
  con_banner: { width: "100%", height: Devices.sW("27%"), marginTop: 10 },
  con_banner_header: [cStyles.row_align_center, cStyles.flex_full, {
    paddingHorizontal: 10, paddingVertical: 20, zIndex: 2
  }],
  con_vendor_logo: { width: Devices.sW("14%"), height: Devices.sW("14%"), borderRadius: Devices.bR(Devices.sW("14%")) },
  con_banner_content: [{ paddingHorizontal: 15 }],
  con_banner_opacity: { backgroundColor: Colors.BLACK_COLOR, opacity: .6, position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1, borderRadius: 10 },

  txt_banner_featured: [cStyles.txt_body_meta_item, { color: Colors.GREEN_COLOR, fontWeight: 'bold' }],
  txt_banner_shop_name: [cStyles.txt_title_header, { color: Colors.WHITE_COLOR, marginVertical: 5 }],
  txt_count_stars: { color: Colors.WHITE_COLOR },
  txt_count_product: [cStyles.txt_body_meta_item, { color: Colors.WHITE_COLOR }],
  con_row_item_right: [cStyles.flex_full, cStyles.row_justify_end, { alignItems: 'center' }],
}