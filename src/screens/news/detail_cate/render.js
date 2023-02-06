/**
 ** Name: 
 ** Author: 
 ** CreateAt: 
 ** Description: 
**/
/* LIBRARY */
import React from 'react';
import { View } from 'react-native';
import {
  Container, Title, Body
} from "native-base";
import { TabView } from 'react-native-tab-view';
/* COMPONENTS */
import CHeader from "~/components/CHeader";
import CText from '~/components/CText';
import CLoading from '~/components/CLoading';
import { SkypeIndicator } from "~/components/CIndicator";
/* COMMON */
import { Configs, Devices } from '~/config';
import { Colors } from '~/utils/colors';
import { cStyles } from '~/utils/styles';
/* STYLES */
import styles from './style';

const RenderLazyTab = () => <SkypeIndicator color={Colors.PRIMARY_COLOR} />

export const ViewNewsCategories = ({
  state = null,
  props = null,
  onFunction = {
    onPressBack: () => { },
    onPressCart: () => { },
    onPressSubCate: () => { },
    onRefresh: () => { },
    onLoadMore: () => { },
    onPressItem: () => { },
    onRenderScene: () => { },
    onRenderTabbar: () => { },
    onChangeTabIndex: () => { },
  }
}) => {
  return (
    <Container>
      <CHeader
        props={props}
        style={{ backgroundColor:'#18504D' }}
        titleComponent={
          <Body>
            <View style={styles.con_title}>
              <Title><CText style={[cStyles.txt_title_header, {color: '#fff'}]}>
                {Configs.html5Entities.decode(props.route.params.name)}
              </CText></Title>
            </View>
          </Body>
        }
        iconLeft_1={Configs.supportRTL ? "angle-right" : "angle-left"}
        iconRight_1={"shopping-cart"}
        onPressLeft_1={onFunction.onPressBack}
        onPressRight_1={onFunction.onPressCart}
      />

      {!state._loading &&
        <TabView
          initialLayout={styles.con_tab}
          navigationState={state}
          renderScene={onFunction.onRenderScene}
          renderTabBar={onFunction.onRenderTabbar}
          onIndexChange={onFunction.onChangeTabIndex}
          lazy={true}
          lazyPreloadDistance={0}
          renderLazyPlaceholder={RenderLazyTab}
          tabBarPosition={'top'}
          removeClippedSubviews={Devices.OS === 'android'}
          swipeEnabled={false}
        />
      }

      <CLoading visible={state._loading} />
    </Container >
  )
}