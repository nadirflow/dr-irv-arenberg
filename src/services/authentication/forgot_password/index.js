import { Configs } from '~/config';
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
  forgotPassword: async (params) => {
    return fetch(Configs.hostApi + Routes.auth.forgotPassword, {
      headers: {
        // Use the correct MIME type for your server
        Accept: 'application/json',
        // Use the correct Content Type to send data to Stripe
        'Content-Type': 'application/json',
      },
      // Use a proper HTTP method
      method: 'post',
      // Format the credit card data to a string of key-value pairs
      // divided by &
      body: JSON.stringify(params)
    }).then(response => response.json())
      .catch(e => console.log("Error", e));
  },

  validateCode: async (params) => {
    return fetch(Configs.hostApi + Routes.auth.validateCode, {
      headers: {
        // Use the correct MIME type for your server
        Accept: 'application/json',
        // Use the correct Content Type to send data to Stripe
        'Content-Type': 'application/json',
      },
      // Use a proper HTTP method
      method: 'post',
      // Format the credit card data to a string of key-value pairs
      // divided by &
      body: JSON.stringify(params)
    }).then(response => response.json())
      .catch(e => console.log("Error", e));
  },

  setPassword: async (params) => {
    return fetch(Configs.hostApi + Routes.auth.setPassword, {
      headers: {
        // Use the correct MIME type for your server
        Accept: 'application/json',
        // Use the correct Content Type to send data to Stripe
        'Content-Type': 'application/json',
      },
      // Use a proper HTTP method
      method: 'post',
      // Format the credit card data to a string of key-value pairs
      // divided by &
      body: JSON.stringify(params)
    }).then(response => response.json())
      .catch(e => console.log("Error", e));
  },
}