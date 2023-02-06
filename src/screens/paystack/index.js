/**
 ** Name: 
 ** Author: ZiniSoft Ltd
 ** CreateAt: 2021
 ** Description: Description of .js
 **/
import React from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { View, BackHandler } from "react-native";
/** COMPONENTS */
import PaystackWebView from "~/components/CPayStackPayment";
import { PopupModal } from '~/screens/book/pick_day/render';
/** COMMON */
import { Configs, Keys } from "~/config";
import Services from '~/services';
import Helpers from '~/utils/helpers';
import { cStyles } from "~/utils/styles";
import { Colors } from "~/utils/colors";
import * as cartActions from '~/redux/actions/cart';

class PayStackPayment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
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

  _onPressBack = () => {
    this._updateOrder(Configs.order.FAILED);
    this._onBack()
  };

  _onBack = () => {
    this.props.navigation.goBack();
    this.props.route.params.cancelPayment();
  }

  onSuccess = (data) => {
    this.setState({
      _captured: true,
      _modalError: false,
      _loadingModal: false
    });
    this._updateOrder(Configs.order.COMPLETED);
  }

  onFailed = (data) => {
    this.setState({
      _captured: true,
      _modalError: true,
      _loadingModal: false
    });
    this._updateOrder(Configs.order.FAILED);
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

    } else return this._error();
  }

  _error = () => {
    this.setState({ _modalError: true, _loadingModal: false });
  }

  _onPressCfmPopup = () => {
    this.setState({ _modalVisible: false })
    this.props.navigation.navigate("RootTab");
  }

  componentDidMount() {
    this.handleAndroidBackButton();
  }

  render() {
    let { _modalVisible, _modalError, _bookingCode, _loadingModal } = this.state;
    return (
      <View style={cStyles.container}>
        <PaystackWebView
          paystackKey={Configs.payStackPublicKey}
          amount={Number(this.props.route.params.order.total)}
          currency={this.props.route.params.order.currency}
          channels={JSON.stringify(["card", "bank", "ussd", "qr", "mobile_money"])}
          billingEmail={this.props.route.params.order.billing.email}
          billingMobile={this.props.route.params.order.billing.phone}
          billingName={this.props.route.params.order.billing.first_name + " " + this.props.route.params.order.billing.last_name}
          ActivityIndicatorColor={Colors.PRIMARY_COLOR}
          onCancel={(e) => this.onFailed(e)}
          onSuccess={(res) => this.onSuccess(res)}
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
      </View>
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
)(PayStackPayment);