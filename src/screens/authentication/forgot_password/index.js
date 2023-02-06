/**
 ** Name: 
 ** Author: 
 ** CreateAt: 
 ** Description: 
**/
/* LIBRARY */
import React from 'react';
import { connect } from 'react-redux';
/* COMPONENTS */
import { ViewForgotPassword } from './render';
/** COMMON */
import { Configs, Languages, Keys } from '~/config';
import Helpers from '~/utils/helpers';
import Services from '~/services';
import { Colors } from '~/utils/colors';

class ForgotPassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      _loading: false,
      _errorEmail: "",
      _errorPassword: "",
      _errorCode: "",
      _pageIndex: 0,
      _email: "",
      _code: "",
      _password: "",
      _isSuccess: false
    }
  }

  /* FUNCTIONS */

  _onGoBack = () => {
    this.setState({ _loading: false });
    this.props.navigation.goBack();
  }

  _validateFields = (type) => {
    let { _email, _password, _code } = this.state;
    if (type === "empty") {
      let { _errorEmail } = this.state;
      _errorEmail = _email === "" ? "email_not_empty" : "";
      this.setState({ _errorEmail });
      return _errorEmail === "";
    }

    if (type === "email") {
      let { _errorEmail } = this.state;
      let _isEmail = Helpers.validateEmail(_email);
      _errorEmail = !_isEmail ? "email_invalid" : "";
      this.setState({ _errorEmail });
      return _errorEmail === "";
    }

    if (type === "code") {
      let { _errorCode } = this.state;
      _errorCode = _code.length === 4 ? "" : "code_invalid";
      this.setState({ _errorCode });
      return _errorCode === "";
    }

    if (type === "password") {
      let { _errorPassword } = this.state;
      _errorPassword = _password.length < 6 ? "password_invalid" : "";
      this.setState({ _errorPassword });
      return _errorPassword === "";
    }
  }



  _onPressBack = (listRef) => {
    this.props.navigation.goBack();
  }

  /** RESET PASSWORD */
  _onChangeEmail = (value) => {
    this.setState({ _email: value })
  }

  _onPressResetPassword = async (listRef) => {
    let _isNotEmpty = this._validateFields("empty");
    if (!_isNotEmpty) return;
    let _isEmail = this._validateFields("email");
    if (!_isEmail) return;
    this.setState({
      _errorEmail: "",
      _errorCode: "",
      _errorPassword: "",
      _isSuccess: false,
      _loading: true,
    }, () => { this._onResetPassword(listRef); })

  }

  _onResetPassword = async (listRef) => {
    let { _pageIndex, _errorEmail, _email } = this.state;
    let params = {
      email: _email
    }
    let res = await Services.ForgotPassword.forgotPassword(params);
    if (res && !res.code) {
      _pageIndex += 1;
      listRef.scrollToIndex({ index: _pageIndex, animated: true });
    } else {
      _errorEmail = res
    }
    this.setState({
      _pageIndex,
      _errorEmail,
      _loading: false
    })
  }

  /** VALIDATE CODE */
  _onChangeCode = (value) => {
    this.setState({ _code: value })
  }
  _onPressValidateCode = async (listRef) => {
    let _isCode = this._validateFields("code");
    if (!_isCode) return;

    this.setState({
      _errorEmail: "",
      _errorCode: "",
      _errorPassword: "",
      _isSuccess: false,
      _loading: true,
    }, () => { this._onValidateCode(listRef); })
  }

  _onValidateCode = async (listRef) => {
    let { _pageIndex, _code, _errorCode, _email } = this.state;
    let params = {
      email: _email,
      code: _code
    }

    let res = await Services.ForgotPassword.validateCode(params);
    if (res && !res.code) {
      _pageIndex += 1;
      listRef.scrollToIndex({ index: _pageIndex, animated: true });
    } else {
      _errorCode = res
    }
    this.setState({
      _pageIndex,
      _errorCode,
      _loading: false
    })
  }

  /** SET NEW PASSWORD */
  _onChangePassword = (value) => {
    this.setState({ _password: value })
  }

  _onPressSetPassword = async (listRef) => {
    let _isPassword = this._validateFields("password");
    if (!_isPassword) return;
    this.setState({
      _errorEmail: "",
      _errorCode: "",
      _errorPassword: "",
      _isSuccess: false,
      _loading: true,
    }, () => { this._onSetPassword(listRef); })
  }

  _onSetPassword = async (listRef) => {
    let { _code, _isSuccess, _errorPassword, _email, _password } = this.state;
    let params = {
      email: _email,
      code: _code,
      password: _password
    }

    let res = await Services.ForgotPassword.setPassword(params);
    if (res && !res.code) {
      _isSuccess = true
    } else {
      _errorPassword = res
    }
    this.setState({
      _isSuccess,
      _errorPassword,
      _loading: false
    })
  }

  /* LIFE CYCLE */

  /* RENDER */
  render() {
    return (
      <ViewForgotPassword
        state={this.state}
        props={this.props}
        onFunction={{
          onPressBack: this._onPressBack,
          onChangeCode: this._onChangeCode,
          onChangeEmail: this._onChangeEmail,
          onChangePassword: this._onChangePassword,
          onPressResetPassword: this._onPressResetPassword,
          onPressValidateCode: this._onPressValidateCode,
          onPressSetPassword: this._onPressSetPassword
        }}
      />
    )
  }

}

const mapStateToProps = state => {
  return {
    language: state.language.language
  }
}

export default connect(mapStateToProps, null)(ForgotPassword);