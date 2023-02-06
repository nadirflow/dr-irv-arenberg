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
import { BackHandler } from 'react-native';
/** COMPONENT */
import { ViewStripePayment } from './render';
import Services from '~/services';
import { PopupModal } from '~/screens/book/pick_day/render';
// /** SERVICES */
// import Services from '../../../services';
/** COMMON */
import { Configs, Keys, Languages } from '~/config';
import Helpers from '~/utils/helpers';
/** REDUX */
import * as cartActions from '~/redux/actions/cart';


class StripePayment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      _loading: false,
      _success: false,
      _error: false,
      _cardData: { valid: false },
      _orderId: props.route.params.orderId,
      _provisional: props.route.params.provisional,
      _modalVisible: false,
      _modalError: false,
      _bookingCode: "",
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
  _onChangeInfoCard = (cardData) => {
    this.setState({ _cardData: cardData });
  }

  _onPressPayment = async () => {
    if (this.state._cardData.values.number === "" ||
      this.state._cardData.values.expiry.split('/')[0] === "" ||
      this.state._cardData.values.expiry.split('/')[1] === "" ||
      this.state._cardData.values.cvc === "")
      return Helpers.showToastDuration({}, Languages[this.props.language]["des_fill_required_fields"], "error");

    this.setState({ _error: false, _success: false, _loading: true, _modalVisible: true });
    let { _cardData } = this.state;
    let params = {
      publishKey: Configs.stripePublishKey,
      card: {
        'card[number]': _cardData.values.number.replace(/ /g, ''),
        'card[exp_month]': _cardData.values.expiry.split('/')[0],
        'card[exp_year]': _cardData.values.expiry.split('/')[1],
        'card[cvc]': _cardData.values.cvc
      }
    }
    let token = await Services.Stripe.getTokenStripe(params);
    if (token) {
      if (token.error) return this._error();
      console.log('---> TOKEN OF STRIPE: ', token);
      this._submitPayment(token.id);
    } else return this._error();

  }

  _submitPayment = async (token) => {
    let { _provisional } = this.state;
    let currency = Configs.currencyValue.toLowerCase();
    let amount = Number(_provisional);
    if (currency === "usd") {
      amount = amount * 100;
    }
    if (amount >= 100000000 && currency === "usd") {
      this._error();
    } else {
      let params = {
        source: token,
        currency,
        amount,
        description: "Charges order"
      }
      let res = await Services.Stripe.processPayment(params);
      if (res) {
        console.log("resPayment", res)
        if (res.status === 'succeeded');
        this._updateOrder(Configs.order.COMPLETED)
      } else return this._error();
    }
  }

  _updateOrder = async (order) => {
    let params = {
      id: this.state._orderId,
      update: {
        status: order,
        set_paid: true
      }
    }
    let resOrder = await Services.Order.updateOrder(params);
    if (resOrder) {
      this.setState({
        _bookingCode: resOrder.id,
        _loading: false,
      });
      if (order === Configs.order.COMPLETED) {
        //Clear data cart
        this.props.cartActions.removeAllCart();
        //Clear async storage
        Helpers.removeKeyStorage(Keys.AS_DATA_CART);
      }

    } else return this._error()
  }
  _onPressCfmPopup = () => {
    this.setState({ _modalVisible: false })
    this.props.navigation.navigate("RootTab");
  }

  _error = () => {
    this._updateOrder(Configs.order.FAILED)
    this.setState({ _error: true, _modalError: true, _loading: false });
  }

  _onPressBack = () => {
    this._updateOrder(Configs.order.FAILED);
    this._onBack()
  };

  _onBack = () => {
    this.props.navigation.goBack();
    this.props.route.params.cancelPayment()
  }

  /** LIFE CYCLE */
  componentDidMount() {
    this.handleAndroidBackButton();
  }

  /** RENDER */
  render() {
    return (
      <>
        <ViewStripePayment
          state={this.state}
          onFunction={{
            onChangeInfoCard: this._onChangeInfoCard,
            onPressPayment: this._onPressPayment,
            onPressBack: this._onPressBack
          }}
        />
        <PopupModal
          visible={this.state._modalVisible}
          error={this.state._modalError}
          bookingCode={this.state._bookingCode}
          loading={this.state._loading}
          onFunction={{
            onPressCfmPopup: this._onPressCfmPopup,
          }}
        />
      </>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.language.language
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
)(StripePayment);
