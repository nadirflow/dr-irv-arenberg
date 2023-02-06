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
  Container, Header, Button, Left, Body, Title, Right, Footer, Content
} from 'native-base';
import { CreditCardInput } from 'react-native-credit-card-input';
import Icon from 'react-native-fontawesome-pro';
/** COMPONENT */
import CText from '~/components/CText';
import CHeader from "~/components/CHeader";
import CViewRow from "~/components/CViewRow";
/** COMMON */
import { Colors } from '~/utils/colors';
import { cStyles } from '~/utils/styles';
import { Configs, Devices } from '~/config';
import Helpers from '~/utils/helpers';
import Currency from '~/utils/currency';
import { layoutWidth } from '~/utils/layout_width';
/** STYLES */
import styles from './style';

export const ViewStripePayment = ({
  state = null,
  onFunction = {
    onChangeInfoCard: () => { },
    onPressPayment: () => { },
    onPressBack: () => { }
  }
}) => {
  let currencyPosition = Configs.currencyPosition;
  let symbol = Helpers.symbolCurrency();
  let provisionalPrice = Helpers.formatNumber(state._provisional);

  return (
    <Container style={styles.con}>
      <CHeader
        title={"stripe"}
        iconLeft_1={Configs.supportRTL ? "angle-right" : "angle-left"}
        iconRight_1={"none"}
        onPressLeft_1={onFunction.onPressBack}
      />

      <Content style={[styles.con_content, { paddingHorizontal: Devices.pH(layoutWidth.width) }]} keyboardShouldPersistTaps={'handled'}>
        <View style={styles.con_invoice}>
          <View style={styles.con_row_init}>
            <CText style={styles.txt_title} i18nKey={"order"} />
          </View>

          <CViewRow style={cStyles.pv_10}
            between
            leftComp={<CText style={styles.txt_title_2} i18nKey={"provisional"} />}
            rightComp={
              <View style={styles.con_price_item}>
                {currencyPosition === Currency.left && <CText style={styles.txt_result}>{`${symbol} `}</CText>}
                <CText style={styles.txt_result}>{provisionalPrice}</CText>
                {currencyPosition === Currency.right && <CText style={styles.txt_result}>{` ${symbol}`}</CText>}
              </View>
            }
          />
        </View>

        <CreditCardInput requiresName
          onChange={(cardData) => onFunction.onChangeInfoCard(cardData)}
          labelStyle={styles.txt_label_card}
          inputStyle={styles.txt_input_card}
          cardScale={1.25}
          inputContainerStyle={styles.con_input}
        />
      </Content>

      {!state._success &&
        <Footer style={[styles.con_footer, { paddingHorizontal: Devices.pH(layoutWidth.width) }]}>
          <Button block style={[styles.con_btn, { backgroundColor: Colors.PRIMARY_COLOR }]} onPress={onFunction.onPressPayment} >
            <CText style={styles.txt_btn} i18nKey={'payment'} />
          </Button>
        </Footer>
      }

    </Container >
  )
}