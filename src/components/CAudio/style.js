/**
 ** Name: 
 ** Author: 
 ** CreateAt: 
 ** Description: 
**/
/* COMMON */
import { cStyles } from '~/utils/styles';
import { Colors } from '~/utils/colors';

export default styles = {
  con: [cStyles.container],

  con_bg_audio: [cStyles.row_align_center,
  {
    backgroundColor: Colors.PLACEHOLDER_COLOR, height: 50, width: '100%', marginVertical: 10, borderRadius: 5,
    paddingRight: 10
  }
  ],
  con_bg_play_pause: [cStyles.center, { height: 50, width: 50 }],
  con_progress: [cStyles.row_align_center, cStyles.row_justify_around, { width: '85%' }],

  txt_progress: [cStyles.txt_base_item, { color: Colors.WHITE_COLOR }]
}