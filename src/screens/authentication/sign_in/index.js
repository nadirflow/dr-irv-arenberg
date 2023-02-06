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
import { ViewSignIn } from './render';
/** COMMON */
import { Configs, Languages, Keys } from '~/config';
import Helpers from '~/utils/helpers';
import Services from '~/services';
import {
  AsyncGoogleSignIn,
  AsyncFacebookSignIn,
  AsyncAppleSignIn
} from "~/utils/helpers/authentication";
/** REDUX */
import * as userActions from '~/redux/actions/user';
import * as cartActions from '~/redux/actions/cart';

class SignIn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      _loading: false,
      _valEmail: "",
      _valPassword: "",
      _errorEmail: "",
      _errorPassword: ""
    }
    this._inputs = {};
  }

  /* FUNCTIONS */
  _onSignUpSocial = async (dataSocial, typeLogin, typeSocial) => {
    let username = dataSocial.name.split(" ").join("") + "_" + typeSocial,
      first_name = dataSocial.name.substring(0, dataSocial.name.indexOf(" ")),
      last_name = dataSocial.name.substring(dataSocial.name.lastIndexOf(" ") + 1);
    let params = {
      update: {
        username,
        email: dataSocial.email,
        password: Configs.passwordSocialDefault,
        first_name,
        last_name,
        billing: {
          first_name,
          last_name,
          email: dataSocial.email
        },
        shipping: {
          first_name,
          last_name
        }
      }
    }
    let res = await Services.SignUp.signUp(params);
    if (res) {
      if (res.code) {
        if (res.code === 'registration-error-email-exists' && typeLogin === Keys.LOGIN_TYPE.SOCIAL) {
          return this._onFetchDataUser({ user_email: dataSocial.email });
        }

        this._onError(res.message);
      } else {
        this._onFetchDataUser({ user_email: res.email });
      }
    } else {
      this._onError("Server error");
    }
  }

  _onFocusNextField = (id) => {
    this._inputs[id].wrappedInstance.focus();
  }

  _validateFields = (type) => {
    if (type === "empty") {
      let { _valEmail, _valPassword, _errorEmail, _errorPassword } = this.state;
      _errorEmail = _valEmail === "" ? "email_not_empty" : "";
      _errorPassword = _valPassword === "" ? "password_not_empty" : "";
      this.setState({ _errorEmail, _errorPassword });
      return _errorEmail === "" && _errorPassword === "";
    }

    if (type === "email") {
      let { _valEmail, _errorEmail } = this.state;
      let _isEmail = Helpers.validateEmail(_valEmail);
      _errorEmail = !_isEmail ? "email_invalid" : "";
      this.setState({ _errorEmail });
      return _errorEmail === "";
    }
  }

  _onFetchDataFromJWT = async (typeSocial, typeLogin, data) => {
    let params = { username: "", password: "" };
    if (typeLogin === Keys.LOGIN_TYPE.SOCIAL) {
      params.username = data.email;
      params.password = Configs.passwordSocialDefault;
    } else {
      params.username = this.state._valEmail;
      params.password = this.state._valPassword;
    }
    let res = await Services.SignIn.jwt(params);
    if (res) {
      if (res.code) {
        if (typeLogin === Keys.LOGIN_TYPE.SOCIAL) {
          this._onSignUpSocial(data, typeLogin, typeSocial);
        } else {
          this._onError(Languages[this.props.language].email_or_password_not_correct);
        }
      } else {
        console.log('asdasd--------------');
        console.log( res);
        Helpers.setDataStorage(Keys.AS_DATA_JWT, res.token);
        this._onFetchDataUser(res);
      }
    } else {
      this._onError(Languages[this.props.language].server_error);
    }
  }

  _onFetchDataUser = async (dataJWT) => {
    let params = { email: dataJWT.user_email };
    let res = await Services.SignIn.signIn(params);
    console.log('res====================================');
    console.log(res);
    console.log('res====================================');
    if (res) {
      if (res.code || res.errors) {
        this._onError(Languages[this.props.language].server_error);
      } else {
        console.log('22====================================');
        console.log(res);
        console.log('22====================================');
        params = { id: res.customer.id };
        res = await Services.User.get(params);
        console.log('22-1====================================');
        console.log(res);
        console.log('22-1====================================');
        if (res) {
          if (res.code) {
            this._onError(Languages[this.props.language].server_error);
          } else {
            this._onSaveDataUser(res);
          }
        } else {
          this._onError(Languages[this.props.language].server_error);
        }
      }
    } else {
      this._onError(Languages[this.props.language].server_error);
    }
  }

  _onSaveDataUser = async (dataUser) => {
    /** Update data to redux user */
    this.props.userActions.updateUser(dataUser);
    /** Update data to async storage user */
    Helpers.setDataStorage(Keys.AS_DATA_USER, JSON.stringify(dataUser));
    let asCart = await Helpers.getDataStorage(Keys.AS_DATA_CART);
    if (asCart && asCart !== "") {
      asCart = JSON.parse(asCart);
      // console.log('23====================================');
      // console.log(asCart);
      // console.log('23====================================');
      this.props.cartActions.updateCart(asCart);
    }
    if (Configs.isPaymentWebview) {
      let asCartKey = await Helpers.getDataStorage(Keys.AS_DATA_CART_KEY);
      
      // console.log('23-1====================================');
      // console.log(asCartKey);
      // console.log('23-1====================================');
      if (asCartKey && asCartKey !== "") {
        // asCartKey = JSON.parse(asCartKey);
        
      // console.log('23-2====================================');
      // console.log(asCartKey);
      // console.log('23-2====================================');
        this.props.cartActions.updateCartKey(asCartKey.key);
      }
    }
    
    console.log('25====================================');
    console.log(dataUser);
    console.log('25====================================');
    /** If done => Navigate to homepage */
    if (dataUser.role === Configs.USER_ROLE.STORE_MANAGER) {
      Helpers.resetNavigation(this.props.navigation, "VendorTab");
    } else {
      Helpers.resetNavigation(this.props.navigation, "RootTab");
    }

  }

  _onGetInformationUserFB = (error, result) => {
    if (error) {
      console.log('Error fetching data: ' + error.toString());
      Helpers.showToastDuration({}, 'Server error', "danger");
      this.setState({ _loading: false });
    } else {
      this._onFetchDataFromJWT(Keys.LOGIN_SOCIAL_TYPE.FACEBOOK, Keys.LOGIN_TYPE.SOCIAL, result);
    }
  }

  _onError = (message) => {
    this.setState({ _loading: false });
    Helpers.showToastDuration({}, message, "danger");
  }

  /** HANDLE FUNCTIONS */
  _onChangeValue = (value, field) => {
    if (field === "email") this.setState({ _valEmail: value });
    if (field === "password") this.setState({ _valPassword: value });
  }

  _onPressForgotPassword = () => {
    this.props.navigation.navigate("ForgotPassword");
  }

  _onPressSignUp = () => {
    this.props.navigation.navigate("SignUp");
  }

  _onPressLogin = async () => {
    /** Validate email */
    let _isNotEmpty = this._validateFields("empty");
    if (!_isNotEmpty) return;

    /** Validate is email */
    if (this.state._valEmail.indexOf('@') !== -1) {
      let _isEmail = this._validateFields("email");
      if (!_isEmail) return;
    }

    /** If done => Submit */
    this.setState({ _loading: true });
    this._onFetchDataFromJWT(Keys.LOGIN_TYPE.DEFAULT);
  }

  _onPressLoginFB = async () => {
    this.setState({ _loading: true });
    let data = await AsyncFacebookSignIn({
      funcCallback: this._onGetInformationUserFB
    });
    if (!data) {
      this.setState({ _loading: false });
    }
  }

  _onPressLoginGG = async () => {
    this.setState({ _loading: true });
    let data = await AsyncGoogleSignIn();
    if (data) {
      this._onFetchDataFromJWT(
        Keys.LOGIN_SOCIAL_TYPE.GOOGLE,
        Keys.LOGIN_TYPE.SOCIAL,
        data.user
      );
    } else {
      this.setState({ _loading: false });
    }
  }

  _onPressLoginAP = async () => {
    this.setState({ _loading: true });
    let data = await AsyncAppleSignIn();
    if (data && data.code === "error_not_support") {
      this.setState({ _loading: false });
    }
    if (!data) {
      this.setState({ _loading: false });
    }
    if (data && data.code !== "error_not_support") {
      Helpers.setDataStorage(Keys.AS_DATA_USER_APPLE, data);
      this._onFetchDataFromJWT(Keys.LOGIN_SOCIAL_TYPE.APPLE, Keys.LOGIN_TYPE.SOCIAL, data);
    }
  }

  _onPressBack = () => {
    this.props.navigation.goBack();
  }

  /* RENDER */
  render() {
    return (
      <ViewSignIn
        state={this.state}
        props={this.props}
        inputs={this._inputs}
        onFunction={{
          onPressBack: this._onPressBack,
          onChangeValue: this._onChangeValue,
          onFocusNextField: this._onFocusNextField,
          onPressForgotPassword: this._onPressForgotPassword,
          onPressSignUp: this._onPressSignUp,
          onPressLogin: this._onPressLogin,
          onPressLoginFB: this._onPressLoginFB,
          onPressLoginGG: this._onPressLoginGG,
          onPressLoginAP: this._onPressLoginAP
        }}
      />
    )
  }
}

const mapStateToProps = state => {
  return {
    language: state.language.language,
    setting: state.setting.app
  }
}

const mapDispatchToProps = dispatch => {
  return {
    userActions: bindActionCreators(userActions, dispatch),
    cartActions: bindActionCreators(cartActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SignIn);