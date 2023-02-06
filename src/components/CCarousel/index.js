/**
 ** Name: 
 ** Author: 
 ** CreateAt: 
 ** Description: 
**/
/** LIBRARY */
import React from 'react';
import { View } from 'react-native';
import Carousel, { Pagination } from 'react-native-snap-carousel';
/** COMPONENTS */
import CParallaxImage from "./components/ParallaxImage";
/** COMMON */
import { Devices } from '~/config';
import { Colors } from '~/utils/colors';
import { cStyles } from '~/utils/styles';
/** STYLES */
import styles from './style';

class CCarousel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      _activeIdx: 0
    }
  }

  /** FUNCTIONS */
  get _pagination() {
    let { _activeIdx } = this.state;
    let { data } = this.props;
    return (
      <Pagination
        containerStyle={{ paddingTop: -20 }}
        dotStyle={[styles.con_dot_active, { backgroundColor: Colors.PRIMARY_COLOR }]}
        inactiveDotStyle={styles.con_dot_unactive}
        dotsLength={data.length}
        activeDotIndex={_activeIdx}
        inactiveDotOpacity={0.4}
        inactiveDotScale={0.6}
      />
    );
  }

  /** RENDER */
  RenderEmptySlider = () => {
    return (
      <CImage
        style={styles.img_slider}
        source={Assets.image_failed}
      />
    )
  }

  render() {
    let { data, style, isHome, onPressItem } = this.props;

    if (data && data.length === 0) {
      return this.RenderEmptySlider();
    }

    return (
      <View style={[styles.con_swiper, style]}>
        <Carousel
          ref={(c) => { this._carousel = c; }}
          contentContainerStyle={cStyles.center}
          data={data}
          renderItem={(props, data) => CParallaxImage(props, data, onPressItem)}
          sliderWidth={Devices.width}
          sliderHeight={Devices.width}
          itemWidth={Devices.width - 60}
          hasParallaxImages={true}
          autoplay={true}
          enableMomentum={true}
          loop={true}
          layout={'default'}
          onSnapToItem={(index) => this.setState({ _activeIdx: index })}
        />

        {isHome && data.length > 0 && this._pagination}
      </View>
    )
  }
}

CCarousel.defaultProps = {
  isHome: true,
  isProduct: false,
  refreshing: false,
  autoScroll: true,
  data: [],
  style: {},
  renderItem: () => { },
  onPressItem: () => { }
}

export default CCarousel;