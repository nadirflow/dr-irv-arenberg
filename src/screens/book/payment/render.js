/**
 ** Name: 
 ** Author: 
 ** CreateAt: 
 ** Description: 
**/
/* LIBRARY */
import React from 'react';
import { View, FlatList, TouchableOpacity } from 'react-native';
import Icon from 'react-native-fontawesome-pro';
/* COMPONENTS */
import CText from '~/components/CText';
import CViewRow from "~/components/CViewRow";
/* COMMON */
import { Colors } from '~/utils/colors';
import { layoutWidth } from '~/utils/layout_width';
import { Devices, Configs } from '~/config';
import { cStyles } from '~/utils/styles';
/* STYLES */
import styles from './style';

const RenderPaymentMethodItem = (state, item, onPress) => {
  return (
    <TouchableOpacity onPress={() => onPress(item)}>
      <CViewRow style={styles.con_row_item}
        between
        leftComp={
          <View style={cStyles.flex_full}>
            <CText style={[
              styles.txt_item_title, 
              state._methodId === item.id && { fontWeight: "bold", color: Colors.PRIMARY_COLOR }
            ]} numberOfLines={2}>
              {item.id === Configs.mercadoPagoMethod ? item.method_title : item.title !== "" ? item.title : item.method_title}
            </CText>

            <CText style={[
              styles.txt_item_description, 
            ]} numberOfLines={10}>
              {item.description !== "" ? item.description : item.method_description}
            </CText>
          </View>
        }
        rightComp={
          <Icon 
            name={state._methodId === item.id ? 'check-circle' : 'circle'} 
            size={Devices.fS(25)} 
            color={state._methodId === item.id ? Colors.PRIMARY_COLOR : Colors.PLACEHOLDER_COLOR} 
            type={state._methodId === item.id ? 'regular' : 'light'} 
          />
        }
      />
    </TouchableOpacity>
  )
}

export const ViewBookPayment = ({
  state = null,
  onFunction = {
    onToggleMethod: () => { }
  }
}) => {
  return (
    <View style={styles.con_payment}>
      <FlatList contentContainerStyle={{paddingHorizontal: Devices.pH(layoutWidth.width)}}
        nestedScrollEnabled
        data={state._dataPayment}
        renderItem={({ item, index }) => RenderPaymentMethodItem(state, item, onFunction.onToggleMethod)}
        keyExtractor={(item, index) => index.toString()}
        removeClippedSubviews={Devices.OS === "android"}
      />
    </View>
  )
}