/**
 ** FileName: 
 ** FileAuthor: 
 ** FileCreateAt: 
 ** FileDescription: 
**/
/* LIBRARY */
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
/** COMPONENT */
import { ViewMercadoPayment } from './render';
import { Configs, Keys } from '~/config';
import Services from '~/services';
import { PopupModal } from '~/screens/book/pick_day/render';
/** COMMON */
import * as cartActions from '~/redux/actions/cart';
import Helpers from '~/utils/helpers';
import { BackHandler } from 'react-native';

class MercadoPayment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      _loading: true,
      _url: "",
      _captured: false,
      _modalVisible: true,
      _bookingCode: "",
      _loadingModal: true,
      _modalError: false,
    }
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
  /** FUNCTIONS */


  _onPressBack = () => {
    this._updateOrder(Configs.order.FAILED);
    this._onBack()
  };

  _onBack = () => {
    this.props.navigation.goBack();
    this.props.route.params.cancelPayment()
  }

  _updateOrder = async (order) => {
    let params = {
      id: this.props.route.params.order.id,
      update: {
        status: order,
        set_paid: Configs.order.COMPLETED === order ? true : false
      }
    }
    let resOrder = await Services.Order.updateOrder(params);
    if (resOrder && !resOrder.code) {
      this.setState({
        _bookingCode: resOrder.id,
        _loadingModal: false,
      });
      if (order === Configs.order.COMPLETED) {
        //Clear data cart
        this.props.cartActions.removeAllCart();
        //Clear async storage
        Helpers.removeKeyStorage(Keys.AS_DATA_CART);
      }

    } else return this._error()
  }

  _error = () => {
    this.setState({ _modalError: true, _loadingModal: false });
  }

  _processPayment = async () => {
    let { _url } = this.state;
    let { order } = this.props.route.params;
    let items = [];
    for (let std of order.line_items) {
      items.push({
        id: std.id,
        title: std.name,
        quantity: std.quantity,
        currency_id: Configs.currencyValue,
        unit_price: std.price
      })
    }
    let params = {
      access_token: Configs.mercadoAccessToken,
      body: {
        items,
        payer: {
          name: order.billing.first_name,
          sub: order.billing.last_name,
          address: {
            zip_code: order.billing.postcode,
            street_name: order.billing.address_1
          }
        },
        auto_return: "approved",
        back_urls: {
          success: Configs.hostApi
        }
      }
    }
    let res = await Services.MercadoPago.processPayment(params);
    if (res && !res.message) {
      _url = res.init_point
    }
    this.setState({
      _loading: false,
      _url
    })
  }

  _onNavigationStateChange = (webViewState) => {
    console.log("webViewState", webViewState);
    let verify = webViewState.url.includes(Configs.hostApi)
    if (verify) {
      this.setState({
        _captured: true
      });
      this._updateOrder(Configs.order.COMPLETED)
    }
  }

  _onPressCfmPopup = () => {
    this.setState({ _modalVisible: false })
    this.props.navigation.navigate("RootTab");
  }
  /** LIFE CYCLE */
  componentDidMount() {
    this.handleAndroidBackButton();
    this._processPayment();
  }

  /** RENDER */
  render() {
    let { _modalVisible, _modalError, _bookingCode, _loadingModal } = this.state;
    return (
      <>
        <ViewMercadoPayment
          state={this.state}
          onFunction={{
            onPressBack: this._onPressBack,
            onNavigationStateChange: this._onNavigationStateChange
          }}
        />
        {this.state._captured &&
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
)(MercadoPayment);
