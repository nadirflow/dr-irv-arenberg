/**
 ** Name:
 ** Author:
 ** CreateAt:
 ** Description:
**/
/* LIBRARY */
import stripeApi from '~/config/stripe.api';
import { Configs } from '~/config';

export default {

  getTokenStripe: async (params) => {
    return fetch(Configs.hostStripe + stripeApi.token.get, {
      headers: {
        // Use the correct MIME type for your server
        Accept: 'application/json',
        // Use the correct Content Type to send data to Stripe
        'Content-Type': 'application/x-www-form-urlencoded',
        // Use the Stripe publishable key as Bearer
        Authorization: `Bearer ${params.publishKey}`
      },
      // Use a proper HTTP method
      method: 'post',
      // Format the credit card data to a string of key-value pairs
      // divided by &
      body: Object.keys(params.card)
        .map(key => key + '=' + params.card[key])
        .join('&')
    }).then(response => response.json())
      .catch(e => null);
  },

  processPayment: async (params) => {
    return fetch(Configs.hostStripe + stripeApi.charges.charges, {
      headers: {
        // Use the correct MIME type for your server
        Accept: 'application/json',
        // Use the correct Content Type to send data to Stripe
        'Content-Type': 'application/x-www-form-urlencoded',
        // Use the Stripe publishable key as Bearer
        Authorization: `Bearer ${Configs.stripeSecret}`
      },
      // Use a proper HTTP method
      method: 'post',
      // Format the credit card data to a string of key-value pairs
      // divided by &
      body: Object.keys(params)
        .map(key => key + '=' + params[key])
        .join('&')
    }).then(response => response.json())
      .catch(e => null);
  },
}
