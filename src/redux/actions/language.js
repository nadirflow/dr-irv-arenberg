/**
 ** Name: 
 ** Author: 
 ** CreateAt: 
 ** Description: 
**/
/* LIBRARY */
/* TYPES */
import * as types from './types';

export const updateLanguage = language => ({ type: types.CHANGE_LANGUAGE, language });
export const setDefault = () => ({ type: types.SET_DEFAULT });