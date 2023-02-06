/**
 ** Name: 
 ** Author: 
 ** CreateAt: 
 ** Description: 
**/
/* LIBRARY */
import { Devices } from '../../config';
import { Colors } from '~/utils/colors';
import { cStyles } from '~/utils/styles';

export default {
  con_swiper: { width: Devices.width },
  con_dot_active: {
    height: 4,
    width: 20,
    borderRadius: 10,
    backgroundColor: Colors.PRIMARY_COLOR,
    marginRight: 10
  },
  con_dot_unactive: {
    height: 2,
    width: 15,
    borderRadius: 10,
    backgroundColor: Colors.PLACEHOLDER_COLOR,
    marginRight: 10
  },
  con_button: {
    position: 'absolute', bottom: -(Devices.sW('5%')), right: 10, width: Devices.sW('10%'), height: Devices.sW('10%'),
    borderRadius: Devices.bR(Devices.sW('10%')), alignItems: 'center', backgroundColor: Colors.PRIMARY_COLOR,
    justifyContent: 'center'
  },
  con_dot_product: {
    position: 'absolute', bottom: 20, left: 20
  }
}