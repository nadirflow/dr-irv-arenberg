/**
 ** Name: 
 ** Author: 
 ** CreateAt: 
 ** Description: 
**/
/* LIBRARY */
import React from 'react';
import { connect } from 'react-redux';
/* COMPONENTS */
import { ViewViewedProducts } from './render';
/** COMMON */
import { Keys } from '~/config';
import Helpers from '~/utils/helpers';

class ViewedProducts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      _loading: true,
      _loadingCart: false,
      _cart: props.cart
    }
    this._viewedProducts = [];
  }

  /* FUNCTIONS */
  _getDataFromStorage = async () => {
    let tmp = await Helpers.getDataStorage(Keys.KEY_HOME_VIEWED_PRODUCT);
    if (tmp && tmp.length > 0) this._viewedProducts = tmp;
    this.setState({ _loading: false });
  }

  _onAddOrUpdate = async (product, variationSelected) => {
    if (Configs.isPaymentWebview) {
      let item = Helpers.prepareItemCart(product.id, variationSelected ? variationSelected.id : 0, variationSelected);
      let params = {
        cartKey: this.props.cartKey,
        data: item
      }
      let res = await Services.Cart.addToCart(params);
      if (res && res.cart_key) {
        if (!this.props.cartKey) {
            this.props.cartActions.updateCartKey(res.cart_key)
        }
        // let resCart = await Services.Cart.getCart({cartKey: res.cart_key});
        // if (resCart && resCart.items) {
        //     resCart.items = Object.keys(resCart.items).map((key) => resCart.items[key]);
        //     this.props.cartActions.addItemCartWebview(resCart);
        // }
      }
    }
    let originPrice = 0, salePrice = 0;
    if (product.on_sale && product.sale_price !== "") {
      originPrice = Number(product.regular_price);
    } else {
      originPrice = Number(product.price);
    }

    if (product.on_sale && product.sale_price !== "") {
      salePrice = Number(product.sale_price);
    }

    let newProductToCart = {
      id: product.id,
      name: product.name,
      short_description: product.short_description,
      description: product.description,
      images: product.images ? product.images : Assets.image_failed,
      categories: product.categories,
      average_rating: product.average_rating,
      rating_count: product.rating_count,
      related_ids: product.related_ids,
      sku: product.sku,
      price: Number(product.price),
      originPrice,
      salePrice,
      variation: variationSelected ? variationSelected : null,
      numberOfProduct: 1,
      sold_individually: product.sold_individually || false,
      shipping_class: product.shipping_class,
      shipping_class_id: product.shipping_class_id
    }

    this.props.cartActions.addItemCart(newProductToCart);

    let { cart } = this.props;
    /** Update data cart to async storage */
    Helpers.setDataStorage(Keys.AS_DATA_CART, JSON.stringify(cart));
    /**  */
    Helpers.showToastDuration({},
      `"${newProductToCart.name}" ` + (Languages[this.props.language].add_to_cart_success),
      "success"
    );
    this.setState({ _loadingCart: !this.state._loadingCart });
  }

  /** HANDLE FUNCTIONS */
  _onPressBack = () => {
    this.props.navigation.goBack();
  }

  _onPressCart = () => {
    this.props.navigation.navigate("Cart");
  }

  _onPressProductItem = async (product) => {
    /** Check product seen */
    let tmp = await Helpers.getDataStorage(Keys.KEY_HOME_VIEWED_PRODUCT);
    if (tmp && tmp.length > 0) {
      let find = tmp.find(f => f.id === product.id);
      if (!find) {
        tmp.push(product);
      }
    } else {
      tmp = [];
      tmp.push(product);
    }
    Helpers.setDataStorage(Keys.KEY_HOME_VIEWED_PRODUCT, tmp);
    /** Navigate to product detail page */
    this.props.navigation.navigate("ProductDetail", {
      product
    });
  }

  _onPressAddCart = (data, variationSelected) => {
    this._onAddOrUpdate(data, variationSelected);
  }

  /* LIFE CYCLE */
  componentDidMount() {
    this._getDataFromStorage();
  }

  /* RENDER */
  render() {
    return (
      <ViewViewedProducts
        state={this.state}
        data={{
          viewedProducts: this._viewedProducts
        }}
        onFunction={{
          onPressProductItem: this._onPressProductItem,
          onPressAddCart: this._onPressAddCart,
          onPressBack: this._onPressBack,
          onPressCart: this._onPressCart
        }}
      />
    )
  }
}

const mapStateToProps = state => {
  return {
    cart: state.cart.carts,
    cartKey: state.cart.cartKey
  }
}

export default connect(mapStateToProps, null)(ViewedProducts);