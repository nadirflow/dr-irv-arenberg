/**
 ** Name: 
 ** Author: 
 ** CreateAt: 
 ** Description: 
**/
/* LIBRARY */
import React from 'react';
import { connect } from 'react-redux';
import { View, FlatList, Linking, TouchableOpacity } from 'react-native';
import {
  Container, Content, Text
} from 'native-base';
import Icon from 'react-native-fontawesome-pro';
import VersionCheck from 'react-native-version-check';
/* COMPONENTS */
import CHeader from "~/components/CHeader";
import CText from '~/components/CText';
import CImage from '~/components/CImage';
import CViewRow from "~/components/CViewRow";
/* COMMON */
import { cStyles } from '~/utils/styles';
import { Configs, Assets, Devices } from '~/config';
import { layoutWidth } from '~/utils/layout_width';
/* STYLES */
import styles from './style';

const INIT_ROW = [
  {
    icon: "award",
    title: "app_name",
    slug: "app_name",
    onPress: () => { }
  },
  {
    icon: "code-merge",
    title: "app_version",
    slug: "app_version",
    onPress: () => { }
  },
  {
    icon: "phone-alt",
    title: "phone",
    slug: "contact",
    onPress: (phone) => Linking.openURL('tel:' + phone).catch(error => console.log('Error call'))
  },
  {
    icon: "envelope",
    title: "email",
    slug: "email",
    onPress: (email) => Linking.openURL('mailto:' + email).catch(error => console.log('Error send mail'))
  },
  {
    icon: "map-marker-alt",
    title: "address",
    slug: "address",
    onPress: () => { }
  }
]

class ContactUs extends React.PureComponent {
  constructor(props) {
    super(props);
    this._settings = {
      app_name: (props.setting && props.setting.general.app_name) ? props.setting.general.app_name : "-",
      app_version: (props.setting && props.setting.general.app_version) ? props.setting.general.app_version : "-",
      contact: (props.setting && props.setting.general.contact) ? props.setting.general.contact : "-",
      email: (props.setting && props.setting.general.email) ? props.setting.general.email : "-",
      address: (props.setting && props.setting.general.address) ? props.setting.general.address : "-"
    }
    this._appVersion = VersionCheck.getCurrentVersion()
    this._logo = Assets.full_logo_vertical;
    if (props.setting.general.app_logo.sizes) {
      if (props.setting.general.app_logo.sizes.medium !== "") {
        this._logo = { uri: props.setting.general.app_logo.sizes.medium };
      }
    }
  }

  /* FUNCTIONS */
  _onPressRow = (routeName) => {
    if (routeName) {
      this.props.navigation.navigate(routeName);
    }
  }

  _onPressBack = () => {
    this.props.navigation.goBack();
  }

  /** LIFE CYCLE */
  componentDidMount() {
  }
  /* RENDER */
  render() {
    return (
      <Container>
        <CHeader
          style={{backgroundColor: '#18504D' }}
          title={"contact_us"}
          iconLeft_1={Configs.supportRTL ? "angle-right" : "angle-left"}
          iconRight_1={"none"}
          onPressLeft_1={this._onPressBack}
        />

        <Content>
          {/* <View style={styles.con_img_logo}>
            <CImage style={styles.img_logo} source={this._logo} resizeMode={'contain'} />
          </View> */}

          <FlatList contentContainerStyle={{ marginHorizontal: Devices.pH(layoutWidth.width) }}
            data={INIT_ROW}
            renderItem={({ item, index }) => {
              return (
                <TouchableOpacity onPress={() => item.onPress(this._settings[item.slug])}>
                  <CViewRow style={cStyles.pv_15} between
                    leftComp={
                      <CViewRow
                        leftComp={
                          <Icon name={item.icon}
                            color={'#18504D'}
                            size={cStyles.ic_left_detail.size}
                            type={cStyles.ic_left_detail.type} />
                        }
                        rightComp={
                          <View style={[
                            styles.con_content_center_row,
                            Configs.supportRTL ?
                              cStyles.column_align_end :
                              cStyles.column_align_start
                          ]}>
                            {item.title &&
                              <CText style={[styles.txt_row,
                              Configs.supportRTL ? cStyles.pr_20 : cStyles.pl_20, {color: '#000'}]} i18nKey={item.title} />
                            }
                          </View>
                        }
                      />
                    }
                    rightComp={
                      <View style={[{ flex: .8 },
                      Configs.supportRTL ? cStyles.column_align_start : cStyles.column_align_end]}>
                        <Text style={[styles.txt_row, Configs.supportRTL ? { textAlign: "left" } : { textAlign: "right", color:'#000' }]} numberOfLines={3}>
                          {item.slug === "app_version" ? this._appVersion : this._settings[item.slug]}
                        </Text>
                      </View>
                    }
                  />
                </TouchableOpacity>
              )
            }}
            keyExtractor={(item, index) => index.toString()}
            ItemSeparatorComponent={() => <View style={styles.con_separator_option} />}
            removeClippedSubviews={Devices.OS === 'android'}
          />
        </Content>
      </Container>
    )
  }
}

const mapStateToProps = state => {
  return {
    setting: state.setting.app
  }
}

export default connect(mapStateToProps, null)(ContactUs);