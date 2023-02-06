/** LIBRARY */
import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { Configs, Keys } from '~/config';
import Services from '~/services';
import Helpers from '~/utils/helpers';
/** COMPONENTS */
import { ViewVendorAbout } from './render';
/** COMMON */
/** STYLES */
import styles from './style';

class VendorAbout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      _loading: true,

    };

  }

  /** FUNCTION */
  _onPressSocial = (social) => {
    // let url = "";
    // switch (social) {
    //   case Configs.SOCIALS.FACEBOOK.key:
    //     url = Configs.SOCIALS.FACEBOOK.url;
    //     break;

    //   default:
    //     url = "";
    //     break;
    // }

    // if (url !== "") {
    //   Linking.openURL('https:' + url).catch(error => console.log('Error link to facebook'))
    // }
  }

  /** LIFE CYCLE */

  /** RENDER */


  render() {
    return (
      <ViewVendorAbout
        state={this.state}
        props={this.props}
        onFunction={{
          onPressSocial: this._onPressSocial
        }}
      />
    )
  }
};

export default VendorAbout;
