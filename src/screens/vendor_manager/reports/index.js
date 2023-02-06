/** LIBRARY */
import React, { Component } from 'react';
/* COMPONENTS */
import { ViewVendorReports } from './render';
/** COMMON */

class VendorReports extends Component {
  constructor(props) {
    super(props);
    this.state = {
      _loading: true,
      _stats: props.route.params.stats
    };
  }
  /** FUNCTION */
  _onPressBack = () => {
    this.props.navigation.goBack();
  }

  /** LIFE CYCLE */

  /** RENDER */
  render() {
    return (
      <ViewVendorReports
        state={this.state}
        props={this.props}
        onFunction={{
          onPressBack: this._onPressBack,
        }}
      />
    )
  }
}

export default VendorReports;