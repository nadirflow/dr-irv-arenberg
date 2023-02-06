/**
 ** Name: 
 ** Author: 
 ** CreateAt: 
 ** Description: 
**/
/* LIBRARY */

const Routes = {
  auth: {
    jwt: "/wp-json/jwt-auth/v1/token",
    signIn: 'customers',
    signUp: 'customers',
    forgotPassword: '/wp-json/bdpwr/v1/reset-password',
    validateCode: '/wp-json/bdpwr/v1/validate-code',
    setPassword: '/wp-json/bdpwr/v1/set-password'
  },
  profile: {
    edit: 'customers',
    upload: '/media'
  },
  coupon: {
    list: 'coupons',
    get: 'coupons'
  },
  news: {
    list: '/posts',
    categories: '/categories',
    related: '/wp-json/zini-app-builder/v2/getRelated'
  },
  service: {
    product: 'products',
    listProduct: 'products',
    listCategories: 'products/categories',
    productsVariation: 'products',
    reviews: 'products/reviews'
  },
  user: {
    get: 'customers',
    getAuthor: '/users'
  },
  setting: {
    get: 'settings/general',
    getShippingZones: 'shipping/zones',
    getShippingMethods: 'shipping/zones',
    getCountryFromZone: 'shipping/zones',
    getPayment: 'payment_gateways',
    appSetting: '/wp-json/zini-app-builder/v2/settings',
    homeSetting: '/wp-json/zini-app-builder/v2/home',
    accountSetting: 'settings/account',
    allowGuestCheckout: 'settings/account/woocommerce_enable_guest_checkout',
  },
  order: {
    order: 'orders',
    list: 'orders'
  },
  page: {
    get: '/pages'
  },
  pdf: {
    convertToImages: '/convert/pdf/to/png'
  },
  data_shipping: {
    listCountries: 'data/countries'
  },
  mercado_pago: {
    findCustomer: '/v1/customers/search',
    processPayment: '/checkout/preferences'
  },
  vendor: {
    wcfm: {
      listStore: '/wcfmmp/v1/store-vendors',
      getStore: '/wcfmmp/v1/store-vendors/',

      listProduct: '/wcfmmp/v1/store-vendors/[vendor_id]/products',
    },
    manager: {
      listProduct: '/wp-json/wcfmmp/v1/products/',
      listOrder: '/wp-json/wcfmmp/v1/orders/',
      stats: '/wp-json/wcfmmp/v1/sales-stats',
      reviews: '/wp-json/wcfmmp/v1/reviews',
      notification: '/wp-json/wcfmmp/v1/notifications'
    }
  },
  cart: {
    addToCart: '/zini-app-builder/v2/cart',
    get: '/zini-app-builder/v2/cart',
    updateQuantity: '/zini-app-builder/v2/set-quantity',
    removeItem: '/zini-app-builder/v2/remove-cart-item',
    addCoupon: '/zini-app-builder/v2/add-discount',
    removeCoupon: '/zini-app-builder/v2/remove-coupon'
  }
}

export default Routes;