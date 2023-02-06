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
  Container
} from "native-base";
import { TabView } from 'react-native-tab-view';
/* COMPONENTS */
import CHeader from "~/components/CHeader";
import CLoading from '~/components/CLoading';
import { CVendor } from '~/components/CVendor';
import { SkypeIndicator } from '~/components/CIndicator';
/* COMMON */
import { Devices, Configs } from '~/config';
import { Colors } from '~/utils/colors';
import { layoutWidth } from '~/utils/layout_width';
/* STYLES */
import styles from './style';

const RenderLazyTab = () => <SkypeIndicator color={Colors.PRIMARY_COLOR} />

export const ViewVendorDetail = ({
  state = null,
  props = null,
  onFunction = {
    onPressBack: () => {},
    onRenderScene: () => { },
    onRenderTabBar: () => { },
    onChangeTabIndex: () => { },
  }
}) => {
  return (
    <Container style={styles.con}>
      <CHeader
        props={props}
        title={state._data ? Configs.html5Entities.decode(state._data.vendor_shop_name) : ''}
        iconLeft_1={Configs.supportRTL ? "angle-right" : "angle-left"}
        isI18n={false}
        iconRight_1={"none"}
        onPressLeft_1={onFunction.onPressBack}
      />
      {state._loading ? 
        <CLoading visible={true} />
      :
      state._data &&
        <>
        <View style={[styles.con_banner, { paddingHorizontal: Devices.pH(layoutWidth.width) }]}>
          <CVendor data={state._data} />
        </View>
        <TabView
          initialLayout={styles.con_tab}
          navigationState={state}
          renderScene={onFunction.onRenderScene}
          renderTabBar={onFunction.onRenderTabBar}
          onIndexChange={onFunction.onChangeTabIndex}
          lazy={true}
          lazyPreloadDistance={0}
          renderLazyPlaceholder={RenderLazyTab}
          tabBarPosition={'top'}
          removeClippedSubviews={Devices.OS === 'android'}
          swipeEnabled={false}
        />
        </>
      }

    </Container>
  )
}