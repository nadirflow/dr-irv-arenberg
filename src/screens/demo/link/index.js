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
import RNRestart from 'react-native-restart';
import { ActionSheet } from 'native-base';
/* COMPONENTS */
import { ViewLinkDemo } from './render';
/** COMMON */
import { Assets, Keys, Configs, Languages } from '~/config';
import { Colors } from '~/utils/colors';
import Helpers from '~/utils/helpers';
import Services from '~/services';
import WooCommerceAPI from '~/services/WooCommerceAPI';
import { WooCommerce } from '~/services/apiWoo';
import * as userActions from '~/redux/actions/user';
import * as cartActions from '~/redux/actions/cart';
import * as settingActions from '~/redux/actions/setting';
import * as languageActions from '~/redux/actions/language';
import * as categoryActions from '~/redux/actions/category';

var CANCEL_INDEX = 1;
var DESTRUCTIVE_INDEX = 0;

class LinkDemo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      _loading: false,
      _errorHostUrl: "",
      _errorConsumerKey: "",
      _errorConsumerSecret: "",
    }
    this._inputs = {};
  }

  /* FUNCTIONS */
  _onPressBack = () => {
    this.props.navigation.goBack();
  }

  _onFocusNextField = (id) => {
    this._inputs[id].wrappedInstance.focus();
  }

  _onPressLinkDemo = async () => {
    let { language } = this.props;
    let _isNotEmpty = this._validateFields("empty");
    if (_isNotEmpty) {
      WooCommerce.api = new WooCommerceAPI({
        url: this._inputs['hostUrl'].wrappedInstance._lastNativeText,
        consumerKey: this._inputs['consumerKey'].wrappedInstance._lastNativeText,
        consumerSecret: this._inputs['consumerSecret'].wrappedInstance._lastNativeText,
        wpAPI: true,
        version: Configs.versionApi,
        queryStringAuth: true,
        wpAPIPrefix: Configs.wpAPIPrefix
      });
      let res = await Services.Setting.getPayment();
      if (!res || res.code) {
        WooCommerce.api = new WooCommerceAPI({
          url: Configs.hostApi,
          consumerKey: Configs.cosumerKey,
          consumerSecret: Configs.consumerSecret,
          wpAPI: true,
          version: Configs.versionApi,
          queryStringAuth: true,
          wpAPIPrefix: Configs.wpAPIPrefix
        });
        return Helpers.showToastDuration({}, Languages[language].something_wrong, "danger");
      } else {
        this._onFetchData();
      }
    }
  }

  _validateFields = (type) => {
    if (type === "empty") {
      let { _errorHostUrl, _errorConsumerKey, _errorConsumerSecret } = this.state;
      _errorHostUrl = this._inputs['hostUrl'].wrappedInstance._lastNativeText === "" ? "host_url_not_empty" : "";
      _errorConsumerKey = this._inputs['consumerKey'].wrappedInstance._lastNativeText === "" ? "consumerkey_not_empty" : "";
      _errorConsumerSecret = this._inputs['consumerSecret'].wrappedInstance._lastNativeText === "" ? "consumersecret_not_empty" : "";
      this.setState({ _errorHostUrl, _errorConsumerKey, _errorConsumerSecret });
      return _errorHostUrl === "", _errorConsumerKey === "", _errorConsumerSecret === "";
    }
  }

  _onFetchData = () => {
    let { language } = this.props;
    ActionSheet.show(
      {
        options: [
          { text: Languages[language].ok, icon: "refresh", iconColor: Colors.PRIMARY_COLOR },
          { text: Languages[language].cancel, icon: "close", iconColor: Colors.RED_COLOR }
        ],
        cancelButtonIndex: CANCEL_INDEX,
        destructiveButtonIndex: DESTRUCTIVE_INDEX,
        title: Languages[language].title_message_change_demo + this._inputs['hostUrl'].wrappedInstance._lastNativeText + " demo?"
      },
      buttonIndex => {
        if (buttonIndex === DESTRUCTIVE_INDEX) {
          this._onSubmit({
            id: this._inputs['hostUrl'].wrappedInstance._lastNativeText,
            title: this._inputs['hostUrl'].wrappedInstance._lastNativeText,
            images: Assets.image_store_demo,
            hostUrl: this._inputs['hostUrl'].wrappedInstance._lastNativeText,
            cosumerKey: this._inputs['consumerKey'].wrappedInstance._lastNativeText,
            consumerSecret: this._inputs['consumerSecret'].wrappedInstance._lastNativeText
          });
        }
      }
    )
  }

  _onSubmit = async (item) => {
    this.setState({ _loading: true });
    Configs.hostApi = item.hostUrl;
    Configs.cosumerKey = item.cosumerKey;
    Configs.consumerSecret = item.consumerSecret;

    let asDemoCustom = await Helpers.getDataStorage(Keys.AS_DATA_DEMO_API_CUSTOM);
    if (asDemoCustom && asDemoCustom !== "") {
      asDemoCustom = JSON.parse(asDemoCustom);
      if (asDemoCustom.length > 0) {
        let find = asDemoCustom.findIndex(f => f.hostUrl === item.hostUrl);
        if (find !== -1) find = item;
      } else {
        asDemoCustom.push(item);
      }
    } else {
      asDemoCustom = [];
      asDemoCustom.push(item);
    }
    await Helpers.setDataStorage(Keys.AS_DATA_DEMO_API_CUSTOM, JSON.stringify(asDemoCustom));
    await Helpers.setDataStorage(Keys.AS_DATA_DEMO_API_CHOOSE, JSON.stringify(item));
    await Helpers.removeMultiKeyStorage([
      Keys.AS_DATA_CART, Keys.AS_DATA_HISTORY_SEARCH, Keys.AS_APP_INTRO, Keys.AS_APP_RATING,
      Keys.AS_NUMBER_TO_RATING, Keys.AS_DATA_SETTING_HOME, Keys.AS_DATA_SETTING_PAYMENT, Keys.AS_DATA_SETTING_WOO,
      Keys.AS_DATA_SETTING_APP, Keys.AS_DATA_LANGUAGE, Keys.AS_DATA_JWT, Keys.AS_DATA_USER,
      Keys.AS_DATA_SETTING_ALLOW_GUEST_CHECKOUT, Keys.AS_DATA_HOME_FEATURE_PRODUCTS,
      Keys.AS_DATA_HOME_LATEST_PRODUCTS, Keys.AS_DATA_HOME_LATEST_POSTS,
      Keys.AS_DATA_HOME_LATEST_COUPONS
    ]);

    this.props.userActions.removeUser();
    this.props.cartActions.removeAllCart();
    // this.props.settingActions.removeAllSetting();
    this.props.categoryActions.removeAllCategory();
    this.props.languageActions.setDefault();

    this.setState({ _loading: false });
    RNRestart.Restart();
  }

  /* LIFE CYCLE */

  /* RENDER */
  render() {
    return (
      <ViewLinkDemo
        state={this.state}
        props={this.props}
        inputs={this._inputs}
        onFunction={{
          onPressBack: this._onPressBack,
          onFocusNextField: this._onFocusNextField,
          onPressLinkDemo: this._onPressLinkDemo
        }}
      />
    )
  }

}

const mapStateToProps = state => {
  return {
    language: state.language.language
  }
}

const mapDispatchToProps = dispatch => {
  return {
    userActions: bindActionCreators(userActions, dispatch),
    cartActions: bindActionCreators(cartActions, dispatch),
    settingActions: bindActionCreators(settingActions, dispatch),
    languageActions: bindActionCreators(languageActions, dispatch),
    categoryActions: bindActionCreators(categoryActions, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LinkDemo);