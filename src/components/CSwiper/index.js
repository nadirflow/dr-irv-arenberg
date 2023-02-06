/**
 ** Name: 
 ** Author: 
 ** CreateAt: 
 ** Description: 
**/
/** LIBRARY */
import React from 'react';
import { View, FlatList, TouchableOpacity } from 'react-native';
import Icon from 'react-native-fontawesome-pro';
/** COMMON */
import { Devices } from '~/config';
import { Colors } from '~/utils/colors';
import { cStyles } from '~/utils/styles';
/** STYLES */
import styles from './style';

class CSwiper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      _activeIdx: 0
    }
  }

  /** FUNCTIONS */
  scrollToIndex = (index, animated) => {
    this.listRef && this.listRef.scrollToIndex({ animated, index })
  }

  viewDot = (data, activeIdx) => {
    return (
      <FlatList
        style={{ marginTop: 10 }}
        contentContainerStyle={cStyles.row_align_center}
        data={data}
        renderItem={({ item, index }) =>
          <View style={index === activeIdx ? [styles.con_dot_active, { backgroundColor: Colors.PRIMARY_COLOR }] : styles.con_dot_unactive} />
        }
        keyExtractor={(item, index) => index.toString()}
        horizontal
      />
    )
  }

  /** LIFE CYCLE */
  componentDidMount() {
    if (this.props.autoScroll && this.props.data.length > 1) {
      this.interval = setInterval(() => {
        let { _activeIdx } = this.state;
        let nextIndex = 0, maxSlider = this.props.data.length - 1;

        if (_activeIdx < maxSlider) {
          nextIndex = _activeIdx + 1;
        }

        this.scrollToIndex(nextIndex, true);
        this.setState({ _activeIdx: nextIndex });
      }, 3000);
    }
  }

  componentWillUnmount() {
    if (this.props.autoScroll) {
      clearInterval(this.interval);
    }
  }

  /** RENDER */
  render() {
    let { data, refreshing, renderItem, renderEmptyItem, style, isHome, isProduct, onPressItem } = this.props;

    return (
      <View>
        <View style={[styles.con_swiper, style]}>
          <FlatList ref={(ref) => this.listRef = ref}
            data={data}
            renderItem={({ item, index }) =>
              renderItem(item)
            }
            getItemLayout={(item, index) => (
              { length: Devices.width, offset: Devices.width * index, index }
            )}
            extraData={refreshing}
            keyExtractor={(item, index) => index.toString()}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            ListEmptyComponent={renderEmptyItem}
            onMomentumScrollEnd={(event) => {
              let _activeIdx = Math.ceil(event.nativeEvent.contentOffset.x ? event.nativeEvent.contentOffset.x / Devices.width : 0);
              this.setState({ _activeIdx });
            }}
          />

          {isHome && data.length > 0 &&
            <TouchableOpacity activeOpacity={.5} onPress={() => onPressItem(data[this.state._activeIdx])}>
              <View style={[styles.con_button, { backgroundColor: Colors.PRIMARY_COLOR }]} >
                <Icon name={"arrow-right"} size={Devices.fS(20)} color={Colors.WHITE_COLOR} type={'solid'} />
              </View>
            </TouchableOpacity>
          }
        </View>

        {isHome && data.length > 0 &&
          <View style={cStyles.column_align_center} >
            {this.viewDot(data, this.state._activeIdx)}
          </View>
        }

        {isProduct && data.length > 0 &&
          <View style={cStyles.column_align_center} >
            {this.viewDot(data, this.state._activeIdx)}
          </View>
        }
      </View>
    )
  }
}

CSwiper.defaultProps = {
  isHome: true,
  isProduct: false,
  refreshing: false,
  autoScroll: true,
  data: [],
  style: {},
  renderItem: () => { },
  renderEmptyItem: () => { },
  onPressItem: () => { }
}

export default CSwiper;