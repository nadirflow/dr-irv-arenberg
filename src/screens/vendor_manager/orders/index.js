/** LIBRARY */
import React, { Component } from 'react';
import moment from "moment";
/* COMPONENTS */
import { ViewVendorOrders } from './render';
/** COMMON */
import { Keys } from '~/config';
import Services from '~/services';
import Helpers from '~/utils/helpers';


class VendorOrders extends Component {
  constructor(props) {
    super(props);
    this.state = {
      _loading: true,
      _refreshing: false,
      _isLoadmore: false,
      _loadmore: true,
      _errorFetch: false,
      _orders: []
    };
    this._page = 1;
    this._per_page = 10;
  }
  /** FUNCTION */
  _onFetchData = async (TYPE) => {
    let token = await Helpers.getDataStorage(Keys.AS_DATA_JWT);
    let { _orders } = this.state, loadmore = true;
    let params = {
      page: this._page,
      per_page: this._per_page,
      auth: token  ? token : ''
    }
    let res = await Services.Vendor.getOrders(params);
    if (res) {
      let tmpArray = [];
      if (res.length < 10) loadmore = false;
      if (res.length > 0) {
        let tmp = [...res];
        this._page += 1;

        /** Prepare by date */
        if (TYPE !== Keys.REFRESH) tmpArray = _orders;
        for (let i = 0; i < tmp.length; i++) {
          let month = moment(tmp[i].date_created, "YYYY-MM-DDTHH:mm:ss").month() + 1;
          let year = moment(tmp[i].date_created, "YYYY-MM-DDTHH:mm:ss").year();
          let findTime = tmpArray.find(f => f.title === (year + "-" + month));
          if (findTime) {
            findTime.data.push(tmp[i]);
          } else {
            let tmpObj = {
              title: year + "-" + month,
              data: [tmp[i]]
            }
            tmpArray.push(tmpObj);
          }
        }
      } else {
        tmpArray = _orders;
        loadmore = false;
      }
      this._onSuccess(tmpArray, loadmore);
    } else {
      this._onError();
    }
  }

  _onSuccess = (data, loadmore) => {

    this.setState({
      _orders: data,
      _refreshing: false,
      _loadmore: loadmore,
      _isLoadmore: false,
      _loading: false
    });
  }

  _onError = () => {
    this.setState({
      _errorFetch: true,
      _refreshing: false,
      _loadmore: false,
      _isLoadmore: false,
      _loading: false
    });
  }

  _onRefresh = () => {
    this.setState({ _refreshing: true, _loadmore: true });
    this._page = 1;
    this._onFetchData(Keys.REFRESH);
  }

  _onLoadmore = () => {
    if (this.state._loadmore && !this.state._isLoadmore) {
      this.setState({ _isLoadmore: true });
      this._onFetchData(Keys.LOAD_MORE);
    }
  }

  _onPressBack = () => {
    this.props.navigation.goBack();
  }
  /** LIFE CYCLE */
  componentDidMount() {
    this._onFetchData(Keys.REFRESH);
  }
  /** RENDER */
  render() {
    return (
      <ViewVendorOrders
        state={this.state}
        props={this.props}
        onFunction={{
          onPressBack: this._onPressBack,
          onRefresh: this._onRefresh,
          onLoadMore: this._onLoadmore
        }}
      />
    )
  }
}

export default VendorOrders;