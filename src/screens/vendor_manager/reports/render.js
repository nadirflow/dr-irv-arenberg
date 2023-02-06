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
  Card,
  Container,
  Content
} from "native-base";
import Icon from 'react-native-fontawesome-pro';
/* COMPONENTS */
import CHeader from "~/components/CHeader";
import CText from '~/components/CText';
/* COMMON */
import { Devices, Configs } from '~/config';
import { Colors } from '~/utils/colors';
import { layoutWidth } from '~/utils/layout_width';
import Helpers from '~/utils/helpers';
import Currency from '~/utils/currency';
/* STYLES */
import styles from './style';

export const ViewVendorReports = ({
  state = null,
  props = null,
  onFunction = {
    onPressBack: () => { }
  }
}) => {
  let currencyPosition = Configs.currencyPosition, symbol = Helpers.symbolCurrency();
  return (
    <Container style={styles.con}>
      <CHeader
        title={"reports"}
        iconLeft_1={Configs.supportRTL ? "angle-right" : "angle-left"}
        iconRight_1={"none"}
        onPressLeft_1={onFunction.onPressBack}
      />
      <Content style={[{ paddingHorizontal: Devices.pH(layoutWidth.width) }]}>
        <View style={styles.con_block}>
          <CText style={styles.txt_title_block} i18nKey={'last_week'} />
          <Card style={styles.income}>
            <View style={[styles.con_ic_income, {backgroundColor: Colors.GOOGLE_PLUS_COLOR}]}>
              <Icon name={'dollar-sign'} color={Colors.WHITE_COLOR} size={Devices.fS(20)} />
            </View>
            <CText style={styles.txt_title_income} i18nKey={'gross_sales'} />
            <View style={styles.con_price}>
              {currencyPosition === Currency.left &&
                <CText style={[styles.txt_income, {color: Colors.GOOGLE_PLUS_COLOR}]}>{symbol}</CText>
              }
              <CText style={[styles.txt_income, {color: Colors.GOOGLE_PLUS_COLOR}]}>{Helpers.formatNumber(state._stats.gross_sales.week)}</CText>
              {currencyPosition === Currency.right &&
                <CText style={[styles.txt_income, {color: Colors.GOOGLE_PLUS_COLOR}]}>{symbol}</CText>
              }
            </View>
          </Card>
          <Card style={styles.income}>
            <View style={[styles.con_ic_income, {backgroundColor: Colors.GREEN_COLOR}]}>
              <Icon name={'money-bill'} color={Colors.WHITE_COLOR} size={Devices.fS(20)} />
            </View>
            <CText style={styles.txt_title_income} i18nKey={'earnings'} />
            <View style={styles.con_price}>
              {currencyPosition === Currency.left &&
                <CText style={[styles.txt_income, {color: Colors.GREEN_COLOR}]}>{symbol}</CText>
              }
              <CText style={[styles.txt_income, {color: Colors.GREEN_COLOR}]}>{Helpers.formatNumber(state._stats.earnings.week)}</CText>
              {currencyPosition === Currency.right &&
                <CText style={[styles.txt_income, {color: Colors.GREEN_COLOR}]}>{symbol}</CText>
              }
            </View>
          </Card>
        </View>

        <View style={styles.con_block}>
          <CText style={styles.txt_title_block} i18nKey={'this_month'} />
          <Card style={styles.income}>
            <View style={[styles.con_ic_income, {backgroundColor: Colors.GOOGLE_PLUS_COLOR}]}>
              <Icon name={'dollar-sign'} color={Colors.WHITE_COLOR} size={Devices.fS(20)} />
            </View>
            <CText style={styles.txt_title_income} i18nKey={'gross_sales'} />
            <View style={styles.con_price}>
              {currencyPosition === Currency.left &&
                <CText style={[styles.txt_income, {color: Colors.GOOGLE_PLUS_COLOR}]}>{symbol}</CText>
              }
              <CText style={[styles.txt_income, {color: Colors.GOOGLE_PLUS_COLOR}]}>{Helpers.formatNumber(state._stats.gross_sales.month)}</CText>
              {currencyPosition === Currency.right &&
                <CText style={[styles.txt_income, {color: Colors.GOOGLE_PLUS_COLOR}]}>{symbol}</CText>
              }
            </View>
          </Card>
          <Card style={styles.income}>
            <View style={[styles.con_ic_income, {backgroundColor: Colors.GREEN_COLOR}]}>
              <Icon name={'money-bill'} color={Colors.WHITE_COLOR} size={Devices.fS(20)} />
            </View>
            <CText style={styles.txt_title_income} i18nKey={'earnings'} />
            <View style={styles.con_price}>
              {currencyPosition === Currency.left &&
                <CText style={[styles.txt_income, {color: Colors.GREEN_COLOR}]}>{symbol}</CText>
              }
              <CText style={[styles.txt_income, {color: Colors.GREEN_COLOR}]}>{Helpers.formatNumber(state._stats.earnings.month)}</CText>
              {currencyPosition === Currency.right &&
                <CText style={[styles.txt_income, {color: Colors.GREEN_COLOR}]}>{symbol}</CText>
              }
            </View>
          </Card>
        </View>

        <View style={styles.con_block}>
          <CText style={styles.txt_title_block} i18nKey={'last_month'} />
          <Card style={styles.income}>
            <View style={[styles.con_ic_income, {backgroundColor: Colors.GOOGLE_PLUS_COLOR}]}>
              <Icon name={'dollar-sign'} color={Colors.WHITE_COLOR} size={Devices.fS(20)} />
            </View>
            <CText style={styles.txt_title_income} i18nKey={'gross_sales'} />
            <View style={styles.con_price}>
              {currencyPosition === Currency.left &&
                <CText style={[styles.txt_income, {color: Colors.GOOGLE_PLUS_COLOR}]}>{symbol}</CText>
              }
              <CText style={[styles.txt_income, {color: Colors.GOOGLE_PLUS_COLOR}]}>{Helpers.formatNumber(state._stats.gross_sales.last_month)}</CText>
              {currencyPosition === Currency.right &&
                <CText style={[styles.txt_income, {color: Colors.GOOGLE_PLUS_COLOR}]}>{symbol}</CText>
              }
            </View>
          </Card>
          <Card style={styles.income}>
            <View style={[styles.con_ic_income, {backgroundColor: Colors.GREEN_COLOR}]}>
              <Icon name={'money-bill'} color={Colors.WHITE_COLOR} size={Devices.fS(20)} />
            </View>
            <CText style={styles.txt_title_income} i18nKey={'earnings'} />
            <View style={styles.con_price}>
              {currencyPosition === Currency.left &&
                <CText style={[styles.txt_income, {color: Colors.GREEN_COLOR}]}>{symbol}</CText>
              }
              <CText style={[styles.txt_income, {color: Colors.GREEN_COLOR}]}>{Helpers.formatNumber(state._stats.earnings.last_month)}</CText>
              {currencyPosition === Currency.right &&
                <CText style={[styles.txt_income, {color: Colors.GREEN_COLOR}]}>{symbol}</CText>
              }
            </View>
          </Card>
        </View>
      </Content>
    </Container>
  )
}