/**
 ** Name: 
 ** Author: 
 ** CreateAt: 
 ** Description: 
**/
/* LIBRARY */
import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import {
  Container, Body, Button, Content, Input, Item, Form,
  Spinner
} from 'native-base';
import IconF from 'react-native-fontawesome-pro';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useColorScheme } from 'react-native-appearance';
import CountryPicker, {
  Flag,
  DARK_THEME,
  DEFAULT_THEME
} from 'react-native-country-picker-modal';
import moment from 'moment';
/* COMPONENTS */
import CHeader from "~/components/CHeader";
import CText from '~/components/CText';
import CViewRow from '~/components/CViewRow';
import CItemInput from '~/components/CItemInput';
/* COMMON */
import { cStyles } from '~/utils/styles';
import { Colors } from '~/utils/colors';
import { layoutWidth } from '~/utils/layout_width';
import { Configs, Languages, Devices } from '~/config';
import MetaFields from '~/utils/meta_fields';
/* STYLES */
import styles from './style';

const inputFields = {
  firstname: "firstname",
  lastname: "lastname",
  email: "email",
  phone: "phone",
  address: "address",
}

export const ViewProfile = ({
  state = null,
  props = null,
  inputs = {},
  onFunction = {
    onPressBack: () => { },
    onPressShowDatePicker: () => { },
    onConfirmDatePicker: () => { },
    onCancelDatePicker: () => { },
    onFocusNextField: () => { },
    onPressEdit: () => { },
    onChangeText: () => { },
    onFocus: () => { },
    onTogglePicker: () => { },
    onSelectCountry: () => { },
  }
}) => {
  let DOB = null, dataDateOfBirth = new Date();
  let colorScheme = useColorScheme();
  if (state._user.meta_data) {
    DOB = state._user.meta_data.find(f => f.key === MetaFields.date_of_birth);
    if (DOB) {
      dataDateOfBirth = new Date(
        moment(DOB.value).year(),
        moment(DOB.value).month(),
        moment(DOB.value).date(),
      )
    }
  }

  return (
    <Container>
      <CHeader
        style={{backgroundColor: '#18504D'}}
        title={"profile"}
        iconLeft_1={Configs.supportRTL ? "angle-right" : "angle-left"}
        iconRight_1={"none"}
        onPressLeft_1={onFunction.onPressBack}
      />

      <Content>
        <Form style={{ paddingHorizontal: Devices.pH(layoutWidth.width) }}>
          <CViewRow between
            leftComp={
              !Configs.supportRTL ?
                <Item style={styles.con_row} error={state._errorFirstName !== ""}>
                  <IconF containerStyle={cStyles.pr_10}
                    name={"user"}
                    color={cStyles.ic_left_detail.color}
                    size={cStyles.ic_left_detail.size}
                    type={state._focusField === "name" ? "solid" : cStyles.ic_left_detail.type} />
                  <Input style={styles.con_input}
                    ref={ref => inputs[inputFields.firstname] = ref}
                    disabled={state._loading}
                    removeClippedSubviews={Devices.OS === 'android'}
                    blurOnSubmit={false}
                    returnKeyType={'next'}
                    placeholder={Languages[props.language].first_name}
                    placeholderTextColor={Colors.PLACEHOLDER_COLOR}
                    value={state._firstName}
                    selectionColor={Colors.BLACK_COLOR}
                    onFocus={() => onFunction.onFocus("name")}
                    onBlur={() => onFunction.onFocus(null)}
                    onChangeText={value => onFunction.onChangeText(inputFields.firstname, value)}
                    onSubmitEditing={() => onFunction.onFocusNextField(inputFields.lastname)} />
                </Item>
                :
                <Item style={styles.con_row} error={state._errorFirstName !== ""}>
                  <Input style={[styles.con_input, cStyles.pr_10, cStyles.txt_RTL]}
                    ref={ref => inputs[inputFields.firstname] = ref}
                    disabled={state._loading}
                    removeClippedSubviews={Devices.OS === 'android'}
                    blurOnSubmit={false}
                    returnKeyType={'next'}
                    placeholder={Languages[props.language].first_name}
                    placeholderTextColor={Colors.PLACEHOLDER_COLOR}
                    value={state._firstName}
                    selectionColor={Colors.BLACK_COLOR}
                    onFocus={() => onFunction.onFocus("name")}
                    onBlur={() => onFunction.onFocus(null)}
                    onChangeText={value => onFunction.onChangeText(inputFields.firstname, value)}
                    onSubmitEditing={() => onFunction.onFocusNextField(inputFields.lastname)} />
                  <IconF name={"user"}
                    color={cStyles.ic_left_detail.color}
                    size={cStyles.ic_left_detail.size}
                    type={state._focusField === "name" ? "solid" : cStyles.ic_left_detail.type} />
                </Item>
            }
            rightComp={
              <Item style={styles.con_row_last_name} error={state._errorLastName !== ""}>
                <Input style={[styles.con_input, Configs.supportRTL && cStyles.txt_RTL]}
                  ref={ref => inputs[inputFields.lastname] = ref}
                  disabled={state._loading}
                  removeClippedSubviews={Devices.OS === 'android'}
                  blurOnSubmit={false}
                  returnKeyType={'next'}
                  placeholder={Languages[props.language].last_name}
                  placeholderTextColor={Colors.PLACEHOLDER_COLOR}
                  value={state._lastName}
                  selectionColor={Colors.BLACK_COLOR}
                  onFocus={() => onFunction.onFocus("name")}
                  onBlur={() => onFunction.onFocus(null)}
                  onChangeText={value => onFunction.onChangeText(inputFields.lastname, value)}
                  onSubmitEditing={() => onFunction.onFocusNextField(inputFields.phone)} />
              </Item>
            }
          />

          <CItemInput style={cStyles.pv_5} error={state._errorAddress !== ""}
            leftComp={
              <IconF containerStyle={[styles.con_row_left, Configs.supportRTL && { paddingRight: 0 }]}
                name={"map-marker-alt"}
                color={cStyles.ic_left_detail.color}
                size={cStyles.ic_left_detail.size}
                type={state._focusField === "address" ? "solid" : cStyles.ic_left_detail.type} />
            }
            rightComp={
              <Input style={[styles.con_input, Configs.supportRTL && cStyles.pr_15]}
                ref={ref => inputs[inputFields.address] = ref}
                disabled={state._loading}
                removeClippedSubviews={Devices.OS === 'android'}
                blurOnSubmit={false}
                returnKeyType={'done'}
                placeholder={Languages[props.language].address}
                placeholderTextColor={Colors.PLACEHOLDER_COLOR}
                value={state._address}
                numberOfLines={1}
                selectionColor={Colors.BLACK_COLOR}
                onFocus={() => onFunction.onFocus("address")}
                onBlur={() => onFunction.onFocus(null)}
                onChangeText={value => onFunction.onChangeText(inputFields.address, value)}
                onSubmitEditing={onFunction.onPressEdit} />
            }
          />

          <CItemInput style={cStyles.pv_5}
            leftComp={
              <IconF containerStyle={[styles.con_row_left, Configs.supportRTL && { paddingRight: 0 }]}
                name={"envelope"}
                color={cStyles.ic_left_detail.color}
                size={cStyles.ic_left_detail.size}
                type={cStyles.ic_left_detail.type} />
            }
            rightComp={
              <Input style={[styles.con_input, { color: Colors.PLACEHOLDER_COLOR }, Configs.supportRTL && cStyles.pr_15]}
                disabled={true}
                value={state._email} />
            }
          />

          <CItemInput style={cStyles.pv_5} error={state._errorPhone !== ""}
            leftComp={
              <TouchableOpacity onPress={onFunction.onTogglePicker}>
                <CViewRow style={[Configs.supportRTL && { marginRight: -15 }]}
                  leftComp={
                    <Flag countryCode={state._flag} flagSize={Devices.fS(25)} withFlagButton={true} />
                  }
                  rightComp={
                    <View style={cStyles.row_align_center}>
                      <CText style={[styles.txt_input, { marginLeft: 0 }]}>{state._callingCode}</CText>
                      <IconF containerStyle={{ marginTop: -10 }} name={"sort-down"} color={Colors.BLACK_COLOR} size={Devices.fS(20)} type={"solid"} />
                    </View>
                  }
                />
              </TouchableOpacity>
            }
            rightComp={
              <Input style={[styles.con_input, Configs.supportRTL && cStyles.mr_10]}
                keyboardType={"phone-pad"}
                ref={ref => inputs[inputFields.phone] = ref}
                disabled={state._loading}
                removeClippedSubviews={Devices.OS === 'android'}
                blurOnSubmit={false}
                returnKeyType={'next'}
                placeholder={Languages[props.language].phone_number}
                placeholderTextColor={Colors.PLACEHOLDER_COLOR}
                value={state._phone}
                selectionColor={Colors.BLACK_COLOR}
                onFocus={() => onFunction.onFocus("phone")}
                onBlur={() => onFunction.onFocus(null)}
                onChangeText={value => onFunction.onChangeText(inputFields.phone, value)}
                onSubmitEditing={() => onFunction.onFocusNextField(inputFields.email)} />
            }
          />
          {state._errorPhone !== "" &&
            <CText style={[styles.txt_error, Configs.supportRTL && cStyles.txt_RTL]} i18nKey={state._errorPhone} />}

          <CItemInput style={cStyles.pv_20}
            leftComp={
              <IconF containerStyle={[styles.con_row_left, Configs.supportRTL && { paddingRight: 0 }]}
                name={"birthday-cake"}
                color={cStyles.ic_left_detail.color}
                size={cStyles.ic_left_detail.size}
                type={state._visibleDatePicker ? "solid" : cStyles.ic_left_detail.type} />
            }
            rightComp={
              <Body style={styles.con_row_right}>
                <TouchableOpacity onPress={onFunction.onPressShowDatePicker}>
                  <View style={styles.con_input}>
                    <CText style={[styles.txt_birthday, Configs.supportRTL && cStyles.txt_RTL]}>
                      {DOB ?
                        moment(DOB.value).format(Configs.formatDate) :
                        moment().format(Configs.formatDate)
                      }
                    </CText>
                  </View>
                </TouchableOpacity>
              </Body>
            }
          />
        </Form>

        <Button block
          style={[styles.con_btn, { backgroundColor: '#18504D', marginHorizontal: Devices.pH(layoutWidth.width) }]}
          onPress={onFunction.onPressEdit} >
          {state._loading && <Spinner style={styles.spi_loading} color={Colors.WHITE_COLOR} size={'small'} />}
          <CText style={styles.txt_btn} i18nKey={'save'} />
        </Button>
      </Content>

      <DateTimePickerModal
        isVisible={state._visibleDatePicker}
        mode={"date"}
        isDarkModeEnabled={colorScheme === 'dark'}
        date={dataDateOfBirth}
        onConfirm={onFunction.onConfirmDatePicker}
        onCancel={onFunction.onCancelDatePicker}
      />

      <CountryPicker
        containerButtonStyle={{ opacity: 0 }}
        withFilter
        withFlag
        withCountryNameButton
        withAlphaFilter
        withCallingCode
        withFlagButton
        theme={colorScheme === "dark" ? DARK_THEME : DEFAULT_THEME}
        modalProps={{
          visible: state._visible
        }}
        onSelect={(country) => onFunction.onSelectCountry(country)}
        onClose={onFunction.onTogglePicker}
      />
    </Container >
  )
}