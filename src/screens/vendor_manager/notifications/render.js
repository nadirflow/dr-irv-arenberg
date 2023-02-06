/**
 ** Name: 
 ** Author: 
 ** CreateAt: 
 ** Description: 
**/
/* LIBRARY */
import React from 'react';
import { FlatList, View } from 'react-native';
import {
  Card,
  Container,
} from "native-base";
import Icon from 'react-native-fontawesome-pro';
import moment from 'moment';
/* COMPONENTS */
import CHeader from "~/components/CHeader";
import CText from '~/components/CText';
import CLoading from '~/components/CLoading';
/* COMMON */
import { Devices, Configs } from '~/config';
import { Colors } from '~/utils/colors';
import { layoutWidth } from '~/utils/layout_width';
/* STYLES */
import styles from './style';

const renderItem = (item, index) => {
  return (
    <Card style={styles.con_item}>
      <View style={styles.con_img_item}>
        <Icon name={'bell'} color={Colors.WHITE_COLOR} size={Devices.fS(25)} type={'solid'} />
      </View>
      <View style={styles.con_item_content}>
        <CText style={styles.txt_item_name} numberOfLines={100}>{item.message}</CText>
        <View style={styles.con_item_title}>
          <CText style={styles.txt_item_time}>{moment(item.created).format(`${Configs.formatTime} ${Configs.formatDate}`)}</CText>
          {/* <CText style={styles.txt_item_des} >{item.message_type}</CText> */}
        </View>
      </View>
    </Card>
  )
}
export const ViewVendorNotifications = ({
  state = null,
  props = null,
  onFunction = {
    onPressBack: () => { },
    onRefresh: () => { },
    onLoadMore: () => { }
  }
}) => {
  return (
    <Container style={styles.con}>
      <CHeader
        title={"notification"}
        iconLeft_1={Configs.supportRTL ? "angle-right" : "angle-left"}
        iconRight_1={"none"}
        onPressLeft_1={onFunction.onPressBack}
      />
      {state._loading ? 
        <CLoading visible={true} />
      :
        <FlatList contentContainerStyle={{paddingHorizontal: Devices.pH(layoutWidth.width), flexGrow: 1}}
          data={state._notification}
          renderItem={({item, index}) => renderItem(item, index)}
          keyExtractor={(item, index) => index.toString()}
          refreshing={state._refreshing}
          onRefresh={onFunction.onRefresh}
          onEndReachedThreshold={0.5}
          onEndReached={onFunction.onLoadMore}
        />

      }
    </Container>
  )
}