/**
 ** Name: 
 ** Author: 
 ** CreateAt: 
 ** Description: 
**/
/* LIBRARY */
import React from 'react';
import {
  FlatList, TouchableWithoutFeedback, Keyboard, Text, ImageBackground
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
import { Assets, Configs, Devices, Languages } from '~/config';
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
      
      <ImageBackground source={Assets.wel} resizeMode='cover' style={{flex:1,  paddingTop:25, }}>
      
      <Container style={[cStyles.container_auth, {backgroundColor:''} ]}>
        <Content style={cStyles.flex_full} contentContainerStyle={[cStyles.ph_20, styles.con_header]}>
          

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
                    <Text style={[styles.txt_title_step, {color: '#313030'}]}>{Languages[props.language].step_1}</Text>
                    <Text style={[styles.txt_title, {color:'#313030'}]}>{Languages[props.language].txt_forgot_password}</Text>

                    {/* <Item style={styles.con_input} floatingLabel last error={state._errorEmail !== ""}> */}
                      {/* <Label style={styles.con_label}><CText style={styles.txt_label} i18nKey={'email'} /></Label> */}
                      <Input style={{ backgroundColor:'##313030', borderRadius:6, paddingHorizontal:15, marginTop:5}}
                        keyboardType={'email-address'}
                        value={state._email}
                        disabled={state._loading}
                        removeClippedSubviews={Devices.OS === 'android'}
                        blurOnSubmit={false}
                        autoFocus={true}
                        returnKeyType={'next'}
                        placeholder={'Email'}

                        placeholderTextColor={'#313030'}
                        selectionColor={Colors.BLACK_COLOR}
                        onChangeText={(value) => onFunction.onChangeEmail(value)}
                        onSubmitEditing={() => onFunction.onPressResetPassword(listRef)}
                      />
                    {/* </Item> */}
                    {(typeof state._errorEmail === "string" && state._errorEmail !== "") &&
                      <CText numberOfLines={2} style={[styles.txt_error, {color: '#fff'}]} i18nKey={state._errorEmail} />}
                    {typeof state._errorEmail === "object" &&
                      <CText numberOfLines={2} style={[styles.txt_error, {color: '#fff'}]}>{state._errorEmail.message}</CText>}

                    <Button block
                      style={[styles.con_btn, { backgroundColor: '#313030' }]}
                      disabled={state._loading}
                      onPress={() => onFunction.onPressResetPassword(listRef)}>
                      {state._loading && <Spinner style={styles.spi_loading} color={Colors.WHITE_COLOR} size={'small'} />}
                      <CText style={styles.txt_btn} i18nKey={'send'} />
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
      </ImageBackground>
    </TouchableWithoutFeedback>
    
  )
}