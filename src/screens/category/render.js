/**
 ** Name: 
 ** Author: 
 ** CreateAt: 
 ** Description: 
**/
/* LIBRARY */
import React from 'react';
import { View, FlatList } from 'react-native';
import {
  Container
} from "native-base";
import Icon from 'react-native-fontawesome-pro';
/* COMPONENTS */
import CHeader from "~/components/CHeader";
import CText from '~/components/CText';
import CLoading from '~/components/CLoading';
import { CategoryItem } from "./components/CategoryItem";
/* COMMON */
import { Devices, Configs } from '~/config';
import { Colors } from '~/utils/colors';
import { cStyles } from '~/utils/styles';

const RenderEmptyList = () => {
  return (
    <View style={[cStyles.column_align_center, { marginTop: Devices.sW('40%') }]}>
      <Icon name={'comment-alt-exclamation'} color={Colors.BORDER_COLOR} size={Devices.fS(50)} type={'light'} />
      <CText style={cStyles.txt_no_data_1} i18nKey={'empty_list'} />
    </View>
  )
}

export const ViewCategory = ({
  state = null,
  props = null,
  onFunction = {
    onPressBack: () => { },
    onPressItem: () => { },
    onRefresh: () => { },
    onLoadMore: () => { },
    onPressCart: () => { }
  }
}) => {
  return (
    <Container>
      <CHeader
        props={props}
        title={"categories"}
        iconLeft_1={Configs.supportRTL ? "angle-right" : "angle-left"}
        iconRight_1={"shopping-cart"}
        onPressLeft_1={onFunction.onPressBack}
        onPressRight_1={onFunction.onPressCart}
      />

      {!state._loading &&
        <FlatList
          contentContainerStyle={cStyles.pv_5}
          data={state._data}
          renderItem={({ item, index }) => CategoryItem(index, item, onFunction.onPressItem)}
          keyExtractor={(item, index) => index.toString()}
          refreshing={state._refreshing}
          onRefresh={onFunction.onRefresh}
          onEndReachedThreshold={0.1}
          onEndReached={onFunction.onLoadMore}
          ListEmptyComponent={RenderEmptyList}
        />
      }

      <CLoading visible={state._loading} />
    </Container >
  )
}