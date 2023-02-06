/**
 ** Name: 
 ** Author: 
 ** CreateAt: 
 ** Description: 
**/
/* LIBRARY */
import React from 'react';
import { Platform } from 'react-native';
import {
  Container, Button, Content
} from 'native-base';
import Share from 'react-native-share';
/* COMPONENTS */
import CHeader from "~/components/CHeader";
import CText from '~/components/CText';
import CImage from '~/components/CImage';
/* COMMON */
import { Assets, Devices, Configs } from '~/config';
import { Colors } from '~/utils/colors';
import { layoutWidth } from '~/utils/layout_width';
/* STYLES */
import styles from './style';

const url = Configs.hostApi;
const title = 'Awesome Contents';
const message = 'Please check this out.';
const options = Platform.select({
  ios: {
    activityItemSources: [
      {
        placeholderItem: { type: 'url', content: url },
        item: {
          default: { type: 'url', content: url },
        },
        subject: {
          default: title,
        },
        linkMetadata: { originalUrl: url, url, title },
      },
      {
        placeholderItem: { type: 'text', content: message },
        item: {
          default: { type: 'text', content: message },
          message: null, // Specify no text to share via Messages app.
        },
      },
    ],
  },
  default: {
    title,
    subject: title,
    message: `${message} ${url}`,
  },
});

class ShareScreen extends React.Component {

  /* FUNCTIONS */
  _onPressBack = () => {
    this.props.navigation.goBack();
  }

  _onPressShare = () => {
    Share.open(options);
  }

  /* RENDER */
  render() {
    return (
      <Container>
        <CHeader
          style={{backgroundColor: '#18504D'}}
          title={"invite_friends"}
          iconLeft_1={Configs.supportRTL ? "angle-right" : "angle-left"}
          iconRight_1={"none"}
          onPressLeft_1={this._onPressBack}
        />

        <Content>
          <CImage
            style={styles.img_share}
            source={Assets.image_share}
          />

          <Button block
            style={[styles.con_btn,
            {
              backgroundColor: '#18504D',
              marginHorizontal: Devices.pH(layoutWidth.width)
            }]}
            onPress={this._onPressShare}>
            <CText style={styles.txt_btn} i18nKey={'share'} />
          </Button>
        </Content>
      </Container >
    )
  }
}

export default ShareScreen;