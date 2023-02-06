/**
 ** Name: 
 ** Author: 
 ** CreateAt: 
 ** Description: 
**/
/* LIBRARY */
import React from 'react';
import { View, FlatList, TouchableOpacity } from 'react-native';
import { Container, Card } from 'native-base';
import Icon from 'react-native-fontawesome-pro';
import firebase from 'react-native-firebase';
/* COMPONENTS */
import CHeader from "~/components/CHeader";
import CText from '~/components/CText';
import CLoading from '~/components/CLoading';
import CImage from '~/components/CImage';
import CViewRow from "~/components/CViewRow";
import CLoadingPlaceholder from '~/components/CLoadingPlaceholder';
/* COMMON */
import { cStyles } from '~/utils/styles';
import { Colors } from '~/utils/colors';
import { Configs, Devices, Assets } from '~/config';
import { layoutWidth } from '~/utils/layout_width';
/* STYLES */
import styles from './style'; 

const RenderCategory = (index, item, onPress) => {
  let source = Assets.image_failed;
  if (typeof(item.thumbnail) !== 'undefined' && item.thumbnail.length) {
    source = { uri: item.thumbnail.sizes.thumbnail };
  }

  return (
    <TouchableOpacity onPress={() => onPress(item)} activeOpacity={1} >
      <Card style={styles.con_row_item}>
        <CViewRow between
          leftComp={
            <CViewRow style={{ flex: .9 }}
              leftComp={<CImage style={styles.img_item} source={source} />}
              rightComp={
                <CText style={[styles.txt_title_item, Configs.supportRTL && cStyles.pr_10, {color: '#18504D'}]} numberOfLines={3}>
                  {Configs.html5Entities.decode(item.name)}
                </CText>
              }
            />
          }
          rightComp={
            <CViewRow start={Configs.supportRTL} style={[!Configs.supportRTL && cStyles.row_justify_end]}
              leftComp={
                <View style={styles.con_count_product}>
                  <CText style={[styles.txt_count_product, {color:'#18504D'}]}>{item.count}</CText>
                </View>
              }
              rightComp={
                <Icon name={Configs.supportRTL ? "angle-left" : "angle-right"}
                  size={cStyles.ic_left_detail.size}
                  color={cStyles.ic_left_detail.color}
                  type={cStyles.ic_left_detail.type} />
              }
            />
          }
        />
      </Card>
    </TouchableOpacity>
  )
}

const _onRenderEmpty = () => {
  return (
    <View style={[cStyles.column_align_center, { marginTop: Devices.sW('40%') }]}>
      <Icon name={'comment-alt-exclamation'} color={Colors.BORDER_COLOR} size={Devices.fS(50)} type={'light'} />
      <CText style={cStyles.txt_no_data_1} i18nKey={'empty_list'} />
    </View>
  )
}

export const ViewNews = ({
  state = null,
  props = null, 
  onFunction = {
    onPressCart: () => { },
    onRefresh: () => { },
    onLoadMore: () => { },
    onPressItem: () => { },
  }
}) => {
  return (
    <Container>
      <CHeader
        style={{backgroundColor:'#18504D'}}
        props={props}
        title={"news"}
        iconLeft_1={"none"}
        iconRight_1={"shopping-cart"}
        onPressRight_1={onFunction.onPressCart}
      />

      {!state._loading ?
        <>
          <FlatList
            contentContainerStyle={{ paddingHorizontal: Devices.pH(layoutWidth.width) }}
            data={state._categories}
            renderItem={({ item, index }) => RenderCategory(index, item, onFunction.onPressItem)}
            keyExtractor={(item, index) => index.toString()}
            refreshing={state._refreshing}
            onRefresh={onFunction.onRefresh}
            removeClippedSubviews={Devices.OS === 'android'}
            onEndReachedThreshold={0.5}
            onEndReached={onFunction.onLoadMore}
            ListEmptyComponent={_onRenderEmpty}
          />
        </>
      :
      <CLoadingPlaceholder />
      }

      {/* <CLoading visible={state._loading} /> */}
    </Container>
  )
}