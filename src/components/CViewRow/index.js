/**
 ** Name: File.js
 ** Author: ZiniSoft Ltd
 ** CreatedAt: 2020
 ** Description: Description of File.js
**/
/* LIBRARY */
import React from 'react';
import { View } from 'react-native';
/** COMMON */
import { Configs } from "~/config";
import { cStyles } from '~/utils/styles';

const CViewRow = ({
  style = {},
  between = false,
  around = false,
  start = false,
  end = false,
  leftComp = null,
  rightComp = null,
}) => {
  if (Configs.supportRTL) {
    return (
      <View style={[
        cStyles.row_align_center,
        cStyles.row_justify_end,
        start && cStyles.row_justify_start,
        between && cStyles.row_justify_between,
        around && cStyles.row_justify_around,
        style
      ]}>
        {rightComp}
        {leftComp}
      </View>
    )
  }

  return (
    <View style={[
      cStyles.row_align_center,
      cStyles.row_justify_start,
      between && cStyles.row_justify_between,
      around && cStyles.row_justify_around,
      style
    ]}>
      {leftComp}
      {rightComp}
    </View>
  )
}

export default CViewRow;