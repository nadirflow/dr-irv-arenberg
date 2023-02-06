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
import { ViewDemo } from './render';
/** COMMON */
import { Keys, Configs, Languages } from '~/config';
import { Colors } from '~/utils/colors';
import { DemoApi } from '~/utils/demo';
import Helpers from '~/utils/helpers';
import * as userActions from '~/redux/actions/user';
import * as cartActions from '~/redux/actions/cart';
import * as settingActions from '~/redux/actions/setting';
import * as languageActions from '~/redux/actions/language';
import * as categoryActions from '~/redux/actions/category';

var CANCEL_INDEX = 1;
var DESTRUCTIVE_INDEX = 0;

class Demo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      _loading: false,
      _data: DemoApi,
      _activeId: 1,
    }
  }

  /* FUNCTIONS */
  _onPressBack = () => {
    this.props.navigation.goBack()
  }

  _onPressLink = () => {
    this.props.navigation.navigate("LinkDemo");
  }

  _onPressItem = (item) => {
    let { language } = this.props;
    ActionSheet.show(
      {
        options: [
          { text: Languages[language].ok, icon: "refresh", iconColor: Colors.PRIMARY_COLOR },
          { text: Languages[language].cancel, icon: "close", iconColor: Colors.RED_COLOR }
        ],
        cancelButtonIndex: CANCEL_INDEX,
        destructiveButtonIndex: DESTRUCTIVE_INDEX,
        title: Languages[language].title_message_change_demo + item.title + " demo?"
      },
      buttonIndex => {
        if (buttonIndex === DESTRUCTIVE_INDEX) this._onSubmit(item);
      }
    )
  }

  _onSubmit = async (item) => {
    this.setState({ _activeId: item.id, _loading: true });

    Configs.hostApi = item.hostUrl;
    Configs.cosumerKey = item.cosumerKey;
    Configs.consumerSecret = item.consumerSecret;

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
  async componentDidMount() {
    let { _data, _activeId } = this.state;
    let asDemoCustom = await Helpers.getDataStorage(Keys.AS_DATA_DEMO_API_CUSTOM);
    if (asDemoCustom && asDemoCustom !== "") {
      asDemoCustom = JSON.parse(asDemoCustom);
      if (asDemoCustom.length > 0) {
        _data = [..._data, ...asDemoCustom]
      }
    }

    let asApi = await Helpers.getDataStorage(Keys.AS_DATA_DEMO_API_CHOOSE);
    if (asApi && asApi !== "") {
      asApi = JSON.parse(asApi);
      _activeId = asApi.id;
    }

    this.setState({ _activeId, _data });
  }

  /* RENDER */
  render() {
    return (
      <ViewDemo
        state={this.state}
        props={this.props}
        onFunction={{
          onPressBack: this._onPressBack,
          onPressLink: this._onPressLink,
          onPressItem: this._onPressItem
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

export default connect(mapStateToProps, mapDispatchToProps)(Demo);