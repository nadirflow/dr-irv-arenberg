/**
 ** Name:
 ** Author:
 ** CreateAt:
 ** Description:
**/
/* LIBRARY */
import ApiWoo from '~/services/apiWoo';
import Routes from '~/services/routes';

export default {
  list: async (params = {}) => {
    try {
      let results = await ApiWoo.get(Routes.coupon.list, params);
      return results;
    } catch (error) {
      return null;
    }
  },
  get: async (params = {}) => {
    try {
      let newURL = Routes.coupon.list + '/' + params.id;
      let results = await ApiWoo.get(newURL, params);
      return results;
    } catch (error) {
      return null;
    }
  }
}