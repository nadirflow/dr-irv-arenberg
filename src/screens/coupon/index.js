/**
 ** Name: 
 ** Author: 
 ** CreateAt: 
 ** Description: 
**/
/* LIBRARY */
import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
/* COMPONENTS */
import { ViewCoupon } from './render';
/* COMMON */
import { Keys } from '~/config';
import Services from '~/services';

class Coupon extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      _loading: true,
      _refreshing: false,
      _loadmore: true,
      _data: [],
    }
    this._page = 1;
    this._limit = 10;
  }

  /* FUNCTIONS */
  _onFetchCoupons = async (params, TYPE) => {
    let { _data } = this.state;
    let tmpNewList = [], isLoadmore = true;
    let res = await Services.Coupon.list(params);
    if (res && !res.code) {
      if (res.length > 0) {
        if (res.length < this._limit) isLoadmore = false;
        if (TYPE === Keys.REFRESH) {
          _data = [...res];
        } else if (TYPE === Keys.LOAD_MORE) {
          _data = [...this.state._data, ...res];
        }
        this._page += 1;
      }

      for (let coupon of _data) {
        let tmp = moment().diff(moment(coupon.date_expires, "YYYY-MM-DDTHH:mmss").valueOf(), "days");
        if (tmp <= 0) {
          tmpNewList.push(coupon);
        }
      }
    } else isLoadmore = false;

    this.setState({
      _data: tmpNewList,
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
      per_page: this._limit
    }
    this._onFetchCoupons(params, Keys.REFRESH);
  }

  _onLoadMore = () => {
    if (!this.state._refreshing && this.state._loadmore) {
      let params = {
        page: this._page,
        per_page: this._limit
      }
      this._onFetchCoupons(params, Keys.LOAD_MORE);
    }
  }

  _onPressCoupon = (data) => {
    this.props.navigation.navigate('CouponsDetail', { data });
  }

  _onPressBack = () => {
    this.props.navigation.goBack();
  }

  _onPressCart = () => {
    this.props.navigation.navigate("Cart");
  }

  /* LIFE CYCLE */
  componentDidMount() {
    let params = {
      page: this._page,
      per_page: this._limit
    }
    this._onFetchCoupons(params, Keys.REFRESH);
  }

  /* RENDER */
  render() {
    return (
      <ViewCoupon
        state={this.state}
        onFunction={{
          onPressBack: this._onPressBack,
          onRefresh: this._onRefresh,
          onLoadMore: this._onLoadMore,
          onPressCoupon: this._onPressCoupon,
          onPressCart: this._onPressCart
        }}
      />
    )
  }
}

const mapStateToProps = (state) => {
  return {
    cart: state.cart.carts
  }
}

export default connect(mapStateToProps, null)(Coupon);