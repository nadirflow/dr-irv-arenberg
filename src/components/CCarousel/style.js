/**
 ** Name: 
 ** Author: 
 ** CreateAt: 
 ** Description: 
**/
/* LIBRARY */
import { Devices } from '../../config';
import { Colors } from '~/utils/colors';

export default {
  con_swiper: { width: Devices.width },
  con_dot_active: {
    height: 4,
    width: 20,
    borderRadius: 10,
    backgroundColor: Colors.PRIMARY_COLOR,
  },
  con_dot_unactive: {
    height: 2,
    width: 15,
    borderRadius: 10,
    backgroundColor: Colors.PLACEHOLDER_COLOR,
  }
}