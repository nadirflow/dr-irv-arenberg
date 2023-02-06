/**
 ** Name: 
 ** Author: 
 ** CreateAt: 
 ** Description: 
**/
/* LIBRARY */
import React from 'react';
import {
  FlatList, TouchableWithoutFeedback, Keyboard, Text
} from 'react-native';
import {
  Container, Content, Item, Input, Label, Button,
  Form, Spinner
} from "native-base";
import Icon from 'react-native-fontawesome-pro';
import OTPTextInput from 'react-native-otp-textinput';
/* COMPONENTS */
import CText from '~/components/CText';
/* COMMON */
import { Configs, Devices, Languages } from '~/config';
import { Colors } from '~/utils/colors';
import { cStyles } from '~/utils/styles';
/* STYLES */
import styles from './style';

let listRef = null;
const steps = [{}, {}, {}]

export const ViewForgotPassword = ({
  state = null,
  props = null,
  onFunction = {
    onPressBack: () => { },
    onChangeCode: () => { },
    onChangeEmail: () => { },
    onChangePassword: () => { },
    onPressResetPassword: () => { },
    onPressValidateCode: () => { },
    onPressSetPassword: () => { }
  }
}) => {
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Container style={cStyles.container_auth}>
        <Content style={cStyles.flex_full} contentContainerStyle={[cStyles.ph_20, styles.con_header]}>
          <Button style={styles.con_btn_back} transparent rounded onPress={onFunction.onPressBack} >
            <Icon containerStyle={styles.con_icon_back}
              name={"times-circle"}
              size={Devices.fS(25)}
              color={'#C1A050'}
              type={"regular"} />
          </Button>

          <FlatList
            ref={(ref) => listRef = ref}
            data={steps}
            horizontal
            keyExtractor={(item, index) => index.toString()}
            showsHorizontalScrollIndicator={false}
            scrollEnabled={false}
            extraData={state}
            renderItem={() => {
              if (state._pageIndex === 0) {
                return (
                  <Form style={styles.con_form_sign_in}>
                    <Text style={styles.txt_title_step}>{Languages[props.language].step_1}</Text>
                    <Text style={styles.txt_title}>{Languages[props.language].txt_forgot_password}</Text>

                    <Item style={styles.con_input} floatingLabel last error={state._errorEmail !== ""}>
                      <Label style={[styles.con_label, {marginTop:Devices.sH(-0.7)}]}><CText style={[styles.txt_label, {fontSize:Devices.fS(10), } ]} i18nKey={'email'} /></Label>
                      <Input style={[styles.txt_input, Configs.supportRTL && cStyles.txt_RTL]}
                        keyboardType={'email-address'}
                        value={state._email}
                        disabled={state._loading}
                        removeClippedSubviews={Devices.OS === 'android'}
                        blurOnSubmit={false}
                        autoFocus={true}
                        returnKeyType={'next'}
                        selectionColor={Colors.BLACK_COLOR}
                        onChangeText={(value) => onFunction.onChangeEmail(value)}
                        onSubmitEditing={() => onFunction.onPressResetPassword(listRef)}
                      />
                    </Item>
                    {(typeof state._errorEmail === "string" && state._errorEmail !== "") &&
                      <CText numberOfLines={2} style={styles.txt_error} i18nKey={state._errorEmail} />}
                    {typeof state._errorEmail === "object" &&
                      <CText numberOfLines={2} style={styles.txt_error}>{state._errorEmail.message}</CText>}

                    <Button block
                      style={[styles.con_btn, { backgroundColor: '#C1A050', height: Devices.sH(5) }]}
                      disabled={state._loading}
                      onPress={() => onFunction.onPressResetPassword(listRef)}>
                      {state._loading && <Spinner style={styles.spi_loading} color={Colors.WHITE_COLOR} size={'small'} />}
                      <CText style={[styles.txt_btn, {fontSize: Devices.fS(12)}]} i18nKey={'send'} />
                    </Button>
                  </Form>
                )

              } else if (state._pageIndex === 1) {
                return (
                  <Form style={styles.con_form_sign_in}>
                    <Text style={styles.txt_title_step}>{Languages[props.language].step_2}</Text>
                    <Text style={styles.txt_title}>{Languages[props.language].txt_verify_password}</Text>

                    <OTPTextInput containerStyle={{ width: Devices.sW(`80%`) }}
                      defaultValue={state._code}
                      inputCount={4}
                      tintColor={Colors.PRIMARY_COLOR}
                      selectionColor={Colors.PRIMARY_COLOR}
                      textInputStyle={styles.txt_input_otp}
                      handleTextChange={code => { onFunction.onChangeCode(code) }}
                    />

                    {(typeof state._errorCode === "string" && state._errorCode !== "") && <CText numberOfLines={2} style={styles.txt_error} i18nKey={state._errorCode} />}
                    {typeof state._errorCode === "object" && <CText numberOfLines={2} style={styles.txt_error}>{state._errorCode.message}</CText>}
                    <Button disabled={state._loading} style={[styles.con_btn, { backgroundColor: Colors.PRIMARY_COLOR }]} block onPress={() => onFunction.onPressValidateCode(listRef)}>
                      {state._loading && <Spinner style={styles.spi_loading} color={Colors.WHITE_COLOR} size={'small'} />}
                      <CText style={styles.txt_btn} i18nKey={'send'} />
                    </Button>
                  </Form>
                )
              } else if (state._pageIndex === 2) {
                return (
                  <Form style={styles.con_form_sign_in}>
                    <Text style={styles.txt_title_step}>{Languages[props.language].step_3}</Text>
                    <Text style={styles.txt_title_step}>{Languages[props.language].txt_set_new_password}</Text>

                    <Item style={styles.con_input} floatingLabel last error={state._errorPassword !== ""}>
                      <Label style={styles.con_label}><CText style={styles.txt_label} i18nKey={'set_new_password'} /></Label>
                      <Input style={styles.txt_input}
                        keyboardType={'default'}
                        value={state._password}
                        disabled={state._loading}
                        removeClippedSubviews={Devices.OS === 'android'}
                        blurOnSubmit={false}
                        secureTextEntry={true}
                        returnKeyType={'next'}
                        selectionColor={Colors.BLACK_COLOR}
                        onChangeText={(value) => onFunction.onChangePassword(value)}
                        onSubmitEditing={() => onFunction.onPressSetPassword(listRef)}
                      />
                    </Item>
                    {(typeof state._errorPassword === "string" && state._errorPassword !== "") &&
                      <CText numberOfLines={2} style={styles.txt_error} i18nKey={state._errorPassword} />}
                    {typeof state._errorPassword === "object" &&
                      <CText numberOfLines={2} style={styles.txt_error}>{state._errorPassword.message}</CText>}
                    {state._isSuccess && <CText numberOfLines={2} style={styles.txt_success} i18nKey={"reset_password_success"} />}

                    <Button block
                      disabled={state._loading}
                      style={[styles.con_btn, { backgroundColor: Colors.PRIMARY_COLOR }]}
                      onPress={() => onFunction.onPressSetPassword(listRef)}>
                      {state._loading && <Spinner style={styles.spi_loading} color={Colors.WHITE_COLOR} size={'small'} />}
                      <CText style={styles.txt_btn} i18nKey={'send'} />
                    </Button>
                  </Form>
                )
              }
            }}
          />
        </Content>
      </Container>
    </TouchableWithoutFeedback>
  )
}