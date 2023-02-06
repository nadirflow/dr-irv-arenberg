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
export const updateCategoriesProduct = categoriesProduct => ({ type: types.UPDATE_CATEGORIES_PRODUCT, categoriesProduct });
export const updateCategoriesNews = categoriesNews => ({ type: types.UPDATE_CATEGORIES_NEWS, categoriesNews });
export const removeAllCategory = () => ({ type: types.REMOVE_ALL_CATEGORY });