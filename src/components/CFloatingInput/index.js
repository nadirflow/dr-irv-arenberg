/**
 ** Name: File.js
 ** Author: ZiniSoft Ltd
 ** CreatedAt: 2020
 ** Description: Description of File.js
**/
/* LIBRARY */
import React from "react";
import { Item, Label, Input } from 'native-base';
/* COMPONENTS */
import CText from '~/components/CText';
/* COMMON */
import { Colors } from '~/utils/colors';
import { Devices } from '~/config';
/* STYLES */
import styles from './style';

export default CFloatingInput = ({
  loading = false,
  error = false,
  required = false,
  optional = false,

  containerStyle = {},
  labelStyle = {},
  titleStyle = {},
  inputStyle = {},

  customRef = null,
  title = "",
  placeholder = "",
  value = "",
  nextFocusField = false,
  keyboardType = "default",

  onChange = () => { },
  onSubmit = () => { }
}) => {
  return (
    <Item style={[styles.con_input, containerStyle]} floatingLabel last error={error}>
      <Label style={[styles.con_label, labelStyle]}>
        <CText style={[styles.txt_label, titleStyle]} i18nKey={title} />
        {required && "*"}
        {optional && <CText style={styles.txt_option} i18nKey={"optional"} />}
      </Label>

      <Input style={[styles.txt_input, inputStyle]}
        getRef={customRef}
        disabled={loading}
        removeClippedSubviews={Devices.OS === 'android'}
        placeholderTextColor={Colors.BORDER_COLOR}
        placeholder={placeholder}
        blurOnSubmit={false}
        returnKeyType={nextFocusField ? 'next' : "done"}
        value={value}
        keyboardType={keyboardType}
        selectionColor={Colors.BLACK_COLOR}
        onChangeText={onChange}
        onSubmitEditing={onSubmit}
      />
    </Item>
  )
}