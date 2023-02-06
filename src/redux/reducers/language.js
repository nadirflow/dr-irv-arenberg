/**
 ** Name: 
 ** Author: 
 ** CreateAt: 
 ** Description: 
**/
/* LIBRARY */
/* TYPE REDUX */
import * as types from '../actions/types';
import { Configs } from '~/config';

const initialState = {
  language: "en"
};

export default function (state = initialState, action = {}) {
  switch (action.type) {
    case types.CHANGE_LANGUAGE:
      return {
        ...state,
        language: action.language
      };

    case types.SET_DEFAULT:
      return {
        ...state,
        language: "en"
      };
    case types.UPDATE_ALL_SETTING:
      return {
        ...state,
        language: action.settings.settingLanguage
      };

    default:
      return state
  }
}