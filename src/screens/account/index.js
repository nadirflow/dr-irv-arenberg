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
import { Linking } from "react-native";
import { ActionSheet } from 'native-base';
/* COMPONENTS */
import { ViewAccount } from './render';
/** COMMON */
import { Colors } from '~/utils/colors';
import { Configs, Keys, Languages } from '~/config';
import Helpers from '~/utils/helpers';
/** REDUX */
import * as userActions from '~/redux/actions/user';
import * as cartActions from '~/redux/actions/cart';

const CANCEL_INDEX = 1;
const DESTRUCTIVE_INDEX = 0;

class Account extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      _loading: false,
      _loadingCart: false
    }
  }

  /* FUNCTIONS */
  _onPressProfile = (routeName) => {
    this.props.navigation.navigate(routeName, {
      user: this.props.user
    });
  }

  _onPressRow = (data) => {
    if (data.routeName === "Phone") {
      if (this.props.settingApp.general.contact !== "") {
        Linking.openURL('tel:' + this.props.settingApp.general.contact)
          .catch(error => console.log('Error link to facebook'))
      } else {
        Helpers.showToastDuration({}, "Error call", "error");
      }
    } else {
      this.props.navigation.navigate(data.routeName);
    }
  }

  _onPressSignOut = () => {
    let { language } = this.props;
    ActionSheet.show(
      {
        options: [
          { text: Languages[language].sign_out, icon: "refresh", iconColor: Colors.PRIMARY_COLOR },
          { text: Languages[language].cancel, icon: "close", iconColor: Colors.RED_COLOR }
        ],
        cancelButtonIndex: CANCEL_INDEX,
        destructiveButtonIndex: DESTRUCTIVE_INDEX,
        title: Languages[language].title_message_signout
      },
      buttonIndex => {
        if (buttonIndex === DESTRUCTIVE_INDEX) {
          this._onSignOut();
        }
      }
    )
  }

  _onSignOut = async () => {
    this.setState({ _loading: true });
    /** Update data to redux user */
    this.props.userActions.removeUser();
    this.props.cartActions.removeAllCart();
    /** Remove key data user in async storage */
    await Helpers.removeKeyStorage(Keys.AS_DATA_USER);
    await Helpers.removeKeyStorage(Keys.AS_DATA_CART);
    await Helpers.removeKeyStorage(Keys.AS_DATA_JWT);

    Helpers.resetNavigation(this.props.navigation, "RootTab");
    /** If done => Navigate to homepage */
    this.setState({ _loading: false });
  }

  _onPressCart = () => {
    this.props.navigation.navigate("Cart");
  }

  _onPressSocial = (social) => {
    let url = "";
    switch (social) {
      case Configs.SOCIALS.FACEBOOK.key:
        url = Configs.SOCIALS.FACEBOOK.url;
        break;

      default:
        url = "";
        break;
    }

    if (url !== "") {
      Linking.openURL('https:' + url).catch(error => console.log('Error link to facebook'))
    }
  }

  /** LIFE CYCLE */
  componentDidMount() {
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      this.setState({ _loadingCart: !this.state._loadingCart });
    });
  }

  componentWillUnmount() {
    this._unsubscribe();
  }

  /* RENDER */
  render() {
    return (
      <ViewAccount
        props={this.props}
        onFunction={{
          onPressCart: this._onPressCart,
          onPressProfile: this._onPressProfile,
          onPressRow: this._onPressRow,
          onPressSignOut: this._onPressSignOut,
          onPressSocial: this._onPressSocial
        }}
      />
    )
  }
}

const mapStateToProps = state => {
  return {
    user: state.user.data,
    language: state.language.language,
    cart: state.cart.carts,
    settingApp: state.setting.app
  }
}

const mapDispatchToProps = dispatch => {
  return {
    userActions: bindActionCreators(userActions, dispatch),
    cartActions: bindActionCreators(cartActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Account);