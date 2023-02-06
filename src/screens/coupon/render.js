/**
 ** Name: 
 ** Author: 
 ** CreateAt: 
 ** Description: 
**/
/* LIBRARY */
import React from 'react';
import { View, FlatList, TouchableOpacity } from 'react-native';
import {
  Container, Header, Left, Button, Body, Title, Right
} from "native-base";
import Icon from 'react-native-fontawesome-pro';
import moment from 'moment';
/* COMPONENTS */
import CText from '~/components/CText';
import CImage from '~/components/CImage';
import CLoading from '~/components/CLoading';
import CHeader from "~/components/CHeader";
/* COMMON */
import { Devices, Configs, Assets } from '~/config';
import { Colors } from '~/utils/colors';
import { cStyles } from '~/utils/styles';
import { layoutWidth } from '~/utils/layout_width';
import Currency from '~/utils/currency';
import Helpers from '~/utils/helpers';
/* STYLES */
import styles from './style';

const RenderEmptyList = () => {
  return (
    <View style={[cStyles.column_align_center, { marginTop: Devices.sW('40%') }]}>
      <Icon name={'comment-alt-exclamation'} color={Colors.BORDER_COLOR} size={Devices.fS(50)} type={'light'} />
      <CText style={cStyles.txt_no_data_1} i18nKey={'empty_list'} />
    </View>
  )
}

const renderCouponItem = (item, onPressCoupon) => {
  let slugDiscountType = Configs.discountType.find(f => f.id === item.discount_type);
  let dateExpires = moment(item.date_expires, "YYYY-MM-DDTHH:mmss").format(Configs.formatDate);
  let amount = Helpers.formatNumber(Number(item.amount), item.discount_type === 'percent' ? 0 : 2);
  let symbol = Helpers.symbolCurrency();

  return (
    <TouchableOpacity onPress={() => onPressCoupon(item)}>
      <View style={[styles.con_item_coupon,
      !Configs.supportRTL &&
      { marginRight: Devices.pH(layoutWidth.width) }
      ]}>
        <View style={[styles.con_coupons_item, { backgroundColor: Colors.BACKGROUND_PRIMARY_COLOR }]}>
          <CImage style={styles.img_coupon} source={Assets.image_bg_coupons}>
            <View style={styles.con_bg_blur} />
            {
              <View style={[styles.con_info_coupon,
              Configs.supportRTL && cStyles.column_align_end,
              !Configs.supportRTL && cStyles.pl_10,
              Configs.supportRTL && cStyles.pr_10,
              ]}>
                <View style={[styles.con_col_info, Configs.supportRTL && cStyles.column_align_end]}>
                  <CImage style={styles.img_icon_coupon} source={Assets.icon_coupon} resizeMode={'contain'} />
                  {item.discount_type === Configs.discountType[2].id &&
                    <CText style={[styles.txt_row_right_bottom, { fontSize: cStyles.txt_base_item.fontSize * 1.5 }]}>
                      {amount + slugDiscountType.slug}
                    </CText>
                  }

                  {item.discount_type !== Configs.discountType[2].id &&
                    <CText style={[styles.txt_row_right_bottom, { fontSize: cStyles.txt_base_item.fontSize * 1.5 }]}>
                      {(Configs.currencyPosition === Currency.left ? symbol : "") +
                        amount +
                        (Configs.currencyPosition === Currency.right ? symbol : "")
                      }
                    </CText>
                  }
                </View>

                <View style={[styles.con_col_info, Configs.supportRTL && cStyles.column_align_end]}>
                  <CText style={styles.txt_row_right_top} i18nKey={'date_expired'} />
                  <CText style={[styles.txt_row_right_bottom, { fontWeight: '800' }]}>
                    {dateExpires}
                  </CText>
                </View>
              </View>
            }
          </CImage>
        </View>
        <CText style={styles.txt_item_coupon_content} numberOfLines={2}>{item.description}</CText>
      </View>
    </TouchableOpacity>

  )
}

export const ViewCoupon = ({
  state = null,
  props = null,
  onFunction = {
    onPressBack: () => { },
    onRefresh: () => { },
    onLoadMore: () => { },
    onPressCoupon: () => { },
    con_coupons_item: () => { }
  }
}) => {
  return (
    <Container>
      <CHeader
        props={props}
        title={"coupons"}
        iconLeft_1={Configs.supportRTL ? "angle-right" : "angle-left"}
        iconRight_1={"shopping-cart"}
        onPressLeft_1={onFunction.onPressBack}
        onPressRight_1={onFunction.onPressCart}
      />

      {!state._loading &&
        <FlatList contentContainerStyle={[styles.con_list_coupon, { paddingHorizontal: Devices.pH(layoutWidth.width) }]}
          data={state._data}
          columnWrapperStyle={cStyles.row_justify_between}
          renderItem={({ item, index }) => renderCouponItem(item, onFunction.onPressCoupon)}
          keyExtractor={(item, index) => index.toString()}
          numColumns={2}
          showsVerticalScrollIndicator={false}
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