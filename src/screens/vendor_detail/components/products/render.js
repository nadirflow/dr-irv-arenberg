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
/* COMPONENTS */
import CLoading from '~/components/CLoading';
import Column from '~/components/CLayout/Column';
/* COMMON */
/* STYLES */
import styles from './style';

export const ViewVendorProducts = ({
  state = null,
  props = null,
  onFunction = {
    onRefresh: () => { },
    onLoadMore: () => { },
    onPressItem: () => { }
  }
}) => {
  return (
    <Container style={styles.con}>
      {state._loading ? 
        <CLoading visible={true} />
      :
        <Column
          data={state._products}
          onFunction={{
            onPressItem: onFunction.onPressItem,
          }}
          isService
          refreshing={state._refreshing}
          paging={{
            onRefresh: onFunction.onRefresh,
            onLoadMore: onFunction.onLoadMore
          }}
        />
      }

    </Container>
  )
}