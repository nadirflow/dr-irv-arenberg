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
  signUp: async (params = {}) => {
    try {
      let results = await ApiWoo.post(Routes.auth.signUp, params);
      return results;
    } catch (error) {
      return null;
    }
  }
}