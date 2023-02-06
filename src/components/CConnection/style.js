/**
* @Description: ./src/libs/Connection
* @CreatedAt: 31/10/2019
* @Author: ZiniSoft
*/
/* LIBRARY */
import { Devices } from '~/config';
import { cStyles } from '~/utils/styles';

export default {
  con: {
    position: 'absolute', top: 0, left: 0, flex: 1, backgroundColor: 'rgba(255,255,255,.7)'
  },
  con_bar: {
    height: 100, width: Devices.width, alignItems: 'center'
  },
  note: [cStyles.small, { textAlign: 'center', marginTop: 20 }]
};