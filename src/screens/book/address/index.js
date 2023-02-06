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
/* COMPONENTS */
import { ViewBookAddress } from './render';
import { Keys } from '~/config';
import Services from '~/services';
import Helpers from '~/utils/helpers';
/** REDUX */
import * as userActions from '~/redux/actions/user';

class BookAddress extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            _loading: true,
            _loadingAdd: false,
            _showModalAdd: false,
            _isSameBilling: true,

            _errorFirstName: false,
            _errorLastName: false,
            _errorCity: false,
            _errorPhone: false,
            _errorEmail: false,
            _errorAddress1: false,
            _errorAddress2: false,
            _errorZipCode: false,
            _errorState: false,
            _errorCountry: false,

            _errorFirstNameShipping: false,
            _errorLastNameShipping: false,
            _errorCityShipping: false,
            _errorAddress1Shipping: false,
            _errorAddress2Shipping: false,
            _errorZipCodeShipping: false,
            _errorStateShipping: false,
            _errorCountryShipping: false,

            _valueFirstName: "",
            _valueLastName: "",
            _valueCompany: "",
            _valueCity: "",
            _valuePhone: "",
            _valueEmail: "",
            _valueAddress1: "",
            _valueAddress2: "",
            _valueZipCode: "",
            _valueState: "",
            _valueCountry: "",

            _valueFirstNameShipping: "",
            _valueLastNameShipping: "",
            _valueCompanyShipping: "",
            _valueCityShipping: "",
            _valueAddress1Shipping: "",
            _valueAddress2Shipping: "",
            _valueZipCodeShipping: "",
            _valueStateShipping: "",
            _valueCountryShipping: "",

            _dataCountry: [...props.setting.dataCountry],
            _dataState: [],
            _dataStateShipping: [],

            _dataUser: props.dataUser
        }
        this._firstNameRef = React.createRef();
        this._lastNameRef = React.createRef();
        this._phoneRef = React.createRef();
        this._companyRef = React.createRef();
        this._emailRef = React.createRef();
        this._address1Ref = React.createRef();
        this._address2Ref = React.createRef();
        this._cityRef = React.createRef();
        this._zipcodeRef = React.createRef();

        this._firstNameShippingRef = React.createRef();
        this._lastNameShippingRef = React.createRef();
        this._companyShippingRef = React.createRef();
        this._address1ShippingRef = React.createRef();
        this._address2ShippingRef = React.createRef();
        this._cityShippingRef = React.createRef();
        this._zipcodeShippingRef = React.createRef();

        this._inputPickerRef = React.createRef();
        this._inputPickerShippingRef = React.createRef();
    }

    /* FUNCTIONS */
    _onFetchData = () => {
        let { _dataUser, _dataCountry } = this.state;

        /** Prepare data */
        let tmp = this._onSendAddress(_dataUser); 

        /** Set default country picker */
        if (_dataCountry.length > 0) {
            tmp._valueCountry = _dataCountry[0].code;
            tmp._valueCountryShipping = _dataCountry[0].code;
            this.props.onPressAddress({
                ...tmp,
                _valueCountry: _dataCountry[0].code,
                _valueCountryShipping: _dataCountry[0].code,
            });

            if (_dataCountry[0].states.length > 0) {
                tmp._valueState = _dataCountry[0].states[0].code;
                tmp._valueStateShipping = _dataCountry[0].states[0].code;
                this.props.onPressAddress({
                    ...tmp,
                    _valueState: _dataCountry[0].states[0].code,
                    _valueStateShipping: _dataCountry[0].states[0].code,
                });

                tmp._dataState = _dataCountry[0].states;
                tmp._dataStateShipping = _dataCountry[0].states;
            }
        }

        /** After prepare, set loading to false */
        tmp._loading = false;
        this.setState(tmp);
    }

    _onToggleAddAddress = () => {
        let { _dataUser } = this.state;

        this.setState({
            _showModalAdd: !this.state._showModalAdd,

            _errorFirstName: false,
            _errorLastName: false,
            _errorCity: false,
            _errorPhone: false,
            _errorEmail: false,
            _errorAddress1: false,
            _errorAddress2: false,
            _errorZipCode: false,
            _errorState: false,
            _errorCountry: false,

            _errorAddress1Shipping: false,
            _errorAddress2Shipping: false,
            _errorFirstNameShipping: false,
            _errorLastNameShipping: false,
            _errorCityShipping: false,
            _errorZipCodeShipping: false,
            _errorStateShipping: false,
            _errorCountryShipping: false,

            _valueFirstName: _dataUser ? _dataUser.billing.first_name : this.state._valueFirstName !== "" ? this.state._valueFirstName : "",
            _valueLastName: _dataUser ? _dataUser.billing.last_name : this.state._valueLastName !== "" ? this.state._valueLastName : "",
            _valueCompany: _dataUser ? _dataUser.billing.company : this.state._valueCompany !== "" ? this.state._valueCompany : "",
            _valueCity: _dataUser ? _dataUser.billing.city : this.state._valueCity !== "" ? this.state._valueCity : "",
            _valuePhone: _dataUser ? _dataUser.billing.phone : this.state._valuePhone !== "" ? this.state._valuePhone : "",
            _valueEmail: _dataUser ? _dataUser.billing.email : this.state._valueEmail !== "" ? this.state._valueEmail : "",
            _valueAddress1: _dataUser ? _dataUser.billing.address_1 : this.state._valueAddress1 !== "" ? this.state._valueAddress1 : "",
            _valueAddress2: _dataUser ? _dataUser.billing.address_2 : this.state._valueAddress2 !== "" ? this.state._valueAddress2 : "",
            _valueZipCode: _dataUser ? _dataUser.billing.postcode : this.state._valueZipCode !== "" ? this.state._valueZipCode : "",
            _valueState: _dataUser ? _dataUser.billing.state : this.state._valueState !== "" ? this.state._valueState : "",
            _valueCountry: _dataUser ? _dataUser.billing.country : this.state._valueCountry !== "" ? this.state._valueCountry : "",

            _valueFirstNameShipping: _dataUser ? _dataUser.shipping.first_name : this.state._valueFirstNameShipping !== "" ? this.state._valueFirstNameShipping : "",
            _valueLastNameShipping: _dataUser ? _dataUser.shipping.last_name : this.state._valueLastNameShipping !== "" ? this.state._valueLastNameShipping : "",
            _valueCompanyShipping: _dataUser ? _dataUser.shipping.company : this.state._valueCompanyShipping !== "" ? this.state._valueCompanyShipping : "",
            _valueCityShipping: _dataUser ? _dataUser.shipping.city : this.state._valueCityShipping !== "" ? this.state._valueCityShipping : "",
            _valueAddress1Shipping: _dataUser ? _dataUser.shipping.address_1 : this.state._valueAddress1Shipping !== "" ? this.state._valueAddress1Shipping : "",
            _valueAddress2Shipping: _dataUser ? _dataUser.shipping.address_2 : this.state._valueAddress2Shipping !== "" ? this.state._valueAddress2Shipping : "",
            _valueZipCodeShipping: _dataUser ? _dataUser.shipping.postcode : this.state._valueZipCodeShipping !== "" ? this.state._valueZipCodeShipping : "",
            _valueStateShipping: _dataUser ? _dataUser.shipping.state : this.state._valueStateShipping !== "" ? this.state._valueStateShipping : "",
            _valueCountryShipping: _dataUser ? _dataUser.shipping.country : this.state._valueCountryShipping !== "" ? this.state._valueCountryShipping : "",
        })
    }

    _onPressAddAddress = () => {
        /** No error validation, start submit */
        let { _dataUser, _isSameBilling } = this.state;

        if (_dataUser) {
            /** Update Redux and Local */
            _dataUser.billing.first_name = this.state._valueFirstName;
            _dataUser.billing.last_name = this.state._valueLastName;
            _dataUser.billing.email = this.state._valueEmail;
            _dataUser.billing.phone = this.state._valuePhone;
            _dataUser.billing.company = this.state._valueCompany;
            _dataUser.billing.address_1 = this.state._valueAddress1;
            _dataUser.billing.address_2 = this.state._valueAddress2;
            _dataUser.billing.city = this.state._valueCity;
            _dataUser.billing.postcode = this.state._valueZipCode;
            _dataUser.billing.state = this.state._valueState;
            _dataUser.billing.country = this.state._valueCountry;

            if (_isSameBilling) {
                _dataUser.shipping.first_name = this.state._valueFirstName;
                _dataUser.shipping.last_name = this.state._valueLastName;
                _dataUser.shipping.company = this.state._valueCompany;
                _dataUser.shipping.address_1 = this.state._valueAddress1;
                _dataUser.shipping.address_2 = this.state._valueAddress2;
                _dataUser.shipping.city = this.state._valueCity;
                _dataUser.shipping.postcode = this.state._valueZipCode;
                _dataUser.shipping.state = this.state._valueState;
                _dataUser.shipping.country = this.state._valueCountry;
            } else {
                _dataUser.shipping.first_name = this.state._valueFirstNameShipping;
                _dataUser.shipping.last_name = this.state._valueLastNameShipping;
                _dataUser.shipping.company = this.state._valueCompanyShipping;
                _dataUser.shipping.address_1 = this.state._valueAddress1Shipping;
                _dataUser.shipping.address_2 = this.state._valueAddress2Shipping;
                _dataUser.shipping.city = this.state._valueCityShipping;
                _dataUser.shipping.postcode = this.state._valueZipCodeShipping;
                _dataUser.shipping.state = this.state._valueStateShipping;
                _dataUser.shipping.country = this.state._valueCountryShipping;
            }

            this.props.userActions.updateUser(_dataUser);
            Helpers.setDataStorage(Keys.AS_DATA_USER, JSON.stringify(_dataUser));

            /** Update Server */
            let paramsUser = {
                id: _dataUser.id,
                update: {
                    billing: _dataUser.billing,
                    shipping: _dataUser.shipping
                }
            }
            Services.Profile.editUser(paramsUser);
        }

        /** Update */
        this._onSendAddress(_dataUser);
    }

    _onSendAddress = (_dataUser) => {
        let tmp = {
            _valueFirstName: _dataUser ? _dataUser.billing.first_name : this.state._valueFirstName !== "" ? this.state._valueFirstName : "",
            _valueLastName: _dataUser ? _dataUser.billing.last_name : this.state._valueLastName !== "" ? this.state._valueLastName : "",
            _valueCompany: _dataUser ? _dataUser.billing.company : this.state._valueCompany !== "" ? this.state._valueCompany : "",
            _valueCity: _dataUser ? _dataUser.billing.city : this.state._valueCity !== "" ? this.state._valueCity : "",
            _valuePhone: _dataUser ? _dataUser.billing.phone : this.state._valuePhone !== "" ? this.state._valuePhone : "",
            _valueEmail: _dataUser ? _dataUser.billing.email : this.state._valueEmail !== "" ? this.state._valueEmail : "",
            _valueAddress1: _dataUser ? _dataUser.billing.address_1 : this.state._valueAddress1 !== "" ? this.state._valueAddress1 : "",
            _valueAddress2: _dataUser ? _dataUser.billing.address_2 : this.state._valueAddress2 !== "" ? this.state._valueAddress2 : "",
            _valueZipCode: _dataUser ? _dataUser.billing.postcode : this.state._valueZipCode !== "" ? this.state._valueZipCode : "",
            _valueState: _dataUser ? _dataUser.billing.state : this.state._valueState !== "" ? this.state._valueState : "",
            _valueCountry: _dataUser ? _dataUser.billing.country : this.state._valueCountry !== "" ? this.state._valueCountry : "",

            _valueFirstNameShipping: _dataUser ? _dataUser.shipping.first_name : this.state._valueFirstNameShipping !== "" ? this.state._valueFirstNameShipping : "",
            _valueLastNameShipping: _dataUser ? _dataUser.shipping.last_name : this.state._valueLastNameShipping !== "" ? this.state._valueLastNameShipping : "",
            _valueCompanyShipping: _dataUser ? _dataUser.shipping.company : this.state._valueCompanyShipping !== "" ? this.state._valueCompanyShipping : "",
            _valueCityShipping: _dataUser ? _dataUser.shipping.city : this.state._valueCityShipping !== "" ? this.state._valueCityShipping : "",
            _valueAddress1Shipping: _dataUser ? _dataUser.shipping.address_1 : this.state._valueAddress1Shipping !== "" ? this.state._valueAddress1Shipping : "",
            _valueAddress2Shipping: _dataUser ? _dataUser.shipping.address_2 : this.state._valueAddress2Shipping !== "" ? this.state._valueAddress2Shipping : "",
            _valueZipCodeShipping: _dataUser ? _dataUser.shipping.postcode : this.state._valueZipCodeShipping !== "" ? this.state._valueZipCodeShipping : "",
            _valueStateShipping: _dataUser ? _dataUser.shipping.state : this.state._valueStateShipping !== "" ? this.state._valueStateShipping : "",
            _valueCountryShipping: _dataUser ? _dataUser.shipping.country : this.state._valueCountryShipping !== "" ? this.state._valueCountryShipping : "",
        }

        this.props.onPressAddress(tmp);
        return tmp;
    }

    /** On change text input */
    _onChangeAddress1 = (value) => {
        if (this.state._isSameBilling) {
            this.setState({ _valueAddress1: value, _valueAddress1Shipping: value });
            this.props.onPressAddress({ _valueAddress1: value, _valueAddress1Shipping: value });
        } else {
            this.setState({ _valueAddress1: value });
            this.props.onPressAddress({ _valueAddress1: value });
        }
    }

    _onChangeAddress2 = (value) => {
        if (this.state._isSameBilling) {
            this.setState({ _valueAddress2: value, _valueAddress2Shipping: value });
            this.props.onPressAddress({ _valueAddress2: value, _valueAddress2Shipping: value });
        } else {
            this.setState({ _valueAddress2: value });
            this.props.onPressAddress({ _valueAddress2: value });
        }
    }

    _onChangeFirstName = (value) => {
        if (this.state._isSameBilling) {
            this.setState({ _valueFirstName: value, _valueFirstNameShipping: value });
            this.props.onPressAddress({ _valueFirstName: value, _valueFirstNameShipping: value });
        } else {
            this.setState({ _valueFirstName: value });
            this.props.onPressAddress({ _valueFirstName: value });
        }
    }

    _onChangeLastName = (value) => {
        if (this.state._isSameBilling) {
            this.setState({ _valueLastName: value, _valueLastNameShipping: value });
            this.props.onPressAddress({ _valueLastName: value, _valueLastNameShipping: value });
        } else {
            this.setState({ _valueLastName: value });
            this.props.onPressAddress({ _valueLastName: value });
        }
    }
    _dataCountry
    _onChangeCompany = (value) => {
        if (this.state._isSameBilling) {
            this.setState({ _valueCompany: value, _valueCompanyShipping: value });
            this.props.onPressAddress({ _valueCompany: value, _valueCompanyShipping: value });
        } else {
            this.setState({ _valueCompany: value });
            this.props.onPressAddress({ _valueCompany: value });
        }
    }

    _onChangeCity = (value) => {
        if (this.state._isSameBilling) {
            this.setState({ _valueCity: value, _valueCityShipping: value });
            this.props.onPressAddress({ _valueCity: value, _valueCityShipping: value });
        } else {
            this.setState({ _valueCi_dataCountryty: value });
            this.props.onPressAddress({ _valueCity: value });
        }
    }

    _onChangePhone = (value) => {
        if (this.state._isSameBilling) {
            this.setState({ _valuePhone: value, _valuePhoneShipping: value });
            this.props.onPressAddress({ _valuePhone: value, _valuePhoneShipping: value });
        } else {
            this.setState({ _valuePhone: value });
            this.props.onPressAddress({ _valuePhone: value });
        }
    }

    _onChangeEmail = (value) => {
        if (this.state._isSameBilling) {
            this.setState({ _valueEmail: value, _valueEmailShipping: value });
            this.props.onPressAddress({ _valueEmail: value, _valueEmailShipping: value });
        } else {
            this.setState({ _valueEmail: value });
            this.props.onPressAddress({ _valueEmail: value });
        }
    }

    _onChangeZipCode = (value) => {
        if (this.state._isSameBilling) {
            this.setState({ _valueZipCode: value, _valueZipCodeShipping: value });
            this.props.onPressAddress({ _valueZipCode: value, _valueZipCodeShipping: value });
        } else {
            this.setState({ _valueZipCode: value });
            this.props.onPressAddress({ _valueZipCode: value });
        }
    }

    _onChangeState = (value) => {
        if (this.state._isSameBilling) {
            this.setState({ _valueState: value, _valueStateShipping: value });
            this.props.onPressAddress({ _valueState: value, _valueStateShipping: value });
        } else {
            this.setState({ _valueState: value });
            this.props.onPressAddress({ _valueState: value });
        }
    }

    _onChangeTextState = (value) => {
        if (this.state._isSameBilling) {
            this.setState({ _valueState: value, _valueStateShipping: value });
            this.props.onPressAddress({ _valueState: value, _valueStateShipping: value });
        } else {
            this.setState({ _valueState: value });
            this.props.onPressAddress({ _valueState: value });
        }
    }

    _onChangeCountry = (value) => {
        //alert('hi')
        this.setState({ _valueCountry: value, _valueState: "" });
        let find = this.state._dataCountry.find(f => f.code === value);
        if (find) {
            if (this.state._isSameBilling) {
                this.setState({
                    _dataState: find.states,
                    _valueState: find.states.length > 0 ? find.states[0].code : "",
                    _dataStateShipping: find.states,
                    _valueStateShipping: find.states.length > 0 ? find.states[0].code : "",
                    _valueCountryShipping: value
                });
                this.props.onPressAddress({
                    _valueCountry: value,
                    _valueCountryShipping: value,
                    _valueState: find.states.length > 0 ? find.states[0].code : "",
                    _valueStateShipping: find.states.length > 0 ? find.states[0].code : ""
                });
            } else {
                this.setState({
                    _dataState: find.states,
                    _valueState: find.states.length > 0 ? find.states[0].code : ""
                });
                this.props.onPressAddress({
                    _valueCountry: value,
                    _valueState: find.states.length > 0 ? find.states[0].code : "",
                });
            }
        }
    }

    _onChangeAddress1Shipping = (value) => {
        this.setState({ _valueAddress1Shipping: value })
        this.props.onPressAddress({ _valueAddress1Shipping: value });
    }

    _onChangeAddress2Shipping = (value) => {
        this.setState({ _valueAddress2Shipping: value })
        this.props.onPressAddress({ _valueAddress2Shipping: value });
    }

    _onChangeFirstNameShipping = (value) => {
        this.setState({ _valueFirstNameShipping: value })
        this.props.onPressAddress({ _valueFirstNameShipping: value });
    }

    _onChangeLastNameShipping = (value) => {
        this.setState({ _valueLastNameShipping: value })
        this.props.onPressAddress({ _valueLastNameShipping: value });
    }

    _onChangeCompanyShipping = (value) => {
        this.setState({ _valueCompanyShipping: value })
        this.props.onPressAddress({ _valueCompanyShipping: value });
    }

    _onChangeCityShipping = (value) => {
        this.setState({ _valueCityShipping: value })
        this.props.onPressAddress({ _valueCityShipping: value });
    }

    _onChangeZipCodeShipping = (value) => {
        this.setState({ _valueZipCodeShipping: value })
        this.props.onPressAddress({ _valueZipCodeShipping: value });
    }

    _onChangeStateShipping = (value) => {
        this.setState({ _valueStateShipping: value })
        this.props.onPressAddress({ _valueStateShipping: value });
    }

    _onChangeTextStateShipping = (value) => {
        this.setState({ _valueStateShipping: value })
        this.props.onPressAddress({ _valueStateShipping: value });
    }

    _onChangeCountryShipping = (value) => {
        this.setState({ _valueCountryShipping: value, _valueStateShipping: "" });
        let find = this.state._dataCountry.find(f => f.code === value);
        if (find) {
            this.setState({
                _dataStateShipping: find.states,
                _valueStateShipping: find.states.length > 0 ? find.states[0].code : ""
            });
            this.props.onPressAddress({
                _valueCountryShipping: value,
                _valueStateShipping: find.states.length > 0 ? find.states[0].code : ""
            });
        }
    }
    /** End */

    _onFocusNextField = (id) => {
        console.log("id", id)
        // this._inputs[id]._root.focus();
    }

    _onPressIsSameBilling = () => {
        if (this.state._isSameBilling) {
            this.setState({
                _valueFirstNameShipping: "",
                _valueLastNameShipping: "",
                _valueCompanyShipping: "",
                _valueCityShipping: "",
                _valueAddress1Shipping: "",
                _valueAddress2Shipping: "",
                _valueZipCodeShipping: "",
                _valueStateShipping: (this.state._dataCountry.length > 0 && this.state._dataCountry[0].states.length > 0) ?
                    this.state._dataCountry[0].states[0].code : "",
                _valueCountryShipping: this.state._dataCountry.length > 0 ? this.state._dataCountry[0].code : "",
                _isSameBilling: false
            })
            this.props.onPressAddress({
                _valueFirstNameShipping: "",
                _valueLastNameShipping: "",
                _valueCompanyShipping: "",
                _valueCityShipping: "",
                _valueAddress1Shipping: "",
                _valueAddress2Shipping: "",
                _valueZipCodeShipping: "",
                _valueStateShipping: (this.state._dataCountry.length > 0 && this.state._dataCountry[0].states.length > 0) ?
                    this.state._dataCountry[0].states[0].code : "",
                _valueCountryShipping: this.state._dataCountry.length > 0 ? this.state._dataCountry[0].code : "",
            });
        } else if (!this.state._isSameBilling) {
            this.setState({
                _valueFirstNameShipping: this.state._valueFirstName,
                _valueLastNameShipping: this.state._valueLastName,
                _valueCompanyShipping: this.state._valueCompany,
                _valueCityShipping: this.state._valueCity,
                _valueAddress1Shipping: this.state._valueAddress1,
                _valueAddress2Shipping: this.state._valueAddress2,
                _valueZipCodeShipping: this.state._valueZipCode,
                _valueStateShipping: this.state._valueState,
                _valueCountryShipping: this.state._valueCountry,
                _isSameBilling: true
            })
            this.props.onPressAddress({
                _valueFirstNameShipping: this.state._valueFirstName,
                _valueLastNameShipping: this.state._valueLastName,
                _valueCompanyShipping: this.state._valueCompany,
                _valueCityShipping: this.state._valueCity,
                _valueAddress1Shipping: this.state._valueAddress1,
                _valueAddress2Shipping: this.state._valueAddress2,
                _valueZipCodeShipping: this.state._valueZipCode,
                _valueStateShipping: this.state._valueState,
                _valueCountryShipping: this.state._valueCountry,
            });
        }
    }

    _onPressFlagCountryPicker = (id) => {
        this._inputs[id].open();
    }

    /* LIFE CYCLE */
    componentDidMount() {
        this._onFetchData();
    }

    /* RENDER */
    render() {

        console.log('object', this.state._dataCountry)
        return (
            <ViewBookAddress
                props={this.props}
                state={this.state}
                inputs={{
                    firstNameRef: this._firstNameRef,
                    lastNameRef: this._lastNameRef,
                    phoneRef: this._phoneRef,
                    companyRef: this._companyRef,
                    emailRef: this._emailRef,
                    address1Ref: this._address1Ref,
                    address2Ref: this._address2Ref,
                    cityRef: this._cityRef,
                    zipcodeRef: this._zipcodeRef,

                    firstNameShippingRef: this._firstNameShippingRef,
                    lastNameShippingRef: this._lastNameShippingRef,
                    companyShippingRef: this._companyShippingRef,
                    address1ShippingRef: this._address1ShippingRef,
                    address2ShippingRef: this._address2ShippingRef,
                    cityShippingRef: this._cityShippingRef,
                    zipcodeShippingRef: this._zipcodeShippingRef,

                    inputPickerRef: this._inputPickerRef,
                    inputPickerShippingRef: this._inputPickerShippingRef
                }}
                onFunction={{
                    onChangeAddress1: this._onChangeAddress1,
                    onChangeAddress2: this._onChangeAddress2,
                    onChangeFirstName: this._onChangeFirstName,
                    onChangeLastName: this._onChangeLastName,
                    onChangeCompany: this._onChangeCompany,
                    onChangePhone: this._onChangePhone,
                    onChangeEmail: this._onChangeEmail,
                    onChangeCity: this._onChangeCity,
                    onChangeZipCode: this._onChangeZipCode,
                    onChangeCountry: this._onChangeCountry,
                    onChangeState: this._onChangeState,
                    onChangeTextState: this._onChangeTextState,

                    onChangeAddress1Shipping: this._onChangeAddress1Shipping,
                    onChangeAddress2Shipping: this._onChangeAddress2Shipping,
                    onChangeFirstNameShipping: this._onChangeFirstNameShipping,
                    onChangeLastNameShipping: this._onChangeLastNameShipping,
                    onChangeCompanyShipping: this._onChangeCompanyShipping,
                    onChangeCityShipping: this._onChangeCityShipping,
                    onChangeZipCodeShipping: this._onChangeZipCodeShipping,
                    onChangeCountryShipping: this._onChangeCountryShipping,
                    onChangeStateShipping: this._onChangeStateShipping,
                    onChangeTextStateShipping: this._onChangeTextStateShipping,

                    onPressAddAddress: this._onPressAddAddress,
                    onToggleAddAddress: this._onToggleAddAddress,
                    onFocusNextField: this._onFocusNextField,
                    onPressIsSameBilling: this._onPressIsSameBilling,

                    onPressFlagCountryPicker: this._onPressFlagCountryPicker,
                }}
            />
        )
    }
}

const mapStateToProps = state => {
    return {
        setting: state.setting,
        cart: state.cart.carts,
        language: state.language.language
    }
}

const mapDispatchToProps = dispatch => {
    return {
        userActions: bindActionCreators(userActions, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(BookAddress);