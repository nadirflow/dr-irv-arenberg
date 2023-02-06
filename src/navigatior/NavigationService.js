/**
 ** Name: 
 ** Author: 
 ** CreateAt: 
 ** Description: 
**/
/* LIBRARY */
import { CommonActions } from '@react-navigation/native';

let _navigator;

function setTopLevelNavigator(navigatorRef) {
  _navigator = navigatorRef;
}

function navigate(routeName, params) {
  _navigator && _navigator.dispatch(
    CommonActions.navigate({
      routeName,
      params,
    })
  );
}

function getCurrentRouteName() {
  if (_navigator && _navigator.state.nav.routes.length > 0) {
    let length = _navigator.state.nav.routes.length;
    let lastRouteName = _navigator.state.nav.routes[length - 1].routeName;
    return lastRouteName;
  }
  return null;
}

function setParams(key, value) {
  _navigator._navigation.setParams(key, value);
}

export default {
  navigate,
  getCurrentRouteName,
  setParams,
  setTopLevelNavigator,
};
