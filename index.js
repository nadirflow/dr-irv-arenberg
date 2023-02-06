/**
 ** Name: 
 ** Author: 
 ** CreateAt: 
 ** Description: 
**/
/* LIBRARY */
import { AppRegistry, LogBox } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
console.disableYellowBox = true;
// Ignore log notification by message:
LogBox.ignoreLogs([
  'Warning:',
  'Non-serializable values were found in the navigation state'
]);
AppRegistry.registerComponent(appName, () => App);
