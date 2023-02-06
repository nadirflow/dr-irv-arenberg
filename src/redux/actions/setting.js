/**
 ** Name: 
 ** Author: 
 ** CreateAt: 
 ** Description: 
**/
/* LIBRARY */
/* TYPES */
import * as types from './types';
/** UPDATE FOR SETTING APP */
export const updateSettingWoo = setting => ({ type: types.UPDATE_SETTING_WOO, setting });
export const updateSettingPayment = payment => ({ type: types.UPDATE_SETTING_PAYMENT, payment });
export const updateSettingGeneral = general => ({ type: types.UPDATE_SETTING_GENERAL, general });
export const updateSettingApp = app => ({ type: types.UPDATE_SETTING_APP, app });
export const updateSettingHome = home => ({ type: types.UPDATE_SETTING_HOME, home });
export const updateAllSettings = (settings) => ({ type: types.UPDATE_ALL_SETTING, settings });
export const updateCheckoutSetting = (settings) => ({ type: types.UPDATE_CHECKOUT_SETTING, settings });
export const removeAllSetting = () => ({ type: types.REMOVE_ALL_SETTING });