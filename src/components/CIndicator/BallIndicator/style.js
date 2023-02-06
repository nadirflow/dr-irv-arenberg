/**
 ** Name: BallIndicator.js
 ** Author: ZiniSoft Ltd
 ** CreatedAt: 2020
 ** Description: Description of BallIndicator.js
**/
/* LIBRARY */
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },

  layer: {
    ...StyleSheet.absoluteFillObject,

    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
});