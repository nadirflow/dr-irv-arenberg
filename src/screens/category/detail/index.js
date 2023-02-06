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
import { Animated } from 'react-native';
/* COMPONENTS */
import { ViewProduct } from './render';
/* COMMON */
import { Configs, Keys, Assets, Languages } from '~/config';
import Services from '~/services';
import Helpers from '~/utils/helpers';
/** REDUX */
import * as cartActions from '~/redux/actions/cart';

class Product extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      _loading: true,
      _loadingMore: false,
      _loadForList: true,
      _refreshing: false,
      _loadmore: true,
      _categoryId: props.route.params.id,
      _subCate: [],
      _products: [],
      _scrollY: new Animated.Value(0),
      _loadingCart: true,
    }
    this._page = 1;
    this._limit = 10;
  }

  /* FUNCTIONS */
  _onFetchData = async () => {
    let { setting } = this.props;
    if (setting.app && setting.app.woo_general.woo_categories_content_type === "sub_categories") {
      let { _subCate } = this.state;
      let paramsSubCategories = {
        parent: this.state._categoryId
      }

      let res = await Services.Service.listCategories(paramsSubCategories);
      if (res && !res.code && res.length > 0) {
        _subCate = res;
        /** Map sub categories */
      }
      this.setState({ _subCate });
    }

    let params = {
      page: this._page,
      category: this.state._categoryId,
      per_page: this._limit
    };
    this._getProductsByCategories(params, Keys.REFRESH);
  }

  _onPressBack = () => {
    this.props.navigation.goBack();
  }

  _getProductsByCategories = async (params, TYPE) => {
    let { _products } = this.state;
    let isLoadMore = true;
    let res = await Services.Service.listProducts(params);
    if (res && res.length > 0) {
      if (res.length < this._limit) {
        isLoadMore = false;
      } else {
        this._page += 1;
      }

      if (TYPE === Keys.REFRESH) {
        _products = [...res];
      } else if (TYPE == Keys.LOAD_MORE) {
        _products = [..._products, ...res];
      }
      /** Get variations of product */
      if (Configs.showVariationsProducts) {
        let i, resVariations;
        for (i = 0; i < _products.length; i++) {
          if (_products[i].variations.length > 0 && typeof _products[i].variations[0] !== 'object') {
            resVariations = await Services.Service.productsVariation({ id: _products[i].id });
            if (resVariations && !resVariations.code && resVariations.length > 0) {
              _products[i].variations = resVariations.sort(function (a, b) { return Number(a.price) - Number(b.price) });
            }
          }
        }
      }
    } else isLoadMore = false;
    this.setState({
      _products,
      _refreshing: false,
      _loadForList: false,
      _loadmore: isLoadMore,
      _loading: false,
      _loadingMore: false
    })
  }

  _onRefresh = () => {
    this.setState({ _refreshing: true, _loadmore: true })
    this._page = 1;
    let params = {
      page: this._page,
      category: this.state._categoryId,
      per_page: this._limit
    };
    this._getProductsByCategories(params, Keys.REFRESH);
  }

  _onLoadMore = () => {
    if (!this.state._refreshing && this.state._loadmore && !this.state._loadingMore) {
      this.setState({ _loadingMore: true });
      let params = {
        page: this._page,
        category: this.state._categoryId,
        per_page: this._limit
      };
      this._getProductsByCategories(params, Keys.LOAD_MORE);
    }
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

  _onPressCart = () => {
    this.props.navigation.navigate("Cart");
  }

  _onPressSubCate = (data) => {
    this.props.navigation.push("Product", {
      name: data.name,
      id: data.id
    })
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

  /* LIFE CYCLE */
  componentDidMount() {
    this._onFetchData();
    this.props.navigation.addListener('focus', () => {
      this.setState({ _loadingCart: !this.state._loadingCart })
    });
  }

  componentWillUnmount() {
    this.props.navigation.removeListener();
  }

  /* RENDER */
  render() {
    return (
      <ViewProduct
        state={this.state}
        props={this.props}
        onFunction={{
          onPressBack: this._onPressBack,
          onPressCart: this._onPressCart,
          onPressProductItem: this._onPressProductItem,
          onLoadMore: this._onLoadMore,
          onRefresh: this._onRefresh,
          onPressSubCate: this._onPressSubCate,
          onPressAddCart: this._onAddOrUpdate
        }}
      />
    )
  }

}

const mapStateToProps = (state) => {
  return {
    language: state.language.language,
    cart: state.cart.carts,
    setting: state.setting,
    cartKey: state.cart.cartKey
  }
}

const mapDispatchToProps = dispatch => {
  return {
    cartActions: bindActionCreators(cartActions, dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Product);
