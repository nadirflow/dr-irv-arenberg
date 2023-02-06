/**
 ** Name: 
 ** Author: 
 ** CreateAt: 
 ** Description: 
**/
/* LIBRARY */
import React from 'react';
import { connect } from "react-redux";
import moment from "moment";
/* COMPONENTS */
import { ViewAppointment } from './render';
/** COMMON */
import { Keys } from '~/config';
import Services from '~/services';

class Appointment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      _loading: true,
      _refreshing: false,
      _isLoadmore: false,
      _loadmore: true,
      _errorFetch: false,
      _orders: []
    }
    this._page = 1;
    this._per_page = 10;
  }

  /* FUNCTIONS */
  _onFetchData = async (TYPE) => {
    let { _orders } = this.state, loadmore = true;
    let params = {
      customer: this.props.user.id,
      page: this._page,
      per_page: this._per_page
    }
    let res = await Services.Order.list(params);
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

  _onPressAppointment = (data) => {
    this.props.navigation.navigate("AppointmentDetail", {
      data
    });
  }

  /* LIFE CYCLE */
  componentDidMount() {
    this._onFetchData(Keys.REFRESH);
  }

  /* RENDER */
  render() {
    return (
      <ViewAppointment
        state={this.state}
        onFunction={{
          onPressBack: this._onPressBack,
          onPressAppointment: this._onPressAppointment,
          onRefresh: this._onRefresh,
          onLoadMore: this._onLoadmore
        }}
      />
    )
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user.data
  }
}

export default connect(mapStateToProps, null)(Appointment);