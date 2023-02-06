/**
 ** Name:
 ** Author:
 ** CreateAt:
 ** Description:
**/
/* LIBRARY */
import payPalApi from '~/config/payPalApi';
import { Configs } from '~/config';

export default {

  getTokenPayPal: async (params) => {
    return fetch(Configs.hostPayPal + payPalApi.token.get, {
      headers: {
        // Use the correct MIME type for your server
        Accept: 'application/json',
        // Use the correct Content Type to send data to Stripe
        'Content-Type': 'application/x-www-form-urlencoded',
        // Use the Stripe publishable key as Bearer
        Authorization: `Basic ${params.auth}`
      },
      // Use a proper HTTP method
      method: 'post',
      // Format the credit card data to a string of key-value pairs
      // divided by &
      body: Object.keys(params.body)
        .map(key => key + '=' + params.body[key])
        .join('&')
    }).then(response => response.json())
      .catch(e => console.log(e));
  },

  processPayment: async (params) => {
    return fetch(Configs.hostPayPal + payPalApi.payments.payment, {
      headers: {
        // Use the correct MIME type for your server
        Accept: 'application/json',
        // Use the correct Content Type to send data to Stripe
        'Content-Type': 'application/json',
        // Use the Stripe publishable key as Bearer
        Authorization: `Bearer ${params.token}`
      },
      // Use a proper HTTP method
      method: 'post',
      // Format the credit card data to a string of key-value pairs
      // divided by &
      body: JSON.stringify(params.body)
    }).then(response => response.json())
      .catch(e => console.log("Error", e));
  },

  getStatusPayment: async (params) => {
    return fetch(Configs.hostPayPal + payPalApi.payments.get + `/${params.id}`, {
      headers: {
        // Use the correct MIME type for your server
        Accept: 'application/json',
        // Use the correct Content Type to send data to Stripe
        'Content-Type': 'application/x-www-form-urlencoded',
        // Use the Stripe publishable key as Bearer
        Authorization: `Bearer ${params.token}`
      },
      // Use a proper HTTP method
      method: 'get',
      // Format the credit card data to a string of key-value pairs
      // divided by &
    }).then(response => response.json())
      .catch(e => null);
  },

  capturePayment: async (params) => {
    return fetch(Configs.hostPayPal + payPalApi.payments.capture + `/${params.id}/capture`, {
      headers: {
        // Use the correct MIME type for your server
        Accept: 'application/json',
        // Use the correct Content Type to send data to Stripe
        'Content-Type': 'application/json',
        // Use the Stripe publishable key as Bearer
        Authorization: `Bearer ${params.token}`
      },
      // Use a proper HTTP method
      method: 'post',
      // Format the credit card data to a string of key-value pairs
      // divided by &
    }).then(response => response.json())
      .catch(e => console.log("Error", e));
  },
}
