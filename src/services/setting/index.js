/**
 ** Name:
 ** Author:
 ** CreateAt:
 ** Description:
**/
/* LIBRARY */
import ApiWoo from '~/services/apiWoo';
import Routes from '~/services/routes';
import { Configs } from '~/config';

export default {
  get: async (params = {}) => {
    try {
      let results = await ApiWoo.get(Routes.setting.get, params);
      return results;
    } catch (error) {
      return null;
    }
  },

  getAccount: async (params = {}) => {
    try {
      let results = await ApiWoo.get(Routes.setting.accountSetting, params);
      return results;
    } catch (error) {
      return null;
    }
  },

  getAllowGuestCheckout: async (params = {}) => {
    try {
      let results = await ApiWoo.get(Routes.setting.allowGuestCheckout, params);
      return results;
    } catch (error) {
      return null;
    }
  },

  getShippingZones: async (params = {}) => {
    try {
      let results = await ApiWoo.get(Routes.setting.getShippingZones, params);
      return results;
    } catch (error) {
      return null;
    }
  },

  getShippingMethods: async (params = {}) => {
    try {
      let newUrl = Routes.setting.getShippingMethods + `/${params.id ? params.id : 1}` + '/methods';
      let results = await ApiWoo.get(newUrl, params);
      return results;
    } catch (error) {
      return null;
    }
  },

  getCountryFromZone: async (params = {}) => {
    try {
      let newUrl = Routes.setting.getCountryFromZone + `/${params.id ? params.id : 1}` + '/locations';
      let results = await ApiWoo.get(newUrl, params);
      return results;
    } catch (error) {
      return null;
    }
  },

  getPayment: async (params = {}) => {
    try {
      let results = await ApiWoo.get(Routes.setting.getPayment, params);
      return results;
    } catch (error) {
      return null;
    }
  },

  appSetting: async () => {
    try {
      let options = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
      };

      let results = await fetch(Configs.hostApi + Routes.setting.appSetting, options);
      // console.log('=== Api.get ' + Configs.hostApi + Routes.setting.appSetting + ': ', results);
      results = await  results.json();
       return results;
    } catch (error) {

      console.log(error)
      //return null;
    }
  },

  homeSetting: async () => {
    try {
      let options = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
      };

      let results = await fetch(Configs.hostApi + Routes.setting.homeSetting, options);
      // console.log('=== Api.get ' + Configs.hostApi + Routes.setting.homeSetting + ': ', results);
       results = await  results.json();



    return results;
    } catch (error) {
      return null;
    }
  },
}