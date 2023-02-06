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
  order: (params = {}) => {
    let newUrl = Routes.order.order;
    try {
      let results = ApiWoo.post(newUrl, params);
      return results;
    } catch (error) {
      return null;
    }
  },
  list: (params = {}) => {
    try {
      let results = ApiWoo.get(Routes.order.list, params);
      return results;
    } catch (error) {
      return null;
    }
  },
  updateOrder: (params = {}) => {
    let newUrl = Routes.order.order + "/" + params.id;
    try {
      let results = ApiWoo.put(newUrl, params);
      return results;
    } catch (error) {
      return null;
    }
  },
}