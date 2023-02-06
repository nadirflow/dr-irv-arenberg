/**
 ** Name:
 ** Author:
 ** CreateAt:
 ** Description:
 **/
/* LIBRARY */
import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { bindActionCreators } from 'redux';
/* COMPONENTS */
import { ViewBookPickDay, PopupModal } from './render';
/* COMMON */
import MetaFields from '~/utils/meta_fields';
import { Configs, Keys, Languages } from '~/config';
import Services from '~/services';
import Helpers from '~/utils/helpers';
/** REDUX */
import * as cartActions from '~/redux/actions/cart';

const data_booking = [{}, {}, {}, {}];
const data_order = [{}, {}, {}];
const MODE = {
  DATE: 'date',
  TIME: 'time',
};
const meta_data = [
  {
    key: MetaFields.booking_day,
    value: moment().format('DD/MM/YYYY'),
  },
  {
    key: MetaFields.booking_hour,
    value: moment().format('HH:mm'),
  },
  {
    key: MetaFields.total_delivery_charges,
    value: '',
  },
  {
    key: MetaFields.delivery_date,
    value: moment().format('DD MMM, YYYY HH:mm'),
  },
  {
    key: MetaFields.orddd_timestamp,
    value: moment().valueOf(),
  },
];

class BookPickDay extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      _pickerVisible: false,
      _loading: false,
      _modalVisible: false,
      _error: false,
      _pickerMode: MODE.DATE,
      _mode: MODE,
      _date: new Date(),
      _time: new Date(),
      _data: Configs.allowBooking ? data_booking : data_order,
      _pageIndex: 0,
      _metaData: meta_data,
      _note: '',
      _paymentMethod: props.payment[0],
      _paymentAddress: null,
      _shippingMethod: null,
      _dataPayment: props.payment,
      _dataService: props.route.params.data,
      _userInfo: props.user,
      _bookingCode: '',
      _dateCreated: new Date(),
    };
    this._inputs = {};
  }

  /* FUNCTIONS */
  _onPressBack = () => {
    this.props.navigation.goBack();
  };

  _onTogglePicker = type => {
    this.setState({ _pickerMode: type, _pickerVisible: true });
  };

  _onConfirm = date => {
    let { _pickerMode, _date, _time, _metaData } = this.state;

    if (_pickerMode === MODE.DATE) {
      _date = date;

      let find = _metaData.findIndex(f => f.key === MetaFields.booking_day);
      if (find !== -1) {
        _metaData[find].value = moment(date).format('DD/MM/YYYY');
      }
    } else if (_pickerMode === MODE.TIME) {
      if (
        moment(_date).format('DD/MM/YYYY') !== moment(date).format('DD/MM/YYYY')
      ) {
        _time = date;
        let find = _metaData.findIndex(f => f.key === MetaFields.booking_hour);
        if (find !== -1) {
          _metaData[find].value = moment(date).format('HH:mm');
        }
      } else {
        if (date >= new Date()) {
          _time = date;
          let find = _metaData.findIndex(
            f => f.key === MetaFields.booking_hour,
          );
          if (find !== -1) {
            _metaData[find].value = moment(date).format('HH:mm');
          }
        }
      }
    }

    this.setState({ _pickerVisible: false, _date, _time, _metaData });
  };

  _onShowPopup = (error, bookingCode, dateCreated) => {
    this.setState({
      _loading: false,
      _error: error,
      _bookingCode: bookingCode ? bookingCode : '',
      _dateCreated: dateCreated ? dateCreated : new Date(),
    });
  };

  _onPressCfmPopup = () => {
    Helpers.resetNavigation(this.props.navigation, 'RootTab');
  };

  _onCancel = () => {
    this.setState({ _pickerVisible: false });
  };

  _onPressContinue = async (scrollToIndex) => {
    if (this.state._pageIndex !== this.state._data.length - 1) {
      if (((
        this.state._paymentAddress._valueFirstName === "" ||
        this.state._paymentAddress._valueLastName === "" ||
        this.state._paymentAddress._valueCity === "" ||
        this.state._paymentAddress._valuePhone === "" ||
        this.state._paymentAddress._valueEmail === "" ||
        this.state._paymentAddress._valueZipCode === "" ||
        this.state._paymentAddress._valueState === "" ||
        this.state._paymentAddress._valueCountry === "" ||

        this.state._paymentAddress._valueFirstNameShipping === "" ||
        this.state._paymentAddress._valueLastNameShipping === "" ||
        this.state._paymentAddress._valueAddress1Shipping === "" ||
        this.state._paymentAddress._valueAddress1Shipping === "" ||
        this.state._paymentAddress._valueCityShipping === "" ||
        this.state._paymentAddress._valueZipCodeShipping === "" ||
        this.state._paymentAddress._valueStateShipping === "" ||
        this.state._paymentAddress._valueCountryShipping === ""
      ) &&
        this.state._pageIndex === 0)) {
        return Helpers.showToastDuration({}, Languages[this.props.language].des_fill_required_fields, "warning");
      }

      let _isEmail = Helpers.validateEmail(this.state._paymentAddress._valueEmail);
      if (!_isEmail && this.state._paymentAddress._valueEmail !== "") {
        return Helpers.showToastDuration({}, Languages[this.props.language].email_invalid, "warning");
      } else {
        let tmp = this.state._pageIndex + 1;
        return scrollToIndex(tmp, true, this._scrollToIndex);
      }
    }

    let { _userInfo } = this.state;
    this.setState({ _modalVisible: true, _loading: true });
    let line_items = [],
      coupon_lines = [],
      shipping_lines = [];
    for (let std of this.state._dataService.service) {
      if (std.variation) {
        line_items.push({
          product_id: std.id,
          quantity: std.numberOfProduct,
          variation_id: std.variation.id,
        });
      } else {
        line_items.push({
          product_id: std.id,
          quantity: std.numberOfProduct,
        });
      }
    }
    if (this.state._dataService.discountCode) {
      coupon_lines.push({
        code: this.state._dataService.discountCode,
      });
    }

    if (this.state._shippingMethod) {
      shipping_lines.push({
        method_title: this.state._shippingMethod.method_title,
        method_id: this.state._shippingMethod.method_id,
        total: this.state._shippingMethod.settings.value_parse
          ? this.state._shippingMethod.settings.value_parse.toString()
          : '0',
      });
    }

    let params = {
      update: {
        customer_id: _userInfo ? _userInfo.id : 0,
        customer_note: this.state._note,
        payment_method: this.state._paymentMethod.id,
        payment_method_title: this.state._paymentMethod.title,
        line_items,
        coupon_lines,
        shipping_lines,
        status: Configs.order.PENDING,
        meta_data: this.state._metaData,
        billing: {
          first_name: this.state._paymentAddress._valueFirstName,
          last_name: this.state._paymentAddress._valueLastName,
          phone: this.state._paymentAddress._valuePhone,
          email: this.state._paymentAddress._valueEmail,
          company: this.state._paymentAddress._valueCompany,
          city: this.state._paymentAddress._valueCity,
          postcode: this.state._paymentAddress._valueZipCode,
          state: this.state._paymentAddress._valueState,
          country: this.state._paymentAddress._valueCountry,
          address_1: this.state._paymentAddress._valueAddress1,
          address_2: this.state._paymentAddress._valueAddress2,
        },
        shipping: {
          first_name: this.state._paymentAddress._valueFirstNameShipping,
          last_name: this.state._paymentAddress._valueLastNameShipping,
          company: this.state._paymentAddress._valueCompanyShipping,
          city: this.state._paymentAddress._valueCityShipping,
          postcode: this.state._paymentAddress._valueZipCodeShipping,
          state: this.state._paymentAddress._valueStateShipping,
          country: this.state._paymentAddress._valueCountryShipping,
          address_1: this.state._paymentAddress._valueAddress1Shipping,
          address_2: this.state._paymentAddress._valueAddress2Shipping,
        },
      },
    };
    let resOrder = await Services.Order.order(params);
    if (resOrder && !resOrder.code) {
      if (this.state._paymentMethod.id === Configs.stripeMethod) {
        this._onStripePayment(
          resOrder.id,
          this.state._dataService.provisionalPrice,
        );
      } else if (this.state._paymentMethod.id === Configs.payPalMethod) {
        this._onPayPalPayment(resOrder);
      } else {
        this._onShowPopup(false, resOrder.number, resOrder.date_created);
      }
      // Clear data cart
      this.props.cartActions.removeAllCart();
      // Clear data cart async storage
      Helpers.removeKeyStorage(Keys.AS_DATA_CART);
    } else {
      this._onShowPopup(true);
    }
  };

  _onStripePayment = (orderId, provisional) => {
    this.setState({ _modalVisible: false });
    this.props.navigation.navigate('StripePayment', {
      orderId,
      provisional,
      cancelPayment: this._onCancelPayment,
    });
  };

  _scrollToIndex = index => {
    this.setState({ _pageIndex: index });
  };

  _onChangeText = value => {
    this.setState({ _note: value });
  };

  _onPressChoosePayment = method => {
    this.setState({ _paymentMethod: method });
  };

  _onPressChooseAddress = address => {
    this.setState({
      _paymentAddress: Object.assign({}, this.state._paymentAddress, address)
    });
  };

  _onPressShippingMethod = method => {
    this.setState({ _shippingMethod: method });
  };

  _onPayPalPayment = order => {
    this.setState({ _modalVisible: false });
    this.props.navigation.navigate('PayPalPayment', {
      order,
      cancelPayment: this._onCancelPayment,
    });
  }; 

  _updateOrder = async (status, order) => {
    let params = {
      id: order.id,
      update: {
        status,
        set_paid: true,
      },
    };
    let resOrder = await Services.Order.updateOrder(params);
    if (resOrder) {
      if (status === Configs.order.COMPLETED) {
        this._onShowPopup(false, order.number, order.date_created);
      }
    } else {
      this._onShowPopup(true);
      return null;
    }
  };

  _onCancelPayment = () => {
    this.setState({ _modalVisible: true, _loading: true });
    this._onShowPopup(true);
  };

  _onMercadoPayment = order => {
    this.setState({ _modalVisible: false });
    this.props.navigation.navigate('MercadoPayment', {
      order,
      info: this.state._paymentAddress,
      cancelPayment: this._onCancelPayment,
    });
  };

  _onPayStackPayment = order => {
    this.setState({ _modalVisible: false });
    this.props.navigation.navigate('PayStackPayment', {
      order,
      cancelPayment: this._onCancelPayment,
    });
  }

  /* RENDER */
  render() {
    return (
      <>
        <ViewBookPickDay
          state={this.state}
          props={this.props}
          onFunction={{
            onPressBack: this._onPressBack,
            onTogglePicker: this._onTogglePicker,
            onConfirm: this._onConfirm,
            onCancel: this._onCancel,
            onPressContinue: this._onPressContinue,
            scrollToIndex: this._scrollToIndex,
            onGetShipping: this._onPressShippingMethod,
            onChangeText: this._onChangeText,
            onPressChoosePayment: this._onPressChoosePayment,
            onPressChooseAddress: this._onPressChooseAddress
          }}
          inputs={this._inputs}
        />

        <PopupModal
          visible={this.state._modalVisible}
          language={this.props.language}
          error={this.state._error}
          bookingCode={this.state._bookingCode}
          dateCreated={this.state._dateCreated}
          loading={this.state._loading}
          contact={this.props.setting.app.general.contact}
          onFunction={{
            onPressCfmPopup: this._onPressCfmPopup,
          }}
        />
      </>
    );
  }
}

const mapStateToProps = state => {
  return {
    language: state.language.language,
    user: state.user.data,
    payment: state.setting.payment,
    setting: state.setting,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    cartActions: bindActionCreators(cartActions, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(BookPickDay);
