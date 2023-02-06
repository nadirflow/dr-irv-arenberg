/**
 ** Name:
 ** Author:
 ** CreateAt:
 ** Description:
**/
/* LIBRARY */
import ApiWP from '~/services/apiWP';
import Routes from '~/services/routes';

export default {
  get: async (params = {}) => {
    try {
      let newURL = Routes.page.get + '/' + params.id;
      let results = await ApiWP.get(newURL);
      return results;
    } catch (error) {
      return null;
    }
  }
}