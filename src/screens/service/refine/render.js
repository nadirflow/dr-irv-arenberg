/**
 ** Name: 
 ** Author: 
 ** CreateAt: 
 ** Description: 
**/
/* LIBRARY */
import React from 'react';
import { View, TouchableOpacity, FlatList } from 'react-native';
import {
  Container, Button, Footer,
} from "native-base";
import Icon from 'react-native-fontawesome-pro';
/* COMPONENTS */
import CHeader from "~/components/CHeader";
import CText from '~/components/CText';
import CViewRow from "~/components/CViewRow";
/* COMMON */
import { Devices, Configs } from '~/config';
import { Colors } from '~/utils/colors';
import { cStyles } from '~/utils/styles';
import { layoutWidth } from '~/utils/layout_width';
/* STYLES */
import styles from './style';

const renderAccordionSort = (item, state, onPress) => {
  return (
    <TouchableOpacity onPress={() => onPress(item.id)}>
      <CViewRow style={styles.con_sort_item} between
        leftComp={
          <CText style={[cStyles.txt_base_item, {color: '#000'}]} i18nKey={item.title} />
        }
        rightComp={state._sortSelected === item.id ?
          <Icon name={"dot-circle"}
            size={Devices.fS(20)}
            color={'#18504D'}
            type={"solid"} />
          :
          <Icon name={"circle"}
            size={Devices.fS(20)}
            color={'#18504D'}
            type={"light"} />
        }
      />
    </TouchableOpacity>
  )
}

export const ViewRefine = ({
  state = null,
  onFunction = {
    onPressItem: () => { },
    onPressBack: () => { }
  }
}) => {
  return (
    <Container>
      <CHeader
      style={{backgroundColor:'#18504D'}}
        title={'sort'}
        iconLeft_1={Configs.supportRTL ? "angle-right" : "angle-left"}
        iconRight_1={"none"}
        onPressLeft_1={onFunction.onPressBack}
      />

      <FlatList contentContainerStyle={{ paddingHorizontal: Devices.pH(layoutWidth.width) }}
        data={state._arrAccordionSort}
        renderItem={({ item, index }) => renderAccordionSort(item, state, onFunction.onPressItem)}
        keyExtractor={(item, index) => index.toString()}
        ItemSeparatorComponent={() => <View style={styles.con_separator_option} />}
      />

      <Footer style={[styles.con_footer, { paddingHorizontal: Devices.pH(layoutWidth.width) }]}>
        <Button block style={[styles.con_btn, { backgroundColor: '#18504D' }]}
          onPress={onFunction.onPressBack}>
          <CText style={cStyles.txt_title_button} i18nKey={'show_result'} />
        </Button>
      </Footer>
    </Container >
  )
}