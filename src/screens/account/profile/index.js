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
import moment from 'moment';
/* COMPONENTS */
import { ViewProfile } from './render';
/** COMMON */
import Services from '~/services';
import Helpers from '~/utils/helpers';
import MetaFields from '~/utils/meta_fields';
import { Keys, Languages } from '~/config';
/** REDUX */
import * as userActions from '~/redux/actions/user';

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      _loading: false,
      _visibleDatePicker: false,
      _successFetch: "",
      _errorFetch: "",
      _errorFirstName: "",
      _errorLastName: "",
      _errorPhone: "",
      _errorAddress: "",
      _focusField: null,

      _user: props.user,
      _firstName: props.user.first_name,
      _lastName: props.user.last_name,
      _phone: props.user.billing.phone,
      _email: props.user.email,
      _address: props.user.billing.address_1,
      /** COUNTRY PICKER */
      _visible: false,
      _flag: "US",
      _callingCode: "+1",
    };
    this._inputs = {};
  }

  /* FUNCTIONS */
  _onPressShowDatePicker = () => {
    this.setState({ _visibleDatePicker: true });
  }

  _onPressConfirmDatePicker = (date) => {
    let { _user } = this.state;
    let dateParsed = moment(date).format("YYYY-MM-DD");
    let find = _user.meta_data.findIndex(f => f.key === MetaFields.date_of_birth);
    if (find !== -1) _user.meta_data[find].value = dateParsed;

    this.setState({ _user, _visibleDatePicker: false });
  }

  _onPressOffDatePicker = () => {
    this.setState({ _visibleDatePicker: false });
  }

  _onPressBack = () => {
    this.props.navigation.goBack();
  }

  _onFocusNextField = (id) => {
    this._inputs[id].wrappedInstance.focus();
  }

  _validateFields = (type, field_1 = null) => {
    if (type === "empty") {
      let {
        _errorFirstName, _errorLastName, _errorPhone,
        _firstName, _lastName, _phone
      } = this.state;
      _errorFirstName = _firstName === "" ? "firstname_not_empty" : "";
      _errorLastName = _lastName === "" ? "lastname_not_empty" : "";
      _errorPhone = _phone === "" ? "phone_not_empty" : "";

      this.setState({ _errorFirstName, _errorLastName, _errorPhone });
      return _errorFirstName === "" && _errorLastName === "" && _errorPhone === "";
    }

    if (type === "specific" && field_1) {
      let { _errorPhone } = this.state;
      let _isPhone = Helpers.validatePhone(field_1);
      _errorPhone = !_isPhone ? "phone_invalid" : "";
      this.setState({ _errorPhone });
      return _errorPhone === "";
    }
  }

  _onPressEdit = async () => {
    let _isNotEmpty = this._validateFields("empty");
    if (!_isNotEmpty) return;
    let _isPhone = this._validateFields("specific", this.state._phone);
    if (!_isPhone) return;

    this.setState({ _errorFetch: "", _successFetch: "", _loading: true });
    this._onFetchData();
  }

  _onFetchData = async (paramsAvt) => {
    let { _firstName, _lastName, _phone, _email, _address, _user } = this.state;
    let params = {
      id: _user.id,
      update: {
        email: _email,
        first_name: _firstName,
        last_name: _lastName,
        billing: {
          first_name: _firstName,
          last_name: _lastName,
          email: _email,
          phone: _phone,
          address_1: _address
        },
        shipping: {
          first_name: _firstName,
          last_name: _lastName,
          address_1: _address
        },
        meta_data: _user.meta_data
      }
    }
    let res = await Services.Profile.editUser(paramsAvt ? paramsAvt : params);
    if (res) {
      if (res.code) {
        this._onError(res.message, false);
      } else {
        this._onSuccess("changed_profile_success", res);
      }
    } else {
      this._onError("server_error");
    }
  }

  _onError = (message, isMultiLang) => {
    this.setState({
      _errorFetch: message,
      _loading: false
    });
    Helpers.showToastDuration({}, isMultiLang ? Languages[this.props.language][message] : message, "error");
  }

  _onSuccess = async (message, dataUser) => {
    this.props.userActions.updateUser(dataUser);
    Helpers.setDataStorage(Keys.AS_DATA_USER, JSON.stringify(dataUser));
    this.setState({
      _successFetch: message,
      _loading: false
    });
    Helpers.showToastDuration({}, Languages[this.props.language][message], "success");
  }

  _onChangeText = (field, value) => {
    let { _firstName, _lastName, _phone, _address } = this.state;
    if (field === 'address') {
      _address = value;
    } else if (field === 'phone') {
      _phone = value;
    } else if (field === 'lastname') {
      _lastName = value;
    } else if (field === 'firstname') {
      _firstName = value;
    }

    this.setState({ _firstName, _lastName, _phone, _address });
  }

  _onFocus = (field) => {
    this.setState({ _focusField: field });
  }

  _onTogglePicker = () => {
    this.setState({ _visible: !this.state._visible })
  }

  _onSelectCountry = (country) => {
    this.setState({
      _flag: country.cca2,
      _callingCode: country.callingCode.length > 0 ? `+${country.callingCode["0"]}` : "",
      _visible: false
    })
  }

  /** LIFE CYCLE */
  componentDidMount() {
    let { _user } = this.state;
    if (!_user.meta_data) {
      _user.meta_data = [];
      _user.meta_data.push({
        key: MetaFields.date_of_birth,
        value: moment().format('YYYY-MM-DD')
      });
      this.setState({ _user });
    } else {
      let find = _user.meta_data.find(f => f.key === MetaFields.date_of_birth);
      if (!find) {
        _user.meta_data.push({
          key: MetaFields.date_of_birth,
          value: moment().format('YYYY-MM-DD')
        });
      }
      this.setState({ _user });
    }
  }

  /* RENDER */
  render() {
    return (
      <ViewProfile
        state={this.state}
        props={this.props}
        inputs={this._inputs}
        onFunction={{
          onPressBack: this._onPressBack,
          onPressShowDatePicker: this._onPressShowDatePicker,
          onConfirmDatePicker: this._onPressConfirmDatePicker,
          onCancelDatePicker: this._onPressOffDatePicker,
          onFocusNextField: this._onFocusNextField,
          onPressEdit: this._onPressEdit,
          onChangeText: this._onChangeText,
          onFocus: this._onFocus,
          onTogglePicker: this._onTogglePicker,
          onSelectCountry: this._onSelectCountry,
        }}
      />
    )
  }
}

const mapStateToProps = state => {
  return {
    language: state.language.language,
    user: state.user.data
  }
}

const mapDispatchToProps = dispatch => {
  return {
    userActions: bindActionCreators(userActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile);