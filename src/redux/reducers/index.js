/**
 ** Name: 
 ** Author: 
 ** CreateAt: 
 ** Description: 
**/
/* LIBRARY */
import { combineReducers } from 'redux';
/* REDUCER */
import connection from './connection';
import language from './language';
import setting from './setting';
import cart from './cart';
import user from './user';
import category from './category';

export default combineReducers({
  connection,
  language,
  setting,
  cart,
  user,
  category
});