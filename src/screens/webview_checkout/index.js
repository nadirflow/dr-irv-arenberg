/**
 ** Name: 
 ** Author: 
 ** CreateAt: 
 ** Description: 
**/
/* LIBRARY */
import React, {Component} from 'react';
import WebView from 'react-native-webview';
import {StyleSheet, View, Modal} from 'react-native';
import {connect} from 'react-redux';
import { Container } from 'native-base';
import queryString from 'query-string';
import {URL} from 'react-native-url-polyfill';
/** COMMON */
import { Configs, Keys } from '~/config';
import { cStyles } from '~/utils/styles';
/** COMPONENTS */
import CHeader from '~/components/CHeader';
import CLoading from '~/components/CLoading';
import { Colors } from '~/utils/colors';
import Helpers from '~/utils/helpers';
import * as cartActions from '~/redux/actions/cart';
import { bindActionCreators } from 'redux';

class WebviewCheckoutScreen extends Component {
  webview = null;
  request = null;

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      visible: false,
      canGoBack: false,
      canGoForward: false,
      uri: ""
    };
  }


  handleResponse = request => {
    const {url, canGoForward, canGoBack} = request;
    const {navigation, theme} = this.props;
    const parsed = queryString.parse(new URL(url).search);
    // console.log('------123-----------');
    // console.log(parsed);
    // console.log(url);
    if (url.includes('/order-received/')) {
      navigation.replace('WebviewThankyou', {
        uri: `${url}&mobile=1&theme=${theme}&currency=${Configs.currencyValue}`,
      });
    }

    if (url.includes('/order-pay/')) {
      navigation.replace('WebviewPayment', {
        uri: `${url}&mobile=1&theme=${theme}&currency=${Configs.currencyValue}`,
      });
    }

    // Cancel order
    if (parsed.cancel_order) {
      navigation.goBack();
    }

    if (!parsed.cancel_order && url.includes(`${Configs.hostApi}/cart`)) {
      // this.props.cartActions.removeAllCart();
      //Clear async storage
      Helpers.removeMultiKeyStorage([Keys.AS_DATA_CART, Keys.AS_DATA_CART_KEY]);
      navigation.goBack();
    }

    this.setState({
      canGoBack,
      canGoForward,
    });
  };

  handleGoBack = () => {
    const {navigation} = this.props;
    const {canGoBack} = this.state;
    if (this.webview && canGoBack) {
      this.webview.goBack();
    } else {
      navigation.goBack();
    }
    this.webview = null;
  };

  handleGoForward = () => {
    const {navigation} = this.props;
    const {canGoForward} = this.state;
    if (this.webview && canGoForward) {
      this.webview.goForward();
    } else {
      navigation.goForward();
    }
  };

  /** LIFE CYCLE */

  /** RENDER */
  render() {
    const { canGoForward} = this.state;
    const { language, cartKey, theme } = this.props;
    const { token } = this.props.route.params;
    
    
    // console.log('====================================');
    // console.log('CheckOUt');
    // console.log(`${Configs.hostApi}/wp-json/zini-app-builder/v2/auto-login?cart-key=${cartKey}&currency=${Configs.currencyValue}&lang=${language}&mobile=${1}&theme=${theme}&token=${token}`);
    // console.log('====================================');
    return (
      <Container style={cStyles.container}>
        <CHeader
          title={'payment'}
          onPressLeft_1={this.handleGoBack}
          onPressRight_1={this.handleGoForward}
          iconLeft_1={Configs.supportRTL ? "angle-right" : "angle-left"}
          iconRight_1={!canGoForward ? "none" : Configs.supportRTL ? "angle-left" : "angle-right"}
        />
        <WebView
          source={{
            uri: `${Configs.hostApi}/wp-json/zini-app-builder/v2/auto-login?cart-key=${cartKey}&currency=${Configs.currencyValue}&lang=${language}&mobile=${1}&theme=${theme}&token=${token}`,
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          }}
          ref={ref => (this.webview = ref)}
          onNavigationStateChange={this.handleResponse}
          style={styles.webView}
        />

      </Container>
    );
  }
}

const styles = StyleSheet.create({
  webView: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  viewLoading: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
  },
});

WebviewCheckoutScreen.propTypes = {};

const mapStateToProps = state => {
  return {
    language: state.language.language,
    cart: state.cart.cartData.items,
    setting: state.setting,
    cartKey: state.cart.cartKey,
    theme: 'light'
  };
};

const mapDispatchToProps = dispatch => {
  return {
    cartActions: bindActionCreators(cartActions, dispatch)
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(WebviewCheckoutScreen);

