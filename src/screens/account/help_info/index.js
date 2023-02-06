/**
 ** Name: 
 ** Author: 
 ** CreateAt: 
 ** Description: 
**/
/* LIBRARY */
import React from 'react';
import { connect } from 'react-redux';
import { View, TouchableOpacity, FlatList } from 'react-native';
import {
  Container, Left, Body, Right
} from 'native-base';
import Icon from 'react-native-fontawesome-pro';
import Rate, { AndroidMarket } from 'react-native-rate';
/* COMPONENTS */
import CHeader from "~/components/CHeader";
import CText from '~/components/CText';
import CViewRow from "~/components/CViewRow";
/* COMMON */
import { cStyles } from '~/utils/styles';
import { Devices, Configs } from '~/config';
import { layoutWidth } from '~/utils/layout_width';
/* STYLES */
import styles from './style';

class HelpInfo extends React.PureComponent {
  constructor(props) {
    super(props);
    this._init_row = [
      {
        icon: "address-card",
        title: "contact_us",
        routeName: 'ContactUs'
      },
      {
        icon: "clipboard-check",
        title: "privacy_policy",
        routeName: 'Policy',
        params: { id: Configs.idPagePolicy, type: "policy" }
      },
      {
        icon: "bookmark",
        title: "terms_condition",
        routeName: 'Policy',
        params: { id: Configs.idPageTerm, type: "terms" }
      },

      {
        icon: "stars",
        title: "rate_this_app",
        routeName: null
      }
    ]
  }

  /* FUNCTIONS */
  _onPressBack = () => {
    this.props.navigation.goBack();
  }

  _onPressCart = () => {
    this.props.navigation.navigate("Cart");
  }

  _onPressRow = (data) => {
    if (data.routeName) {
      let params = {};
      if (data.params) params = data.params;
      this.props.navigation.navigate(data.routeName, params);
    } else {
      let options = {
        AppleAppID: Configs.ratingAppleAppID,
        GooglePackageName: Configs.ratingGooglePackageName,
        preferredAndroidMarket: AndroidMarket.Google,
        preferInApp: true,
        openAppStoreIfInAppFails: true,
        inAppDelay: 1.0
      };
      Rate.rate(options, success => {
        console.log('success', success);
      });
    }
  }

  /* RENDER */
  render() {
    return (
      <Container>
        <CHeader
          style={{backgroundColor: '#18504D'}}
          props={this.props}
          title={"help_info"}
          iconLeft_1={Configs.supportRTL ? "angle-right" : "angle-left"}
          iconRight_1={"shopping-cart"}
          onPressLeft_1={this._onPressBack}
          onPressRight_1={this._onPressCart}
        />

        <FlatList
          contentContainerStyle={[styles.con_list, { marginHorizontal: Devices.pH(layoutWidth.width) }]}
          data={this._init_row}
          renderItem={({ item, index }) => {
            return (
              <TouchableOpacity onPress={() => this._onPressRow(item)}>
                <CViewRow style={cStyles.pv_15}
                  leftComp={
                    <CViewRow
                      leftComp={
                        <Icon name={item.icon}
                          color={'#18504D'}
                          size={cStyles.ic_left_detail.size}
                          type={cStyles.ic_left_detail.type} />
                      }
                      rightComp={
                        <Body style={[
                          styles.con_content_center_row,
                          Configs.supportRTL ? cStyles.column_align_end : cStyles.column_align_start
                        ]}>
                          <CText style={[styles.txt_row, 
                          Configs.supportRTL ? cStyles.pr_20 : cStyles.pl_20,{color:'#000000'}]}
                            i18nKey={item.title} />
                        </Body>
                      }
                    />
                  }
                  rightComp={
                    <Right style={[Configs.supportRTL ? cStyles.column_align_start : cStyles.column_align_end]}>
                      <Icon name={Configs.supportRTL ? "angle-left" : cStyles.ic_right_detail.name}
                        color={'#18504D'}
                        size={cStyles.ic_right_detail.size}
                        type={cStyles.ic_right_detail.type} />
                    </Right>
                  }
                />
              </TouchableOpacity>
            )
          }}
          keyExtractor={(item, index) => index.toString()}
          ItemSeparatorComponent={() => <View style={styles.con_separator_option} />}
          removeClippedSubviews={Devices.OS === 'android'}
        />
      </Container >
    )
  }
}

const mapStateToProps = state => {
  return {
    cart: state.cart.carts
  }
}

export default connect(mapStateToProps, null)(HelpInfo);