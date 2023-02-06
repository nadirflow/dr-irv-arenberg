/**
 * @Description: API
 * @Created by ZiniTeam
 * @Date create:
 */

const Api = {
  token: {
    get: '/v1/oauth2/token'
  },
  payments: {
    payment: '/v2/checkout/orders',
    get: '/v2/checkout/orders',
    capture: '/v2/checkout/orders'
  },

}

export default Api;