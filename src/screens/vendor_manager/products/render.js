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
} from 'native-base';
/* COMPONENTS */
import CHeader from "~/components/CHeader";
import CLoading from '~/components/CLoading';
import Column from '~/components/CLayout/Column';
/* COMMON */
import { Configs, Devices } from '~/config';
import { layoutWidth } from '~/utils/layout_width';
/* STYLES */
import styles from './style';

export const ViewVendorProducts = ({
  state = null,
  onFunction = {
    onPressBack: () => { }
  }
}) => {

  return (
    <Container style={styles.con}>
      <CHeader
        title={"products"}
        iconLeft_1={Configs.supportRTL ? "angle-right" : "angle-left"}
        iconRight_1={"none"}
        onPressLeft_1={onFunction.onPressBack}
      />
      {state._loading ? 
        <CLoading visible={true} />
      :
        <View style={[styles.con, {padding: Devices.pH(layoutWidth.width)}]}>
          <Column
            data={state._products}
            onFunction={{
              onPressItem: () => {},
            }}
            isService
          />
        </View>
      }
    </Container>
  )
}