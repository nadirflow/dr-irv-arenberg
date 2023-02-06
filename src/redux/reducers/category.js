/**
 ** Name: 
 ** Author: 
 ** CreateAt: 
 ** Description: 
**/
/* LIBRARY */
/* TYPE REDUX */
import * as types from '../actions/types';

const initialState = {
  categoriesProduct: null,
  categoriesNews: null
};

export default function (state = initialState, action = {}) {
  switch (action.type) {
    case types.UPDATE_CATEGORIES_PRODUCT:
      return {
        ...state,
        categoriesProduct: action.categoriesProduct
      };
    case types.UPDATE_CATEGORIES_NEWS:
      return {
        ...state,
        categoriesNews: action.categoriesNews
      };
    case types.REMOVE_ALL_CATEGORY:
      return {
        ...state,
        categoriesProduct: null,
        categoriesNews: null
      };
    case types.UPDATE_ALL_SETTING:
      return {
        ...state,
        categoriesProduct: action.settings.settingCateProduct,
        categoriesNews: action.settings.settingCateNews
      };

    default:
      return state
  }
}