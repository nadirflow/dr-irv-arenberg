/**
 ** Name: 
 ** Author: 
 ** CreateAt: 
 ** Description: 
**/
/* LIBRARY */
/* TYPES */
import * as types from './types';
/** UPDATE DATA USER */
export const updateUser = user => ({ type: types.UPDATE_USER, user });
export const removeUser = () => ({ type: types.REMOVE_USER });