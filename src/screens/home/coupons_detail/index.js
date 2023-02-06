/**
 ** Name: 
 ** Author: 
 ** CreateAt: 
 ** Description: 
**/
/* LIBRARY */
import React from 'react';
import { Animated, Clipboard } from 'react-native';
import { connect } from 'react-redux';
import { View, TouchableOpacity } from 'react-native';
import { Container, Content, Button } from "native-base";
import Icon from 'react-native-fontawesome-pro';
import moment from 'moment';
/* COMPONENTS */
import CImage from '~/components/CImage';
import CText from '~/components/CText';
/** COMMON */
import { cStyles } from '~/utils/styles';
import { layoutWidth } from '~/utils/layout_width';
import { Colors } from '~/utils/colors';
import { Configs, Languages, Assets, Devices } from '~/config';
import Helpers from '~/utils/helpers';
import Currency from '~/utils/currency';
/** STYLE */
import styles from './style';
import { StatusBar } from 'react-native';

const MIN_HEIGHT = 80;
const MAX_HEIGHT = Devices.sH('35%');

class CouponsDetail extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      _scrollY: new Animated.Value(0)
    }
    this._coupons = props.route.params.data;
    StatusBar.setBackgroundColor("#18504D", true);
    StatusBar.setBarStyle("dark-content", true)
  }

  /* FUNCTIONS */
  _onPressCode = () => {
    Clipboard.setString(this._coupons.code);
    Helpers.showToastDuration({}, Languages[this.props.language].copied_to_clipboard);
  }

  _onPressBack = () => {
    this.props.navigation.goBack();
  }

  /* RENDER */
  render() {
    let slugDiscountType = Configs.discountType.find(f => f.id === this._coupons.discount_type);
    let dateExpires = moment(this._coupons.date_expires, "YYYY-MM-DDTHH:mmss").format(Configs.formatDate);
    let amount = Helpers.formatNumber(Number(this._coupons.amount), this._coupons.discount_type === 'percent' ? 0 : 2);
    let currencyPosition = Configs.currencyPosition;
    let symbol = Helpers.symbolCurrency();
    let imageOpacity = this.state._scrollY.interpolate({
      inputRange: [0, (MAX_HEIGHT - MIN_HEIGHT)],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });
    let headerOpacity = this.state._scrollY.interpolate({
      inputRange: [0, (MAX_HEIGHT - MIN_HEIGHT)],
      outputRange: [0, 1],
      extrapolate: 'clamp',
    });

    return (
      <Container>
        <Animated.View style={[styles.con_header_fixed, {
          paddingHorizontal: Devices.pH(layoutWidth.width),
          opacity: headerOpacity
        }]}>
          <Icon
            name={"angle-left"}
            size={Devices.fS(20)}
            color={Colors.BLACK_COLOR}
            type={'regular'}
            onPress={this._onPressBack}
          />
          <CText style={styles.txt_title_header_fixed} i18nKey={'coupons'} />
          {this._coupons.discount_type === Configs.discountType[2].id &&
            <CText style={styles.txt_coupon_amount_item}>
              {amount + slugDiscountType.slug}
            </CText>
          }
          {this._coupons.discount_type !== Configs.discountType[2].id &&
            <CText style={styles.txt_coupon_amount_item}>
              {(currencyPosition === Currency.left ? symbol : "") +
                amount +
                (currencyPosition === Currency.right ? symbol : "")
              }
            </CText>
          }
        </Animated.View>

        <Content
          style={styles.con_content_full}
          showsVerticalScrollIndicator={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: this.state._scrollY } } }]
          )}
        >
          <Animated.View style={[styles.con_header, { opacity: imageOpacity, backgroundColor: Colors.BACKGROUND_PRIMARY_COLOR }]}>
            <CImage
              style={styles.img_header}
              source={Assets.image_bg_coupons}>
              {<View style={[cStyles.full_center, cStyles.row_align_center]}>
                <View style={styles.con_bg_blur} />
                <View style={styles.con_col_image}>
                  <CImage style={styles.img_icon_coupon} source={Assets.icon_coupon} resizeMode={'contain'} />
                  <CImage style={styles.img_icon_calendar} source={Assets.icon_calendar} resizeMode={'contain'} />
                </View>

                <View style={styles.con_col_info}>
                  <CText style={styles.txt_row_right_top} i18nKey={'coupons'} />
                  {this._coupons.discount_type === Configs.discountType[2].id &&
                    <CText style={[styles.txt_row_right_bottom, { fontWeight: '600', fontSize: cStyles.txt_title_group.fontSize * 2 }]}>
                      {amount + slugDiscountType.slug}
                    </CText>
                  }

                  {this._coupons.discount_type !== Configs.discountType[2].id &&
                    <CText style={[styles.txt_row_right_bottom, { fontWeight: '600', fontSize: cStyles.txt_title_group.fontSize * 2 }]}>
                      {(currencyPosition === Currency.left ? symbol : "") +
                        amount +
                        (currencyPosition === Currency.right ? symbol : "")
                      }
                    </CText>
                  }

                  <CText style={styles.txt_row_right_top} i18nKey={'date_expired'} />
                  <CText style={[styles.txt_row_right_bottom, { fontWeight: '600', fontSize: cStyles.txt_title_group.fontSize * 1.3 }]}>
                    {dateExpires}
                  </CText>
                </View>
              </View>}
            </CImage>

            <TouchableOpacity style={[styles.con_icon_back_full, { left: Devices.pH(layoutWidth.width) }]}
              onPress={this._onPressBack}>
              <Icon
                name={"angle-left"}
                size={Devices.fS(20)}
                color={Colors.WHITE_COLOR}
                type={"regular"}
              />
            </TouchableOpacity>
          </Animated.View>

          <View style={[styles.con_content, { marginHorizontal: Devices.pH(layoutWidth.width) }]}>
            <Button block style={[styles.con_btn, { backgroundColor: Colors.PRIMARY_COLOR }]} onPress={this._onPressCode}>
              <CText style={styles.txt_btn} i18nKey={'copy_code'} />
              <CText style={styles.txt_btn}>{": " + this._coupons.code}</CText>
            </Button>

            <View style={[cStyles.row_align_start, { marginTop: 10, marginBottom: 10 }]}>
              <CText style={styles.txt_title_left} i18nKey={'coupons'} />
              {this._coupons.discount_type === Configs.discountType[2].id &&
                <CText style={[styles.txt_title_right, { fontWeight: '600' }]}>
                  {" " + amount + slugDiscountType.slug}
                </CText>
              }

              {this._coupons.discount_type !== Configs.discountType[2].id &&
                <CText style={[styles.txt_title_right, { fontWeight: '600' }]}>
                  {(currencyPosition === Currency.left ? " " + symbol : " ") +
                    amount +
                    (currencyPosition === Currency.right ? symbol : "")
                  }
                </CText>
              }
            </View>

            <CText style={styles.txt_description} numberOfLines={20}>{this._coupons.description}</CText>
          </View>

        </Content>
      </Container>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.language.language
  }
}

export default connect(
  mapStateToProps,
  null
)(CouponsDetail);