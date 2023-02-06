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

  listCountries: (params = {}) => {
    let newUrl = Routes.data_shipping.listCountries;
    try {
      let results = ApiWoo.get(newUrl, params);
      return results;
    } catch (error) {
      return null;
    }
  },
}