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
import { ViewCategory } from './render';
/** COMMON */
import { Keys } from '~/config';
import Services from '~/services';

const KEY = {
  LOAD_MORE: "LOAD_MORE",
  REFRESH: "REFRESH"
}

class Category extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      _loading: true,
      _refreshing: false,
      _loadmore: true,
      _data: [],
      _cart: props.cart
    }
    this._page = 1;
    this._limit = 10;
  }

  /* FUNCTIONS */
  _prepareCategories = () => {
    let { _data, _loadmore } = this.state;
    let { category } = this.props;

    if (category.categoriesProduct.length > 0) {
      if (category.categoriesProduct.length < this._limit) {
        _loadmore = false;
      } else {
        this._page += 1;
      }
      _data = category.categoriesProduct;
    }

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
    this.props.navigation.navigate("Product", {
      id: item.id,
      name: item.name
    })
  }

  _onFetchCategories = async (params, TYPE) => {
    let { _data } = this.state;
    let isLoadmore = true;
    let res = await Services.Service.listCategories(params);
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

  _onPressCart = () => {
    this.props.navigation.navigate("Cart");
  }

  /* LIFE CYCLE */
  componentDidMount() {
    this._prepareCategories();
    this.props.navigation.addListener('focus', () => {
      this.setState({
        _cart: this.props.cart
      })
    });
  }
  componentWillUnmount() {
    this.props.navigation.removeListener();
  }

  /* RENDER */
  render() {
    return (
      <ViewCategory
        state={this.state}
        props={this.props}
        onFunction={{
          onPressBack: this._onPressBack,
          onPressItem: this._onPressItem,
          onRefresh: this._onRefresh,
          onLoadMore: this._onLoadMore,
          onPressCart: this._onPressCart
        }}
      />
    )
  }
}

const mapStateToProps = state => {
  return {
    cart: state.cart.carts,
    category: state.category
  }
}

export default connect(mapStateToProps, null)(Category);