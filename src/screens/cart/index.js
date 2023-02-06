/**
 ** Name:
 ** Author:
 ** CreateAt:
 ** Description:
 **/
/* LIBRARY */
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ActionSheet } from 'native-base';
import { Modal, View } from 'react-native';
import moment from 'moment';
/* COMPONENTS */
import { ViewCart } from './render';
import CLoading from '~/components/CLoading';
/** COMMON */
import { Configs, Languages, Keys } from '~/config';
import { Colors } from '~/utils/colors';
import Services from '~/services';
import Helpers from '~/utils/helpers';
import styles from './style';
/** REDUX */
import * as cartActions from '~/redux/actions/cart';

const MODAL = {
  COUPON: 0,
  POINT: 1,
};
var CANCEL_INDEX = 1;
var DESTRUCTIVE_INDEX = 0;

class Cart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      _loadingNextPage: false,
      _loadingProductDetail: false,
      _loadingCoupon: false,
      _loadingCheckProducts: true,
      _success: false,
      _modalVisible: false,
      _error: '',
      _products: props.cart,
      _modalType: MODAL.COUPON,
      _coupon: null,
      _couponCode: '',
      _points: 0,
      _totalPrice: 0,
      _discountPrice: 0,
      _provisionalPrice: 0,
      _couExcludeCateProducts: [],
      _couCateProducts: [],
      _couExcludeProducts: [],
      _couProducts: [],
      _token: '',
    };
    this._totalProducts = 0;
  }

  /* FUNCTIONS */
  _checkProducts = async () => {
    let resCart = await Services.Cart.getCart({cartKey: this.props.cartKey});
    if (resCart && resCart.items) {
      resCart.items = Object.keys(resCart.items).map((key) => resCart.items[key]);
      this.props.cartActions.addItemCartWebview(resCart);
    }
    let token = await Helpers.getDataStorage(Keys.AS_DATA_JWT);
    let { _products } = this.state;
    let include = [];
    include = _products.map(item => {
      return item.id;
    });
    include.unshift(-1);
    let params = {
      include: JSON.stringify(include),
    };
    let resProducts = await Services.Service.listProducts(params);
    if (resProducts && !resProducts.code) {
      for (let i = 0; i < resProducts.length; i++) {
        for (let y = 0; y < _products.length; y++) {
          if (resProducts[i].id === _products[y].id) {
            let originPrice = 0,
              salePrice = 0;
            if (_products[y].variation) {
              if (
                _products[y].variation.on_sale &&
                _products[y].variation.sale_price !== ''
              ) {
                originPrice = Number(_products[y].variation.regular_price);
                salePrice = Number(_products[y].variation.sale_price);
              } else {
                originPrice = Number(_products[y].variation.price);
              }
            } else {
              if (resProducts[i].on_sale && resProducts[i].sale_price !== '') {
                originPrice = Number(resProducts[i].regular_price);
                salePrice = Number(resProducts[i].sale_price);
              } else {
                originPrice = Number(resProducts[i].price);
              }
            }

            _products[y].price = _products[y].variation
              ? Number(_products[y].variation.price)
              : Number(_products[y].price);
            _products[y].originPrice = originPrice;
            _products[y].salePrice = salePrice;
          }
        }
      }
    }
    this.setState({ _products, _loadingCheckProducts: false, token: token || '' }, () => {
      this._prepareProducts();
    });
  };

  _prepareProducts = (coupon = null) => {
    let {
      _totalPrice,
      _discountPrice,
      _provisionalPrice,
      _products,
      _couExcludeCateProducts,
      _couCateProducts,
      _couExcludeProducts,
      _couProducts,
    } = this.state;
    (_totalPrice = 0), (_discountPrice = 0), (_provisionalPrice = 0);
    this._totalProducts = 0;

    for (let i = 0; i < _products.length; i++) {
      let price,
        flag = false;
      if (
        !flag &&
        _couExcludeCateProducts.findIndex(f => f.id === _products[i].id) !== -1
      ) {
        price =
          (Number(_products[i].salePrice) > 0
            ? Number(_products[i].salePrice)
            : Number(_products[i].price)) * _products[i].numberOfProduct;
        _totalPrice += Number(price);
        _products[i].price_coupon = 0;
        flag = true;
      }

      if (
        !flag &&
        _couExcludeProducts.findIndex(f => f.id === _products[i].id) !== -1
      ) {
        price =
          (Number(_products[i].salePrice) > 0
            ? Number(_products[i].salePrice)
            : Number(_products[i].price)) * _products[i].numberOfProduct;
        _totalPrice += Number(price);
        _products[i].price_coupon = 0;
        flag = true;
      }

      if (
        !flag &&
        _couCateProducts.findIndex(f => f.id === _products[i].id) !== -1
      ) {
        price =
          (Number(_products[i].salePrice) > 0
            ? Number(_products[i].salePrice)
            : Number(_products[i].price)) * _products[i].numberOfProduct;
        _totalPrice += Number(price);
        if (coupon) {
          if (coupon.discount_type === 'percent') {
            _products[i].price_coupon = (price * Number(coupon.amount)) / 100;
          } else {
            _products[i].price_coupon = Number(coupon.amount);
          }
          _discountPrice += Number(_products[i].price_coupon);
        }
        flag = true;
      }

      if (
        !flag &&
        _couProducts.findIndex(f => f.id === _products[i].id) !== -1
      ) {
        price =
          (Number(_products[i].salePrice) > 0
            ? Number(_products[i].salePrice)
            : Number(_products[i].price)) * _products[i].numberOfProduct;
        _totalPrice += Number(price);
        if (coupon) {
          if (coupon.discount_type === 'percent') {
            _products[i].price_coupon = (price * Number(coupon.amount)) / 100;
          } else {
            _products[i].price_coupon = Number(coupon.amount);
          }
          _discountPrice += Number(_products[i].price_coupon);
        }
        flag = true;
      }

      if (
        !flag &&
        !_products[i].price_coupon &&
        _couCateProducts.length === 0 &&
        _couProducts.length === 0
      ) {
        price =
          (Number(_products[i].salePrice) > 0
            ? Number(_products[i].salePrice)
            : Number(_products[i].price)) * _products[i].numberOfProduct;
        _totalPrice += Number(price);
        if (coupon) {
          if (coupon.discount_type === 'percent') {
            _products[i].price_coupon = (price * Number(coupon.amount)) / 100;
          } else {
            _products[i].price_coupon = Number(coupon.amount);
          }
          _discountPrice += Number(_products[i].price_coupon);
        }
        flag = true;
      }

      this._totalProducts += _products[i].numberOfProduct;
    }

    _totalPrice = Number(_totalPrice);
    _provisionalPrice = Number(_totalPrice - _discountPrice);
    this.setState({ _products, _totalPrice, _discountPrice, _provisionalPrice });
  };

  _onRemoveProduct = async product => {
    let { _products } = this.state;
    let findIdx = -1;
    for (let i = 0; i < _products.length; i++) {
      if (product.variation && _products[i].variation) {
        if (
          _products[i].id === product.id &&
          _products[i].variation.id === product.variation.id
        ) {
          findIdx = i;
        }
      } else {
        if (_products[i].id === product.id) {
          findIdx = i;
        }
      }
    }

    if (findIdx !== -1) {
      if (Configs.isPaymentWebview) {
        let { cartData } = this.props;
        let variationId = _products[findIdx].variation ? _products[findIdx].variation.id : 0;
        let findIndex = cartData.findIndex(f => f.product_id === _products[findIdx].id && f.variation_id === variationId);
        if (findIndex !== -1) {
          let params = {
            cartKey: this.props.cartKey,
            data: {
              cart_item_key: cartData[findIndex].key,
            }
          }
          let res = await Services.Cart.removeItem(params);
          if (res && res.success) {
            let resCart = await Services.Cart.getCart({cartKey: this.props.cartKey});
            if (resCart && resCart.items) {
              resCart.items = Object.keys(resCart.items).map((key) => resCart.items[key]);
              this.props.cartActions.addItemCartWebview(resCart);
            }
          } else {
            return Helpers.showToastDuration(
              {},
              `"${product.name}" ` +
              Languages[this.props.language].remove_from_cart_failed,
              'danger',
            );
          }
        }
      }
      Helpers.removeKeyStorage(Keys.AS_DATA_CART);
      _products.splice(findIdx, 1);
      if (_products.length > 0) {
        Helpers.setDataStorage(Keys.AS_DATA_CART, JSON.stringify(_products));
      }

      this.setState({ _products });
      this.props.cartActions.removeItemCart(
        product.id,
        product.variation ? product.variation.id : null,
      );
      this._prepareProducts();
    } else {
      Helpers.showToastDuration(
        {},
        `"${product.name}" ` +
        Languages[this.props.language].remove_from_cart_failed,
        'danger',
      );
    }
  };

  _onPressToggleModal = type => {
    this.setState({
      _modalVisible: !this.state._modalVisible,
      _modalType: type,
    });
  };

  _onPressCloseModal = () => {
    this.setState({ _modalVisible: false });
  };

  _onPressCoupon = coupon => {
    this.setState({ _coupon: coupon, _modalVisible: false });
  };

  _onPressPoints = points => {
    this.setState({ _points: points, _modalVisible: false });
  };

  _onPressOrder = async () => {
    /** Check total price with plugins wc_minmax */
    if (Configs.minCartTotalPrice && Configs.minCartTotalPrice !== 0) {
      if (this.state._totalPrice < Configs.minCartTotalPrice) {
        return Helpers.showToastDuration(
          {},
          Languages[this.props.language].error_min_total_order +
          ' ' +
          Configs.minCartTotalPrice +
          '!',
          'danger',
        );
      }
    }

    if (Configs.maxCartTotalPrice && Configs.maxCartTotalPrice !== 0) {
      if (this.state._totalPrice > Configs.maxCartTotalPrice) {
        return Helpers.showToastDuration(
          {},
          Languages[this.props.language].error_max_total_order +
          ' ' +
          Configs.maxCartTotalPrice +
          '!',
          'danger',
        );
      }
    }

    /** Check total products with plugins wc_minmax */
    if (Configs.minProductQuantity && Configs.minProductQuantity !== 0) {
      if (this._totalProducts < Configs.minProductQuantity) {
        return Helpers.showToastDuration(
          {},
          Languages[this.props.language].error_min_product_quantity +
          ' ' +
          Configs.minProductQuantity +
          '!',
          'danger',
        );
      }
    }

    if (Configs.maxProductQuantity && Configs.maxProductQuantity !== 0) {
      if (this._totalProducts > Configs.maxProductQuantity) {
        return Helpers.showToastDuration(
          {},
          Languages[this.props.language].error_max_product_quantity +
          ' ' +
          Configs.maxProductQuantity +
          '!',
          'danger',
        );
      }
    }
    // console.log('9====================================');
    // console.log(Configs.isPaymentWebview);
    // console.log('9====================================');
    if (Configs.isPaymentWebview) {
      let token = await Helpers.getDataStorage(Keys.AS_DATA_JWT);
      console.log('10====================================');
      console.log(token);
      console.log('10====================================');
      if(!token || token === "" ){
        this.props.navigation.navigate("SignIn");
      }else{
        this.props.navigation.navigate('WebviewCheckout', {
          token: token || ""
        })
      }
    } else {
      this.setState({ _loadingNextPage: true });
    }

  };

  _onChangeText = value => {
    this.setState({ _couponCode: value });
  };

  _onCheckCoupon = async () => {
    let { _products } = this.state;
    let resCoupons = await Services.Coupon.list({
      code: this.state._couponCode.toLowerCase(),
    });
    if (resCoupons) {
      if (resCoupons.code) {
        return this.setState({
          _error: 'coupon_not_found',
          _success: false,
          _loadingCoupon: false,
        });
      } else {
        if (resCoupons.length > 0) {
          /** Check expired */
          let isExpired = moment(resCoupons[0].date_expires).diff(
            moment(),
            'days',
          );
          if (isExpired < 0)
            return this.setState({
              _error: 'coupon_expired',
              _success: false,
              _loadingCoupon: false,
            });

          /** Check usage limit */
          if (resCoupons[0].usage_count && resCoupons[0].usage_limit) {
            if (resCoupons[0].usage_count >= resCoupons[0].usage_limit) {
              return this.setState({
                _error: 'coupon_usage_limit',
                _success: false,
                _loadingCoupon: false,
              });
            }
          }

          if (this.props.user) {
            let findProductsPerUser = [];
            /** Check usage limit per user */
            if (resCoupons[0].usage_limit_per_user) {
              if (resCoupons[0].used_by && resCoupons[0].used_by.length > 0) {
                findProductsPerUser = resCoupons[0].used_by.filter(userId => {
                  if (userId === this.props.user.id) return true;
                  else return null;
                });
              }
            }
            if (resCoupons[0].usage_limit_per_user && findProductsPerUser.length >= resCoupons[0].usage_limit_per_user) {
              return this.setState({
                _error: 'coupon_usage_limit_per_user',
                _success: false,
                _loadingCoupon: false,
              });
            }
          }

          let findExcludeCateProducts = [];
          let findCateProducts = [];
          /** Check exclude products categories apply */
          if (resCoupons[0].excluded_product_categories.length > 0) {
            findExcludeCateProducts = _products.filter((product, index) => {
              let find = false;
              if (product.categories.length > 0) {
                for (let category of product.categories) {
                  if (
                    !find &&
                    resCoupons[0].excluded_product_categories.includes(
                      category.id,
                    )
                  )
                    find = true;
                }
              }
              if (find) return product;
              else return null;
            });
          }

          /** Check products categories apply */
          if (resCoupons[0].product_categories.length > 0) {
            findCateProducts = _products.filter((product, index) => {
              let find = false;
              if (product.categories.length > 0) {
                for (let category of product.categories) {
                  if (
                    !find &&
                    resCoupons[0].product_categories.includes(category.id)
                  )
                    find = true;
                }
              }
              if (find) return product;
              else return null;
            });
            if (findCateProducts.length === 0) {
              return this.setState({
                _error: 'coupon_not_valid',
                _success: false,
                _loadingCoupon: false,
              });
            }
          }

          let findExcludeProducts = [];
          let findProducts = [];
          /** Check exclude products apply */
          if (resCoupons[0].excluded_product_ids.length > 0) {
            findExcludeProducts = _products.filter((product, index) => {
              if (product.variation) {
                if (
                  resCoupons[0].excluded_product_ids.includes(
                    product.variation.id,
                  )
                )
                  return product;
              }
              if (resCoupons[0].excluded_product_ids.includes(product.id))
                return product;
            });
          }

          /** Check products apply */
          if (resCoupons[0].product_ids.length > 0) {
            findProducts = _products.filter((product, index) => {
              if (product.variation) {
                if (resCoupons[0].product_ids.includes(product.variation.id))
                  return product;
              }
              if (resCoupons[0].product_ids.includes(product.id))
                return product;
            });
          }

          if (findExcludeCateProducts.length > 0) {
            return this.setState({
              _error: 'coupon_not_valid',
              _success: false,
              _loadingCoupon: false,
            });
          }

          if (findExcludeProducts.length > 0) {
            return this.setState({
              _error: 'coupon_not_valid',
              _success: false,
              _loadingCoupon: false,
            });
          }

          /** If done, next */
          this.setState({
            _couExcludeCateProducts: findExcludeCateProducts,
            _couCateProducts: findCateProducts,
            _couExcludeProducts: findExcludeProducts,
            _couProducts: findProducts,

            _coupon: resCoupons[0],
            _success: true,
            _loadingCoupon: false,
          });

          return this._prepareProducts(resCoupons[0]);
        } else {
          return this.setState({
            _error: 'coupon_not_found',
            _loadingCoupon: false,
          });
        }
      }
    } else {
      return this.setState({ _error: 'server_error', _loadingCoupon: false });
    }
  };

  _onPressApply = async () => {
    if (this.state._couponCode === '') {
      return this.setState({ _error: 'coupon_not_empty' });
    }
    let { _products } = this.state;
    for (let i = 0; i < _products.length; i++) {
      _products[i].price_coupon = 0;
    }

    this.setState({
      _couExcludeCateProducts: [],
      _couCateProducts: [],
      _couExcludeProducts: [],
      _couProducts: [],
      _products,
      _success: false,
      _error: '',
      _loadingCoupon: true,
    });

    if (Configs.isPaymentWebview) {
      let params = {
        cartKey: this.props.cartKey,
        data: {
          coupon_code: this.state._couponCode
        }
      }
      let res = await Services.Cart.addCoupon(params);
      if (res && res.success) {
        let resCart = await Services.Cart.getCart({cartKey: this.props.cartKey});
        if (resCart && resCart.items) {
          resCart.items = Object.keys(resCart.items).map((key) => resCart.items[key]);
          this.props.cartActions.addItemCartWebview(resCart);
        }
      } else {
        return this.setState({
          _error: 'coupon_not_found',
          _success: false,
          _loadingCoupon: false,
        });
      }
    }
    this._onCheckCoupon();
  };

  _onPressClear = async () => {
    if (Configs.isPaymentWebview) {
      let params = {
        cartKey: this.props.cartKey,
        data: {
          coupon_code: this.state._couponCode
        }
      }
      let res = await Services.Cart.removeCoupon(params);
      if (res && res.success) {
        let resCart = await Services.Cart.getCart({cartKey: this.props.cartKey});
        if (resCart && resCart.items) {
          resCart.items = Object.keys(resCart.items).map((key) => resCart.items[key]);
          this.props.cartActions.addItemCartWebview(resCart);
        }
      } else {
        return Helpers.showToastDuration(
          {},
          Languages[this.props.language].server_error,
          'danger',
          'top',
        );
      }
    }
    let arrProducts = this.state._products;
    for (let std of arrProducts) {
      delete std.price_coupon
    }
    this.setState({
      _coupon: null,
      _couponCode: '',
      _success: false,
      _error: '',
      _couExcludeCateProducts: [],
      _couCateProducts: [],
      _couExcludeProducts: [],
      _couProducts: [],
      _products: arrProducts
    }, () => this._prepareProducts());
  };

  _onPressRemoveProduct = product => {
    let { language } = this.props;
    ActionSheet.show(
      {
        options: [
          {
            text: Languages[language].ok,
            icon: 'trash',
            iconColor: Colors.PRIMARY_COLOR,
          },
          {
            text: Languages[language].cancel,
            icon: 'close',
            iconColor: Colors.RED_COLOR,
          },
        ],
        cancelButtonIndex: CANCEL_INDEX,
        destructiveButtonIndex: DESTRUCTIVE_INDEX,
        title: Languages[language].title_message_remove_service,
      },
      buttonIndex => {
        if (buttonIndex === DESTRUCTIVE_INDEX) {
          this._onRemoveProduct(product);
        }
      },
    );
  };

  _onPressMinusAmount = async indexProduct => {
    let { _products } = this.state;
    if (_products[indexProduct].numberOfProduct > 1) {
      if (this.state._couponCode !== '') {
        this.setState({
          _coupon: null,
          _couponCode: '',
          _success: false,
          _error: '',
        });
      }
      if (Configs.isPaymentWebview) {
        let { cartData } = this.props;
        let variationId = _products[indexProduct].variation ? _products[indexProduct].variation.id : 0;
        let findIndex = cartData.findIndex(f => f.product_id === _products[indexProduct].id && f.variation_id === variationId);
        if (findIndex !== -1) {
          let params = {
            cartKey: this.props.cartKey,
            data: {
              cart_item_key: cartData[findIndex].key,
              quantity: _products[indexProduct].numberOfProduct - 1
            }
          }
          let res = await Services.Cart.updateQuantity(params);
          if (res && res.success) {
            let resCart = await Services.Cart.getCart({cartKey: this.props.cartKey});
            if (resCart && resCart.items) {
              resCart.items = Object.keys(resCart.items).map((key) => resCart.items[key]);
              this.props.cartActions.addItemCartWebview(resCart);
            }
          } else {
            return Helpers.showToastDuration(
              {},
              Languages[this.props.language].update_quantity_failed,
              'danger',
              'top',
            );
          }
        }
      }
      _products[indexProduct].numberOfProduct -= 1;
      this.props.cartActions.updateCart(_products);
      Helpers.setDataStorage(Keys.AS_DATA_CART, JSON.stringify(_products));
      this._prepareProducts();
    }
  };

  _onPressPlusAmount = async indexProduct => {
    let { _products } = this.state;
    if (this.state._couponCode !== '') {
      this.setState({
        _coupon: null,
        _couponCode: '',
        _success: false,
        _error: '',
      });
    }
    if (Configs.isPaymentWebview) {
      let { cartData } = this.props;
      let variationId = _products[indexProduct].variation ? _products[indexProduct].variation.id : 0;
      let findIndex = cartData.findIndex(f => f.product_id === _products[indexProduct].id && f.variation_id === variationId);
      if (findIndex !== -1) {
        let params = {
          cartKey: this.props.cartKey,
          data: {
            cart_item_key: cartData[findIndex].key,
            quantity: _products[indexProduct].numberOfProduct + 1
          }
        }
        let res = await Services.Cart.updateQuantity(params);
        if (res && res.success) {
          let resCart = await Services.Cart.getCart({cartKey: this.props.cartKey});
          if (resCart && resCart.items) {
            resCart.items = Object.keys(resCart.items).map((key) => resCart.items[key]);
            this.props.cartActions.addItemCartWebview(resCart);
          }
        } else {
          return Helpers.showToastDuration(
            {},
            Languages[this.props.language].update_quantity_failed,
            'danger',
            'top',
          );
        }
      }
    }
    _products[indexProduct].numberOfProduct += 1;
    this.props.cartActions.updateCart(_products);
    Helpers.setDataStorage(Keys.AS_DATA_CART, JSON.stringify(_products));
    this._prepareProducts();
  };

  _onPressProduct = async indexProduct => {
    this.setState({ _loadingProductDetail: true });
    let { _products } = this.state;
    let res = await Services.Service.product({ id: _products[indexProduct].id });
    if (res && !res.code) {
      /** Check product seen */
      let tmp = await Helpers.getDataStorage(Keys.KEY_HOME_VIEWED_PRODUCT);
      if (tmp && tmp.length > 0) {
        let find = tmp.find(f => f.id === res.id);
        if (!find) {
          tmp.push(res);
        }
      } else {
        tmp = [];
        tmp.push(res);
      }
      Helpers.setDataStorage(Keys.KEY_HOME_VIEWED_PRODUCT, tmp);
      /** Navigate to product detail page */
      this.setState({ _loadingProductDetail: false });
      this.props.navigation.navigate('ProductDetail', {
        product: res,
      });
    }
  };

  _onPressBack = () => {
    if (
      this.props.route.params &&
      this.props.route.params.hasOwnProperty('onRefresh')
    ) {
      this.props.route.params.onRefresh();
    }
    if (this.state._couponCode !== "") {
      this._onPressClear();
    }

    if (Configs.isPaymentWebview && this.props.coupons.length > 0) {
      for (let std of this.props.coupons) {
        let params = {
          cartKey: this.props.cartKey,
          data: {
            coupon_code: std
          }
        }
        Services.Cart.addCoupon(params);
      }
    }
    this.props.navigation.goBack();
  };

  /* LIFE CYCLE */
  componentDidMount() {
    if (this.state._products.length > 0) {
      this._checkProducts();
    } else {
      this.setState({ _loadingCheckProducts: false });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state._loadingNextPage) {
      if (this.props.setting.payment && this.props.setting.payment.length > 0) {
        this.setState({ _loadingNextPage: false });

        /** Go to check out
         * + If enabled guest checkout, allow to check out without login
         * + If disabled guest checkout, go to login
         */
        let { user, setting } = this.props;
        if (user || (!user && setting.account && setting.account.value === "yes")) {
          this.props.navigation.navigate('BookPickDay', {
            data: {
              service: this.state._products,
              totalPrice: this.state._totalPrice,
              discountPrice: this.state._discountPrice,
              discountCode: this.state._couponCode.toLowerCase(),
              provisionalPrice: this.state._provisionalPrice,
            },
          });
        } else this.props.navigation.navigate('SignIn');
      }
    }
  }

  /* RENDER */
  render() {
    return (
      <>
        <ViewCart
          state={this.state}
          props={this.props}
          data={{
            totalProducts: this._totalProducts,
          }}
          onFunction={{
            onPressBack: this._onPressBack,
            onPressOrder: this._onPressOrder,
            onChangeText: this._onChangeText,
            onPressApply: this._onPressApply,
            onPressClear: this._onPressClear,
            onPressRemoveProduct: this._onPressRemoveProduct,
            onPressMinusAmount: this._onPressMinusAmount,
            onPressPlusAmount: this._onPressPlusAmount,
            onPressProduct: this._onPressProduct,
          }}
        />

        <Modal
          visible={this.state._loadingProductDetail}
          transparent
          statusBarTranslucent
          onRequestClose={() => { }}>
          <View style={styles.con_modal}>
            <CLoading color={Colors.WHITE_COLOR} />
          </View>
        </Modal>
      </>
    );
  }
}

const mapStateToProps = state => {
  return {
    cart: state.cart.carts,
    language: state.language.language,
    user: state.user.data,
    setting: state.setting,
    cartKey: state.cart.cartKey,
    cartData: state.cart.cartData.items,
    coupons: state.cart.cartData.coupons
  };
};

const mapDispatchToProps = dispatch => {
  return {
    cartActions: bindActionCreators(cartActions, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Cart);
