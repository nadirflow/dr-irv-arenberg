/**
 ** Name: 
 ** Author: 
 ** CreateAt: 
 ** Description: 
**/
/* LIBRARY */
import React from 'react';
import { View, FlatList, TouchableOpacity } from 'react-native';
import {
  Header, Left, Body, Right
} from 'native-base';
import Lightbox from 'react-native-lightbox';
/* COMPONENTS */
import CImage from '~/components/CImage';
import CText from '../CText';
/** COMMON */
import { Colors } from '~/utils/colors';
import { cStyles } from '~/utils/styles';
import { Devices } from '~/config';
/** STYLE */
import styles from './style';

const anim = { tension: 1000000, friction: 1000000 };

class CLightBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      _loading: true,
      _activeIdx: 0
    }
    this.listRef = null;
  }

  /* FUNCTIONS */
  _onRenderOneImage = (data) => {
    return (
      <CImage
        style={styles.img_image_single_full}
        resizeMode={"contain"}
        source={{ uri: data.sizes.woocommerce_single }}
      />
    )
  }

  _onRenderMultiImage = (idxActive) => {
    return (
      <View style={styles.con_swiper}>
        <FlatList
          ref={(ref) => this.listRef = ref}
          contentContainerStyle={cStyles.center}
          data={this.props.images}
          initialScrollIndex={idxActive}
          renderItem={({ item, index }) => this._onRenderOneImage(item)}
          getItemLayout={(item, index) => (
            { length: Devices.width, offset: Devices.width * index, index }
          )}
          keyExtractor={(item, index) => index.toString()}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(event) => {
            let _activeIdx = Math.ceil(event.nativeEvent.contentOffset.x ? event.nativeEvent.contentOffset.x / Devices.width : 0);
            this.setState({ _activeIdx });
          }}
        />
      </View>
    )
  }

  _onRenderHeader = (close) => {
    return (
      <Header transparent hasSegment style={styles.con_header} iosBarStyle={'dark-content'} androidStatusBarColor={Colors.WHITE_COLOR} translucent={false}>
        <Left>
          <TouchableOpacity onPress={close}>
            <View style={styles.con_close}>
              <CText style={styles.txt_close}>{'Close'}</CText>
            </View>
          </TouchableOpacity>
        </Left>
        <Body>
          {this.props.images.length > 1 &&
            <CText style={styles.txt_close}>{(this.state._activeIdx + 1) + " / " + this.props.images.length}</CText>
          }
        </Body>
        <Right />
      </Header >
    )
  }

  _onOpenLightBox = (idxActive) => {
    this.setState({ _activeIdx: idxActive });
  }

  _onCheckGallery = () => {
  }

  /* LIFE CYCLE */
  componentDidMount() {
  }

  /* RENDER */
  render() {
    let { images } = this.props;

    if (images.length === 1) { // 1 photo
      return (
        <View style={styles.con_light_box}>
          <Lightbox underlayColor={Colors.WHITE_COLOR}
            underlayColor={Colors.WHITE_COLOR}
            renderContent={() => this._onRenderOneImage(images[0])}
            renderHeader={close => this._onRenderHeader(close)}
            onOpen={() => this._onOpenLightBox(0)}
            springConfig={anim}
            swipeToDismiss={false}
          >
            <CImage
              style={styles.img_image_single_full}
              resizeMode="contain"
              source={{ uri: images[0].sizes.woocommerce_single }}
            />
          </Lightbox>
        </View>
      )
    }

    if (images.length === 2) { // 2 photos
      return (
        <View style={styles.con_light_box}>
          <Lightbox underlayColor={Colors.WHITE_COLOR}
            underlayColor={Colors.WHITE_COLOR}
            renderContent={() => this._onRenderMultiImage(0)}
            renderHeader={close => this._onRenderHeader(close)}
            onOpen={() => this._onOpenLightBox(0)}
            springConfig={anim}
            swipeToDismiss={false}
          >
            <CImage
              style={styles.img_two_image}
              resizeMode="contain"
              source={{ uri: images[0].sizes.woocommerce_single }}
            />
          </Lightbox>

          <Lightbox underlayColor={Colors.WHITE_COLOR}
            underlayColor={Colors.WHITE_COLOR}
            renderContent={() => this._onRenderMultiImage(1)}
            renderHeader={close => this._onRenderHeader(close)}
            onOpen={() => this._onOpenLightBox(1)}
            springConfig={anim}
            swipeToDismiss={false}
          >
            <CImage
              style={styles.img_two_image}
              resizeMode="contain"
              source={{ uri: images[1].sizes.woocommerce_single }}
            />
          </Lightbox>
        </View>
      )
    }

    if (images.length === 3) { // 3 photos
      return (
        <View style={styles.con_light_box}>
          <Lightbox underlayColor={Colors.WHITE_COLOR}
            underlayColor={Colors.WHITE_COLOR}
            renderContent={() => this._onRenderMultiImage(0)}
            renderHeader={close => this._onRenderHeader(close)}
            onOpen={() => this._onOpenLightBox(0)}
            springConfig={anim}
            swipeToDismiss={false}
          >
            <CImage
              style={styles.img_three_image}
              resizeMode="contain"
              source={{ uri: images[0].sizes.woocommerce_single }}
            />
          </Lightbox>

          <Lightbox underlayColor={Colors.WHITE_COLOR}
            underlayColor={Colors.WHITE_COLOR}
            renderContent={() => this._onRenderMultiImage(1)}
            renderHeader={close => this._onRenderHeader(close)}
            onOpen={() => this._onOpenLightBox(1)}
            springConfig={anim}
            swipeToDismiss={false}
          >
            <CImage
              style={styles.img_three_image}
              resizeMode="contain"
              source={{ uri: images[1].sizes.woocommerce_single }}
            />
          </Lightbox>

          <Lightbox underlayColor={Colors.WHITE_COLOR}
            underlayColor={Colors.WHITE_COLOR}
            renderContent={() => this._onRenderMultiImage(2)}
            renderHeader={close => this._onRenderHeader(close)}
            onOpen={() => this._onOpenLightBox(2)}
            springConfig={anim}
            swipeToDismiss={false}
          >
            <CImage
              style={styles.img_three_image}
              resizeMode="contain"
              source={{ uri: images[2].sizes.woocommerce_single }}
            />
          </Lightbox>
        </View>
      )
    }

    if (images.length >= 4) { // >= 4 photos
      return (
        <View style={styles.con_light_box}>
          <Lightbox style={styles.con_light_box_item}
            underlayColor={Colors.WHITE_COLOR}
            renderContent={() => this._onRenderMultiImage(0)}
            renderHeader={close => this._onRenderHeader(close)}
            onOpen={() => this._onOpenLightBox(0)}
            springConfig={anim}
            swipeToDismiss={false}>
            <CImage
              style={styles.img_image}
              resizeMode="contain"
              source={{ uri: images[0].sizes.woocommerce_gallery_thumbnail }}
            />
          </Lightbox>

          <Lightbox style={styles.con_light_box_item}
            underlayColor={Colors.WHITE_COLOR}
            renderContent={() => this._onRenderMultiImage(1)}
            renderHeader={close => this._onRenderHeader(close)}
            onOpen={() => this._onOpenLightBox(1)}
            springConfig={anim}
            swipeToDismiss={false}>
            <CImage
              style={styles.img_image}
              resizeMode="contain"
              source={{ uri: images[1].sizes.woocommerce_gallery_thumbnail }}
            />
          </Lightbox>

          <Lightbox style={styles.con_light_box_item}
            underlayColor={Colors.WHITE_COLOR}
            renderContent={() => this._onRenderMultiImage(2)}
            renderHeader={close => this._onRenderHeader(close)}
            onOpen={() => this._onOpenLightBox(2)}
            springConfig={anim}
            swipeToDismiss={false}>
            <CImage
              style={styles.img_image}
              resizeMode="contain"
              source={{ uri: images[2].sizes.woocommerce_gallery_thumbnail }}
            />
          </Lightbox>

          <Lightbox style={styles.con_light_box_item}
            underlayColor={Colors.WHITE_COLOR}
            renderContent={() => this._onRenderMultiImage(3)}
            renderHeader={close => this._onRenderHeader(close)}
            onOpen={() => this._onOpenLightBox(3)}
            springConfig={anim}
            swipeToDismiss={false}>
            <CImage
              style={styles.img_image}
              resizeMode="contain"
              source={{ uri: images[3].sizes.woocommerce_gallery_thumbnail }}
              renderContent={
                images.length > 4 ?
                  (
                    <View style={styles.con_bg}>
                      <CText style={styles.txt_more}>{"+" + (images.length - 4)}</CText>
                    </View>
                  ) : null
              }
            />
          </Lightbox>
        </View>
      )
    }
    return null;
  }

}

export default CLightBox;