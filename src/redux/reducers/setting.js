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
  setting: null,
  payment: null,
  app: null,
  home: null,
  shippingZones: null,
  account: null,
  dataCountry: null,
};

export default function (state = initialState, action = {}) {
  switch (action.type) {
    case types.UPDATE_SETTING_WOO:
      return {
        ...state,
        setting: action.setting
      };

    case types.UPDATE_SETTING_PAYMENT:
      return {
        ...state,
        payment: action.payment
      };

    case types.UPDATE_SETTING_APP:
      return {
        ...state,
        app: action.app
      };

    case types.UPDATE_SETTING_HOME:
      return {
        ...state,
        home: action.home
      };
    case types.UPDATE_SETTING_SHIPPING_ZONES:
      return {
        ...state,
        shippingZones: action.shippingZones
      };
    case types.UPDATE_SETTING_COUNTRY:
      return {
        ...state,
        dataCountry: action.dataCountry
      };
    case types.UPDATE_ALL_SETTING:
      return {
        ...state,
        setting: action.settings.settingWoo,
        app: action.settings.settingApp,
        home: action.settings.settingHome,
        account: action.settings.settingAccount,
      };
    case types.UPDATE_CHECKOUT_SETTING:
      return {
        ...state,
        payment: action.settings.settingPayment,
        shippingZones: action.settings.settingShippingZones,
        dataCountry: action.settings.settingDataCountry,
      };
    case types.REMOVE_ALL_SETTING:
      return {
        ...state,
        setting: null,
        payment: null,
        app: null,
        home: null,
        shippingZones: null,
        account: null,
        dataCountry: null,
      };

    default:
      return state
  }
}