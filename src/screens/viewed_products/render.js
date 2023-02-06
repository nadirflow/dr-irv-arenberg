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
  Container, Header, Left, Right, Body, Title, Button
} from 'native-base';
import Icon from 'react-native-fontawesome-pro';
/* COMPONENTS */
import CLoading from '~/components/CLoading';
import CText from '~/components/CText';
import Column from '~/components/CLayout/Column';
/* COMMON */
import { Devices } from '~/config';
import { Colors } from '~/utils/colors';
import { cStyles } from '~/utils/styles';
import { layoutWidth } from '~/utils/layout_width';
/* STYLES */
import styles from './style';

export const ViewViewedProducts = ({
  state = null,
  data = {
    viewedProducts: []
  },
  onFunction = {
    onPressProductItem: () => { },
    onPressAddCart: () => { },
    onPressBack: () => { },
    onPressCart: () => { }
  }
}) => {
  return (
    <Container>
      <Header hasSegment transparent style={cStyles.con_header} iosBarStyle={'dark-content'} androidStatusBarColor={Colors.WHITE_COLOR} translucent={false}>
        <Left>
          <Button transparent onPress={onFunction.onPressBack}>
            <Icon name={'chevron-left'} color={cStyles.txt_title_header.color} size={Devices.fS(20)} type={'light'} />
          </Button>
        </Left>
        <Body style={styles.con_header_center}>
          <View style={styles.con_title}>
            <Title><CText style={cStyles.txt_title_header} i18nKey={'viewed_products'} /></Title>
          </View>
        </Body>
        <Right>
          <Button transparent onPress={onFunction.onPressCart}>
            <Icon name={'shopping-cart'} color={cStyles.txt_title_header.color} size={Devices.fS(20)} type={'light'} />
            {state._cart.length > 0 &&
              <View style={styles.con_badge}>
                <CText style={styles.txt_badge}>{state._cart.length > 9 ? "+9" : state._cart.length}</CText>
              </View>
            }
          </Button>
        </Right>
      </Header>

      {!state._loading &&
        <Column
          contentStyle={{ paddingHorizontal: Devices.pH(layoutWidth.width) }}
          data={data.viewedProducts}
          onFunction={{
            onPressItem: onFunction.onPressProductItem,
            onPressAddCart: onFunction.onPressAddCart
          }}
          isService
        />
      }

      <CLoading visible={state._loading} />
    </Container>
  )
}