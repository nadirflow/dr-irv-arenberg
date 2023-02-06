/**
 ** Name: 
 ** Author: 
 ** CreateAt: 
 ** Description: 
**/
/* LIBRARY */
import React from 'react';
import { View, FlatList, TouchableOpacity } from 'react-native';
import {
  Container, Header, Left, Body, Title, Right,
} from "native-base";
import Icon from 'react-native-fontawesome-pro';
/* COMPONENTS */
import CText from '~/components/CText';
import CImage from '~/components/CImage';
import CLoading from '~/components/CLoading';
/* COMMON */
import { Devices } from '~/config';
import { Colors } from '~/utils/colors';
import { cStyles } from '~/utils/styles';
import { layoutWidth } from '~/utils/layout_width';
/* STYLES */
import styles from './style'
import { Button } from 'react-native';

const renderItem = (item, state, onPress) => {

  return (
    <TouchableOpacity style={styles.con_item}
      onPress={() => { state._activeId === item.id ? null : onPress(item) }}
      activeOpacity={.5}
    >
      <CImage
        style={styles.img_item}
        source={item.images}
      />
      <View style={styles.con_item_content}>
        {item.id === state._activeId &&
          <Icon name={"check-circle"} size={Devices.fS(20)} type={"solid"} color={Colors.PRIMARY_COLOR} />
        }
        <CText style={[styles.txt_title, item.id === state._activeId && { color: Colors.PRIMARY_COLOR }]} numberOfLines={2} >{item.title}</CText>
      </View>
    </TouchableOpacity>
  )
}

export const ViewDemo = ({
  state = null,
  props = null,
  onFunction = {
    onPressBack: () => { },
    onPressLink: () => { },
    onPressItem: () => { },
  }
}) => {
  return (
    <Container>
      <Header hasSegment transparent style={cStyles.con_header} iosBarStyle={'dark-content'} androidStatusBarColor={Colors.WHITE_COLOR} translucent={false}>
        <Left>
          <Button transparent onPress={onFunction.onPressBack}>
            <Icon name={"chevron-left"} size={Devices.fS(20)} type={"light"} color={cStyles.txt_title_header.color} />
          </Button>
        </Left>
        <Body style={styles.con_header_center}>
          <View style={styles.con_title}>
            <Title><CText style={cStyles.txt_title_header} i18nKey={'demo'} /></Title>
          </View>
        </Body>
        <Right>
          <Icon name={"link"} size={Devices.fS(20)} type={"light"} onPress={onFunction.onPressLink} color={cStyles.txt_title_header.color} />
        </Right>
      </Header>

      <FlatList contentContainerStyle={{ marginHorizontal: Devices.pH(layoutWidth.width) }}
        data={state._data}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        renderItem={({ item, index }) => renderItem(item, state, onFunction.onPressItem)}
        keyExtractor={(item, index) => index.toString()}
        numColumns={2}
      />

      <CLoading visible={state._loading} />
    </Container >
  )
}