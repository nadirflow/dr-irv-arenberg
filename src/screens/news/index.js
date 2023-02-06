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
import { ViewNews } from './render';
/** COMMON */
import Services from '~/services';
import { Keys } from '~/config';

class News extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      _loading: true,
      _loadingCart: false,
      _loadForList: true,
      _refreshing: false,
      _loadmore: true,
      _errorFetch: false,
      _categories: [],
    }
    this._page = 1;
    this._limit = 10;
    this._settings = props.setting;
  }

  /* FUNCTIONS */
  _onFetchCategories = async (params, TYPE) => {
    let { _categories } = this.state;
    let isLoadmore = true;
    let res = await Services.News.categories(params);
    if (res && !res.code) {
      if (res.length < this._limit) isLoadmore = false;
      if (res.length > 0) {
        if (TYPE === Keys.REFRESH) {
          _categories = [...res];
        } else if (TYPE === Keys.LOAD_MORE) {
          _categories = [..._categories, ...res];
        }
      } else isLoadmore = false;
      this._page += 1;
      this._onSuccess(_categories, isLoadmore)
    } else {
      isLoadmore = false;
      this._onError(isLoadmore);
    }
  }

  _onSuccess = (data, loadmore) => {
    this.setState({
      _categories: data,
      _refreshing: false,
      _loading: false,
      _loadmore: loadmore,
      _loadForList: false
    });
  }

  _onError = (loadmore) => {
    this.setState({
      _errorFetch: true,
      _refreshing: false,
      _loadmore: loadmore,
      _loading: false,
      _loadForList: false
    });
  }

  _onRefresh = () => {
    this.setState({ _refreshing: true, _loadmore: true });
    this._page = 1;
    let params = {
      page: this._page = 1,
      per_page: this._limit,
      parent: 0
    }
    this._onFetchCategories(params, Keys.REFRESH);
  }

  _onLoadMore = () => {
    if (!this.state._refreshing && this.state._loadmore) {
      let params = {
        page: this._page,
        per_page: this._limit,
        parent: 0
      }
      this._onFetchCategories(params, Keys.LOAD_MORE);
    }
  }

  /** HANDLE FUNCTIONS */
  _onPressItem = (item) => {
    this.props.navigation.navigate('NewsCategories', {
      id: item.id,
      name: item.name,
      dataFull: item
    })
  }

  _onPressCart = () => {
    this.props.navigation.navigate("Cart");
  }

  /* LIFE CYCLE */
  componentDidMount() {
    let params = {
      page: this._page,
      per_page: this._limit,
      parent: 0
    }
    this._onFetchCategories(params, Keys.REFRESH);
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      this.setState({ _loadingCart: !this.state._loadingCart });
    });
  }

  componentWillUnmount() {
    this._unsubscribe();
  }

  /* RENDER */
  render() {
    return (
      <ViewNews
        state={this.state}
        props={this.props}
        onFunction={{
          onPressCart: this._onPressCart,
          onPressItem: this._onPressItem,
          onLoadMore: this._onLoadMore,
          onRefresh: this._onRefresh
        }}
      />
    )
  }
}

const mapStateToProps = (state) => {
  return {
    cart: state.cart.carts,
    setting: state.setting
  }
}

export default connect(
  mapStateToProps,
  null
)(News);