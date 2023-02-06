/**
 ** Name:
 ** Author:
 ** CreateAt:
 ** Description:
**/
/* LIBRARY */
import ApiWoo from '~/services/apiWoo';
import Routes from '~/services/routes';
import ApiWP from '~/services/apiWP';


export default {
  editUser: (params = {}) => {
    let newUrl = Routes.profile.edit + "/" + params.id
    try {
      let results = ApiWoo.put(newUrl, params);
      return results;
    } catch (error) {
      return null;
    }
  },
  uploadAvt: (params = {}) => {
    let newUrl = Routes.profile.upload;
    try {
      let results = ApiWP.upload(newUrl, params);
      return results;
    } catch (error) {
      return null;
    }
  },
}