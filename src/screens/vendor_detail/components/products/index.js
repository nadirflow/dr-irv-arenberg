/** LIBRARY */
import React, { Component } from 'react';
import { Configs, Keys } from '~/config';
import Services from '~/services';
import Helpers from '~/utils/helpers';
/** COMPONENTS */
import { ViewVendorProducts } from './render';
/** COMMON */
/** STYLES */

class VendorProducts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      _loading: true,
      _refreshing: true,
      _products: [],
      _loadMore: true,
    };
    this._limit = this.props.data.store_products_per_page > 0 ? this.props.data.store_products_per_page : 10;
    this._page = 1;
    this._vendorId = this.props.data.vendor_id;
  }

  /** FUNCTION */
  _getProductsVendor = async (params, type) => {
    let loadMore = true, newData = this.state._products, item;
    let res = await Services.Vendor.listProduct(Configs.vendor, params);
    if (res) {
      for (item of res) {
        item.stock_status = !item.in_stock ? Configs.stockStatus.OUT_OF_STOCK : (item.in_stock && item.backordered) ? Configs.stockStatus.ON_BACK_ORDER : Configs.stockStatus.IN_STOCK
      }
      loadMore = res.length >= this._limit;
      this._page += 1;
      if (type === Keys.REFRESH) {
        newData = [...res];
      } else {
        newData = [...newData, res]
      }
    }
    
    this.setState({
      _loading: false,
      _refreshing: false,
      _loadMore: loadMore,
      _products: newData
    })
  }

  _onRefresh = () => {
    this.setState({
      _refreshing: true
    },() => {
      this._page = 1;
      let params = {
        page: 1,
        per_page: this._limit,
        vendor_id: this._vendorId
      }
      this._getProductsVendor(params, Keys.REFRESH);
    })
  }

  _onLoadMore = () => {
    if (this.state._loadMore) {
      let params = {
        page: this._page,
        per_page: this._limit,
        vendor_id: this._vendorId
      }
      this._getProductsVendor(params, Keys.REFRESH);
    }
  }

  _onPressItem = async (product) => {
    /** Check product seen */
    let tmp = await Helpers.getDataStorage(Keys.KEY_HOME_VIEWED_PRODUCT);
    if (tmp && tmp.length > 0) {
      let find = tmp.find(f => f.id === product.id);
      if (!find) {
        tmp.push(product);
      }
    } else {
      tmp = [];
      tmp.push(product);
    }
    Helpers.setDataStorage(Keys.KEY_HOME_VIEWED_PRODUCT, tmp);
    /** Navigate to product detail page */
    this.props.navigation.navigate("ProductDetail", {
      product
    });
  }
  /** LIFE CYCLE */
  componentDidMount() {
    let params = {
      page: 1,
      per_page: this._limit,
      vendor_id: this._vendorId
    }
    this._getProductsVendor(params, Keys.REFRESH);
  }
  /** RENDER */
  render() {
    return (
      <ViewVendorProducts 
        state={this.state}
        props={this.props}
        onFunction={{
          onRefresh: this._onRefresh,
          onLoadMore: this._onLoadMore,
          onPressItem: this._onPressItem
        }}
      />
    )
  }
};

export default VendorProducts;
