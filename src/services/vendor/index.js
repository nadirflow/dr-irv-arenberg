/**
 ** Name:
 ** Author:
 ** CreateAt:
 ** Description:
**/
/* LIBRARY */
import { Configs } from '~/config';
import Routes from '~/services/routes';
import ApiVD from '../apiVD';

export default {
  getStore: async (type = Configs.vendor, params = {}) => {
    try {
      let newURL = "";
      if (type === 'wcfm') {
        newURL = Routes.vendor.wcfm.getStore + params.vendorId;
      } else {

      }

      let results = await ApiVD.get(newURL);
      return results;
    } catch (error) {
      return null;
    }
  },
  listStore: async (type = Configs.vendor) => {
    try {
      let newURL = "";
      if (type === 'wcfm') {
        newURL = Routes.vendor.wcfm.listStore;
      }

      let results = await ApiVD.get(newURL);
      return results;
    } catch (error) {
      return null;
    }
  },
  listProduct: async (type = Configs.vendor, params = {}) => {
    try {
      let newURL = "";
      if (type === 'wcfm') {
        newURL = Routes.vendor.wcfm.listProduct;
        newURL = newURL.replace('[vendor_id]', params.vendor_id);
        newURL = `${newURL}?page=${params.page}&per_page=${params.per_page}`;
      } else {

      }

      let results = await ApiVD.get(newURL);
      return results;
    } catch (error) {
      return null;
    }
  },

  //** FOR STORE MANAGER */

  getProducts: async (params) => {
    // console.log('params', params)
    return fetch(Configs.hostApi + Routes.vendor.manager.listProduct, {
      headers: {
        // Use the correct MIME type for your server
        Accept: 'application/json',
        // Use the Stripe publishable key as Bearer
        Authorization: `Bearer ${params.auth}`
      },
      // Use a proper HTTP method
      method: 'get'
    }).then(response => {
      console.log('response', response);
      return response.json()
    })
      .catch(e => console.log(e));
  },

  getOrders: async (params) => {
    return fetch(`${Configs.hostApi}${Routes.vendor.manager.listOrder}?page=${params.page}&per_page=${params.per_page}`, {
      headers: {
        // Use the correct MIME type for your server
        Accept: 'application/json',
        // Use the Stripe publishable key as Bearer
        Authorization: `Bearer ${params.auth}`
      },
      // Use a proper HTTP method
      method: 'get'
    }).then(response => response.json())
      .catch(e => console.log(e));
  },

  getStats: async (params) => {
    return fetch(Configs.hostApi + Routes.vendor.manager.stats, {
      headers: {
        // Use the correct MIME type for your server
        Accept: 'application/json',
        // Use the Stripe publishable key as Bearer
        Authorization: `Bearer ${params.auth}`
      },
      // Use a proper HTTP method
      method: 'get'
    }).then(response => response.json())
      .catch(e => console.log(e));
  },

  getReviews: async (params) => {
    return fetch(`${Configs.hostApi}${Routes.vendor.manager.reviews}?page=${params.page}&per_page=${params.per_page}`, {
      headers: {
        // Use the correct MIME type for your server
        Accept: 'application/json',
        // Use the Stripe publishable key as Bearer
        Authorization: `Bearer ${params.auth}`
      },
      // Use a proper HTTP method
      method: 'get'
    }).then(response => response.json())
      .catch(e => console.log(e));
  },

  getNotifications: async (params) => {
    return fetch(`${Configs.hostApi}${Routes.vendor.manager.notification}?page=${params.page}&per_page=${params.per_page}`, {
      headers: {
        // Use the correct MIME type for your server
        Accept: 'application/json',
        // Use the Stripe publishable key as Bearer
        Authorization: `Bearer ${params.auth}`
      },
      // Use a proper HTTP method
      method: 'get'
    }).then(response => response.json())
      .catch(e => console.log(e));
  },
}