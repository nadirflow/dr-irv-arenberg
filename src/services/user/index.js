/**
 ** Name:
 ** Author:
 ** CreateAt:
 ** Description:
**/
/* LIBRARY */
import ApiWoo from '~/services/apiWoo';
import Routes from '~/services/routes';
import ApiWP from '../apiWP';

export default {
  get: async (params = {}) => {
    try {
      let newURL = Routes.user.get + "/" + params.id;
      let results = await ApiWoo.get(newURL);
      return results;
    } catch (error) {
      return null;
    }
  },
  
  getAuthor: async (params = {}) => {
    try {
      let newURL = Routes.user.getAuthor + "/" + params.id;
      let results = await ApiWP.get(newURL);
      return results;
    } catch (error) {
      return null;
    }
  }
}