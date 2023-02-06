/** LIBRARY */
import React, { Component } from 'react';
/* COMPONENTS */
import { ViewVendorNotifications } from './render';
/** COMMON */
import { Keys } from '~/config';
import Services from '~/services';
import Helpers from '~/utils/helpers';

class VendorNotifications extends Component {
  constructor(props) {
    super(props);
    this.state = {
      _loading: true,
      _notification: [],
      _loadMore: true,
      _refreshing: true
    };
    this._page = 1;
    this._limit = 10;
  }
  /** FUNCTION */
  _onPressBack = () => {
    this.props.navigation.goBack();
  }

  _getNotifications = async (type) => {
    let token = await Helpers.getDataStorage(Keys.AS_DATA_JWT);
    let params = {
      page: this._page,
      per_page: this._limit,
      auth: token  ? token : ''
    }
    let newData = this.state._notification, loadMore = true;
    let res = await Services.Vendor.getNotifications(params);
    if (res) {
      loadMore = res.length >= this._limit;
      this._page += 1;
      if (type === Keys.REFRESH) {
        newData = [...res]
      } else {
        newData = [...newData, ...res]
      }
      
    }
    this.setState({
      _loading: false,
      _loadMore: loadMore,
      _refreshing: false,
      _notification: newData
    })
  }

  _onRefresh = () => {
    this._page = 1;
    this.setState({ _refreshing: true}, () => {
      this._getNotifications(Keys.REFRESH);
    })
  }

  _onLoadMore = () => {
    if (this.state._loadMore) {
      this._getNotifications(Keys.LOAD_MORE);
    }
  }
  /** LIFE CYCLE */
  componentDidMount() {
    this._getNotifications()
  }
  /** RENDER */
  render() {
    return (
      <ViewVendorNotifications
        state={this.state}
        props={this.props}
        onFunction={{
          onPressBack: this._onPressBack,
          onRefresh: this._onRefresh,
          onLoadMore: this._onLoadMore
        }}
      />
    )
  }
}

export default VendorNotifications;