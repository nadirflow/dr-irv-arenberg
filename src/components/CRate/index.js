/**
 ** Name: 
 ** Author: 
 ** CreateAt: 
 ** Description: 
**/
/* LIBRARY */
import React from 'react';
import { Modal, TouchableOpacity, View, Text } from 'react-native';
import {
  Container, Content,
} from "native-base";
import Icon from 'react-native-fontawesome-pro';
/* COMPONENTS */
import CText from '~/components/CText';
import CImage from '../CImage';
/* COMMON */
import { Devices, Assets } from '~/config';
import { Colors } from '~/utils/colors';
import { cStyles } from '~/utils/styles';
/* STYLES */
import styles from './style'
import StarRating from 'react-native-star-rating';


class CRate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      _star: 0,
    }
  }

  /* FUNCTIONS */

  /* LIFE CYCLE */

  /* RENDER */
  render() {
    let { visible, onRequestClose, onOK, appName } = this.props;
    return (
      <Modal
        visible={visible}
        animationType={'fade'}
        onRequestClose={onRequestClose}
        transparent
      >
        <TouchableOpacity style={styles.con_bg} onPress={onRequestClose} activeOpacity={1}>
          <TouchableOpacity style={styles.con_modal} activeOpacity={1}>
            <View style={styles.con_modal_content}>
              <View style={styles.con_img}>
                <CImage
                  style={styles.img}
                  source={Assets.logo}
                  resizeMode={'contain'}
                />
              </View>

              <CText style={cStyles.txt_title_group}>{appName}</CText>
              <CText style={styles.txt_content} i18nKey={"rating_for_app"} />
            </View>
            <View style={styles.con_star}>
              <StarRating
                starStyle={styles.con_star_for_review}
                maxStars={5}
                rating={this.state._star}
                starSize={25}
                selectedStar={(rating) => {
                  this.setState({ _star: rating });
                  setTimeout(() => {
                    this.props.onOK()
                  }, 200);
                }}
                animation={'tada'}
                fullStarColor={Colors.YELLOW_COLOR}
                emptyStarColor={Colors.YELLOW_COLOR}
              />
            </View>

            <View style={styles.con_btn}>
              <TouchableOpacity style={styles.con_btn_left} onPress={onRequestClose}>
                <CText style={[cStyles.txt_title_button, { color: Colors.TEXT_BASE_COLOR, fontFamily: Devices.zsHeadlineMedium }]} i18nKey={'remind_me_later'} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.con_btn_right} onPress={onOK}>
                <CText style={[cStyles.txt_title_button, { color: Colors.TEXT_BASE_COLOR }]} i18nKey={'ok'} />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    )
  }

}

export default CRate;