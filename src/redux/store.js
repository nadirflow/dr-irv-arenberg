/**
 ** Name: 
 ** Author: 
 ** CreateAt: 
 ** Description: 
**/
/* LIBRARY */
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';
/* REDUCERS */
import rootReducer from './reducers';

let loggerMiddleware = createLogger({ predicate: (getState, action) => __DEV__ });
let createStoreWithMiddleware = applyMiddleware(thunk, loggerMiddleware)(createStore);
let store = createStoreWithMiddleware(rootReducer);

export default store;