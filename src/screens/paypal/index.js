/**
 ** Name: 
 ** Author: 
 ** CreateAt: 
 ** Description: 
**/
/* LIBRARY */
import React from 'react';
import { BackHandler } from 'react-native';
import {
  Container, Content, Header, Left, Body, Title, Right, Button
} from "native-base";
import Icon from 'react-native-fontawesome-pro';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Base64 } from 'js-base64';
import WebView from 'react-native-webview';
/* COMPONENTS */
import CText from '~/components/CText';
import { PopupModal } from '../book/pick_day/render';
import CLoading from '~/components/CLoading';
/* COMMON */
import { Devices, Keys } from '~/config';
import { Colors } from '~/utils/colors';
import { cStyles } from '~/utils/styles';
import Services from '~/services';
import { Configs } from '~/config';
import Helpers from '~/utils/helpers';
import * as cartActions from '~/redux/actions/cart';
/* STYLES */
import styles from './style';

class PayPalPayment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      _loading: true,
      _urlPayPal: "",
      _payPalId: "",
      _captured: false,
      _modalVisible: false,
      _modalError: false,
      _loadingModal: true,
      _bookingCode: "",
      _order: props.route.params.order,

    };
    this._token = "";
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
  _getPayPalToken = async () => {
    let auth = `${Configs.payPalClientId}:${Configs.payPalSecret}`,
      body = { grant_type: "client_credentials" }
    let params = {
      auth: Base64.encode(auth),
      body
    }
    let resToken = await Services.PayPal.getTokenPayPal(params);
    if (resToken) {

      this._token = resToken.access_token;
      this._payment(resToken.access_token)
    } else {
      this.props.navigation.goBack()
    }
  }

  _payment = async (token) => {
    let { _urlPayPal, _payPalId, _order } = this.state;
    let value = _order.total;
    let params = {
      token,
      body: {
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: "USD",
              value
            }
          }
        ]
      }
    }

    let resPayment = await Services.PayPal.processPayment(params);
    if (resPayment && resPayment.status === "CREATED") {
      let find = resPayment.links.find(link => link.rel === "approve");
      if (find) {
        _urlPayPal = find.href;
      }
      _payPalId = resPayment.id
    }
    this.setState({
      _urlPayPal,
      _payPalId,
      _loading: false
    })
  }

  _onNavigationStateChange = async (webViewState) => {
    console.log("webViewState", webViewState)
    if (!this.state._captured) {
      let params = {
        id: this.state._payPalId,
        token: this._token
      }
      let res = await Services.PayPal.getStatusPayment(params);
      if (res && res.status && res.status === "APPROVED") {
        this._capturePayment()
      }
    }
  }

  _capturePayment = async () => {
    let params = {
      id: this.state._payPalId,
      token: this._token
    }
    let res = await Services.PayPal.capturePayment(params);
    if (res && res.status === "COMPLETED") {
      this.setState({ _captured: true, _modalVisible: true });
      this._updateOrder(Configs.order.COMPLETED);
    } else {
      this.setState({ _captured: true, _modalVisible: true });
      this._updateOrder(Configs.order.FAILED)
    }
  }

  _updateOrder = async (order) => {
    let params = {
      id: this.state._order.id,
      update: {
        status: order,
        set_paid: true
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

  _onPressCfmPopup = () => {
    this.setState({ _modalVisible: false })
    this.props.navigation.navigate("RootTab");
  }

  _error = () => {
    this._updateOrder(Configs.order.FAILED)
    this.setState({ _modalError: true, _loadingModal: false });
  }

  _onPressBack = () => {
    this._updateOrder(Configs.order.FAILED);
    this._onBack();
  }
  _onBack = () => {
    this.props.navigation.goBack();
    this.props.route.params.cancelPayment()
  }
  /* LIFE CYCLE */
  componentDidMount() {
    this._getPayPalToken();
    this.handleAndroidBackButton();
  }
  /* RENDER */
  render() {
    let { _loading, _captured, _urlPayPal, _modalVisible, _modalError, _bookingCode, _loadingModal } = this.state;
    return (
      <Container>
        <Header style={{ backgroundColor: Colors.BACKGROUND_PRIMARY_COLOR }} hasSegment transparent iosBarStyle={'dark-content'} androidStatusBarColor={Colors.PRIMARY_COLOR} translucent={false}>
          <Left>
            <Button transparent onPress={this._onPressBack}>
              <Icon
                name={"chevron-left"}
                size={Devices.fS(20)}
                type={"light"}
                color={cStyles.txt_title_header.color}
              />
            </Button>
          </Left>
          <Body style={styles.con_header_center}>
            <Title><CText style={cStyles.txt_title_header} />{"PayPal"}</Title>
          </Body>
          <Right />
        </Header>
        {!_loading &&
          <>
            {!_captured ?
              <WebView
                source={{ uri: _urlPayPal }}
                onNavigationStateChange={this._onNavigationStateChange.bind(this)}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                startInLoadingState={true}
              />
              :
              <PopupModal
                visible={_modalVisible}
                error={_modalError}
                bookingCode={_bookingCode}
                loading={_loadingModal}
                onFunction={{
                  onPressCfmPopup: this._onPressCfmPopup,
                }}
              />
            }
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
)(PayPalPayment);

