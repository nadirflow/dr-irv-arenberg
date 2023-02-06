/**
 ** Name: 
 ** Author: 
 ** CreateAt: 
 ** Description: 
**/
/* LIBRARY */
import React from 'react';
import { View } from 'react-native';
import { Container } from "native-base";
import HTML from 'react-native-render-html';
import { WebView } from 'react-native-webview';
/* COMPONENTS */
import CHeader from "~/components/CHeader";
/* COMMON */
import { Devices, Configs } from '~/config';
import { layoutWidth } from '~/utils/layout_width';
import { cStyles } from '~/utils/styles';

export const ViewHomePostDetail = ({
  data = null,
  state = null,
  onFunction = {
    onPressBack: () => { },
  }
}) => {
  return (
    <Container>
      <CHeader
        titleComponent={
          <View>
            <HTML
              html={data.caption}
              tagsStyles={{ p: cStyles.txt_title_header }}
            />
          </View>
        }
        iconLeft_1={Configs.supportRTL ? "angle-right" : "angle-left"}
        onPressLeft_1={onFunction.onPressBack}
      />
      <WebView showsHorizontalScrollIndicator={false}
        style={{ paddingHorizontal: Devices.pH(layoutWidth.width) }}
        source={{ uri: data.url }} />
    </Container>
  )
}
