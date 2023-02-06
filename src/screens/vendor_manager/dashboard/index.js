/** LIBRARY */
import { Container } from 'native-base';
import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { Configs, Keys } from '~/config';
import Services from '~/services';
import Helpers from '~/utils/helpers';
import { ViewVendorDashboard } from './render';

const dataLayout = [
  { name: 'products', icon: 'box'},
  { name: 'order', icon: 'shopping-cart'},
  { name: 'reports', icon: 'chart-line'},
  { name: 'reviews', icon: 'comment-alt-dots'},
  { name: 'notification', icon: 'bell'},
]
class VendorDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      _dataLayout: dataLayout,
      _loading: true,
      _stats: {
        gross_sales: {
          last_month: 0,
          month: 0,
          week: 0
        },
        earnings: {
            last_month: 0,
            month: 0,
            week: 0
        },
        currency: Configs.currencyValue
      }
    }
  }
  /** FUNCTION */
  _onPressItem = (item) => {
    switch (item.name) {
      case 'order':
        return this.props.navigation.navigate('VendorOrders');
      case 'products':
        return this.props.navigation.navigate('VendorProducts');
      case 'reviews':
        return this.props.navigation.navigate('VendorReviews');
      case 'notification':
        return this.props.navigation.navigate('VendorNotifications');
      default:
        return this.props.navigation.navigate('VendorReports', {stats: this.state._stats});;
    }
    
  }

  _getStats = async () => {
    let token = await Helpers.getDataStorage(Keys.AS_DATA_JWT);
    let params = {
      auth: token ? token : ''
    };
    let newStats = this.state._stats;
    let res = await Services.Vendor.getStats(params);
    if (res) {
      newStats = res;
    };
    this.setState({
      _loading: false,
      _stats: newStats
    })
  }
  /** LIFE CYCLE */
  componentDidMount() {
    this._getStats()
  }
  /** RENDER */
  render() {
    return (
      <ViewVendorDashboard
        state={this.state}
        props={this.props}
        onFunction={{
          onPressItem: this._onPressItem
        }}
      />
    )
  }
}

export default VendorDashboard;