/**
 ** Name: 
 ** Author: 
 ** CreateAt: 
 ** Description: 
**/
/* LIBRARY */
import React from 'react';
import { FlatList, TouchableOpacity, View } from 'react-native';
import {
  Card,
  Container
} from "native-base";
import Icon from 'react-native-fontawesome-pro';
/* COMPONENTS */
import CHeader from "~/components/CHeader";
import CLoading from '~/components/CLoading';
import CText from '~/components/CText';
/* COMMON */
import { Devices, Configs } from '~/config';
import { Colors } from '~/utils/colors';
import { layoutWidth } from '~/utils/layout_width';
import Helpers from '~/utils/helpers';
import Currency from '~/utils/currency';
/* STYLES */
import styles from './style';

const renderItem = (item, index, onPress) => {
  return (
    <TouchableOpacity onPress={() => onPress(item)}>
      <Card style={styles.con_item_dashboard}>
        <Icon name={item.icon} size={Devices.fS(40)} type={'light'} />
        <CText style={styles.txt_title_item} i18nKey={item.name} />
      </Card>
    </TouchableOpacity>
  )
}
export const ViewVendorDashboard = ({
  state = null,
  props = null,
  onFunction = {
    onPressItem: () => { }
  }
}) => {
  let currencyPosition = Configs.currencyPosition, symbol = Helpers.symbolCurrency();
  return (
    <Container style={styles.con}>
      <CHeader
        props={props}
        title={'home'}
        iconLeft_1={"none"}
        iconRight_1={"none"}
      />
      {state._loading && 
        <CLoading visible={true} />
      }
      <View style={[{ paddingHorizontal: Devices.pH(layoutWidth.width) }]}>
        <Card style={styles.income}>
          <View style={[styles.con_ic_income, {backgroundColor: Colors.GOOGLE_PLUS_COLOR}]}>
            <Icon name={'dollar-sign'} color={Colors.WHITE_COLOR} size={Devices.fS(20)} />
          </View>
          <CText style={styles.txt_title_income} i18nKey={'txt_vendor_dashboard_sale_month'} />
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
          <CText style={styles.txt_title_income} i18nKey={'txt_vendor_dashboard_earning_month'} />
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

        <FlatList style={styles.con_list}
          data={state._dataLayout}
          renderItem={({item, index}) => renderItem(item, index, onFunction.onPressItem)}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          numColumns={2}
          columnWrapperStyle={{justifyContent: 'space-evenly'}}
        />
      </View>
    </Container>
  )
}