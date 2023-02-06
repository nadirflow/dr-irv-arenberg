/**
 ** Name: 
 ** Author: 
 ** CreateAt: 
 ** Description: 
**/
/* LIBRARY */
/* TYPE REDUX */
import { Configs, Keys } from '~/config';
import Helpers from '~/utils/helpers';
import * as types from '../actions/types';

const initialState = {
  cartKey: null,
  cartData: {
    items: [],
    totals: {},
    coupons: [],
  },
  carts: []
};

export default function (state = initialState, action = {}) {
  let tmpCarts = state.carts;
  let idService = action.idService || "-1";
  let variationId = action.variationId || "-1";
  let service = action.service || null;

  switch (action.type) {
    case types.UPDATE_CART:
      return {
        ...state,
        carts: action.carts
      };

    case types.ADD_ITEM_CART_WEBVIEW: 
      return {
        ...state,
        cartData: {
          ...action.cartData
        }
      };

    case types.ADD_ITEM_CART:
      if (service) {
        if (Configs.isPaymentWebview) {

        }
        let find = tmpCarts.findIndex(f => f.id === service.id);
        if (find !== -1) {
          if (service.variation) {
            if (service.variation.id === tmpCarts[find].variation.id) {
              tmpCarts[find].numberOfProduct += 1;
            } else {
              tmpCarts.push(service);
            }
          } else {
            tmpCarts[find].numberOfProduct += 1;
          }
        } else {
          tmpCarts.push(service);
        }
        return {
          ...state,
          carts: tmpCarts
        };
      }



    case types.UPDATE_ITEM_CART:
      if (service) {
        let find = tmpCarts.findIndex(f => f.id === service.id);
        if (find !== -1) {
          if (service.variation) {
            if (service.variation.id === tmpCarts[find].variation.id) {
              tmpCarts[find].numberOfProduct += 1;
            } else {
              tmpCarts.push(service);
            }
          } else {
            tmpCarts[find].numberOfProduct += 1;
          }
        } else {
          tmpCarts.push(service);
        }
      }

      return {
        ...state,
        carts: tmpCarts
      };

    case types.REMOVE_ITEM_CART:
      let find = tmpCarts.findIndex(f => f.id === idService && f.variation.id === variationId);
      if (find !== -1) {
        tmpCarts.splice(find, 1);
      }

      return {
        ...state,
        carts: tmpCarts
      };

    case types.REMOVE_ALL_CART:
      return {
        cartKey: null,
        carts: [],
        cartData: {
          items: {},
          totals: {},
          coupons: [],
        }
    };

    case types.UPDATE_CART_KEY:
      Helpers.setDataStorage(Keys.AS_DATA_CART_KEY, {key: action.cartKey});
      return {
        ...state,
        cartKey: action.cartKey,
    };

    default:
      return state
  }
}