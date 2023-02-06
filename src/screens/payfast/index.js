/**
 ** Name: 
 ** Author: 
 ** CreateAt: 
 ** Description: 
**/
/* LIBRARY */
import React from 'react';
import { View, BackHandler } from 'react-native';
import {
  Container, Content, Header, Left, Body, Title, Right, Button
} from "native-base";
import Icon from 'react-native-fontawesome-pro';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
/* COMPONENTS */
import CText from '~/components/CText';
/* COMMON */
import { Devices, Keys } from '~/config';
import { Colors } from '~/utils/colors';
import { cStyles } from '~/utils/styles';
import Services from '~/services';
import { Configs } from '~/config';
/* STYLES */
import styles from './style'


import * as cartActions from '~/redux/actions/cart';
import WebView from 'react-native-webview';
import CLoading from '~/components/CLoading';
import { PopupModal } from '../book/pick_day/render';
import Helpers from '~/utils/helpers';


class PayFastPayment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      _loading: true,
      _url: "",
      _order: props.route.params.order,
      _info: props.route.params.info,
      _modalVisible: false,
      _loadingModal: true,
      _bookingCode: "",
    };
  }

  /**
   * Attaches an event listener that handles the android-only hardware
   * back button
   */
  handleAndroidBackButton = () => {
    BackHandler.addEventListener('hardwareBackPress', () => {
      this._onPressBack()
      return true;
    });
  };

  /* FUNCTIONS */
  _processPayment = async () => {
    let { info, order } = this.props.route.params;
    let params = {
      body: {
        // 'payment_method': 'cc',
        'merchant_id': Configs.payFastMerchantId,
        'merchant_key': Configs.payFastMerchantKey,
        'return_url': Configs.payFastRUrl,
        'cancel_url': Configs.payFastCUrl,
        'notify_url': Configs.payFastNUrl,
        'name_first': info._valueFirstName,
        'name_last': info._valueLastName,
        'email_address': info._valueEmail,
        'amount': parseInt(order.total, 2),
        'item_name': order.line_items[0].name,
        'item_description': "",
        'email_confirmation': 1,
        'confirmation_address': info._valueEmail,
      }
    }
    let res = await Services.PayFast.processPayment(params);
    if (res && res.ok) {
      this.setState({
        _url: res.url,
        _loading: false
      })
    }
  }

  _onNavigationStateChange = (webViewState) => {
    console.log("webViewState", webViewState);
    if (webViewState.url === Configs.payFastRUrl) {
      this.setState({ _modalVisible: true });
      this._updateOrder(Configs.order.COMPLETED)
    } else if (webViewState.url === Configs.payFastCUrl) {
      this.setState({ _modalVisible: true });
      this._updateOrder(Configs.order.FAILED)
    }
  }

  _onPressBack = () => {
    this._updateOrder(Configs.order.FAILED);
    this._onBack();
  }
  _onBack = () => {
    this.props.navigation.goBack();
    this.props.route.params.cancelPayment()
  }

  _onPressCfmPopup = () => {
    this.setState({ _modalVisible: false })
    this.props.navigation.navigate("RootTab");
  }

  _updateOrder = async (order) => {
    let params = {
      id: this.state._order.id,
      update: {
        status: order,
        set_paid: order === Configs.order.COMPLETED ? true : false,
      }
    }
    let resOrder = await Services.Order.updateOrder(params);
    if (resOrder) {
      if (order === Configs.order.COMPLETED) {
        //Clear data cart
        this.props.cartActions.removeAllCart();
        //Clear async storage
        Helpers.removeKeyStorage(Keys.AS_DATA_CART);
      }
      this.setState({
        _bookingCode: resOrder.id,
        _loadingModal: false,
      });
    } else return this._error()
  }

  _error = () => {
    this._updateOrder(Configs.order.FAILED)
    this.setState({ _modalError: true, _loadingModal: false });
  }

  /* LIFE CYCLE */
  componentDidMount() {
    this._processPayment();
    this.handleAndroidBackButton()
  }

  /* RENDER */
  render() {
    let { _loading, _url } = this.state;
    return (
      <Container>
        <Header style={{ backgroundColor: Colors.BACKGROUND_PRIMARY_COLOR }} hasSegment transparent iosBarStyle={'dark-content'} androidStatusBarColor={Colors.PRIMARY_COLOR} translucent={false}>
          <Left>
            <Button transparent onPress={this._onPressBack}>
              <Icon name={"chevron-left"} size={Devices.fS(20)} type={"light"} color={cStyles.txt_title_header.color} />
            </Button>
          </Left>
          <Body style={styles.con_header_center}>
            <Title><CText style={cStyles.txt_title_header} />{"PayFast"}</Title>
          </Body>
          <Right />
        </Header>
        {!_loading &&
          <>
            <WebView
              source={{ uri: _url }}
              onNavigationStateChange={(webViewState) => this._onNavigationStateChange(webViewState)}
              javaScriptEnabled={true}
              domStorageEnabled={true}
            // startInLoadingState
            />
            <PopupModal
              visible={this.state._modalVisible}
              error={this.state._modalError}
              bookingCode={this.state._bookingCode}
              loading={this.state._loadingModal}
              onFunction={{
                onPressCfmPopup: this._onPressCfmPopup,
              }}
            />
          </>
        }

        <CLoading visible={_loading} />
      </Container>

    )
  }

}

const mapStateToProps = (state) => {
  return {

  }
}

const mapDispatchToProps = dispatch => {
  return {
    cartActions: bindActionCreators(cartActions, dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PayFastPayment);

