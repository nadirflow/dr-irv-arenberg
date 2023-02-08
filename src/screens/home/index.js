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
import { Drawer } from 'native-base';
import { Alert, Linking, StyleSheet, Dimensions, View, Text, Platform } from 'react-native';
import Rate, { AndroidMarket } from 'react-native-rate';
import moment from 'moment';
import VersionCheck from 'react-native-version-check';
/* COMPONENTS */
import { ViewHome } from './render';
import CDrawer from '~/components/CDrawer';
import Carousel, {ParallaxImage} from 'react-native-snap-carousel';
/** COMMON */
import { Keys, Assets, Configs, Languages, Devices } from '~/config';
import Services from '~/services';
import Helpers from '~/utils/helpers';
import { Colors } from '~/utils/colors';
/** REDUX */
import * as userActions from '~/redux/actions/user';
import * as cartActions from '~/redux/actions/cart';
import * as settingActions from '~/redux/actions/setting';
/* STYLES */
import styles from './style';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      _loading: true,
      _loadingCart: false,
      _refreshing: false,
      _rating: false,
      _isNeedUpdate: false,
      _currSlick: 0,
      _about_author: 1,
      _details: null,
      entries:[]
    }
    this._pageStickyPosts = 1;
    this._pageFeaturedPosts = 1;
    this._pageCoupons = 1;
    this._pageLatestServices = 1;
    this._pageLatestPosts = 1;
    this._pageCategories = 1;
    this._logo = Assets.full_logo_horizontal;
    this._appName = "";
    this._drawer = null;
    this._settingOrder = [];
    if ( props.setting.app.general ) {
      if ( props.setting.app.general.app_logo.sizes && props.setting.app.general.app_logo.sizes.medium ) { 
        this._logo = { uri: props.setting.app.general.app_logo.sizes.medium };
      }
    }
    const { width: screenWidth } = Dimensions.get('window');
    this.screenWidth = screenWidth;
  }

  /* FUNCTIONS */
  _onCheckSettingHome = async (isRefreshing) => {
    let { setting } = this.props, find = false, i;
    /** Get data user and cart of user in async storage */
    this._onCheckUserCartStorage();

    /** Default */
    this._settingOrder = [];

    /** Get data home from setting on server */
    
    if (setting.home && setting.home.length > 0) {
      for (i = 0; i < setting.home.length; i++) {
        find = false;

        /** BANNERS */
        if (!find && setting.home[i].acf_fc_layout === Keys.KEY_HOME_BANNERS) {
          let tmp = setting.home[i];
          tmp.order = setting.home[i].order;
          tmp.data = setting.home[i].list_banners;
          this._settingOrder.push(tmp);
          find = true;
        }

        /** CATEGORIES PRODUCTS */
        if (!find && setting.home[i].acf_fc_layout === Keys.KEY_HOME_CATEGORIES) {
          let tmp = setting.home[i];
          tmp.order = setting.home[i].order;
          tmp.data = this._onFetchCategories();
          this._settingOrder.push(tmp);
          find = true;
        }

        /** FEATURED PRODUCTS */
        if (!find && setting.home[i].acf_fc_layout === Keys.KEY_HOME_FEATURED_PRODUCT) {
          let tmp = setting.home[i];
          tmp.order = setting.home[i].order;
          tmp.data = setting.home[i].data;
          this._settingOrder.push(tmp);
          find = true;
        }

        /** LATEST PRODUCT */
        if (!find && setting.home[i].acf_fc_layout === Keys.KEY_HOME_LATEST_PRODUCT) {
          let tmp = setting.home[i];
          tmp.order = setting.home[i].order;
          tmp.data = setting.home[i].data;
          this._settingOrder.push(tmp);
          find = true;
        }

        /** FEATURED POSTS */
        if (!find && setting.home[i].acf_fc_layout === Keys.KEY_HOME_FEATURED_POSTS) {
          let tmp = setting.home[i];
          tmp.order = setting.home[i].order;
          tmp.data = setting.home[i].zs_featured_posts;
          this._settingOrder.push(tmp);
          find = true;
        }

        /** LATEST POSTS */
        if (!find && setting.home[i].acf_fc_layout === Keys.KEY_HOME_LATEST_POSTS) {
          let tmp = setting.home[i];
          tmp.order = setting.home[i].order;
          tmp.data = await this._onFetchLatestPosts(
            setting.home[i].num_of_post,
            isRefreshing
          );
          this._settingOrder.push(tmp);
          find = true;
        }

        /** COUPONS */
        if (!find && setting.home[i].acf_fc_layout === Keys.KEY_HOME_COUPONS) {
          let tmp = setting.home[i];
          tmp.order = setting.home[i].order;
          tmp.data = await this._onFetchCoupons(
            setting.home[i].num_of_coupon,
            isRefreshing
          );
          this._settingOrder.push(tmp);
          find = true;
        }
      }

      let tmp = {}
      tmp.data = [];
      tmp.acf_fc_layout = Keys.KEY_HOME_VENDORS;
      let vendors = await this._onFetchVendors();
      if (vendors && vendors.length > 0) {
        tmp.data = vendors;
      }

      this._settingOrder.push(tmp);
    }

    /** Get data seen products and show us */
    /** SEEN PRODUCT */
    let tmp1 = await Helpers.getDataStorage(Keys.KEY_HOME_VIEWED_PRODUCT);
    if (tmp1 && tmp1.length > 0) {
      if (tmp1.length > 4) tmp1 = tmp1.slice(0, 4);
      let tmp2 = { acf_fc_layout: Keys.KEY_HOME_VIEWED_PRODUCT };
      tmp2.order = 2;
      tmp2.data = tmp1;
      this._settingOrder.splice(1, 0, tmp2);
    }

    /** Sort by order */
    if (this._settingOrder.length > 0) {
      this._settingOrder = this._settingOrder.sort((a, b) => a.order - b.order);
    }

    //if (!isRefreshing) this._getSettingCheckOut();
    /** Done -> Go show */
    this.setState({
      _loading: false,
      _refreshing: false
    });

  }

  _onCheckUserCartStorage = async () => {
    let asUser = await Helpers.getDataStorage(Keys.AS_DATA_USER);
    if (asUser && asUser !== "") {
      asUser = JSON.parse(asUser);
      /** Update data to redux user */
      this.props.userActions.updateUser(asUser);
      /** Update cart to redux cart */
      let asCart = await Helpers.getDataStorage(Keys.AS_DATA_CART);
      if (asCart && asCart !== "") {
        asCart = JSON.parse(asCart);
        this.props.cartActions.updateCart(asCart);
      }
      if (Configs.isPaymentWebview) {
        let asCartKey = await Helpers.getDataStorage(Keys.AS_DATA_CART_KEY);
        if (asCartKey && asCartKey !== "") {
          asCartKey = JSON.parse(asCartKey);
          this.props.cartActions.updateCartKey(asCartKey.key);
        }
      }
    }
  }

  _onFetchLatestPosts = async (numberItem, isRefreshing) => {
    if (isRefreshing) {
      let tmp = [], res = null;
      let params = {
        page: this._pageLatestPosts,
        per_page: Number(numberItem)
      }
      res = await Services.News.list(params);
      if (res) {
        if (res.code) {
          // Do nothing
        } else {
          if (res.length > 0) {
            tmp = res;
            Helpers.setDataStorage(Keys.AS_DATA_HOME_LATEST_POSTS, tmp);
          }
        }
      }
      return tmp;
    } else {
      let dataStorage = await Helpers.getDataStorage(Keys.AS_DATA_HOME_LATEST_POSTS);
      if (!dataStorage || dataStorage === "") {
        this._onFetchLatestPosts(numberItem, true);
      } else {
        return dataStorage;
      }
    }
  }

  _onFetchCoupons = async (numberItem, isRefreshing) => {
    if (isRefreshing) {
      let tmp = [], tmpNewList = [], res = null;
      let params = {
        page: this._pageCoupons,
        per_page: Number(numberItem)
      }
      res = await Services.Coupon.list(params);
      if (res) {
        if (res.code) {
          // Do nothing
        } else {
          if (res.length > 0) {
            tmp = res;
            for (let coupon of tmp) {
              let tmp = moment().diff(moment(coupon.date_expires, "YYYY-MM-DDTHH:mmss").valueOf(), "days");
              if (tmp <= 0) {
                tmpNewList.push(coupon);
              }
            }
            Helpers.setDataStorage(Keys.AS_DATA_HOME_LATEST_COUPONS, tmpNewList);
          }
        }
      }
      return tmpNewList;
    } else {
      let dataStorage = await Helpers.getDataStorage(Keys.AS_DATA_HOME_LATEST_COUPONS);
      if (!dataStorage || dataStorage === "") {
        this._onFetchCoupons(numberItem, true);
      } else {
        return dataStorage;
      }
    }
  }

  _onFetchCategories = () => {
    if (this.props.category.categoriesProduct.length > 0) {
      return this.props.category.categoriesProduct;
    } else return [];
  }

  _onFetchVendors = async () => {
    let res = await Services.Vendor.listStore();
    if (res && !res.code) {
      if (res.length > 0) {
        return res;
      } else return [];
    } else return [];
  }

  /** HANDLE FUNCTIONS */
  _onPressStickyPost = (data) => {
    if (data.url !== "") {
      this.props.navigation.navigate("HomeDetail", { data });
    }
  }

  _onPressCoupon = (data) => {
    this.props.navigation.navigate('CouponsDetail', { data });
  }

  _onPressCart = () => {
    this.props.navigation.navigate("Cart");
  }

  _onFocusSearch = () => {
    this.props.navigation.navigate("Search");
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

  _onPressCategory = (item) => {
    this.props.navigation.navigate("Product", {
      id: item.id,
      name: item.name
    })
  }

  _onPressSeeAllCate = () => {
    this.props.navigation.navigate("Category");
  }

  _onPressSeeAllVendors = () => {
    this.props.navigation.navigate("Vendors");
  }

  _onPressSeeAllViewedProducts = () => {
    this.props.navigation.navigate("ViewedProducts");
  }

  _onRefresh = () => {
    this.setState({ _refreshing: true }, () => {
      this._onCheckSettingHome(true);
    });
  }

  _onPressListCoupon = () => {
    this.props.navigation.navigate("Coupon")
  }

  _closeDrawer = () => {
    this._drawer && this._drawer._root.close()
  }

  _openDrawer = () => {
    console.log('onOpenDrawer');
    this._drawer && this._drawer._root.open()
  }

  _onPressNewsItem = (data) => {
    this.props.navigation.navigate('NewsDetail', {
      data
    })
  }

  _onToggleModalRating = () => {
    this.setState({
      _rating: !this.state._rating,
      _star: 0
    })
  }

  _onPressStartRating = async () => {
    this._onToggleModalRating();
    let options = {
      AppleAppID: Configs.ratingAppleAppID,
      GooglePackageName: Configs.ratingGooglePackageName,
      preferredAndroidMarket: AndroidMarket.Google,
      preferInApp: true,
      openAppStoreIfInAppFails: true,
      inAppDelay: 1.0
    };
    Rate.rate(options, async success => {
      if (success) Helpers.setDataStorage(Keys.AS_APP_RATING, 'true');
    });

  }

  _onCheckRatingApp = async () => {
    let _isAlreadyRate = await Helpers.getDataStorage(Keys.AS_APP_RATING);
    if (_isAlreadyRate && _isAlreadyRate !== "") {
      _isAlreadyRate = JSON.parse(_isAlreadyRate);
      if (!_isAlreadyRate) {
        let _numberShowRate = await Helpers.getDataStorage(Keys.AS_NUMBER_TO_RATING);
        if (_numberShowRate && _numberShowRate !== "") {
          _numberShowRate = JSON.parse(_numberShowRate);
          if (Number(_numberShowRate) >= 10) {
            Helpers.setDataStorage(Keys.AS_NUMBER_TO_RATING, '1');
            this._onToggleModalRating();
          } else {
            _numberShowRate = Number(_numberShowRate);
            _numberShowRate += 1;
            Helpers.setDataStorage(Keys.AS_NUMBER_TO_RATING, JSON.stringify(_numberShowRate));
          }
        }
      }
    } else {
      Helpers.setDataStorage(Keys.AS_APP_RATING, 'false');
      Helpers.setDataStorage(Keys.AS_NUMBER_TO_RATING, '1');
    }
  }

  _onPressAddCart = (data, variationSelected) => {
    this._onAddOrUpdate(data, variationSelected);
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
  }

  _getSettingCheckOut = async () => {
    let res = null,
      tmpRes = null,
      resCountry = null,
      settingPayment = null,
      settingShippingZones = null,
      settingDataCountry = null,
      countries = [];

    /** Get all country for woo */
    resCountry = await Services.DataShipping.listCountries();
    if (resCountry && !resCountry.code && resCountry.length > 0)
      countries = resCountry;

    /** Get shipping zones for woo */
    res = await Services.Setting.getShippingZones();
    if (res && !res.code) {
      if (res.length > 0) {
        for (let i = 1; i < res.length; i++) {
          let tmpRes = await Services.Setting.getShippingMethods({
            id: res[i].id,
          });
          if (tmpRes && !tmpRes.code) res[i].methods = tmpRes;
        }
      }

      Helpers.setDataStorage(Keys.AS_DATA_SETTING_SHIPPING_ZONES, res);
      settingShippingZones = res;
      tmpRes = res;
    } else {
      res = await Helpers.getDataStorage(Keys.AS_DATA_SETTING_SHIPPING_ZONES);
      if (res && res !== '') {
        res = JSON.parse(res);
        settingShippingZones = res;
        tmpRes = res;
      }
    }
    if (tmpRes) {
      for (let e of tmpRes) {
        let tmp = await Services.Setting.getCountryFromZone({ id: e.id });
        if (tmp && !tmp.code && tmp.length > 0) {
          let filterCountry = tmp.filter(f => f.type === 'country');
          e.countries = filterCountry;
        }
      }
    }

    if (this.props.setting) {
      /** Find ship to countries */
      find = this.props.setting.setting.find(
        f => f.id === 'woocommerce_ship_to_countries',
      );
      if (find) {
        switch (find.value) {
          case 'all': // Ship to all countries
            settingDataCountry = countries;
            break;

          case 'specific': // Ship to specific countries only
            let specificFind = this.props.setting.setting.find(
              f => f.id === 'woocommerce_specific_ship_to_countries',
            );
            if (specificFind && specificFind.value.length > 0) {
              countries = countries.filter(item => {
                return specificFind.value.includes(item.code);
              });
            }
            settingDataCountry = countries;
            break;

          case 'disabled': // Disable shipping & shipping calculations
            break;

          default:
            // Ship to all countries you sell to
            let defaultFind = this.props.setting.setting.find(
              f => f.id === 'woocommerce_specific_allowed_countries',
            );
            if (defaultFind && defaultFind.value.length > 0) {
              countries = countries.filter(item => {
                return defaultFind.value.includes(item.code);
              });
            }
            settingDataCountry = countries;
            break;
        }
      }
    } else {
      /** Get data countries shipping of woocommerce */
      res = await Services.DataShipping.listCountries();
      if (res && !res.code && res.length > 0) {
        settingDataCountry = res;
      }
    }

    /** Get settings for payments */
    res = await Services.Setting.getPayment();
    if (res && !res.code) {
      let tmpPayment = [];
      for (let std of res) {
        if (std.enabled === true) {
          tmpPayment.push(std);
        }
      }
      Helpers.setDataStorage(Keys.AS_DATA_SETTING_PAYMENT, tmpPayment);
      settingPayment = tmpPayment;
      let find = tmpPayment.find(f => f.id === Configs.payFastMethod);
      if (find) {
        Configs.payFastMerchantId = parseInt(find.settings.merchant_id.value);
        Configs.payFastMerchantKey = find.settings.merchant_key.value;
      }
    } else {
      res = await Helpers.getDataStorage(Keys.AS_DATA_SETTING_ViewHome);
      if (res && res !== '') {
        res = JSON.parse(res);
        let tmpPayment = [];
        for (let std of res) {
          if (std.enabled === true) {
            tmpPayment.push(std);
          }
        }
        settingPayment = tmpPayment;
        /** PAYFAST SETTING */
        let find = settingPayment.find(f => f.id === Configs.payFastMethod);
        if (find) {
          Configs.payFastMerchantId = parseInt(find.settings.merchant_id.value);
          Configs.payFastMerchantKey = find.settings.merchant_key.value;
        }

        /** MERCADO PAGO SETTING */
        let findMercado = settingPayment.find(
          f => f.id === Configs.mercadoPagoMethod,
        );
        if (findMercado) {
          Configs.mercadoAccessToken =
            findMercado.settings._mp_access_token_test.default;
          Configs.mercadoPublicKey =
            findMercado.settings._mp_public_key_test.default;
        }
      }
    }

    let allSetting = {
      settingPayment,
      settingShippingZones,
      settingDataCountry,
    };
    this.props.settingActions.updateCheckoutSetting(allSetting);
  };

  _onCheckForUpdate = async () => {
    VersionCheck.needUpdate()
      .then(resUpdate => {
        if (resUpdate && resUpdate.isNeeded) {
          this.setState({ _isNeedUpdate: true });
          Alert.alert(
            Languages[this.props.language].update_software,
            this._appName + Languages[this.props.language].txt_update_software,
            [
              {
                text: Languages[this.props.language].cancel,
                style: "cancel"
              },
              { text: Languages[this.props.language].ok, onPress: () => Linking.openURL(resUpdate.storeUrl) }
            ],
            { cancelable: false }
          );
        }
      })
  }

  _onPressVendor = (item) => {
    this.props.navigation.navigate("VendorDetail", {
      vendorData: item
    })
  }
  _onPressAbout = e => {
    this.setState({
      _about_author: 2,
    })
  }
  /* LIFE CYCLE */
  componentDidMount() {
    /** Check setting general show/hide rating app */
    if (Configs.showRatingApp) this._onCheckRatingApp();

    /** Check for data home */
    this._onCheckSettingHome();

    /** Check for Update */
    this._onCheckForUpdate();
      this.props.navigation.addListener('tabPress', () => {
        this._toggleAboutAuthor();
      });
      this._unsubscribe = this.props.navigation.addListener('focus', () => {
        this.setState({ _loadingCart: !this.state._loadingCart });
      });
    }
  
  componentWillUnmount() {
    this._unsubscribe();
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.setting && nextProps.setting && (nextState._about_author == this.state._about_author) && (nextState._details && this.state._details &&  nextState._details.name == this.state._details.name)) {
      if ((nextProps.setting.home.length === this.props.setting.home.length) &&
        this.props.cart.length === nextProps.cart.length &&
        nextState._loading === this.state._loading &&
        nextState._loadingCart === this.state._loadingCart
      ) {
        return false;
      }
    }

    return true;
  }
  _toggleAboutAuthor = () => {
    this.setState({
      _about_author : 1
    })
  }
  _onPressLogoBack = () => {
    console.log('_onPressLogoBack');
    this.setState({
      _about_author : 1
    })
  }
  _onPressOverview = () => {
    this.setState({
      _about_author : 3
    })
  }
  _onPressVideos  = () => {
    this.setState({
      _about_author : 4
    })
  }
  _updateDetails = (detail) => {
    
  }
  _onUpdateEntries = (entry) => {
    console.log(entry);
    this.setState({
      entries : entry
    }, () => {
      this.setState({
        _details : entry[1] ? entry[1] : (entry[0] ? entry[0] : null)
      })
    })
  }
  _snapItem = (index) => {
    this.setState({
      _details : this.state.entries[index]
    })
  }
  _onBeforeSnapToItem = (item) => {
  }
  _renderItem = ({item, index}, parallaxProps) => {
    return (
        <View style={{width: Devices.sW('48%'), height: Devices.sH('27%')}}>
            <ParallaxImage
                source={{ uri: item.images[0].src }}
                containerStyle={[styles.snap_imageContainer]}
                style={styles.snap_image}
                parallaxFactor={0.4}
                {...parallaxProps}
            />
            <Text style={styles.snap_title} numberOfLines={2}>
                { item.name }
            </Text>
        </View>
    );
  }
  mainArea =  () => {
    return (<Carousel 
      style={[styles.snap_courselContainer]}
      data={this.state.entries}
      renderItem={this._renderItem}
      sliderWidth={this.screenWidth}
      itemWidth={this.screenWidth - 160}
      hasParallaxImages={true}
      loop={true}
      containerCustomStyle={{ flex: 1 }}
      slideStyle={{ flex: 1 }}
      onSnapToItem={this._snapItem}
      removeClippedSubviews={false}
      
    />)
  }
        
  /* RENDER */
  render() {

    return (
      <Drawer
        ref={ref => this._drawer = ref}
        side={Configs.supportRTL ? "right" : "left"}
        content={<CDrawer navigation={this.props.navigation} />}
        onClose={this._closeDrawer}> 
        <ViewHome 
        
          mainArea={this.mainArea}
          toggleAboutAuthor={this._toggleAboutAuthor}
          state={this.state}
          props={this.props} 
          settings={{
            order: this._settingOrder,
            // vendor: this._dataVendor,
            logo: this._logo,
            appName: this._appName
          }}
          onFunction={{
            onPressCart: this._onPressCart,
            onPressCoupon: this._onPressCoupon,
            onPressStickyPost: this._onPressStickyPost,
            onFocusSearch: this._onFocusSearch,
            onPressServiceItem: this._onPressProductItem,
            onPressCategory: this._onPressCategory,
            onPressSeeAllCate: this._onPressSeeAllCate,
            onPressSeeAllVendors: this._onPressSeeAllVendors,
            onPressSeeAllViewedProducts: this._onPressSeeAllViewedProducts,
            onRefresh: this._onRefresh,
            onPressListCoupon: this._onPressListCoupon,
            onPressNewsItem: this._onPressNewsItem,
            onOpenDrawer: this._openDrawer,
            onToggleModalRating: this._onToggleModalRating,
            onPressStartRating: this._onPressStartRating,
            onPressAddCart: this._onPressAddCart,
            onPressVendor: this._onPressVendor,
            onPressAbout: this._onPressAbout,
            onPressVideos: this._onPressVideos,
            onPressOverview: this._onPressOverview,
            onUpdateDetails: this._updateDetails,
            onUpdateEntries: this._onUpdateEntries,
            onPressLogoBack: this._onPressLogoBack
          }}
        />
      </Drawer>
    )
  }
 
}


const mapStateToProps = (state) => {
  return {
    cart: state.cart.carts,
    setting: state.setting,
    category: state.category,
    language: state.language.language,
    cartKey: state.cart.cartKey
  }
}

const mapDispatchToProps = dispatch => {
  return {
    userActions: bindActionCreators(userActions, dispatch),
    cartActions: bindActionCreators(cartActions, dispatch),
    settingActions: bindActionCreators(settingActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
