/**
 ** Name: 
 ** Author: 
 ** CreateAt: 
 ** Description: 
**/
/* LIBRARY */
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { View, Keyboard, FlatList, TouchableOpacity, Text } from 'react-native';
import {
  Container, Input, Button, Item
} from 'native-base';
import Icon from 'react-native-fontawesome-pro';
/* COMPONENTS */
import CHeader from "~/components/CHeader";
import CText from '~/components/CText';
import CLoading from '~/components/CLoading';
import CImage from '~/components/CImage';
import { CRateStar } from '~/components/CRateStar';
import { BallIndicator } from "~/components/CIndicator";
import CViewRow from "~/components/CViewRow";
/** COMMON */
import { Configs, Languages, Keys, Devices, Assets } from '~/config';
import { layoutWidth } from '~/utils/layout_width';
import { Colors } from '~/utils/colors';
import { cStyles } from '~/utils/styles';
import Helpers from '~/utils/helpers';
import Services from '~/services';
import Currency from '~/utils/currency';
/** STYLES */
import styles from './style';
/** REDUX */
import * as cartActions from '~/redux/actions/cart';

class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      _loadingSearch: false,
      _valueSearch: "",
      _dataSearch: [],
      _dataHistorySearch: []
    }
  }

  /* FUNCTIONS */
  _onFetchData = async (value) => {
    let { _dataSearch } = this.state;
    let params = { search: value };
    let res = await Services.Service.listProducts(params);
    if (res) {
      if (res.code) {
        // Do not thing
        this._onError('server_error');
        this.setState({
          _loadingSearch: false,
        })
      } else {
        let tmp = [];
        if (res.length > 0) {
          tmp = [..._dataSearch, ...res];
        }

        this.setState({
          _dataSearch: tmp,
          _loadingSearch: false,
        })
      }
    } else {
      this._onError('server_error');
      this.setState({
        _loadingSearch: false
      })
    }
  }

  _onError = (message) => {
    Helpers.showToastDuration({}, Languages[this.props.language][message], "danger");
  }

  _onSaveToHistory = async (value) => {
    let { _dataHistorySearch } = this.state;
    if (_dataHistorySearch.length > 0) {
      let find = _dataHistorySearch.find(f => f === value);
      if (!find) {
        _dataHistorySearch.unshift(value);
        _dataHistorySearch = _dataHistorySearch.slice(0, 10)
      }
    } else {
      _dataHistorySearch.unshift(value);
      _dataHistorySearch = _dataHistorySearch.slice(0, 10);
    }
    this.setState({ _dataHistorySearch });
    Helpers.setDataStorage(Keys.AS_DATA_HISTORY_SEARCH, JSON.stringify(_dataHistorySearch));
  }

  _onSubmitSearch = () => {
    Keyboard.dismiss();
    let { _valueSearch } = this.state;
    if (_valueSearch !== "") {
      this.setState({ _loadingSearch: true });
      this._onSaveToHistory(_valueSearch);
      this._onFetchData(_valueSearch);
    } else {
      this.setState({ _dataSearch: [] });
    }
  }

  _onGetHistorySearch = async () => {
    let asHistory = await Helpers.getDataStorage(Keys.AS_DATA_HISTORY_SEARCH);
    if (asHistory && asHistory !== "") {
      asHistory = JSON.parse(asHistory);
    } else {
      asHistory = [];
    }
    this.setState({ _dataHistorySearch: asHistory });
  }

  _onPressRemoveHistory = () => {
    this.setState({ _dataHistorySearch: [] });
    Helpers.removeKeyStorage(Keys.AS_DATA_HISTORY_SEARCH);
  }

  _onPressHistoryItem = (value) => {
    Keyboard.dismiss();
    this.setState({ _valueSearch: value, _loadingSearch: true });
    this._onFetchData(value);
  }

  _onChangeText = (value) => {
    this.setState({
      _valueSearch: value
    })
  }

  _onPressBack = () => {
    this.props.navigation.goBack();
  }

  _onPressHSearchItem = (product) => {
    this._getProductsVariation(product);
  }

  _getProductsVariation = async (product) => {
    /** Check product seen */
    let tmp = await Helpers.getDataStorage(Keys.KEY_HOME_VIEWED_PRODUCT);
    if (tmp && tmp.length > 0) {
      let find = tmp.find(f => f.id === product.id);
      if (!find) {
        tmp.push(product);
      }
    } else {
      tmp = [];
      tmp.push(product);
    }
    Helpers.setDataStorage(Keys.KEY_HOME_VIEWED_PRODUCT, tmp);
    /** Navigate to product detail page */
    this.props.navigation.navigate("ProductDetail", {
      product
    });
  }

  /** OTHER RENDER */
  _onRenderSearchItem = (index, data) => {
    let price = Helpers.formatNumber(data.price);
    let currencyPosition = Configs.currencyPosition;
    let symbol = Helpers.symbolCurrency();
    let image = Assets.image_failed;
    let percentSale = 0;
    if (data.images && data.images.length > 0) {
      image = { uri: data.images[0].sizes.woocommerce_thumbnail };
    }
    if (data.on_sale && data.sale_price !== "") {
      percentSale = Helpers.parsePercentSale(data.regular_price, data.sale_price);
      price = Helpers.formatNumber(data.regular_price);
    }

    return (
      <TouchableOpacity onPress={() => this._onPressHSearchItem(data)}>
        <CViewRow style={[cStyles.pv_15, index === 0 && { paddingTop: 0 }]}
          leftComp={
            <CViewRow
              leftComp={
                <CImage style={styles.img_product_item} source={image} />
              }
              rightComp={
                <View style={[styles.con_name_product,
                !Configs.supportRTL && cStyles.pl_10,
                Configs.supportRTL && cStyles.pr_10
                ]}>
                  <CText style={[styles.txt_name_item, Configs.supportRTL && cStyles.txt_RTL, {color: '#18504D'}]} numberOfLines={2}>
                    {data.name}
                  </CText>

                  <View style={[{ width: "100%" }, Configs.supportRTL && cStyles.row_justify_end]}>
                    <CRateStar containerStyle={styles.con_star} averageRating={Number(data.average_rating)} ratingCount={data.rating_count} />
                  </View>

                  <View style={[styles.con_tag, Configs.supportRTL && cStyles.row_justify_end]}>
                    {data.featured &&
                      <View style={styles.con_product_new}>
                        <CText style={styles.txt_product_new} i18nKey={'new'} upperCase />
                      </View>
                    }
                    {data.on_sale &&
                      <View style={styles.con_product_sale}>
                        <CText style={styles.txt_product_sale} i18nKey={'sale'} upperCase />
                      </View>
                    }
                  </View>
                </View>
              }
            />
          }
          rightComp={
            <View style={[Configs.supportRTL ? cStyles.column_align_start : cStyles.column_align_end]}>
              {data.variations.length > 0 &&
                <CText style={cStyles.txt_body_meta_item} i18nKey={"from_price"} />
              }
              <View style={styles.con_content_price_2}>
                {currencyPosition === Currency.left &&
                  <CText style={[styles.txt_price_item, styles.txt_unit_item, percentSale !== 0 && { color: '#000' }]}>{symbol}</CText>
                }
                <CText style={[styles.txt_price_item, percentSale !== 0 && { color:'#000', textDecorationLine: 'line-through' }]}>{price}</CText>
                {currencyPosition === Currency.right &&
                  <CText style={[styles.txt_price_item, styles.txt_unit_item, percentSale !== 0 && { color: '#000' }]}>{symbol}</CText>
                }
              </View>

              {percentSale !== 0 &&
                <View style={styles.con_content_price_2}>
                  {currencyPosition === Currency.left &&
                    <CText style={[styles.txt_content_price_sale, {color: '#18504D'}]}>{symbol}</CText>
                  }
                  <CText style={[styles.txt_content_price_sale, {color: '#18504D'}]}>{Helpers.formatNumber(data.sale_price)}</CText>
                  {currencyPosition === Currency.right &&
                    <CText style={[styles.txt_content_price_sale, {color: '#18504D'}]}>{symbol}</CText>
                  }
                </View>
              }
            </View>
          }
        />
      </TouchableOpacity>
    )
  }

  _onRenderSeparatorItem = () => (<View style={styles.con_separator_option} />)

  _onRenderEmptySearch = () => {
    return (
      <View style={[cStyles.column_align_center, { marginTop: Devices.sW('40%') }]}>
        <Icon name={'search'} color={Colors.BLACK_COLOR} size={Devices.fS(50)} type={'light'} />
        <CText style={cStyles.txt_no_data_1} i18nKey={'no_results_found'} />
        <Text style={cStyles.txt_no_data}>
          {Languages[this.props.language].search_no_data_hint_1}
        </Text>
      </View>
    )
  }

  /* LIFE CYCLE */
  componentDidMount() {
    this._onGetHistorySearch();
  }

  /* RENDER */
  render() {
    let { language } = this.props;
    let { _loadingSearch, _valueSearch, _dataHistorySearch, _dataSearch } = this.state;

    return (
      <Container>
        <CHeader
          style={{backgroundColor: '#18504D'}}
          searchBar={true}
          rounded={true}
          titleComponent={
            !Configs.supportRTL ?
              <View style={[cStyles.flex_full, cStyles.row_justify_between]}>
                <Item style={[cStyles.row_align_center, cStyles.row_justify_between, cStyles.p_20,
                cStyles.ml_15, cStyles.mr_20, { paddingRight: 30 }]}>
                  <View style={cStyles.row_align_center}>
                    <Icon name={'search'} size={Devices.fS(20)} color={"#000"} type={"regular"} />
                    <Input ref={ref => this._searchRef = ref}
                      style={[styles.txt_search, {color: '#000'}]}
                      autoFocus={true}
                      placeholder={Languages[language].txt_home_search_bar}
                      placeholderTextColor={Colors.PLACEHOLDER_COLOR}
                      selectionColor={Colors.BLACK_COLOR}
                      clearTextOnFocus={true}
                      returnKeyType={'search'}
                      value={_valueSearch}
                      onChangeText={value => this._onChangeText(value)}
                      onEndEditing={this._onSubmitSearch}
                      onSubmitEditing={this._onSubmitSearch} />
                  </View>
                  {_loadingSearch &&
                    <BallIndicator color={Colors.ICON_COLOR} size={17} />
                  }
                </Item>

                <Button style={cStyles.pr_10} transparent onPress={this._onPressBack}>
                  <CText style={styles.txt_header_cancel} i18nKey={'cancel'} />
                </Button>
              </View>
              :
              <View style={[cStyles.flex_full, cStyles.row_justify_between]}>
                <Button style={cStyles.pr_10} transparent onPress={this._onPressBack}>
                  <CText style={styles.txt_header_cancel} i18nKey={'cancel'} />
                </Button>

                <Item style={[cStyles.row_align_center, cStyles.row_justify_between, cStyles.p_20,
                cStyles.ml_15, cStyles.mr_20]}>
                  {_loadingSearch &&
                    <BallIndicator color={Colors.ICON_COLOR} size={17} />
                  }
                  <View style={cStyles.row_align_center}>
                    <Input ref={ref => this._searchRef = ref}
                      style={[styles.txt_search, cStyles.pr_20, { textAlign: "right" }]}
                      autoFocus={true}
                      placeholder={Languages[language].txt_home_search_bar}
                      placeholderTextColor={Colors.PLACEHOLDER_COLOR}
                      selectionColor={Colors.BLACK_COLOR}
                      clearTextOnFocus={true}
                      returnKeyType={'search'}
                      value={_valueSearch}
                      onChangeText={value => this._onChangeText(value)}
                      onEndEditing={this._onSubmitSearch}
                      onSubmitEditing={this._onSubmitSearch} />
                    <Icon name={'search'} size={Devices.fS(20)} color={Colors.BLACK_COLOR} type={"regular"} />
                  </View>
                </Item>
              </View>
          }
        />

        {_dataHistorySearch.length > 0 &&
          <View style={[styles.con_history_search, { paddingHorizontal: Devices.pH(layoutWidth.width) }]}>
            <CViewRow between
              leftComp={<CText style={[cStyles.txt_title_group, {color: '#000'}]} i18nKey={"history_search"} />}
              rightComp={
                <Icon name={'trash-alt'}
                  color={'#18504D'}
                  size={Devices.fS(20)}
                  type={"regular"}
                  onPress={this._onPressRemoveHistory} />
              }
            />

            <View style={styles.con_content_history}>
              <FlatList style={cStyles.column}
                contentContainerStyle={cStyles.flex_wrap}
                data={_dataHistorySearch}
                renderItem={({ item, index }) => {
                  return (
                    <TouchableOpacity onPress={() => this._onPressHistoryItem(item)}>
                      <View style={styles.con_history_item}>
                        <CText style={[cStyles.txt_base_item, {color: '#18504D'}]}>{item}</CText>
                      </View>
                    </TouchableOpacity>
                  )
                }}
                inverted={Configs.supportRTL}
                keyExtractor={(item, index) => index.toString()}
                showsHorizontalScrollIndicator={false}
                horizontal
                removeClippedSubviews={Devices.OS === 'android'}
              />
            </View>
          </View>
        }

        <View style={styles.con_list_search}>
          {_dataSearch.length > 0 &&
            <CText style={[cStyles.txt_title_group, cStyles.pv_10,
            { paddingHorizontal: Devices.pH(layoutWidth.width), color: '#000' }]}
              i18nKey={"search_results"} />
          }

          {!_loadingSearch &&
            <FlatList
              contentContainerStyle={[
                styles.con_content_list_search,
                { paddingHorizontal: Devices.pH(layoutWidth.width) }
              ]}
              data={_dataSearch}
              renderItem={({ item, index }) => this._onRenderSearchItem(index, item)}
              keyExtractor={(item, index) => index.toString()}
              ItemSeparatorComponent={this._onRenderSeparatorItem}
              ListEmptyComponent={this._onRenderEmptySearch}
              removeClippedSubviews={Devices.OS === 'android'}
            />
          }
        </View>

        <CLoading visible={_loadingSearch} showIcon={false} />
      </Container >
    )
  }
}

const mapStateToProps = state => {
  return {
    language: state.language.language,
    cart: state.cart.carts
  }
}

const mapDispatchToProps = dispatch => {
  return {
    cartActions: bindActionCreators(cartActions, dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Search);