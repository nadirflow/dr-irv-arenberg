/**
 ** Name: 
 ** Author: 
 ** CreateAt: 
 ** Description: 
**/
/* LIBRARY */
import WooCommerceAPI from './WooCommerceAPI';
/** COMMON */
import { Configs } from '~/config';

export const WooCommerce = {
  api: new WooCommerceAPI({
    url: Configs.hostApi,
    consumerKey: Configs.cosumerKey,
    consumerSecret: Configs.consumerSecret,
    wpAPI: true,
    version: Configs.versionApi,
    queryStringAuth: true, 
    wpAPIPrefix: Configs.wpAPIPrefix 
  })
}

class ApiWoo {
  static async get(route, params) {
    try {
      let data = await WooCommerce.api.get(route, params);
      // console.log('=== Api.get ' + route + ': ', data);
      return data;
    } catch (e) {
      // console.log('ERROR => Api.get ' + route + ': ', e);
      return null;
    }
  }

  static async post(route, params) {
    try {
      let data = await WooCommerce.api.post(route, params.update, params.other);
      // console.log('=== Api.post ' + route + ': ', data);
      return data;
    } catch (e) {
      // console.log('ERROR => Api.post ' + route + ': ', e);
      return null;
    }
  }

  static async put(route, params) {
    try {
      let data = await WooCommerce.api.put(route, params.update, params.other);
      // console.log('=== Api.put ' + route + ': ', data);
      return data;
    } catch (e) {
      // console.log('ERROR => Api.put ' + route + ': ', e);
      return null;
    }
  }

  static async delete(route, params) {
    try {
      let data = await WooCommerce.api.delete(route, params);
      // console.log('=== Api.delete ' + route + ': ', data);
      return data;
    } catch (e) {
      // console.log('ERROR => Api.delete ' + route + ': ', e);
      return null;
    }
  }
}

export default ApiWoo;