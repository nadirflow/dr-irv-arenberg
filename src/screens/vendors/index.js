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
import { ViewVendors } from './render';
/** COMMON */
import { Keys } from '~/config';
import Services from '~/services';

const KEY = {
  LOAD_MORE: "LOAD_MORE",
  REFRESH: "REFRESH"
}

class Vendors extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      _loading: true,
      _refreshing: false,
      _loadmore: true,
      _data: [],
      // _cart: props.cart
    }
    this._page = 1;
    this._limit = 10;
  }

  /* FUNCTIONS */
  _prepareVendors = async () => {
    let { _data, _loadmore } = this.state;

    let res = await Services.Vendor.listStore();
    if (res && !res.code) {
      if (res.length > 0) {
        _data = res;
      }
    }

    _loadmore = false;

    this.setState({
      _data,
      _loading: false,
      _refreshing: false,
      _loadmore
    })
  }

  _onPressBack = () => {
    this.props.navigation.goBack();
  }

  _onPressItem = (item) => {
    this.props.navigation.navigate("VendorDetail", {
      vendorData: item
    })
  }

  _onFetchVendors = async (params, TYPE) => {
    let { _data } = this.state;
    let isLoadmore = true;
    let res = await Services.Vendor.listStore();
    if (res && !res.code) {
      if (res.length < this._limit) isLoadmore = false;
      if (res.length > 0) {
        if (TYPE === Keys.REFRESH) {
          _data = [...res];
        } else if (TYPE === Keys.LOAD_MORE) {
          _data = [..._data, ...res];
        }
      }
      this._page += 1;
    } else isLoadmore = false;

    this.setState({
      _data,
      _loading: false,
      _refreshing: false,
      _loadmore: isLoadmore
    })
  }

  _onRefresh = () => {
    this.setState({ _refreshing: true, _loadmore: true });
    this._page = 1;
    let params = {
      page: this._page,
      per_page: this._limit,
      parent: 0
    }
    this._onFetchVendors(params, Keys.REFRESH);
  }

  _onLoadMore = () => {
    if (!this.state._refreshing && this.state._loadmore) {
      let params = {
        page: this._page,
        per_page: this._limit,
        parent: 0
      }
      this._onFetchVendors(params, Keys.LOAD_MORE);
    }
  }

  /* LIFE CYCLE */
  componentDidMount() {
    this._prepareVendors();
  }

  /* RENDER */
  render() {
    return (
      <ViewVendors
        state={this.state}
        props={this.props}
        onFunction={{
          onPressBack: this._onPressBack,
          onPressItem: this._onPressItem,
          onRefresh: this._onRefresh,
          onLoadMore: this._onLoadMore,
        }}
      />
    )
  }
}

const mapStateToProps = state => {
  return {
  }
}

export default connect(mapStateToProps, null)(Vendors);