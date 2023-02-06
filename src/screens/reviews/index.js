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
import { ViewReviews } from './render';
/** COMMON */
import { Languages } from '~/config';
import Services from '~/services';
import Helpers from '~/utils/helpers';
import { Colors } from '~/utils/colors';

class Reviews extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      _loading: true,
      _loadingSubmit: false,
      _isWriteReview: false,
      _product: props.route.params.product,
      _reviews: [],
      _review: "",
      _star: 5,
    }
    this._page = 1;
    this._perpage = 10;
    this._5_star = 0;
    this._4_star = 0;
    this._3_star = 0;
    this._2_star = 0;
    this._1_star = 0;
  }

  /* FUNCTIONS */
  _onFetchData = async () => {
    let { _reviews, _product } = this.state;
    let params = {
      page: this._page,
      per_page: this._perpage,
      product: _product.id
    }
    let res = await Services.Service.reviews(params);
    if (res && !res.code && res.length > 0) {
      _reviews = res;
      this._5_star = _reviews.filter(x => x.rating === 5).length;
      this._4_star = _reviews.filter(x => x.rating === 4).length;
      this._3_star = _reviews.filter(x => x.rating === 3).length;
      this._2_star = _reviews.filter(x => x.rating === 2).length;
      this._1_star = _reviews.filter(x => x.rating === 1).length;
    }

    this.setState({
      _reviews,
      _loading: false
    })
  }

  _onSubmitReview = async () => {
    if (this.state._review === "") return Helpers.showToastDuration({}, Languages[this.props.language].warning_review, 'warning');
    this.setState({ _loadingSubmit: true });
    let { _star, _review, _product } = this.state;
    let { user } = this.props;
    let params = {
      update: {
        product_id: _product.id,
        review: _review,
        reviewer: user.first_name + " " + user.last_name,
        reviewer_email: user.email,
        rating: _star,
        status: 'hold'
      }
    }
    let res = await Services.Service.submitReview(params);
    if (res && !res.code) {
      Helpers.showToastDuration({ backgroundColor: Colors.PRIMARY_COLOR }, Languages[this.props.language].success_review, 'success');
    } else {
      Helpers.showToastDuration({}, Languages[this.props.language].server_error, 'danger');
    }

    this.setState({
      _loadingSubmit: false,
      _isWriteReview: false,
      _star: 1,
      _review: ""
    });
  }

  _onPressWriteReview = () => {
    this.setState({ _isWriteReview: true });
  }

  _onPressSubmitReview = () => {
    this._onSubmitReview();
  }

  _onPressBack = () => {
    if (this.state._isWriteReview) {
      this.setState({ _isWriteReview: false });
    } else {
      this.props.navigation.goBack();
    }
  }

  _onChangeText = (value) => {
    this.setState({ _review: value });
  }

  _onSelectedStar = (rating) => {
    this.setState({ _star: rating });
  }

  /* LIFE CYCLE */
  componentDidMount() {
    this._onFetchData();
  }

  /* RENDER */
  render() {
    return (
      <ViewReviews
        state={this.state}
        props={this.props}
        data={{
          numOfStar5: this._5_star,
          numOfStar4: this._4_star,
          numOfStar3: this._3_star,
          numOfStar2: this._2_star,
          numOfStar1: this._1_star,
        }}
        onFunctions={{
          onPressWriteReview: this._onPressWriteReview,
          onPressSubmitReview: this._onPressSubmitReview,
          onPressBack: this._onPressBack,
          onChangeText: this._onChangeText,
          selectedStar: this._onSelectedStar
        }}
      />
    )
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.language.language,
    user: state.user.data
  }
}

export default connect(
  mapStateToProps,
  null
)(Reviews);