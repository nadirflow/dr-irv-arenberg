/**
 ** Name: 
 ** Author: 
 ** CreateAt: 
 ** Description: 
**/
/* LIBRARY */
import React from 'react';
import { View, FlatList, RefreshControl, Animated } from 'react-native';
import {
  Container, Body, Title, Content,
} from "native-base";
import Icon from 'react-native-fontawesome-pro';
/* COMPONENTS */
import CHeader from "~/components/CHeader";
import CText from '~/components/CText';
import CLoading from '~/components/CLoading';
import Column from '~/components/CLayout/Column';
import { SkypeIndicator } from "~/components/CIndicator";
import { CategoryItem } from "../components/CategoryItem";
/* COMMON */
import { layoutWidth } from '~/utils/layout_width';
import { Configs, Devices } from '~/config';
import { Colors } from '~/utils/colors';
import { cStyles } from '~/utils/styles';
/* STYLES */
import styles from './style';

const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
  const paddingToBottom = 20
  return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
}

export const ViewProduct = ({
  state = null,
  props = null,
  onFunction = {
    onPressBack: () => { },
    onPressCart: () => { },
    onPressProductItem: () => { },
    onLoadMore: () => { },
    onRefresh: () => { },
    onPressSubCate: () => { },
    onPressAddCart: () => { }
  }
}) => {
  return (
    <Container>
      <CHeader
        props={props}
        titleComponent={
          <Body style={styles.con_header_center}>
            <View style={styles.con_title}>
              <Title><CText style={cStyles.txt_title_header}>
                {Configs.html5Entities.decode(props.route.params.name)}
              </CText></Title>
            </View>
          </Body>
        }
        iconLeft_1={Configs.supportRTL ? "angle-right" : "angle-left"}
        iconRight_1={"shopping-cart"}
        onPressLeft_1={onFunction.onPressBack}
        onPressRight_1={onFunction.onPressCart}
      />

      {!state._loading &&
        <>
          {state._subCate.length > 0 || state._products.length > 0 ?
            <Content
              refreshControl={<RefreshControl refreshing={state._refreshing} onRefresh={onFunction.onRefresh} />}
              scrollEventThrottle={16}
              onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { y: state._scrollY } } }],
                {
                  listener: event => {
                    if (isCloseToBottom(event.nativeEvent)) onFunction.onLoadMore();
                  }
                }
              )}
              onMomentumScrollEnd={({ nativeEvent }) => {
                if (isCloseToBottom(nativeEvent)) onFunction.onLoadMore();
              }}
              showsVerticalScrollIndicator={false}
            >
              <FlatList contentContainerStyle={{ paddingHorizontal: Devices.pH(layoutWidth.width) }}
                data={state._subCate}
                renderItem={({ item, index }) => CategoryItem(index, item, onFunction.onPressSubCate)}
                keyExtractor={(item, index) => index.toString()}
                ListEmptyComponent={() => null}
              />

              <Column
                contentStyle={styles.con_list_product}
                data={state._products}
                render={{
                  header: null,
                  footer: state._loadingMore ?
                    <View style={styles.con_footer_loading}>
                      <SkypeIndicator color={Colors.PRIMARY_COLOR} />
                    </View> : null,
                  empty: null
                }}
                onFunction={{
                  onPressItem: onFunction.onPressProductItem,
                  onPressAddCart: onFunction.onPressAddCart
                }}
                isService
                cart={props.cart}
              />
            </Content>
            :
            <View style={[cStyles.column_align_center, { marginTop: Devices.sW('40%') }]}>
              <Icon name={'comment-alt-exclamation'} color={Colors.BORDER_COLOR} size={Devices.fS(50)} type={'light'} />
              <CText style={cStyles.txt_no_data_1} i18nKey={'category_is_empty_products'} />
            </View>
          }
        </>
      }

      <CLoading visible={state._loading} />
    </Container >
  )
}