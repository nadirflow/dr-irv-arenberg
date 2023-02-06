/**
 ** Name: 
 ** Author: 
 ** CreateAt: 
 ** Description: 
**/
/* LIBRARY */
import React from 'react';
import { FlatList, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import Icon from 'react-native-fontawesome-pro';
/* COMPONENTS */
import { ViewVendorDetail } from './render';
/** COMMON */
import { Configs, Languages, Devices } from '~/config';
import Services from '~/services';
/** STYLES */
import styles from './style';
import { layoutWidth } from '~/utils/layout_width';
import CText from '~/components/CText';
import { cStyles } from '~/utils/styles';
import { Colors } from '~/utils/colors';
import VendorProducts from './components/products';
import VendorAbout from './components/about';

class VendorDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      _loading: true,
      _data: null,
      routes: [],
      index: 0
    }
  }

  /* FUNCTIONS */
  _onFetchData = async () => {
    let { language } = this.props;
    let newData = this.props.route.params.vendorData, newRoutes = [], i;
    newRoutes = [
      { index: 0, name: Languages[language].products, key: 'products' },
      { index: 1, name: Languages[language].about, key: 'about' },
      // { index: 2, name: Languages[language].reviews, key: 'reviews' },
      // { index: 3, name: Languages[language].policies, key: 'policies' },
      // { index: 4, name: Languages[language].followers, key: 'followers' },
    ]
    this.setState({
      _data: newData,
      routes: newRoutes,
      _loading: false,
    });
  }

  _onPressBack = () => {
    this.props.navigation.goBack();
  }

  _onRenderScene = ({ route, jumpTo }) => {
    switch (route.key) {
      case 'products':
        return <VendorProducts data={this.state._data} {...this.props} />
      case 'about':
        return <VendorAbout data={this.state._data} {...this.props} />
      default:
        return null;
    }
  }

  _onRenderTabBar = (propsTab) => {
    return (
      <View style={{ paddingHorizontal: Devices.pH(layoutWidth.width) }}>
        <FlatList
          data={propsTab.navigationState.routes}
          renderItem={props => {
            return (
              <TouchableOpacity
                style={[styles.con_tab_bar_item,
                props.index === this.state.index && [styles.con_tab_bar_active_item,
                { borderBottomColor: Colors.PRIMARY_COLOR }],
                  props.index === propsTab.navigationState.routes.length - 1 && styles.con_tab_bar_last_item
                ]}
                onPress={() => this._onPressTabBar(props.item, props.index)}
              >
                <CText style={[styles.txt_tab_bar,
                  this.state.index === props.index && [cStyles.txt_title_group, { color: Colors.PRIMARY_COLOR }]]}
                  upperCase
                >
                  {props.item.name}
                </CText>
              </TouchableOpacity>
            )
          }}
          keyExtractor={(item, index) => index.toString()}
          inverted={Configs.supportRTL}
          horizontal
          removeClippedSubviews={Devices.OS === "android"}
          showsHorizontalScrollIndicator={false}
        />
      </View>
    );
  }

  _onPressTabBar = (route, index) => {
    if (this.state.index !== index) this.setState({ index });
  }
  _onChangeTabIndex = () => {

  }

  /* LIFE CYCLE */
  componentDidMount() {
    this._onFetchData();
  }

  /* RENDER */
  render() {
    return (
      <ViewVendorDetail
        state={this.state}
        props={this.props}
        onFunction={{
          onPressBack: this._onPressBack,
          onRenderScene: this._onRenderScene,
          onRenderTabBar: this._onRenderTabBar,
          onChangeTabIndex: this._onChangeTabIndex,
        }}
      />
    )
  }
}

const mapStateToProps = state => {
  return {
    language: state.language.language
  }
}

export default connect(mapStateToProps, null)(VendorDetail);