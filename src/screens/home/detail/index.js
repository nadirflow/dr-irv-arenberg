/**
 ** Name: 
 ** Author: 
 ** CreateAt: 
 ** Description: 
**/
/* LIBRARY */
import React from 'react';
import { StatusBar, Animated } from 'react-native';
/** COMMON */
/* COMPONENTS */
import { ViewHomePostDetail } from './render';

class HomePostDetail extends React.Component {
  constructor(props) {
    super(props);
    StatusBar.setBackgroundColor("#18504D", true);
    StatusBar.setBarStyle("dark-content", true)
    this._dataPostDetail = props.route.params.data;
    this.state = {
      _scrollY: new Animated.Value(0),
    }
  }

  /* FUNCTIONS */
  _onPressBack = () => {
    this.props.navigation.goBack();
  }

  /* RENDER */
  render() {
    return (
      <ViewHomePostDetail
        data={this._dataPostDetail}
        state={this.state}
        onFunction={{
          onPressBack: this._onPressBack,
        }}
      />
    )
  }

}


export default HomePostDetail;
