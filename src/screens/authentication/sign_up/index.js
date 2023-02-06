/**
 ** Name: 
 ** Author: 
 ** CreateAt: 
 ** Description: 
**/
/* LIBRARY */
import React from 'react';
import { connect } from 'react-redux';
import firebase from 'react-native-firebase';
/* COMPONENTS */
import { ViewSignUp } from './render';
/** COMMON */
import Helpers from '~/utils/helpers';
import Services from '~/services';
import COtp from '~/components/COtp';

class SignUp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      _loading: false,
      _successFetch: "",
      _errorFetch: "",

      _valueUserName: "",
      _valueFirstName: "",
      _valueLastName: "",
      _valueEmail: "",
      _valuePhone: "",
      _valuePassword: "",
      _valueConfirmPassword: "",

      _errorUserName: "",
      _errorFirstName: "",
      _errorLastName: "",
      _errorEmail: "",
      _errorPhone: "",
      _errorPassword: "",
      _errorConfirmPassword: "",

      _modalVisible: false,
      _confirmResult: null,
      /** COUNTRY PICKER */
      _visible: false,
      _flag: "US",
      _callingCode: "+1",
    }
    this._inputs = {};
  }

  /* FUNCTIONS */
  _onFetchData = async () => {
    let params = {
      update: {
        username: this.state._valueUserName,
        email: this.state._valueEmail,
        first_name: this.state._valueFirstName,
        last_name: this.state._valueLastName,
        password: this.state._valuePassword,
        billing: {
          first_name: this.state._valueFirstName,
          last_name: this.state._valueLastName,
          email: this.state._valueEmail,
          phone: this.state._valuePhone
        },
        shipping: {
          first_name: this.state._valueFirstName,
          last_name: this.state._valueLastName
        }
      }
    }

    let res = await Services.SignUp.signUp(params);
    if (res) {
      if (res.code) {
        this._onError(res.message);
      } else {
        this._onSuccess();
      }
    } else {
      this._onError("Server error");
    }
  }

  _onError = (message) => {
    let regex = /(<([^>]+)>)/ig;
    message = message.replace(regex, "");
    this.setState({
      _errorFetch: message,
      _loading: false,
      _modalVisible: false
    })
  }

  _onSuccess = () => {
    this.setState({
      _successFetch: "created_user_success",
      _loading: false,
      _modalVisible: false
    });
    setTimeout(() => {
      this.setState({ _successFetch: "" });
      this.props.navigation.goBack();
    }, 1500);
  }

  _onFocusNextField = (id) => {
    this._inputs[id]._root.focus();
  }

  _validateFields = (type) => {
    if (type === "empty") {
      let { _errorUserName, _errorEmail, _errorPassword, _errorConfirmPassword } = this.state;
      _errorUserName = this.state._valueUserName === "" ? "username_not_empty" : "";
      _errorEmail = this.state._valueEmail === "" ? "email_not_empty" : "";
      _errorPassword = this.state._valuePassword === "" ? "password_not_empty" : "";
      _errorConfirmPassword = this.state._valueConfirmPassword === "" ? "confirmpassword_not_empty" : "";

      this.setState({ _errorUserName, _errorEmail, _errorPassword, _errorConfirmPassword });
      return _errorUserName === "" && _errorEmail === "" && _errorPassword === "" && _errorConfirmPassword === "";
    }

    if (type === "email") {
      let { _errorEmail } = this.state;
      let _isEmail = Helpers.validateEmail(this.state._valueEmail);
      _errorEmail = !_isEmail ? "email_invalid" : "";
      this.setState({ _errorEmail });
      return _errorEmail === "";
    }

    if (type === "confirmpassword") {
      let { _errorConfirmPassword } = this.state;
      _errorConfirmPassword = this.state._valuePassword !== this.state._valueConfirmPassword ?
        "confirmpassword_not_correct" :
        "";
      this.setState({ _errorConfirmPassword });
      return _errorConfirmPassword === "";
    }
  }

  _onPressSignUp = () => {
    let _isNotEmpty = this._validateFields("empty");
    if (!_isNotEmpty) return;
    let _isEmail = this._validateFields("email");
    if (!_isEmail) return;
    let _isLike = this._validateFields("confirmpassword");
    if (!_isLike) return;
    this.setState({ _errorFetch: "", _successFetch: "", _loading: true });
    this._onFetchData();
    // this._onGetOtp();
  }

  _onPressBack = () => {
    this.props.navigation.goBack();
  }

  _onGetOtp = async () => {
    let phone = this.state._valuePhone;
    if (phone !== "") {
      await firebase.auth().verifyPhoneNumber(phone, false)
        .on('state_changed', (phoneAuthSnapshot) => {
          switch (phoneAuthSnapshot.state) {
            // ------------------------
            //  IOS AND ANDROID EVENTS
            // ------------------------
            case firebase.auth.PhoneAuthState.CODE_SENT: // or 'sent'
              console.log('code sent');
              console.log(phoneAuthSnapshot);
              this.setState({ _modalVisible: true })
              // firebase.auth().applyActionCode(phoneAuthSnapshot.verificationId).then(result => console.log("result", result)).catch(error => console.log("Verify",error))
              // on ios this is the final phone auth state event you'd receive
              // so you'd then ask for user input of the code and build a credential from it
              // as demonstrated in the `signInWithPhoneNumber` example above
              break;
            case firebase.auth.PhoneAuthState.ERROR: // or 'error'
              console.log('verification error');
              console.log(phoneAuthSnapshot.error);
              break;

            // ---------------------
            // ANDROID ONLY EVENTS
            // ---------------------
            case firebase.auth.PhoneAuthState.AUTO_VERIFY_TIMEOUT: // or 'timeout'
              console.log('auto verify on android timed out');
              // proceed with your manual code input flow, same as you would do in
              // CODE_SENT if you were on IOS
              break;
            case firebase.auth.PhoneAuthState.AUTO_VERIFIED: // or 'verified'
              // auto verified means the code has also been automatically confirmed as correct/received
              // phoneAuthSnapshot.code will contain the auto verified sms code - no need to ask the user for input.
              console.log('auto verified on android');
              console.log(phoneAuthSnapshot);
              this._onFetchData();
              // Example usage if handling here and not in optionalCompleteCb:
              // const { verificationId, code } = phoneAuthSnapshot;
              // const credential = firebase.auth.PhoneAuthProvider.credential(verificationId, code);

              // Do something with your new credential, e.g.:
              // firebase.auth().signInWithCredential(credential);
              // firebase.auth().currentUser.linkWithCredential(credential);
              // etc ...
              break;
          }
        }, (error) => {
          console.log("Error", error);
          this._onError("Server error");
        }, (phoneAuthSnapshot) => {
          // optionalCompleteCb would be same logic as the AUTO_VERIFIED/CODE_SENT switch cases above
          // depending on the platform. If you've already handled those cases in the observer then
          // there's absolutely no need to handle it here.

          // Platform specific logic:
          // - if this is on IOS then phoneAuthSnapshot.code will always be null
          // - if ANDROID auto verified the sms code then phoneAuthSnapshot.code will contain the verified sms code
          //   and there'd be no need to ask for user input of the code - proceed to credential creating logic
          // - if ANDROID auto verify timed out then phoneAuthSnapshot.code would be null, just like ios, you'd
          //   continue with user input logic.
          console.log("phoneAuthSnapshot", phoneAuthSnapshot);
        })
    }
  }

  _onVerification = async (otp) => {
    await firebase.auth().applyActionCode(otp)
      .then(result => this._onFetchData())
      .catch(error => this._onError("Server error"))
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

  _onPressSignIn = () => {
    this.props.navigation.navigate("SignIn");
  }

  _onChangeText = (value, slug) => {
    if (slug === "firstname") {
      this.setState({ _valueFirstName: value });
    } else if (slug === "lastname") {
      this.setState({ _valueLastName: value });
    } else if (slug === "username") {
      this.setState({ _valueUserName: value });
    } else if (slug === "email") {
      this.setState({ _valueEmail: value });
    } else if (slug === "phone") {
      this.setState({ _valuePhone: value });
    } else if (slug === "password") {
      this.setState({ _valuePassword: value });
    } else if (slug === "confirmpassword") {
      this.setState({ _valueConfirmPassword: value });
    }
  }

  /* RENDER */
  render() {
    return (
      <>
        <ViewSignUp
          state={this.state}
          props={this.props}
          inputs={this._inputs}
          onFunction={{
            onFocusNextField: this._onFocusNextField,
            onPressSignUp: this._onPressSignUp,
            onPressBack: this._onPressBack,
            onTogglePicker: this._onTogglePicker,
            onSelectCountry: this._onSelectCountry,
            onPressSignIn: this._onPressSignIn,
            onChangeText: this._onChangeText
          }}
        />
        <COtp
          visible={this.state._modalVisible}
          onVerify={this._onVerification}
        />
      </>
    )
  }
}

const mapStateToProps = state => {
  return {
    language: state.language.language
  }
}

export default connect(mapStateToProps, null)(SignUp);