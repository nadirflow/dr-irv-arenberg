/**
 ** Name: 
 ** Author: 
 ** CreateAt: 
 ** Description: 
**/
/* LIBRARY */
import React from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import { Animated, View } from 'react-native';
import NetInfo from "@react-native-community/netinfo";
/* COMPONENT */
import CText from '../CText';
/** REDUX */
import * as connectionActions from '~/redux/actions/connection';
/* STYLES */
import styles from './style';

class CConnection extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      _connected: true
    }
    this.animatedValue = new Animated.Value(0);
  }

  /** FUNCTIONS */
  _animate = () => {
    this.setState({ _connected: false });
    Animated.timing(
        this.animatedValue, { toValue: 1, duration: 300, useNativeDriver: true 
      }
    ).start(() => {
      if (this.state._connected) {
        this._reverseAnimate();
      }
    });
  }

  _reverseAnimate = () => {
    Animated.timing(
      this.animatedValue,
      {
        toValue: 0,
        duration: 300,
        useNativeDriver: true
      }
    ).start();
  }

  _handleNetInfo = obj => {
    obj.isConnected ? this._reverseAnimate() : this._animate();
    obj.isConnected
      ? this.props.connectionActions.updateNetStatus(true)
      : this.props.connectionActions.updateNetStatus(false);
  }

  /** LIFE CYCLE */
  componentDidMount() {
    NetInfo.addEventListener(this._handleNetInfo);
  }

  /** RENDER */
  render() {
    let { _connected } = this.state;

    if (!_connected) {
      return (
        <Animated.View style={[styles.con, { opacity: this.animatedValue }]}>
          <View style={styles.con_bar}>
            <CText i18nKey={'connection_failed'} style={styles.note} />
          </View>
        </Animated.View>
      );
    }
    return null;
  }
}

const mapStateToProps = state => {
  return {
    status: state.connection.connection
  }
};

const mapDispatchToProps = dispatch => {
  return {
    connectionActions: bindActionCreators(connectionActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CConnection);