/**
 ** Name: 
 ** Author: 
 ** CreateAt: 
 ** Description: 
**/
/* LIBRARY */
import React from 'react';
import { View } from 'react-native';
import {
  Container, Content, Header, Left, Body, Title, Right, Form, Item, Label,
  Input, Button, Spinner,
} from "native-base";
import Icon from 'react-native-fontawesome-pro';
/* COMPONENTS */
import CText from '~/components/CText';
/* COMMON */
import { Devices } from '~/config';
import { Colors } from '~/utils/colors';
import { cStyles } from '~/utils/styles';
import { layoutWidth } from '~/utils/layout_width';
/* STYLES */
import styles from './style'

const inputFields = {
  hostUrl: "hostUrl",
  consumerKey: 'consumerKey',
  consumerSecret: 'consumerSecret'
}
export const ViewLinkDemo = ({
  state = null,
  props = null,
  inputs = {},
  onFunction = {
    onPressBack: () => { },
    onFocusNextField: () => { },
    onPressLinkDemo: () => { },
  }
}) => {
  return (
    <Container>
      <Header hasSegment transparent style={cStyles.con_header} iosBarStyle={'dark-content'} androidStatusBarColor={Colors.WHITE_COLOR} translucent={false}>
        <Left>
          <Button transparent onPress={onFunction.onPressBack}>
            <Icon name={"chevron-left"} size={Devices.fS(20)} type={"light"} color={cStyles.txt_title_header.color} />
          </Button>
        </Left>
        <Body style={styles.con_header_center}>
          <View style={styles.con_title}>
            <Title><CText style={cStyles.txt_title_header} i18nKey={'link_demo'} /></Title>
          </View>
        </Body>
        <Right />
      </Header>
      <Content>
        <Form style={[styles.con_form, { paddingHorizontal: Devices.pH(layoutWidth.width) }]}>
          {/** HOST URL INPUT */}
          <Item style={[styles.con_input, { flex: 1, marginLeft: 0 }]} floatingLabel error={state._errorHostUrl !== ""} >
            <Label style={styles.con_label}><CText style={styles.txt_label} i18nKey={'host_url'} /></Label>
            <Input style={styles.txt_input}
              getRef={ref => inputs[inputFields.hostUrl] = ref}
              disabled={state._loading}
              removeClippedSubviews={Devices.OS === 'android'}
              placeholderTextColor={Colors.PLACEHOLDER_COLOR}
              blurOnSubmit={false}
              autoFocus={true}
              returnKeyType={'next'}
              selectionColor={Colors.BLACK_COLOR}
              onSubmitEditing={() => onFunction.onFocusNextField(inputFields.consumerKey)}
            />
          </Item>
          {state._errorHostUrl !== "" && <CText style={styles.txt_error} i18nKey={state._errorHostUrl} />}

          {/** WOO CK INPUT */}
          <Item style={[styles.con_input, { flex: 1, marginLeft: 0 }]} floatingLabel error={state._errorConsumerKey !== ""} >
            <Label style={styles.con_label}><CText style={styles.txt_label} i18nKey={'woocommerce_consumer_key'} /></Label>
            <Input style={styles.txt_input}
              getRef={ref => inputs[inputFields.consumerKey] = ref}
              disabled={state._loading}
              removeClippedSubviews={Devices.OS === 'android'}
              placeholderTextColor={Colors.PLACEHOLDER_COLOR}
              blurOnSubmit={false}
              returnKeyType={'next'}
              selectionColor={Colors.BLACK_COLOR}
              onSubmitEditing={() => onFunction.onFocusNextField(inputFields.consumerSecret)}
            />
          </Item>
          {state._errorConsumerKey !== "" && <CText style={styles.txt_error} i18nKey={state._errorConsumerKey} />}

          {/** WOO CS INPUT */}
          <Item style={[styles.con_input, { flex: 1, marginLeft: 0 }]} floatingLabel error={state._errorConsumerSecret !== ""} >
            <Label style={styles.con_label}><CText style={styles.txt_label} i18nKey={'woocommerce_consumer_secret'} /></Label>
            <Input style={styles.txt_input}
              getRef={ref => inputs[inputFields.consumerSecret] = ref}
              disabled={state._loading}
              removeClippedSubviews={Devices.OS === 'android'}
              placeholderTextColor={Colors.PLACEHOLDER_COLOR}
              blurOnSubmit={false}
              returnKeyType={'next'}
              selectionColor={Colors.BLACK_COLOR}
              onSubmitEditing={onFunction.onPressLinkDemo}
            />
          </Item>
          {state._errorConsumerSecret !== "" && <CText style={styles.txt_error} i18nKey={state._errorConsumerSecret} />}

          <Button block style={[styles.con_btn, { backgroundColor: Colors.PRIMARY_COLOR }]} iconLeft_1 onPress={onFunction.onPressLinkDemo} >
            {state._loading && <Spinner style={styles.spi_loading} color={Colors.WHITE_COLOR} size={'small'} />}
            <CText style={styles.txt_btn} i18nKey={'change'} />
          </Button>
        </Form>

      </Content>
    </Container >
  )
}