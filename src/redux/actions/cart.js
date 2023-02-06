/**
 ** Name: 
 ** Author: 
 ** CreateAt: 
 ** Description: 
**/
/* LIBRARY */
/* TYPES */
import * as types from './types';
/** UPDATE FOR CART */
export const updateCart = carts => ({ type: types.UPDATE_CART, carts });

export const addItemCart = service => ({ type: types.ADD_ITEM_CART, service });

export const addItemCartWebview = cartData => ({ type: types.ADD_ITEM_CART_WEBVIEW, cartData });

export const updateItemCart = service => ({ type: types.UPDATE_ITEM_CART, service });

export const removeItemCart = (idService, variationId) => ({ type: types.REMOVE_ITEM_CART, idService, variationId });

export const removeAllCart = () => ({ type: types.REMOVE_ALL_CART });

export const updateCartKey = (cartKey) => ({ type: types.UPDATE_CART_KEY, cartKey });