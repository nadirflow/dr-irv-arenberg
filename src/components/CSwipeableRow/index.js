/**
 ** Name: 
 ** Author: 
 ** CreateAt: 
 ** Description: 
**/
/* LIBRARY */
import React from 'react';
import { View, I18nManager, Animated } from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { RectButton } from 'react-native-gesture-handler';
import Icon from 'react-native-fontawesome-pro';
/** COMPONENT */
import CText from '../CText';
/* COMMON */
import { Colors } from '~/utils/colors';
import { cStyles } from '~/utils/styles';
import { Devices } from '~/config';

const WIDTH_BUTTON = 64;

class CSwipeableRow extends React.Component {
  constructor(props) {
    super(props);
    this._rightButtons = props.rightButtons || [];
    this._leftButtons = props.leftButtons || [];
  }

  /* FUNCTIONS */
  updateRef = ref => {
    this._swipeableRow = ref;
  };

  close = () => {
    this._swipeableRow.close();
  };

  renderLeftActions = (progress, dragX) => {
    let trans = dragX.interpolate({
      inputRange: [0, 50, 100, 101],
      outputRange: [-20, 0, 0, 1],
    });

    return (
      <RectButton style={styles.leftAction} onPress={this.close}>
        <Animated.Text
          style={[
            styles.actionText,
            {
              transform: [{ translateX: trans }],
            },
          ]}>
          Archive
        </Animated.Text>
      </RectButton>
    );
  };

  renderRightAction = (index, text, icon, color, onPress, x, progress) => {
    let trans = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [x, 0],
    });

    let pressHandler = () => {
      this.close();
      onPress();
    };

    return (
      <Animated.View key={index.toString()} style={{ flex: 1, transform: [{ translateX: trans }], paddingLeft: index === 0 ? 10 : 0 }}>
        <RectButton style={[cStyles.full_center, { backgroundColor: color }]}
          onPress={pressHandler}>
          <Icon name={icon} size={15} color={Colors.WHITE_COLOR} type={'solid'} />
          <CText style={[cStyles.txt_body_meta_item, { color: Colors.WHITE_COLOR, marginTop: 5, fontSize: Devices.fS(10) }]}>{text}</CText>
        </RectButton>
      </Animated.View>
    );
  };

  renderRightActions = progress => (
    <View style={{ width: WIDTH_BUTTON * this._rightButtons.length, flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row' }}>
      {this._rightButtons.map((item, index) => {
        return this.renderRightAction(index, item.title, item.icon, item.color, item.onPress, WIDTH_BUTTON * this._rightButtons.length, progress);
      })}
    </View>
  );

  /* RENDER */
  render() {
    return (
      <Swipeable
        ref={this.updateRef}
        friction={2}
        leftThreshold={30}
        rightThreshold={40}
        renderLeftActions={this._leftButtons.length > 0 ? this.renderLeftActions : null}
        renderRightActions={this._rightButtons.length > 0 ? this.renderRightActions : null}
      >
        {this.props.children}
      </Swipeable>
    )
  }

}

export default CSwipeableRow;