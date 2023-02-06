/**
 ** Name: 
 ** Author: 
 ** CreateAt: 
 ** Description: 
**/
/* LIBRARY */
import React from 'react';
import { View, FlatList, TouchableOpacity, Text } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-fontawesome-pro';
/** COMPONENTS */
import CText from '~/components/CText';
import CImage from '~/components/CImage';
import { CRateStar } from '~/components/CRateStar';
/* COMMON */
import { Configs, Assets, Devices } from '~/config';
import { cStyles } from '~/utils/styles';
import { Colors } from '~/utils/colors';
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

export class RenderItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      _dataOptions: props.data.variations || [],
      _selected: (props.data.variations && props.data.variations.length > 0 && typeof props.data.variations[0] === 'object') ? props.data.variations[0] : null
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
      index, data, isNews, isService, isCategory, leftThumb, blogMetaField, onPress, onPressAddCart,
      showBookmark
    } = this.props
    let time = '', price = 0, currencyPosition = Configs.currencyPosition, symbol = Helpers.symbolCurrency(),
      source = Assets.image_failed, title = Configs.html5Entities.decode(data.name), excerpt = "", author = "",
      categories = "", percentSale = 0, scaleImage = 1, inBookmark = false, isFeatured = false, isSale = false;

    if (isService) {
      if (data.on_sale && data.sale_price !== "") {
        isSale = true;
        percentSale = Helpers.parsePercentSale(data.regular_price, data.sale_price);
        price = Helpers.formatNumber(_selected ? Number(_selected.regular_price) : data.regular_price);
      } else price = Helpers.formatNumber(_selected ? Number(_selected.price) : data.price);
      isFeatured = data.featured;

      if (data.images && data.images.length > 0) {
        if (data.images[0].sizes) {
          source = { uri: data.images[0].sizes.woocommerce_thumbnail };
          scaleImage = data.images[0].sizes["woocommerce_thumbnail-width"] / data.images[0].sizes["woocommerce_thumbnail-height"]
        } else {
          source = { uri: data.images[0].src };
        }
      }
    }

    if (isNews) {
      title = Configs.html5Entities.decode(data.title.rendered);
      author = data.author.author_name;
      excerpt = data.excerpt.rendered.replace(regex, '');
      excerpt = excerpt.replace(regex2, '');
      excerpt = Configs.html5Entities.decode(excerpt);
      time = Configs.parseTimestamp(data.date);
      source = Assets.image_slider_failed;
      if (data.featured_media && typeof data.featured_media !== 'number') {
        console.log("data.featured_media", data.featured_media)
        source = { uri: data.featured_media.sizes.thumbnail };
        scaleImage = data.featured_media.sizes["thumbnail-width"] / data.featured_media.sizes["thumbnail-height"];
      }
      let tmpCate = [];
      if (blogMetaField.categories && data.categories && data.categories.length > 0) {
        for (let std of data.categories) tmpCate.push(std.name);
      }
      categories = tmpCate.join(", ");
      inBookmark = Configs.bookmarks.includes(data.id);
    }
    let size = Devices.sImage("horizontal", scaleImage);

    return (
      <View style={cStyles.pt_10}>
        {leftThumb ?
          <TouchableOpacity onPress={() => onPress(data)}>
            <View style={[styles.con_store, isService ? { paddingVertical: 10 } : { paddingBottom: 10, paddingTop: index === 0 ? 10 : 0 }]}>
              <View style={cStyles.column_align_center}>
                <CImage
                  style={[styles.img_store, { width: size.width, height: size.height }]}
                  source={source}>
                </CImage>
                {(showBookmark && inBookmark) ?
                  <View style={styles.con_content_image}>
                    <View style={[styles.con_bookmark, !Configs.supportRTL ? { right: 5 } : { left: 5 }]}>
                      <Icon name={'bookmark'}
                        color={'#000'}
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

              <View style={[styles.con_info_store, cStyles.pl_10]}>
                <View style={cStyles.row_align_start}>
                  <View style={[styles.con_title_store, { width: "100%" }, Configs.supportRTL && cStyles.column_align_end]}>
                    {isNews && <Text style={[styles.txt_title_new, Configs.supportRTL && cStyles.txt_RTL, {color: '#000'}]} numberOfLines={3}>{title}</Text>}
                    {isCategory && <Text style={[styles.txt_title_category, Configs.supportRTL && cStyles.txt_RTL]} numberOfLines={2}>{data.name}</Text>}
                    {isService && <Text onPress={() => onPress(data)} style={[styles.txt_title_service, Configs.supportRTL && cStyles.txt_RTL]} numberOfLines={2}>{title}</Text>}
                    {isService && !isNews && data.reviews_allowed && <CRateStar containerStyle={{ marginTop: 0 }} averageRating={Number(data.average_rating)} ratingCount={data.rating_count} />}
                  </View>
                </View>

                {isNews &&
                  <View style={[cStyles.flex_full, cStyles.column_justify_between, { width: "100%" }, Configs.supportRTL && cStyles.column_align_end]}>
                    <View style={cStyles.column_justify_start}>
                      {(blogMetaField.categories && data.categories && data.categories.length > 0) &&
                        <CText style={[styles.txt_news_category, {color: '#000'}]}>{categories}</CText>
                      }
                    </View>

                    <View style={cStyles.row_align_start}>
                      <CText style={styles.txt_news_time}>{time.time} </CText>
                      {time.type !== 'days' && <CText style={styles.txt_news_time} i18nKey={time.type} />}
                      {(blogMetaField.author && author && author !== "") && <CText style={[styles.txt_news_time, {color: '#000'} ]} i18nKey={"by"} />}
                      {(blogMetaField.author && author && author !== "") && <CText style={[styles.txt_author, {color: '#000'}]}>{author}</CText>}
                    </View>
                  </View>
                }

                {(Configs.showVariationsProducts && isService && _dataOptions.length > 0) ?
                  <View style={styles.con_variations}>
                    <CText style={cStyles.txt_body_meta_item}>{`Opciones: `}</CText>
                    <View style={styles.con_picker_variations}>
                      <Picker
                        mode={'dialog'}
                        iosIcon={<Icon containerStyle={{ paddingHorizontal: 10 }} name="chevron-down" size={Devices.fS(15)} color={Colors.BLACK_COLOR} type={"light"} />}
                        selectedValue={_selected ? _selected : null}
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
                    <View>
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
                      <View style={styles.con_content_price}>
                        {_dataOptions.length > 0 &&
                          <CText style={cStyles.txt_body_meta_item} i18nKey={"from_price"} />
                        }

                        {currencyPosition === Currency.left &&
                          <CText style={[styles.txt_price_item, percentSale !== 0 && { color: Colors.PLACEHOLDER_COLOR }]}>{symbol}</CText>
                        }
                        <CText style={[styles.txt_price_item, percentSale !== 0 && styles.txt_regular_price]}>{price}</CText>
                        {currencyPosition === Currency.right &&
                          <CText style={[styles.txt_price_item, percentSale !== 0 && { color: Colors.PLACEHOLDER_COLOR }]}>{symbol}</CText>
                        }
                      </View>
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
            </View>
          </TouchableOpacity>
          :
          <TouchableOpacity onPress={() => onPress(data)}>
            <View style={[styles.con_store, isService ? { paddingVertical: 10 } : { paddingBottom: 10, paddingTop: index === 0 ? 10 : 0 }]}>
              <View style={[styles.con_info_store, { paddingRight: 10 }]}>
                <View style={[styles.con_title_store, { width: "100%" }, Configs.supportRTL && cStyles.column_align_end]}>
                  {isNews && <CText style={[styles.txt_title_new, Configs.supportRTL && cStyles.txt_RTL]} numberOfLines={3}>{title}</CText>}
                  {isCategory && <CText style={[styles.txt_title_category, Configs.supportRTL && cStyles.txt_RTL]} numberOfLines={2}>{data.name}</CText>}
                  {isService && <CText style={[styles.txt_title_service, Configs.supportRTL && cStyles.txt_RTL]} numberOfLines={2}>{title}</CText>}
                  {isService && !isNews && data.reviews_allowed && <CRateStar containerStyle={{ marginTop: 0 }} averageRating={Number(data.average_rating)} ratingCount={data.rating_count} />}
                </View>

                {isNews &&
                  <View style={[cStyles.flex_full, cStyles.column_justify_between, { width: "100%" }, Configs.supportRTL && cStyles.column_align_end]}>
                    <View style={cStyles.row_align_start}>
                      <CText style={styles.txt_news_time}>{time.time} </CText>
                      {time.type !== 'days' && <CText style={styles.txt_news_time} i18nKey={time.type} />}
                      {(blogMetaField.author && author && author !== "") && <CText style={styles.txt_author} i18nKey={"by"} />}
                      {blogMetaField.author && <CText style={styles.txt_author}>{author}</CText>}
                    </View>

                    <View style={cStyles.row_align_start}>
                      {(blogMetaField.categories && data.categories && data.categories.length > 0) &&
                        <CText style={styles.txt_news_category}>{categories}</CText>
                      }
                    </View>
                  </View>
                }

                {(Configs.showVariationsProducts && isService && _dataOptions.length > 0) ?
                  <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center", marginTop: 10 }}>
                    <CText style={cStyles.txt_body_meta_item}>{`Opciones: `}</CText>
                    <View style={{ borderWidth: .5, borderColor: Colors.PLACEHOLDER_COLOR, flex: 1, borderRadius: 5, height: Devices.sW('8%'), justifyContent: "center", }}>
                      <Picker
                        mode={"dialog"}
                        iosIcon={<Icon containerStyle={{ paddingHorizontal: 10 }} name="chevron-down" size={Devices.fS(15)} color={Colors.BLACK_COLOR} type={"light"} />}
                        selectedValue={_selected ? _selected : null}
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
                    <View>
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
                      <View style={styles.con_content_price}>
                        {_dataOptions.length > 0 &&
                          <CText style={cStyles.txt_body_meta_item} i18nKey={"from_price"} />
                        }

                        {currencyPosition === Currency.left &&
                          <CText style={[styles.txt_price_item, percentSale !== 0 && { color: Colors.PLACEHOLDER_COLOR }]}>{symbol}</CText>
                        }
                        <CText style={[styles.txt_price_item, percentSale !== 0 && styles.txt_regular_price]}>{price}</CText>
                        {currencyPosition === Currency.right &&
                          <CText style={[styles.txt_price_item, percentSale !== 0 && { color: Colors.PLACEHOLDER_COLOR }]}>{symbol}</CText>
                        }
                      </View>
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

              <CImage
                style={[styles.con_info_store, styles.img_store, { width: size.width, height: size.height }]}
                source={source}>
                {(isNews && inBookmark) ?
                  <View style={styles.con_content_image}>
                    <View style={[styles.con_bookmark, { right: -size.width }]}>
                      <Icon name={'bookmark'}
                        color={Colors.PRIMARY_COLOR}
                        sizes={Devices.fS(20)}
                        type={inBookmark ? 'solid' : 'light'} />
                    </View>
                  </View>
                  : (isService && isFeatured && !isSale) ?
                    <View style={styles.con_content_image}>
                      <View style={styles.con_product_new}>
                        <CText style={styles.txt_product_new} i18nKey={'new'} upperCase />
                      </View>
                    </View>
                    : (isService && !isFeatured && isSale) ?
                      <View style={styles.con_content_image}>
                        <View style={styles.con_product_sale}>
                          <CText style={styles.txt_product_sale} i18nKey={'sale'} upperCase />
                        </View>
                      </View>
                      : (isService && isFeatured && isSale) &&
                      <View style={styles.con_content_image}>
                        <View style={styles.con_product_new}>
                          <CText style={styles.txt_product_new} i18nKey={'new'} upperCase />
                        </View>

                        <View style={[styles.con_product_sale, { top: 35 }]}>
                          <CText style={styles.txt_product_sale} i18nKey={'sale'} upperCase />
                        </View>
                      </View>}
              </CImage>
            </View>
          </TouchableOpacity>
        }
      </View>
    )
  }
}

export default Horizontal = ({
  contentStyle = {},
  refreshing = false,
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
  paging = {
    onRefresh: () => null,
    onLoadMore: () => null
  },
  isNews = false,
  isService = false,
  isCategory = false,
  leftThumb = false
}) => {
  return (
    <FlatList
      style={styles.con_list_store}
      contentContainerStyle={[cStyles.flex_grow, contentStyle]}
      data={data}
      renderItem={({ item, index }) =>
        <RenderItem index={index} data={item} isNews={isNews} isService={isService}
          isCategory={isCategory} leftThumb={leftThumb}
          blogMetaField={Configs.settingLocal.blog.blog_meta_fields}
          onPress={onFunction.onPressItem}
          onPressAddCart={onFunction.onPressAddCart} />
      }
      keyExtractor={(item, index) => item.id + index.toString()}
      extraData={data}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      removeClippedSubviews={Devices.OS === 'android'}
      initialNumToRender={10}
      ListHeaderComponent={render.header}
      ListFooterComponent={render.footer}
      ListEmptyComponent={render.empty}
      ItemSeparatorComponent={isService && data.length > 0 && renderSeparator}
      refreshing={refreshing}
      onRefresh={() => paging.onRefresh()}
      onEndReachedThreshold={0.05}
      onEndReached={() => paging.onLoadMore()}
    />
  )
}

