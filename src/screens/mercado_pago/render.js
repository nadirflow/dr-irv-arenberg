/**
 ** FileName: 
 ** FileAuthor: 
 ** FileCreateAt: 
 ** FileDescription: 
**/
/* LIBRARY */
import React from 'react';
import { View } from 'react-native';
import {
  Container, Header, Button, Left, Body, Title, Right, Footer, Content, Form
} from 'native-base';
import { CreditCardInput } from 'react-native-credit-card-input';
import Icon from 'react-native-fontawesome-pro';
/** COMPONENT */
import CText from '~/components/CText';
/** COMMON */
import { Colors } from '~/utils/colors';
import { cStyles } from '~/utils/styles';
import { Configs, Devices } from '~/config';
import Helpers from '~/utils/helpers';
import Currency from '~/utils/currency';
import { layoutWidth } from '~/utils/layout_width';
/** STYLES */
import styles from './style';
import WebView from 'react-native-webview';
import CLoading from '~/components/CLoading';

export const ViewMercadoPayment = ({
  state = null,
  onFunction = {
    onPressBack: () => { },
    onNavigationStateChange: () => { }
  }
}) => {
  return (
    <Container style={styles.con}>
      <Header style={{ backgroundColor: Colors.BACKGROUND_PRIMARY_COLOR }} hasSegment transparent iosBarStyle={'dark-content'} androidStatusBarColor={Colors.PRIMARY_COLOR} translucent={false}>
        <Left>
          <Button transparent onPress={onFunction.onPressBack}>
            <Icon name={"chevron-left"} size={Devices.fS(20)} type={"light"} color={cStyles.txt_title_header.color} />
          </Button>
        </Left>
        <Body style={styles.con_header_center}>
          <Title><CText style={cStyles.txt_title_header} />{"Mercado Pago"}</Title>
        </Body>
        <Right />
      </Header>
      {!state._loading &&
        <WebView
          source={{ uri: state._url }}
          onNavigationStateChange={onFunction.onNavigationStateChange}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
        />
      }

      <CLoading visible={state._loading} />
    </Container >
  )
}