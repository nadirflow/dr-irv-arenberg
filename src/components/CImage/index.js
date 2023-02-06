/**
 ** Name: 
 ** Author: 
 ** CreateAt: 
 ** Description: 
**/
/* LIBRARY */
import React from 'react';
import { Animated } from 'react-native';
import FastImage from 'react-native-fast-image';
/** COMPONENTS */
import { WaveIndicator } from "~/components/CIndicator";
/** COMMON */
import { Colors } from '~/utils/colors';
import { cStyles } from '~/utils/styles';
import { Assets } from '~/config';

const durationLoading = 500;

class CImage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      _loading: true,
      _source: props.source,
      _animOpacity: new Animated.Value(1)
    }
  }

  /* FUNCTIONS */
  _onLoad = () => {
    this.setState({ _loading: false }, () => {
      let animationParams = { toValue: 0, duration: durationLoading, useNativeDriver: true };
      Animated.timing(this.state._animOpacity, animationParams).start();
    })
  }

  _onError = () => {
    this.setState({
      _source: this.props.sourceFailed ? this.props.sourceFailed : Assets.image_failed,
      _loading: false
    })
  }

  /* LIFE CYCLES */
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.source != this.props.source) {
      this.setState({ _source: this.props.source });
    }
  }

  /* RENDER */
  render() {
    let { style, resizeMode, children } = this.props;
    let { _source } = this.state;

    return (
      <FastImage
        style={[style, { overflow: 'hidden' }]}
        source={_source.uri ?
          {
            uri: _source.uri,
            priority: FastImage.priority.normal
          } :
          _source}
        resizeMode={resizeMode}
        cache={FastImage.cacheControl.immutable}
        onLoadStart={this._onLoadStart}
        onLoad={this._onLoad}
        onError={this._onError}
      >
        <Animated.View style={[styles.con_loading, { opacity: this.state._animOpacity }]}>
          <WaveIndicator color={Colors.PRIMARY_COLOR} waveMode={"outline"} />
        </Animated.View>
        {children}
      </FastImage>
    )
  }
}

CImage.defaultProps = {
  style: {},
  source: Assets.image_failed,
  resizeMode: "cover"
}

const styles = {
  con_loading: [cStyles.full_center, { position: 'absolute', top: 0, left: 0, bottom: 0, right: 0, backgroundColor: Colors.BACKGROUND_ITEM_COLOR }]
}

export default CImage;