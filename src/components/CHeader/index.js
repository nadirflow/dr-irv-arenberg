/**
 ** Name: 
 ** Author: 
 ** CreateAt: 
 ** Description: 
**/
/* LIBRARY */
import React from 'react';
import { Pressable, View } from 'react-native';
import {
  Header,
  Title,
  Left,
  Body,
  Right,
  Button
} from 'native-base';
import Icon from 'react-native-fontawesome-pro';
/* COMPONENTS */
import CText from '~/components/CText';
/* COMMON */
import { cStyles } from '~/utils/styles';
import { Colors } from '~/utils/colors';
import { Devices, Configs } from '~/config';
import { layoutWidth } from '~/utils/layout_width';
/* STYLES */
import styles from './style';

const CHeader = ({
  props = null,

  style = {},
  rounded = false,
  searchBar = false,

  title = "home",
  titleComponent = null,
  isI18n = true,
  customTitle = false,
  iconLeft_1 = null,
  iconLeft_2 = null,
  iconRight_1 = null,
  iconRight_2 = null,

  onPressLeft_1 = () => { },
  onPressLeft_2 = () => { },
  onPressRight_1 = () => { },
  onPressRight_2 = () => { },
}) => {
  // console.log(Configs.supportRTL)
  // console.log(iconLeft_1);
  return (
    <Header
      transparent
      hasSegment
      searchBar={searchBar}
      rounded={rounded}
      translucent={false}
      style={[cStyles.con_header, {
        paddingLeft: Devices.pH(layoutWidth.width),
        paddingRight: Devices.pH(layoutWidth.width)
      }, style]}
      iosBarStyle={'dark-content'}
      androidStatusBarColor={'#18504D'}>
      {/** LEFT */}
      {!Configs.supportRTL ?
        <>
          {iconLeft_1 === "none" && <Left />}

          {(iconLeft_1 !== "none" && iconLeft_1 || iconLeft_2) &&
            <Left style={[cStyles.row_align_center,cStyles.ml_5]}>
              {iconLeft_1 &&
                <Button transparent onPress={onPressLeft_1} style={[ {elevation: 15}]}>
                  <Icon
                    containerStyle={{ marginLeft: iconLeft_1 === "angle-left" ? -5 : 0 }}
                    name={iconLeft_1}
                    color={Colors.WHITE_COLOR}
                    size={Devices.fS(20)}
                    type={"regular"} />
                </Button>
              }

              {iconLeft_2 &&
                <Button transparent onPress={onPressLeft_2}>
                  <Icon name={iconLeft_2}
                    color={cStyles.txt_title_header.color}
                    size={Devices.fS(20)}
                    type={"regular"} />
                </Button>
              }
            </Left>
          }
        </>
        :
        <>
          {iconRight_1 === "none" && <Left />}

          {(iconRight_1 !== "none" && iconRight_1 || iconRight_2) &&
            <Left style={[cStyles.row_align_center]}>
              {iconRight_1 &&
                <Button style={cStyles.pr_20} transparent onPress={onPressRight_1}>
                  <Icon name={iconRight_1}
                    color={"#000000"}
                    size={Devices.fS(20)}
                    type={'regular'} />

                  {props && props.cart && props.cart.length > 0 &&
                    <View style={styles.con_badge_RTL}>
                      <CText style={styles.txt_badge}>
                        {props.cart.length > 9 ?
                          "+9" :
                          props.cart.length
                        }
                      </CText>
                    </View>
                  }
                </Button>
              }

              {iconRight_2 &&
                <Button transparent onPress={onPressRight_2}>
                  <Icon name={iconRight_2}
                    color={'#fff'}
                    size={Devices.fS(20)}
                    type={'regular'} />
                </Button>
              }
            </Left>
          }
        </>
      }

      {/** CENTER */}
      {titleComponent ?
        titleComponent
        :
        <Body style={styles.con_header_center}>
          <View style={styles.con_title}>
            <Title>
              {!customTitle && isI18n ?
                <CText style={[cStyles.txt_title_header, {color: '#fff'}]} i18nKey={title} />
                :
                <CText style={[cStyles.txt_title_header, {color: '#fff'}]}>{title}</CText>
              }
            </Title>
          </View>
        </Body>
      }

      {/** RIGHT */}
      {!Configs.supportRTL ?
        <>
          {iconRight_1 === "none" && <Right />}

          {(iconRight_1 !== "none" && iconRight_1 || iconRight_2) &&
            <Right style={cStyles.row_align_center}>
              {iconRight_2 &&
                <Button style={cStyles.pr_20} transparent onPress={onPressRight_2}>
                  <Icon name={iconRight_2}
                    color={'#fff'}
                    size={Devices.fS(20)}
                    type={'regular'} />
                </Button>
              }

              {iconRight_1 &&
                <Button transparent onPress={onPressRight_1} style={[ cStyles.mr_5]}>
                  <Icon name={iconRight_1}
                    color={"#fff"}
                    size={Devices.fS(20)}
                    type={'regular'} />

                  {props && props.cart && props.cart.length > 0 &&
                    <View style={styles.con_badge}>
                      <CText style={styles.txt_badge}>
                        {props.cart.length > 9 ?
                          "+9" :
                          props.cart.length
                        }
                      </CText>
                    </View>
                  }
                </Button>
              }
            </Right>
          }
        </>
        :
        <>
          {iconLeft_1 === "none" && <Right />}

          {(iconLeft_1 !== "none" && iconLeft_1 || iconLeft_2) &&
            <Right style={cStyles.row_align_center}>
              {iconLeft_2 &&
                <Button transparent onPress={onPressLeft_2} style={[ cStyles.ml_5]}>
                  <Icon name={iconLeft_2}
                    color={cStyles.txt_title_header.color}
                    size={Devices.fS(20)}
                    type={"regular"} />
                </Button>
              }

              {iconLeft_1 &&
                <Button style={[{ marginRight: -17 }]} transparent onPress={onPressLeft_1} >
                  <Icon name={iconLeft_1}
                    color={cStyles.txt_title_header.color}
                    size={Devices.fS(20)}
                    type={"regular"} />
                </Button>
              }
            </Right>
          }
        </>
      }
    </Header>
  )
}

export default CHeader;