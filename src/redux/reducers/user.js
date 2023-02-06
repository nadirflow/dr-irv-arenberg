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
  data: null
};

export default function (state = initialState, action = {}) {
  switch (action.type) {
    case types.UPDATE_USER:
      return {
        ...state,
        data: action.user
      };
    case types.REMOVE_USER:
      return {
        ...state,
        data: null
      };

    default:
      return state
  }
}