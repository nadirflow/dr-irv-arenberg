/**
 ** Name: File.js
 ** Author: ZiniSoft Ltd
 ** CreatedAt: 2020
 ** Description: Description of File.js
**/
/* LIBRARY */
import React from 'react';
import {
  Item
} from 'native-base';
/** COMMON */
import { Configs, Devices } from "~/config";
import { cStyles } from '~/utils/styles';
import { layoutWidth } from '~/utils/layout_width';

const CItemInput = ({
  style = {},
  error = false,
  between = false,
  around = false,
  leftComp = null,
  rightComp = null,
}) => {
  if (Configs.supportRTL) {
    return (
      <Item style={[
        { marginLeft: 0 },
        cStyles.flex_full,
        cStyles.row_align_center,
        cStyles.row_justify_end,
        between && cStyles.row_justify_between,
        around && cStyles.row_justify_around,
        style
      ]} error={error}>
        {rightComp}
        {leftComp}
      </Item>
    )
  }

  return (
    <Item style={[
      { marginLeft: 0 },
      cStyles.flex_full,
      cStyles.row_align_center,
      cStyles.row_justify_end,
      between && cStyles.row_justify_between,
      around && cStyles.row_justify_around,
      style
    ]} error={error}>
      {leftComp}
      {rightComp}
    </Item>
  )
}

export default CItemInput;