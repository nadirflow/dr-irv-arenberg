/**
 ** Name: 
 ** Author: 
 ** CreateAt: 
 ** Description: 
**/
/* LIBRARY */
import React from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import {
  Container
} from "native-base";
/* COMPONENTS */
import CLoading from '~/components/CLoading';
/* COMMON */
import { Devices, Configs, Assets } from '~/config';
import { Colors } from '~/utils/colors';
import { layoutWidth } from '~/utils/layout_width';
/* STYLES */
import styles from './style';
import { cStyles } from '~/utils/styles';
import Icon from 'react-native-fontawesome-pro';
import CText from '~/components/CText';



export const ViewVendorAbout = ({
  state = null,
  props = null,
  onFunction = {
    onPressSocial: () => { }
  }
}) => {
  return (
    <Container style={styles.con}>
      <View style={[styles.con_info, {
        paddingHorizontal: Devices.pH(layoutWidth.width)
      },
      Configs.supportRTL && cStyles.row_justify_end
      ]}>
        <View style={styles.con_info_item}>
          <Icon name={"map"} size={Devices.fS(18)} type={"light"} />
          <CText style={styles.txt_info} numberOfLines={10} >{props.data.vendor_address}</CText>
        </View>
        <View style={styles.con_info_item}>
          <Icon name={"phone-alt"} size={Devices.fS(18)} type={"light"} />
          <CText style={styles.txt_info} numberOfLines={10}>{props.data.vendor_phone}</CText>
        </View>
        <View style={styles.con_info_item}>
          <Icon name={"envelope"} size={Devices.fS(18)} type={"light"} />
          <CText style={styles.txt_info} numberOfLines={10}>{props.data.vendor_email}</CText>
        </View>
      </View>
      {/* <View style={[styles.con_bottom_socials,
        { paddingHorizontal: Devices.pH(layoutWidth.width) },
        Configs.supportRTL && cStyles.row_justify_end]}
      >
        <TouchableOpacity
          style={[styles.con_icon_social, {
            backgroundColor: Colors.FACEBOOK_COLOR
          }, !Configs.supportRTL ? cStyles.mr_10 : cStyles.ml_10]}
          onPress={() => onFunction.onPressSocial("fb")}
        >
          <Icon name={"facebook-f"} color={Colors.WHITE_COLOR} size={Devices.fS(18)} type={"brands"} />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.con_icon_social, {
            backgroundColor: Colors.GOOGLE_PLUS_COLOR
          }, !Configs.supportRTL ? cStyles.mr_10 : cStyles.ml_10]} 
          onPress={() => onFunction.onPressSocial("fb")}
        >
          <Icon name={"google"} color={Colors.WHITE_COLOR} size={Devices.fS(18)} type={"brands"} />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.con_icon_social, {
            backgroundColor: Colors.TWITTER_COLOR
          }, !Configs.supportRTL ? cStyles.mr_10 : cStyles.ml_10]} 
          onPress={() => onFunction.onPressSocial("fb")}
        >
          <Icon name={"twitter"} color={Colors.WHITE_COLOR} size={Devices.fS(18)} type={"brands"} />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.con_icon_social, !Configs.supportRTL ? cStyles.mr_10 : cStyles.ml_10]} 
          onPress={() => onFunction.onPressSocial("fb")}
        >
          <Image style={styles.con_icon_social} source={Assets.icon_instagram} resizeMode={"contain"} />
        </TouchableOpacity>
      </View> */}
    </Container>
  )
}