/**
 ** Name: 
 ** Author: 
 ** CreateAt: 
 ** Description: 
**/
/* LIBRARY */
import React from 'react';
import {
  Container
} from 'native-base';
/* COMPONENTS */
import CHeader from "~/components/CHeader";
import Horizontal from '~/components/CLayout/Horizontal';
import CLoading from '~/components/CLoading';
/* COMMON */
import { layoutWidth } from '~/utils/layout_width';
import { Configs, Devices } from '~/config';

export const ViewBookmark = ({
  state = null,
  onFunctions = {
    onPressBack: () => { },
    onPressDeleteAll: () => { },
    onPressItem: () => { },
    onPressDeleteBookmark: () => { }
  }
}) => {
  return (
    <Container>
      <CHeader
        title={"bookmark"}
        iconLeft_1={Configs.supportRTL ? "angle-right" : "angle-left"}
        iconRight_1={state._news.length > 0 ? "align-slash" : "none"}
        onPressLeft_1={onFunctions.onPressBack}
        onPressRight_1={onFunctions.onPressDeleteAll}
      />

      {!state._loading &&
        <Horizontal
          contentStyle={{ paddingHorizontal: Devices.pH(layoutWidth.width) }}
          data={state._news}
          onFunction={{
            onPressItem: onFunctions.onPressItem,
            onPressDeleteBookmark: onFunctions.onPressDeleteBookmark
          }}
          showBookmark={false}
          isNews
          leftThumb
        />
      }

      <CLoading visible={state._loading} />
    </Container >
  )
}