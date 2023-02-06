/**
 ** Name: 
 ** Author: 
 ** CreateAt: 
 ** Description: 
**/
/* LIBRARY */
import React from 'react';
import { connect } from 'react-redux';
import { View, FlatList, TextInput, TouchableOpacity, RefreshControl, Image, ImageBackground,Pressable, Text,BackHandler   } from 'react-native';
import {
  Container, Content, Drawer
} from 'native-base';
import CDrawer from '~/components/CDrawer';

import Icon from 'react-native-fontawesome-pro';
import CHeader from '~/components/CHeader';
/* COMMON */
import { Colors } from '~/utils/colors';
import { Assets, Configs, Devices, Keys } from '~/config';
import { cStyles } from '~/utils/styles';

class AboutAuthor extends React.PureComponent {
  constructor(props) {
    super(props);
    // this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
  }
  // toggleAboutAuthor = () => {
  //   this.props.toggleAboutAuthor();
  // }

  // handleBackButtonClick = () => {
  //   console.log('====================================');
  //   console.log('back Pressed on about us');
  //   console.log(this.props);
  //   console.log(this.state);
  //   console.log('====================================');
  //   this.props.toggleAboutAuthor2; 
  //   return true;
  // }
  // componentWillMount() {
  //   BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
  // }

  // componentWillUnmount() {
  //     BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
  // }
  
  /** LIFE CYCLE */
  componentDidMount() {
    
    console.log('props');
    console.log(this.props);
  }
  /* RENDER */
  render() {
    return (
      <Container></Container>
    )
  }
}



const mapStateToProps = (state) => {
  return {
  }
}

const mapDispatchToProps = dispatch => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AboutAuthor);