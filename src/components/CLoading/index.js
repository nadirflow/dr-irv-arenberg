/**
 ** Name: 
 ** Author: 
 ** CreateAt: 
 ** Description: 
**/
/* LIBRARY */
import React from 'react';
import { View } from 'react-native';
import Modal from "react-native-modal";
/** COMPONENTS */
import { BallIndicator } from "~/components/CIndicator";
/* COMMON */
import { cStyles } from '~/utils/styles';
import { Colors } from '~/utils/colors';

const styles = {
  con_loading: {
    backgroundColor: Colors.WHITE_COLOR,
    height: 60,
    width: 60
  }
}

export default ViewLoading = ({
  visible = false,
  showIcon = true,
  color = Colors.WHITE_COLOR
}) => {
  return (
    <Modal
      isVisible={visible}
      animationIn={"fadeIn"}
      animationOut={"fadeOut"}
      backdropOpacity={.2}
      onBackButtonPress={() => { }}
      onBackdropPress={() => { }}
    >
      {showIcon ?
        <View style={cStyles.full_center}>
          <BallIndicator color={color} />
        </View>
        :
        null
      }
    </Modal>
  )
}