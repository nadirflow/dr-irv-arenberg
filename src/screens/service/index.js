/**
 ** Name: 
 ** Author: 
 ** CreateAt: 
 ** Description: 
**/
/* LIBRARY */
import React from 'react';
import { connect } from 'react-redux';
import { View, FlatList, TouchableOpacity } from 'react-native';
import { bindActionCreators } from 'redux';
/* COMPONENTS */
import { ViewService } from './render';
import CText from '~/components/CText';
import CLoading from '~/components/CLoading';
import Column from '~/components/CLayout/Column';
import { SkypeIndicator } from "~/components/CIndicator";
/** COMMON */
import { Configs, Keys, Devices, Languages } from '~/config';
import { cStyles } from '~/utils/styles';
import Services from '~/services';
import { Colors } from '~/utils/colors';
import Helpers from '~/utils/helpers';
import { layoutWidth } from '~/utils/layout_width';
/** STYLES */
import styles from './style';
/** REDUX */
import * as cartActions from '~/redux/actions/cart';


class Service extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      _loading: true,
      _loadingCart: false,
      _loadForList: true,
      _refreshing: false,
      _loadmore: true,
      _cart: props.cart,
      index: 0,
      routes: [],
      // filter
      _modalVisible: false,
      _sortId: "latest",
    }
    this._tabbars = [];
    this._limit = 10;
    this._settings = props.setting;
    this._tmpRoutes = [];
  }
 
  /** FUNCTIONS */
  _onRefresh = (id) => {
    let { routes, index, } = this.state;
    routes[index].page = 1;
    let params = {
      page: 1,
      category: routes[index].id,
      per_page: this._limit
    };
    this.setState({ _refreshing: true, _loadmore: true },
      () => this._getProductsByCategories(params, Keys.REFRESH)
    )
  }

  _onLoadMore = (id) => {
    let { routes, index, } = this.state;
    if (this.state._loadmore) {
      let params = {
        page: routes[index].page,
        category: routes[index].id,
        per_page: this._limit
      };
      this._getProductsByCategories(params, Keys.LOAD_MORE);
    }
  }

  _onSort = (id, loadmore, route) => {
    let routes = route ? route : this.state.routes
    let i;
    if (id === "latest") {
      for (i = 0; i < routes.length; i++) {
        routes[i].products = routes[i].products.sort(function (a, b) { return Number(Date.parse(b.date_created)) - Number(Date.parse(a.date_created)) });
      }
    } else if (id === "desPrice") {
      for (i = 0; i < routes.length; i++) {
        routes[i].products = routes[i].products.sort(function (a, b) { return Number(b.price) - Number(a.price) });
      }
    } else if (id === "incPrice") {
      for (i = 0; i < routes.length; i++) {
        routes[i].products = routes[i].products.sort(function (a, b) { return Number(a.price) - Number(b.price) });
      }
    } else {
      for (i = 0; i < routes.length; i++) {
        routes[i].products = routes[i].products.sort(function (a, b) { return Number(Date.parse(b.date_created)) - Number(Date.parse(a.date_created)) });
      }
    }
    this.setState({
      routes,
      _refreshing: false,
      _loadForList: false,
      _loading: false,
      _loadmore: loadmore,
    })
  }

  _getListCategories = async () => {
    
    let { category } = this.props;
    if (category.categoriesProduct.length > 0) {
      let i, routes = [];
      routes = category.categoriesProduct;
      for (i = 0; i < category.categoriesProduct.length; i++) {
        routes[i].index = i + 1;
        routes[i].key = i + 1;
        routes[i].category = category.categoriesProduct[i].id;
        routes[i].products = [];
        routes[i].page = 1;
      }
      let params = {
        page: 1,
        category: category.categoriesProduct[0].id,
        per_page: this._limit
      };
      this._getProductsByCategories(params, Keys.REFRESH, routes);
    }
  }

  _getProductsByCategories = async (params, TYPE, routesTab) => {
    let { routes, index } = this.state;
    let loadmore = true;

    routesTab ? routes = routesTab : routes;

    let res = await Services.Service.listProducts(params);
    if (res && !res.code && res.length > 0) {
      if (res.length < this._limit) {
        loadmore = false;
      }
      routes[index].page += 1;

      if (TYPE === Keys.REFRESH) {
        routes[index].products = [...res];
      } else if (TYPE == Keys.LOAD_MORE) {
        routes[index].products = [...routes[index].products, ...res];
      }
    } else loadmore = false;
    this._tmpRoutes = routes;
    this._onSort(this.state._sortId, loadmore, routes);
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

  _onChangeTabIndex = (index) => {
    this.setState({ index });
  }

  /** HANDLE FUNCTIONS */
  _onPressTabbar = (route, index) => {
    if (route.products.length === 0) {
      this.setState({ index, _loadmore: true, _loadForList: true }, () => {
        let params = {
          page: route.page,
          category: route.id,
          per_page: this._limit
        };
        this._getProductsByCategories(params, Keys.REFRESH);
      });
    } else {
      this.setState({ index, _loadmore: !(route.products.length < this._limit) })
    }
  }

  _onPressServicesItem = async (product) => {
    /** Check product seen */
    let tmp = await Helpers.getDataStorage(Keys.KEY_HOME_VIEWED_PRODUCT);
    // console.log('--tmp--');
    // console.log(tmp);
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

  _onPressBack = () => {
    this.props.navigation.goBack();
  }

  _onPressCart = () => {
    this.props.navigation.navigate("Cart");
  }

  _onFocusSearch = () => {
    this.props.navigation.navigate("Search");
  }

  _onPressRefine = () => {
    this.props.navigation.navigate("Refine", {
      onBack: this._onPressSort,
      sortId: this.state._sortId
    })
  }

  _onPressSort = (id) => {
    this.setState({
      _sortId: id,
      _loadForList: true,
    }, () => {
      this._onSort(id)
    })
  }

  /* LIFE CYCLE */
  componentDidMount() {
    this._getListCategories();
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      this.setState({ _loadingCart: !this.state._loadingCart });
    });
  }

  componentWillUnmount() {
    this._unsubscribe();
  }

  /* RENDER */
  _onRenderScene = ({ route, jumpTo }) => {
    return (
      <>
        {!this.state._loadForList &&
          route.products.length > 0 ? (
            <Column
              data={route.products}
              render={{
                header: null,
                footer: this.state._loadmore ?
                  <View style={styles.con_footer_loading}>
                    <SkypeIndicator color={Colors.PRIMARY_COLOR} />
                  </View> : null,
                empty: null
              }}
              onFunction={{
                onPressItem: this._onPressServicesItem,
                onPressAddCart: this._onAddOrUpdate
              }}
              paging={{
                onRefresh: () => this._onRefresh(),
                onLoadMore: () => this._onLoadMore()
              }}
              isService
              cart={this.props.cart}
              refreshing={this.state._refreshing}
            />
          ) : (
            <View style={cStyles.full_center}>
              <CText style={cStyles.txt_no_data} i18nKey={'no_data'} />
            </View>
          )
        }

        <CLoading visible={this.state._loadForList} />
      </>
    )
  }

  _onRenderTabbar = (props) => {
    let { index } = this.state;
    let newRoutesTab = props.navigationState.routes;
    return (
      <View style={[styles.con_tabbar, { paddingHorizontal: Devices.pH(layoutWidth.width) }]}>
        <FlatList showsHorizontalScrollIndicator={false}
          data={newRoutesTab}
          renderItem={(props) => this._onRenderTabItem(props, index, newRoutesTab.length)}
          keyExtractor={(item, index) => index.toString()}
          horizontal
          inverted={Configs.supportRTL}
        />
      </View>
    );
  }

  _onRenderTabItem = (propsItem, indexActive, routesLength) => {
    return (
      <TouchableOpacity
        style={[styles.con_tabbar_item,
        propsItem.index === indexActive && [styles.con_tabbar_active_item, { backgroundColor: '#18504D', borderBottomWidth:0, }],
        propsItem.index === routesLength - 1 && styles.con_tabbar_last_item
        ]}
        onPress={() => this._onPressTabbar(propsItem.item, propsItem.index)}>
        <CText style={[styles.txt_tabbar, indexActive === propsItem.index && [cStyles.large, { fontFamily: Devices.zsBodySemiBold, color: '#fff' }]]}>
          {Configs.html5Entities.decode(propsItem.item.name)}
        </CText>
      </TouchableOpacity>
    );
  }

  _onRenderServicesEmpty = () => {
    return (
      <View style={cStyles.center}>
        <CText style={[cStyles.txt_no_data, { marginTop: 100 }]} i18nKey={'no_data'} />
      </View>
    )
  }

  _onRenderSeparatorItem = () => (<View style={styles.con_separator} />);

  render() {
    return (
      <ViewService
        state={this.state}
        props={this.props}
        settings={{
          ads: this._settings.app.ads
        }}
        onFunction={{
          onRenderServicesEmpty: this._onRenderServicesEmpty,
          onPressCart: this._onPressCart,
          onRenderScene: this._onRenderScene,
          onRenderTabbar: this._onRenderTabbar,
          onChangeTabIndex: this._onChangeTabIndex,
          onPressBack: this._onPressBack,
          onFocusSearch: this._onFocusSearch,
          onPressRefine: this._onPressRefine
        }}
      />
    )
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.language.language,
    cart: state.cart.carts,
    category: state.category,
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
)(Service);