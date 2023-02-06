/** LIBRARY */
import React, { Component } from 'react';
import { Configs, Keys } from '~/config';
import Services from '~/services';
import Helpers from '~/utils/helpers';
/* COMPONENTS */
import { ViewVendorProducts } from './render';
/** COMMON */

class VendorProducts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      _loading: true,
      _products: []
    };
  }
  /** FUNCTION */
  _onPressBack = () => {
    this.props.navigation.goBack();
  }

  _getAllProducts = async () => {
    let token = await Helpers.getDataStorage(Keys.AS_DATA_JWT);
    let params = {
      auth: token ? token : ''
    };
    let newData = [];
    let res = await Services.Vendor.getProducts(params);
    if (res && res.length > 0) {
      for (item of res) {
        item.stock_status = !item.in_stock ? Configs.stockStatus.OUT_OF_STOCK : (item.in_stock && item.backordered) ? Configs.stockStatus.ON_BACK_ORDER : Configs.stockStatus.IN_STOCK
      }
      newData = res
    };
    this.setState({
      _loading: false,
      _products: newData
    })
  }
  /** LIFE CYCLE */
  componentDidMount() {
    this._getAllProducts();
  }
  /** RENDER */
  render() {
    return (
      <ViewVendorProducts
        state={this.state}
        props={this.props}
        onFunction={{
          onPressBack: this._onPressBack,
        }}
      />
    )
  }
}

export default VendorProducts;