/**
 ** Name:
 ** Author:
 ** CreateAt:
 ** Description:
**/
/* LIBRARY */
import ApiWoo from '~/services/apiWoo';
import Routes from '~/services/routes';

export default {
  product: (params) => {
    try {
      let newParams = params, newUrl = Routes.service.product;
      newParams.status = "publish";
      newUrl += "/" + params.id;

      let results = ApiWoo.get(newUrl, params);
      return results;
    } catch (error) {
      return null;
    }
  },

  listCategories: (params) => {
    try {
      let results = ApiWoo.get(Routes.service.listCategories, params);
      console.log(params);
      return results;
    } catch (error) {
      return null;
    }
  },

  listProducts: (params) => {
    try {
      let newParams = params;
      newParams.status = "publish";
      let results = ApiWoo.get(Routes.service.listProduct, newParams);
      return results;
    } catch (error) {
      return null;
    }
  },

  productsVariation: (params) => {
    let newUrl = Routes.service.productsVariation + "/" + params.id + "/variations";
    try {
      let results = ApiWoo.get(newUrl, params);
      return results;
    } catch (error) {
      return null;
    }
  },

  reviews: (params) => {
    try {
      let results = ApiWoo.get(Routes.service.reviews, params);
      return results;
    } catch (error) {
      return null;
    }
  },

  submitReview: (params) => {
    try {
      let results = ApiWoo.post(Routes.service.reviews, params);
      return results;
    } catch (error) {
      return null;
    }
  }
}