/**
 ** Name: 
 ** Author: 
 ** CreateAt: 
 ** Description: 
**/
/* LIBRARY */
import React from 'react';
import {
  View, TouchableOpacity, TouchableWithoutFeedback, Keyboard,
  Text,
  ImageBackground
} from 'react-native';
import {
  Container, Content, Form, Item, Input, Label, Button,
  Spinner
} from "native-base";
import appleAuth from '@invertase/react-native-apple-authentication';
import Icon from 'react-native-fontawesome-pro';
/* COMPONENTS */
import CText from '~/components/CText';
/* COMMON */
import { Devices, Configs, Languages, Assets } from '~/config';
import { Colors } from '~/utils/colors';
import { cStyles } from '~/utils/styles';
/* STYLES */
import styles from './style';

import CHeader from '~/components/CHeader';
import CImage from '~/components/CImage';

const inputFields = {
  email: "email",
  password: "password"
}

export const ViewSignIn = ({
  
  state = null,
  props = null,
  inputs = {},
  onFunction = {
    onPressBack: () => { },
    onChangeValue: () => { },
    onFocusNextField: () => { },
    onPressForgotPassword: () => { },
    onPressSignUp: () => { },
    onPressLogin: () => { },
    onPressLoginFB: () => { },
    onPressLoginGG: () => { },
    onPressLoginAP: () => { }
  }
}) => {
  console.log(props.user);
  return (
    <>
    
    <CHeader
        
        style={{backgroundColor:'#18504D', color:'#fff'}}
        titleComponent={
          <View style={[cStyles.row_justify_center, cStyles.flex_full]}>
            <View
              style={[
                cStyles.column_align_center,
                cStyles.column_justify_center,
                { width: '100%' },
              ]}>
              <Text style={{color: '#fff', fontWeight:'700'}}>Sign In</Text>
            </View>
          </View>
        }
        iconLeft_1={'chevron-left'}
        iconRight_1={'none'}
        
        onPressLeft_1={onFunction.onPressBack}
        
      />
     <ImageBackground source={Assets.wel} resizeMode='cover' style={{flex:1,  }}> 
      
      
        <Content style={[cStyles.flex_full, {backgroundColor:'rgba(24, 80, 77, 0.3)', }]} contentContainerStyle={[cStyles.ph_20, styles.con_header]}>
          

          <Form >
            {/* <Text style={{color:'#fff', fontSize:Devices.fS(22), fontWeight:'700', marginBottom:20,}}>Login</Text> */}
            
            {/** EMAIL INPUT */}
            
              {/* <Label style={styles.con_label}>
                <CText style={styles.txt_label} i18nKey={'email_or_username'} />
              </Label> */}
              <Input style={{ backgroundColor:'transparent', borderRadius:6, paddingHorizontal:15, borderBottomWidth:1, borderBottomColor:'#fff'}}
                keyboardType={'email-address'}
                getRef={ref => inputs[inputFields.email] = ref}
                disabled={state._loading}
                placeholder={'Username'}
                removeClippedSubviews={Devices.OS === 'android'}
                placeholderTextColor={'#fff'}
                blurOnSubmit={false}
                returnKeyType={'next'}
                selectionColor={Colors.WHITE_COLOR}
                autoFocus={true}
                value={state._valEmail}
                onChangeText={(value) => onFunction.onChangeValue(value, "email")}
                onSubmitEditing={() => onFunction.onFocusNextField(inputFields.password)}
              />
            
            {state._errorEmail !== "" && <CText style={[styles.txt_error, {color: '#fff'}]} i18nKey={state._errorEmail} />}

            {/** PASSWORD INPUT */}
           
              <Input style={{ backgroundColor:'transparent', borderRadius:6, paddingHorizontal:15, marginTop:15, borderBottomWidth:1, borderBottomColor:'#fff'}}
                secureTextEntry
                getRef={ref => inputs[inputFields.password] = ref}
                disabled={state._loading}
                removeClippedSubviews={Devices.OS === 'android'}
                placeholderTextColor={'#ffff'}
                blurOnSubmit={false}
                placeholder={'Passowrd'}
                returnKeyType={'done'}
                selectionColor={Colors.WHITE_COLOR}
                value={state._valPassword}
                onChangeText={(value) => onFunction.onChangeValue(value, "password")}
                onSubmitEditing={onFunction.onPressLogin}
              />
            
            {state._errorPassword !== "" && <CText style={[styles.txt_error, {color: '#fff'}]} i18nKey={state._errorPassword} />}
            <View style={styles.con_forgot_password}>
              <TouchableOpacity activeOpacity={.5} onPress={onFunction.onPressForgotPassword}>
                <CText style={{fontSize:Devices.fS(14), color:"#fff",}} i18nKey={'forgot_password'} />
              </TouchableOpacity>
            </View>
            <Button block
              style={[styles.con_btn, { backgroundColor: Colors.WHITE_COLOR, borderRadius:6, color:'#A93A75', }]}
              disabled={state._loading}
              onPress={onFunction.onPressLogin}>
              {state._loading && <Spinner style={styles.spi_loading} color={Colors.BLACK_COLOR} size={'small'} />}
              {!state._loading && <CText style={[styles.txt_btn, {color:'#18504D', fontWeight:'700', fontSize:Devices.fS(14)}]} i18nKey={'sign_in'} />}
            </Button>

            

            <View style={styles.separator} />

            {Devices.OS === 'ios' && appleAuth.isSupported && props.setting.general.is_allow_apple_login &&
              <Button block style={[styles.con_btn_social, styles.con_btn_apple]}
                disabled={state._loading}
                onPress={onFunction.onPressLoginAP}>
                <Icon containerStyle={styles.con_icon_socials}
                  name={'apple'}
                  color={Colors.WHITE_COLOR}
                  size={Devices.fS(25)}
                  type={'brands'} />
                <Text style={styles.txt_login_social}>{Languages[props.language].sign_in_with_apple}</Text>
              </Button>
            }
            {/* {props.setting.general.is_allow_facebook_login &&
              <Button block style={[styles.con_btn_social, styles.con_btn_facebook]}
                disabled={state._loading}
                onPress={onFunction.onPressLoginFB}>
                <Icon containerStyle={styles.con_icon_socials}
                  name={'facebook'}
                  color={Colors.WHITE_COLOR}
                  size={Devices.fS(25)}
                  type={'brands'} />
                <Text style={styles.txt_login_social}>{Languages[props.language].sign_in_with_facebook}</Text>
              </Button>
            } */}

            {/* {props.setting.general.is_allow_google_login &&
              <Button block style={[styles.con_btn_social, styles.con_btn_google]}
                disabled={state._loading}
                onPress={onFunction.onPressLoginGG}>
                <Icon containerStyle={styles.con_icon_socials}
                  name={'google'}
                  color={Colors.WHITE_COLOR}
                  size={Devices.fS(25)}
                  type={'brands'} />
                <Text style={styles.txt_login_social}>{Languages[props.language].sign_in_with_google}</Text>
              </Button>
            } */}

            <Button  style={[styles.con_btn, { backgroundColor: Colors.WHITE_COLOR, borderRadius:6, color:'#A93A75', }]}
              block  transparent
              disabled={state._loading}
              onPress={onFunction.onPressSignUp}>
              <CText style={[styles.txt_btn, {color:'#18504D', fontWeight:'700', fontSize:Devices.fS(14)}]} i18nKey={'sign_up'} />
            </Button>
          </Form>
        </Content>
      
    </ImageBackground>
    </>

  )
}