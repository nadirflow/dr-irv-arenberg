/**
 ** Name: 
 ** Author: 
 ** CreateAt: 
 ** Description: 
**/
/* LIBRARY */
import React from 'react';
import { View, FlatList, TouchableOpacity, Text } from 'react-native';
import Icon from 'react-native-fontawesome-pro';
import { Card } from 'native-base';
import {Picker} from '@react-native-picker/picker';

/** COMPONENTS */
import CText from '~/components/CText';
import CImage from '~/components/CImage';
import { CRateStar } from '~/components/CRateStar';
/* COMMON */
import { cStyles } from '~/utils/styles';
import { Colors } from '~/utils/colors';
import { Assets, Configs, Devices } from '~/config';
import { layoutWidth } from '~/utils/layout_width';
import Currency from '~/utils/currency';
import Helpers from '~/utils/helpers';
/* STYLES */
import styles from './style';

const regex = /(<([^>]+)>)/ig;
const regex2 = /\n/g;

const RenderEmptyList = () => {
  return (
    <View style={[cStyles.column_align_center, { marginTop: Devices.sW('40%') }]}>
      <Icon name={'comment-alt-exclamation'} color={Colors.BORDER_COLOR} size={Devices.fS(50)} type={'light'} />
      <CText style={cStyles.txt_no_data_1} i18nKey={'empty_list'} />
    </View>
  )
}
const renderSeparator = () => <View style={styles.con_separator} />

class RenderItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      _dataOptions: props.data.variations || [],
      _selected: (props.data.variations && props.data.variations.length > 0 && typeof props.data.variations[0] === 'object') ?
        props.data.variations[0] : null
    }
  }

  /** FUNCTIONS */
  _onPressOption = (value) => {
    if (value.id !== this.state._selected.id) {
      this.setState({ _selected: value });
    }
  }

  /** RENDER */
  render() {
    let { _dataOptions, _selected } = this.state;
    let {
      index, data, showBookmark, isCategory, isService, isNews, isVendors, listData,
      blogMetaField, onPress, onPressAddCart
    } = this.props;
    let price = 0, currencyPosition = Configs.currencyPosition, symbol = Helpers.symbolCurrency(),
      source = Assets.image_failed, title = Configs.html5Entities.decode(data.name), excerpt = '', time = '',
      author = "", categories = "", percentSale = 0, scaleImage = 1.25, inBookmark = false, isFeatured = false,
      isSale = false;

    if (isService) {
      if (data.on_sale && data.sale_price !== "") {
        isSale = true;
        percentSale = Helpers.parsePercentSale(data.regular_price, data.sale_price);
        price = Helpers.formatNumber(_selected ? Number(_selected.regular_price) : data.regular_price);
      } else price = Helpers.formatNumber(_selected ? Number(_selected.price) : data.price);
      isFeatured = data.featured;
    }
    if (isNews) {
      title = Configs.html5Entities.decode(data.title.rendered);
      excerpt = data.excerpt.rendered.replace(regex, '');
      excerpt = excerpt.replace(regex2, '');
      excerpt = Configs.html5Entities.decode(excerpt);
      time = Configs.parseTimestamp(data.date);
      if (data.featured_media && typeof data.featured_media !== 'number') {
        source = { uri: data.featured_media.sizes.medium };
      }
      let tmpCate = [];
      if (blogMetaField.categories && data.categories && data.categories.length > 0) {
        for (let std of data.categories) tmpCate.push(std.name);
      }
      categories = tmpCate.join();
      inBookmark = Configs.bookmarks.includes(data.id);
    }
    if (isCategory) if (data.image) source = { uri: data.image.src };
    if (isVendors) {
      source = { uri: data.vendor_shop_logo };
      title = data.vendor_shop_name
    }
    if (data.images && data.images.length > 0) {
      if (data.images[0].sizes) {
        source = { uri: data.images[0].sizes.woocommerce_single };
        let height = data.images[0].sizes["woocommerce_single-height"] !== 0 ?
          data.images[0].sizes["woocommerce_single-height"] :
          data.images[0].sizes["woocommerce_single-width"];
        scaleImage = data.images[0].sizes["woocommerce_single-width"] / height;
      } else {
        source = { uri: data.images[0].src };
      }
    }
    let size = Devices.sImage("card", scaleImage, layoutWidth.width);

    return (
      <TouchableOpacity onPress={() => onPress(data)}>
        <Card style={[
          (isCategory) ? styles.con_store_category : isVendors ? styles.con_store_vendor : styles.con_store,
          (!Configs.supportRTL ?
            { marginLeft: Devices.pH(layoutWidth.width) } :
            { marginRight: Devices.pH(layoutWidth.width) }),
          ((isCategory) && Configs.supportRTL && index === 0) && { marginRight: Devices.pH(layoutWidth.width) },
          ((isCategory) && Configs.supportRTL && index === listData.length - 1) && { marginLeft: Devices.pH(layoutWidth.width) },
          ((isCategory) && !Configs.supportRTL && index === listData.length - 1) && { marginRight: Devices.pH(layoutWidth.width) },
          styles.noBorder
        ]}
          noShadow transparent={isCategory}>
          <View style={cStyles.column_align_center}>
            {!isVendors
              ?
              <CImage
                style={[styles.img_store_service, (!isCategory) && { width: size.width, height: size.height }]}
                source={source}
              />
              :
              <CImage
                style={[styles.img_store_vendor]}
                source={source}
              />
            }

            {(showBookmark && inBookmark) ?
              <View style={styles.con_content_image}>
                <View style={[styles.con_bookmark, !Configs.supportRTL ? { right: 5 } : { left: 5 }]}>
                  <Icon name={'bookmark'}
                    color={Colors.PRIMARY_COLOR}
                    sizes={Devices.fS(20)}
                    type={inBookmark ? 'solid' : 'light'} />
                </View>
              </View>
              : (isService && isFeatured && !isSale) ?
                <View style={[styles.con_content_image, !Configs.supportRTL ? { left: 5 } : { right: 5 }]}>
                  <View style={styles.con_product_new}>
                    <CText style={styles.txt_product_new} i18nKey={'new'} upperCase />
                  </View>
                </View>
                : (isService && !isFeatured && isSale) ?
                  <View style={[styles.con_content_image, !Configs.supportRTL ? { left: 5 } : { right: 5 }]}>
                    <View style={styles.con_product_sale}>
                      <CText style={styles.txt_product_sale} i18nKey={'sale'} upperCase />
                    </View>
                  </View>
                  : (isService && isFeatured && isSale) &&
                  <View style={[styles.con_content_image, !Configs.supportRTL ? { left: 5 } : { right: 5 }]}>
                    <View style={styles.con_product_new}>
                      <CText style={styles.txt_product_new} i18nKey={'new'} upperCase />
                    </View>

                    <View style={[styles.con_product_sale, { top: Devices.sW('5%') }]}>
                      <CText style={styles.txt_product_sale} i18nKey={'sale'} upperCase />
                    </View>
                  </View>
            }
          </View>

          <View style={styles.con_info_store}>
            <View style={styles.con_title_store}>
              {isService && <Text style={[styles.txt_title_global, Configs.supportRTL && cStyles.txt_RTL]} numberOfLines={2}>{title}</Text>}
              {isCategory && <Text style={[styles.txt_title_global, styles.txt_title_category]} numberOfLines={2}>{title}</Text>}
              {isVendors &&
                <View style={[styles.des_vendor]}>
                  <Text style={[styles.txt_title_global, styles.txt_title_category]} numberOfLines={2}>{title}</Text>
                  <View style={styles.rating_star}>
                    <CRateStar averageRating={Number(data.store_rating ? data.store_rating : 0)} />
                  </View>
                </View>
              }
              {isNews && <Text style={[styles.txt_title_new, Configs.supportRTL && cStyles.txt_RTL]} numberOfLines={2}>{title}</Text>}
              {isService && !isNews && data.reviews_allowed && <CRateStar averageRating={Number(data.average_rating)} ratingCount={data.rating_count} />}
            </View>

            {isNews &&
              <View style={styles.con_news_info}>
                {(blogMetaField.categories && data.categories && data.categories.length > 0) &&
                  <View style={[styles.con_news_time, { flex: 1, marginTop: 3 }]}>
                    <CText style={[styles.txt_news_time, { marginTop: 0 }]} i18nKey={"categories"} />
                    <CText style={[styles.txt_news_time, { flex: 1, marginTop: 0 }]}>{`: ${categories}`}</CText>
                  </View>
                }
                <View style={styles.con_news_time}>
                  <CText style={styles.txt_news_time}>{time.time} </CText>
                  {time.type !== 'days' && <CText style={styles.txt_news_time} i18nKey={time.type} />}
                  {(blogMetaField.author && author && author !== "") && <CText style={styles.txt_author} i18nKey={"by"} />}
                  {(blogMetaField.author && author && author !== "") && <CText style={styles.txt_author}>{author}</CText>}
                </View>
              </View>
            }

            {(Configs.showVariationsProducts && isService && _dataOptions.length > 0) ?
              <View style={styles.con_variations}>
                <CText style={cStyles.txt_body_meta_item}>{`Opciones: `}</CText>
                <View style={styles.con_picker_variations}>
                  <Picker mode={'dialog'}
                    iosIcon={
                      <Icon containerStyle={{ paddingHorizontal: 10 }}
                        name="chevron-down"
                        size={Devices.fS(15)}
                        color={Colors.BLACK_COLOR}
                        type={"light"} />
                    }
                    selectedValue={_selected}
                    onValueChange={(value) => this._onPressOption(value)}
                    textStyle={cStyles.txt_base_item}
                    itemTextStyle={cStyles.txt_base_item}
                    headerTitleStyle={cStyles.txt_title_header}
                    headerBackButtonTextStyle={[cStyles.txt_base_item, { color: Colors.PRIMARY_COLOR }]}
                  >
                    {_dataOptions.map((item, index) => {
                      let label = "";
                      for (let std of item.attributes) {
                        label += `${std.option}, `;
                      }
                      label = label.substr(0, label.length - 2)
                      return (
                        <Picker.Item label={label} value={item} key={index.toString()} />
                      )
                    })}
                  </Picker>
                </View>
              </View> : null
            }

            {isService &&
              <View style={styles.con_button_add}>
                <View style={cStyles.row_align_end}>
                  {_dataOptions.length > 0 &&
                    <CText style={cStyles.txt_body_meta_item} i18nKey={"from_price"} />
                  }
                  {currencyPosition === Currency.left &&
                    <CText style={[styles.txt_unit_item, percentSale !== 0 && { color: Colors.PLACEHOLDER_COLOR }]}>{symbol}</CText>
                  }
                  <CText style={[styles.txt_price_item, percentSale !== 0 && styles.txt_regular_price]}>{price}</CText>
                  {currencyPosition === Currency.right &&
                    <CText style={[styles.txt_unit_item, percentSale !== 0 && { color: Colors.PLACEHOLDER_COLOR }]}>{symbol}</CText>
                  }
                  {percentSale !== 0 &&
                    <View style={styles.con_content_price_2}>
                      {currencyPosition === Currency.left &&
                        <CText style={styles.txt_content_price_sale}>{symbol}</CText>
                      }
                      <CText style={styles.txt_content_price_sale}>{Helpers.formatNumber(data.sale_price)}</CText>
                      {currencyPosition === Currency.right &&
                        <CText style={styles.txt_content_price_sale}>{symbol}</CText>
                      }
                    </View>
                  }
                </View>
                {(Configs.showVariationsProducts && data.stock_status === Configs.stockStatus.IN_STOCK) ?
                  <TouchableOpacity activeOpacity={.5} onPress={() => onPressAddCart(data, _selected ? _selected : null)}>
                    <View style={[styles.con_btn_add, { backgroundColor: Colors.BACKGROUND_PRIMARY_COLOR }]} >
                      <Icon name={'plus'} color={Colors.WHITE_COLOR} size={Devices.fS(15)} type={'regular'} />
                    </View>
                  </TouchableOpacity>
                  :
                  data.stock_status === Configs.stockStatus.OUT_OF_STOCK ?
                    <CText style={styles.txt_out_of_stock} i18nKey={"out_of_stock"} />
                    :
                    null
                }
              </View>
            }
          </View>
        </Card>
      </TouchableOpacity >
    )
  }
}

export default CardView = ({
  contentStyle = {},
  data = [],
  render = {
    header: () => null,
    footer: () => null,
    item: () => null,
    empty: RenderEmptyList
  },
  onFunction = {
    onPressItem: () => { },
    onPressAddCart: () => { }
  },
  refreshing = false,
  isCategory = false,
  isService = false,
  isNews = false,
  isVendors = false,
  showBookmark = true,
  paging = {
    onLoadMore: () => null,
    onRefresh: () => null,
  }
}) => {
  return (
    <FlatList style={styles.con_list_store}
      contentContainerStyle={[cStyles.flex_grow, contentStyle]}
      data={data}
      renderItem={({ item, index }) => {
        return (
          <RenderItem index={index} data={item} showBookmark={showBookmark}
            isCategory={isCategory} isService={isService} isNews={isNews} isVendors={isVendors}
            listData={data} blogMetaField={Configs.settingLocal.blog.blog_meta_fields}
            onPress={onFunction.onPressItem}
            onPressAddCart={onFunction.onPressAddCart}
          />
        )
      }}
      inverted={Configs.supportRTL}
      keyExtractor={(item, index) => index.toString()}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      removeClippedSubviews={Devices.OS === 'android'}
      ItemSeparatorComponent={isService && data.length > 0 && renderSeparator}
      initialNumToRender={10}
      ListHeaderComponent={render.header}
      ListFooterComponent={render.footer}
      ListEmptyComponent={render.empty}
      horizontal={isCategory || isVendors}
      refreshing={refreshing}
      onRefresh={() => paging.onRefresh()}
      onEndReachedThreshold={0.1}
      onEndReached={() => paging.onLoadMore()}
    />
  )
}

