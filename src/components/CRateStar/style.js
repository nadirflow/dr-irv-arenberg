/**
 ** Name: 
 ** Author: 
 ** CreateAt: 
 ** Description: 
**/
/* COMMON */
import { cStyles } from '~/utils/styles';
import { Devices } from '~/config';

export default styles = {
  con_review_store: [cStyles.row_align_center, cStyles.mt_5],
  con_star_item: { paddingRight: 3 },
  con_star_size: Devices.fS(10),

  txt_rating_count: cStyles.txt_body_meta_item,
}