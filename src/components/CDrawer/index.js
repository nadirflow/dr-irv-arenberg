/**
 ** Name: 
 ** Author: 
 ** CreateAt: 
 ** Description: 
**/
/* LIBRARY */
import React from 'react';
import { View, TouchableOpacity, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import { Container, Accordion } from "native-base";
import Icon from 'react-native-fontawesome-pro';
import Rate, { AndroidMarket } from 'react-native-rate';
/* COMPONENTS */
import CText from '~/components/CText';
import CViewRow from "~/components/CViewRow";
/* COMMON */
import { Configs, Devices } from '~/config';
import { Colors } from '~/utils/colors';
import { cStyles } from '~/utils/styles';
/* STYLES */
import styles from './style';

class CDrawer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      _loading: true,
      _categories: props.category.categoriesProduct,
      _arrAccordionCate: [],
      _arrAccordionHelper: [
        { title: 'contact_us', routeName: "ContactUs", content: "" },
        { title: 'privacy_policy', routeName: "Policy", content: "", params: { id: Configs.idPagePolicy, type: "policy" } },
        { title: 'terms_condition', routeName: "Policy", content: "", params: { id: Configs.idPageTerm, type: "terms" } }
      ]
    }
  }

  /* FUNCTIONS */
  _onPressCategory = (data) => {
    this.props.navigation.navigate("Product", {
      id: data.id,
      name: data.title ? data.title : data.name
    })
  }

  _onPressRoute = (data) => {
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
        console.log('success', success)
      });
    }
  }

  /** OTHER RENDER */
  _renderHeaderAccordionHelper = (item, expanded) => {
    return (
      <TouchableOpacity onPress={() => this._onPressRoute(item)}>
        <View style={styles.con_header_accordion}>
          <CText style={[styles.txt_header_accordion, {color:'#000'}]} i18nKey={item.title} />
        </View>
      </TouchableOpacity>
    )
  }

  _renderHeaderAccordionCate = (item, expanded) => {
    return (
      <CViewRow style={styles.con_header_accordion} between
        leftComp={
          <TouchableOpacity onPress={() => this._onPressCategory(item)}>
            <CText style={[styles.txt_header_accordion, {color:'#000'}]}>{Configs.html5Entities.decode(item.title)}</CText>
          </TouchableOpacity>
        }
        rightComp={
          item.subs.length > 0 ?
            <View style={styles.con_btn_expanded} >
              <Icon name={expanded ? 'angle-up' : 'angle-down'}
                color={Colors.BLACK_COLOR}
                size={Devices.fS(15)}
                type={"regular"} />
            </View> : <View />
        }
      />
    )
  }

  _renderContentAccordionCate = (e) => {
    if (e.subs.length > 0) {
      return (
        <View>
          {e.subs.map((item, index) => {
            return (
              <TouchableOpacity key={index.toString()} onPress={() => this._onPressCategory(item)}>
                <View style={styles.con_header_accordion}>
                  {!Configs.supportRTL &&
                    <CText style={[styles.txt_sub_header_accordion, cStyles.pl_10, {color:'#000'}]}>&#8627;  {Configs.html5Entities.decode(item.name)}</CText>
                  }
                  {Configs.supportRTL &&
                    <CText style={[styles.txt_sub_header_accordion, cStyles.pr_10, {color:'#000'}]}>{Configs.html5Entities.decode(item.name)}  &#8626;</CText>
                  }
                </View>
              </TouchableOpacity>
            )
          })}
        </View>
      )
    }
    return null;
  }

  /* LIFE CYCLE */
  componentDidMount() {
    let { _categories, _arrAccordionCate, _arrAccordionHelper } = this.state;
    let { setting } = this.props;
    let i;
    if (_categories.length > 0) {
      for (i = 0; i < _categories.length; i++) {
        _arrAccordionCate.push({
          id: _categories[i].id,
          subs: _categories[i].subs || [],
          title: _categories[i].name,
          content: ""
        });
      }
    }
    if (setting.app && setting.app.general && setting.app.general.is_show_demo_app) {
      _arrAccordionHelper.push({
        title: "demo",
        routeName: "Demo",
        content: ""
      })
    }
    this.setState({ _arrAccordionCate, _arrAccordionHelper });
  }

  UNSAFE_componentWillMount() {
    /** Check setting general show/hide rating app */
    if (Configs.showRatingApp) {
      let { _arrAccordionHelper } = this.state;
      _arrAccordionHelper.push({ title: 'rate_this_app', routeName: null, content: "" });
      this.setState({ _arrAccordionHelper });
    }
  }

  /* RENDER */
  render() {
    return (
      <Container>
        <ScrollView style={styles.con_content} showsVerticalScrollIndicator={false}>
          <View>
            <View style={styles.con_title_group}>
              <CText style={[cStyles.txt_title_group, {color:'#18504D'}]} i18nKey={'categories'} upperCase />
            </View>
            <Accordion style={styles.con_accordion}
              expanded={[0]}
              dataArray={this.state._arrAccordionCate}
              renderHeader={this._renderHeaderAccordionCate}
              renderContent={this._renderContentAccordionCate}
            />
          </View>

          <View style={styles.con_group_2}>
            <View style={styles.con_title_group}>
              <CText style={[cStyles.txt_title_group, {color:'#18504D'}]} i18nKey={'help_info'} upperCase />
            </View>
            <Accordion style={styles.con_accordion}
              expanded={[0]}
              dataArray={this.state._arrAccordionHelper}
              renderHeader={this._renderHeaderAccordionHelper}
            />
          </View>
        </ScrollView>
      </Container>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    category: state.category,
    setting: state.setting
  }
}

export default connect(mapStateToProps, null)(CDrawer);