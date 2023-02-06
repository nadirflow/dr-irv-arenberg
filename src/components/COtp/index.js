/**
 ** Name: 
 ** Author: 
 ** CreateAt: 
 ** Description: 
**/
/* LIBRARY */
import React, { Component } from 'react';
import { Text, View } from 'react-native';
import Modal from 'react-native-modal';
import { Devices } from '~/config';
import OTPTextInput from 'react-native-otp-textinput';
/** COMMON */
import { Colors } from '~/utils/colors';
/** STYLES */
import styles from './style';
import { Button } from 'native-base';
import CText from '../CText';


class COtp extends Component {
  constructor(props){
    super(props);
    this.state={
      _otp: "",
    }
  }

  /** FUNCTIONS */
  clearText = () => {
    this.otpInput.clear();
  }

  setText = () => {
    if (this.otpInput.state.otpText.length === 6) {
      this.props.verify(this.otpInput.state.otpText,join(''))
    }
  }

  // onVerify = () => {
  //   this.props
  // }
  /** RENDER */
  render() {
    let { visible } = this.props;
    return (
      <Modal
        isVisible={visible}
        deviceHeight={Devices.sH("100%")}
        deviceWidth={Devices.sW("100%")}
        style={{margin: 0, justifyContent: "center"}}
      >
        <View style={{width: Devices.sW("100%"), height: Devices.sH("20%"),  backgroundColor: Colors.WHITE_COLOR, alignItems: "center"}}>
          <OTPTextInput ref={e => (this.otpInput = e)}
            inputCount={6}
            tintColor={Colors.PRIMARY_COLOR}
            textInputStyle={{color: Colors.PRIMARY_COLOR, fontFamily: Devices.zsBodyBold}}
            handleTextChange={this.setText}
          />
        </View>
      </Modal>
    )
  }
}

export default COtp;
