/* eslint-disable no-shadow */
/* eslint-disable react-native/no-inline-styles */
/**
 ** Name:
 ** Author:
 ** CreateAt:
 ** Description:
 **/
/* LIBRARY */
import React, { useEffect, useState } from 'react';
import { View, FlatList, TextInput, ScrollView, TouchableOpacity, RefreshControl, Image, ImageBackground,Pressable, Text, BackHandler, Dimensions, StyleSheet, Platform } from 'react-native';

import Icon from 'react-native-fontawesome-pro';
import { Container, Content } from 'native-base';
import moment from 'moment';
/* COMPONENTS */
import CHeader from '~/components/CHeader';
import { CRateStar } from '~/components/CRateStar';
import CText from '~/components/CText';
import CCarousel from '~/components/CCarousel';
import Carousel, {ParallaxImage} from 'react-native-snap-carousel';
import CImage from '~/components/CImage';
import Horizontal from '~/components/CLayout/Horizontal';
import CLoading from '~/components/CLoading';
import Column from '~/components/CLayout/Column';
import CardView from '~/components/CLayout/CardView';
import CRate from '~/components/CRate';
import CViewRow from '~/components/CViewRow';
import CLoadingPlaceholder from '~/components/CLoadingPlaceholder';
import OverviewDetail from './overview_detail';
/* COMMON */
import { Colors } from '~/utils/colors';
import { Assets, Configs, Devices, Keys } from '~/config';
import { cStyles } from '~/utils/styles';
import { layoutWidth } from '~/utils/layout_width';
import Currency from '~/utils/currency';
import Helpers from '~/utils/helpers';
import AboutAuthor from '~/screens/account/about_author';
import Services from '~/services';
/* STYLES */
import styles from './style';

const renderCouponItem = (index, data, dataLength, onPressPostDetail) => {
  let slugDiscountType = Configs.discountType.find(
    (f) => f.id === data.discount_type,
  );
  let dateExpires = moment(data.date_expires, 'YYYY-MM-DDTHH:mmss').format(
    Configs.formatDate,
  );
  let amount = Helpers.formatNumber(
    Number(data.amount),
    data.discount_type === 'percent' ? 0 : 2,
  );
  let symbol = Helpers.symbolCurrency();

  return (
    <TouchableOpacity onPress={() => onPressPostDetail(data)}>
      <View
        style={[
          styles.con_item_coupon,
          !Configs.supportRTL
            ? { marginLeft: Devices.pH(layoutWidth.width) }
            : { marginRight: Devices.pH(layoutWidth.width) },
        ]}>
        <View
          style={[
            styles.con_coupons_item,
            { backgroundColor: Colors.BACKGROUND_PRIMARY_COLOR },
          ]}>
          <CImage style={styles.img_coupon} source={Assets.image_bg_coupons}>
            <View style={styles.con_bg_blur} />
            {
              <View
                style={[
                  styles.con_info_coupon,
                  Configs.supportRTL && cStyles.column_align_end,
                  !Configs.supportRTL && cStyles.pl_10,
                  Configs.supportRTL && cStyles.pr_10,
                ]}>
                <View
                  style={[
                    styles.con_col_info,
                    Configs.supportRTL && cStyles.column_align_end,
                  ]}>
                  <CImage
                    style={styles.img_icon_coupon}
                    source={Assets.icon_coupon}
                    resizeMode={'contain'}
                  />

                  {data.discount_type === Configs.discountType[2].id && (
                    <CText
                      style={[
                        styles.txt_row_right_bottom,
                        { fontSize: cStyles.txt_base_item.fontSize * 1.5 },
                      ]}>
                      {amount + slugDiscountType.slug}
                    </CText>
                  )}

                  {data.discount_type !== Configs.discountType[2].id && (
                    <CText
                      style={[
                        styles.txt_row_right_bottom,
                        { fontSize: cStyles.txt_base_item.fontSize * 1.5 },
                      ]}>
                      {(Configs.currencyPosition === Currency.left
                        ? symbol
                        : '') +
                        amount +
                        (Configs.currencyPosition === Currency.right
                          ? symbol
                          : '')}
                    </CText>
                  )}
                </View>

                <View
                  style={[
                    styles.con_col_info,
                    Configs.supportRTL && cStyles.column_align_end,
                  ]}>
                  <CText
                    style={styles.txt_row_right_top}
                    i18nKey={'date_expired'}
                  />
                  <CText
                    style={[styles.txt_row_right_bottom, { fontWeight: '800' }]}>
                    {dateExpires}
                  </CText>
                </View>
              </View>
            }
          </CImage>
        </View>
        <CText style={styles.txt_item_coupon_content} numberOfLines={2}>
          {data.description}
        </CText>
      </View>
    </TouchableOpacity>
  );
};
const renderHeaderList = (slug, onPress) => {
  return (
    <CViewRow
      style={styles.con_header_group}
      leftComp={
        <View style={styles.con_title_category}>
          <CText style={styles.txt_coupon_title} i18nKey={slug} />
        </View>
      }
      rightComp={
        onPress ? (
          <TouchableOpacity onPress={onPress}>
            <CText style={styles.txt_coupon_show_all} i18nKey={'show_all'} />
          </TouchableOpacity>
        ) : (
          <View />
        )
      }
    />
    );
};

const { width: screenWidth } = Dimensions.get('window');
const _onRenderEmpty = () => {
  return (
    <View style={[cStyles.full_center, cStyles.pv_20, { width: Devices.width }]}>
      <CText style={cStyles.txt_no_data} i18nKey={'no_data'} />
    </View>
  );
};
export const ViewHome = ({
  state = null,
  props = null,
  toggleAboutAuthor = () => {},
  mainArea = () => {},
  settings = {
    banners: null,
    order: [],
    logo: '',
    appName: '',
  },
  onFunction = {
    onPressCart: () => { },
    onPressCoupon: () => { },
    onPressStickyPost: () => { },
    onFocusSearch: () => { },
    onPressServiceItem: () => { },
    onPressCategory: () => { },
    onPressSeeAllCate: () => { },
    onPressSeeAllVendors: () => { },
    onPressSeeAllViewedProducts: () => { },
    onRefresh: () => { },
    onPressListCoupon: () => { },
    onOpenDrawer: () => { },
    onPressNewsItem: () => { },
    onToggleModalRating: () => { },
    onPressStartRating: () => { },
    onPressAddCart: () => { },
    onPressVendor: () => { },
    onPressAbout: () => { },
    onPressVideos: () => { },
    onPressOverview: () => { },
    onUpdateDetails: () => { },
    onUpdateEntries: () => { },
  }
}) => {
  // const [entries, setEntries] = useState([]); 
  // const [details, setDetails] = useState(null); 

  const _getProductsByCategories = async (params ) => {
    console.log('_getProductsByCategories');
    let res = await Services.Service.listProducts(params);
    console.log(res);
    if (res && !res.code && res.length > 0) {
      // const maps = res.map((item, index) => {
      //   return {title: item.name, illustration: item.images.length > 0 ? item.images[0].src : null, description: item.description, rating: item.average_rating };
      // });
      onFunction.onUpdateEntries(res)
      onFunction.onUpdateDetails(res[0])
    } 
  }
  const params = {"category": 21, "page": 1, "per_page": 10};
  const  backAction = () => {
    if( state._about_author == 2 || state._about_author == 3 || state._about_author == 4){
      toggleAboutAuthor();
      return true;
    }
    return false;
  };
  useEffect(() => {
    if(state._about_author == 3 && state.entries.length == 0) {
      _getProductsByCategories(params)
    }
    BackHandler.addEventListener("hardwareBackPress", backAction);

    return () =>
      BackHandler.removeEventListener("hardwareBackPress", backAction);
  }, [state._about_author]);
  
  
  return (
    <Container>
      <View style={[{height:150,backgroundColor:Colors.BLACK_COLOR, borderBottomRightRadius:45,overflow: 'hidden'}]}>
          <ImageBackground  style={{width: "100%", height: 150, borderBottomRightRadius:45,overflow: 'hidden',  elevation: 1 }} imageStyle= {{opacity:0.3}} resizeMode="cover" source={Assets.header_background} >
          <CHeader 
            style={{ backgroundColor:'transparent',  top:30, elevation: 2, overflow: 'hidden' }} 
            props={props}
            titleComponent={
              <View style={[cStyles.row_justify_center, cStyles.row_align_center, cStyles.flex_full]}>
                <Pressable  style={[{elevation: 3,width: '100%',height: 35, flexDirection: 'row'} ]} onPress={onFunction.onFocusSearch}>
                  <View
                    style={[
                      // cStyles.column_align_center,
                      // cStyles.column_justify_center,
                      styles.header_top_search, cStyles.br_5,
                      { width: '100%',height: 35, flexDirection: 'row',flex: 1 },
                    ]}>
                    {/* <CImage
                      style={styles.img_header_logo}
                      source={settings.logo}
                      resizeMode={'contain'}
                    /> */}

                    <Text style={[{color: Colors.WHITE_COLOR}, cStyles.mt_5, cStyles.ml_10]}>
                      Search
                    </Text>
                        {/* <TextInput 
                          style={[styles.header_top_search, cStyles.br_5,  {flex: 1}]}
                          onFocus={onFunction.onFocusSearch}
                          placeholder="Search"
                          placeholderTextColor={Colors.WHITE_COLOR}
                          
                        /> */}
                        <View style={[{position: 'absolute', height: 20, width: 20, right:5, top: 10} ]} >
                          <Icon 
                            name='search'
                            color={Colors.WHITE_COLOR}
                            size={Devices.fS(20)}
                            type={'regular'} />
                        </View>

                    
                  </View>
                </Pressable >
              </View>
            }
            iconLeft_1={'bars'}
            iconRight_1={'shopping-cart'}
            // iconRight_2={'search'}
            onPressLeft_1={onFunction.onOpenDrawer}
            onPressRight_1={onFunction.onPressCart}
            // onPressRight_2={onFunction.onFocusSearch}
          />
          </ImageBackground> 
      </View>
      { state?._about_author >1 ? 
        
        (state._about_author == 3 ? 
        <View style={{marginTop:10, flex: 1 }}>
           {  mainArea() ?? <View style={[snap_styles.dummyHeight]}></View>}
            <OverviewDetail  
              onFunction={{onPressItem: onFunction.onPressServiceItem}}
              props={props} 
              snap_selected={state._details}>
            </OverviewDetail>
        </View>
        :         
        (state._about_author == 4 ? 
        <><View><Text>Tabraiz</Text></View></>
        : 
        <ScrollView>
        <View style={[cStyles.m_15]}>
          <View style={cStyles.row_align_start}> 
            <Image style={[{width: 95, height: 120},cStyles.row_align_end, cStyles.br_10, cStyles.mr_15]} source={Assets.about_author_detail} ></Image>
            <View style={[cStyles.mt_5, {flexShrink: 1}]}>
              <Text style={[cStyles.mb_5, cStyles.txt_title_header, {fontSize: Devices.fS(20), color: Colors.BLACK_COLOR}]} >The Author</Text>
              <Text style={{fontSize: Devices.fS(13)}}>
                Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laud antium, totam rem aperiam, eaque ipsa quae ab illo invent ore veritatis et quasi architecto
              </Text>
            </View>
            
          </View>
          <View style={[cStyles.mt_20, {flexShrink: 1}]}>
            <Text style={{fontSize: Devices.fS(13)}}>
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur.
            </Text>
          </View>
          
          <View style={[cStyles.mt_20,cStyles.mb_20, {flexShrink: 1}]}>
            <Text style={{fontSize: Devices.fS(13)}}> 
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur.
            </Text>
          </View>
        </View>
      </ScrollView>))
      : 
        (<>
          <View style={[cStyles.flex_wrap,cStyles.column_align_start, cStyles.column, {height:450}]}>
            <Pressable onPress={onFunction.onPressOverview} style={[{marginHorizontal:17, marginVertical:10}]}>
              <View style={[{backgroundColor:'#AF8400', height: 220.4, width:Devices.sW("40%"),  borderRadius: 10}, cStyles.column_justify_between]}>
                <Text style={[cStyles.row_align_start,cStyles.txt_title_button, {flex: 1, flexWrap: 'wrap',width:100, fontSize:Devices.fS(22)}, cStyles.ml_15, cStyles.mt_10]}>Book Overview</Text>
                <Image style={[{width: 175.57, height: 149.4},cStyles.row_align_end]} source={Assets.book_overview} />
              </View>
            </Pressable>
            
            <Pressable onPress={onFunction.onPressVideos}  style={[{marginHorizontal:17, marginVertical:10}]}>
              <View style={[{backgroundColor:'#003B3F', height: 125.42, width:Devices.sW("40%"), borderRadius: 10, paddingLeft: 20}, cStyles.column_justify_between]}>
                <Image style={[{width: 120.63, height: 69.86},cStyles.row_align_start]} source={Assets.video_image} />
                <Text style={[cStyles.txt_title_button,cStyles.mt_10, {flex: 1, flexWrap: 'wrap',width:100, fontSize:Devices.fS(22)}]}>Videos</Text>
              </View>
            </Pressable>
            
            <Pressable onPress={onFunction.onPressAbout} style={[{marginHorizontal:17, marginVertical:10}]}> 
              <View style={[{backgroundColor:'#175700', height: 160, width:Devices.sW("40%"),  borderRadius: 10}, cStyles.column_justify_between]}>
                <Text style={[cStyles.row_align_start,cStyles.txt_title_button, {flex: 1, flexWrap: 'wrap',width:80, fontSize:Devices.fS(22)}, cStyles.ml_15, cStyles.mt_10]}>About The Author</Text>
                <Image  style={[{width: 85, height: 165, flex:1,position: 'absolute', right: -8, top:-5},cStyles.row_align_end]} source={Assets.about_author} />
              </View>
            </Pressable>
  
            <Pressable  onPress={() => props?.navigation.jumpTo('Service')} style={[{marginHorizontal:17, marginVertical:10}]}> 
              <View style={[{backgroundColor:'#690001', height: 200, width:Devices.sW("40%"),  borderRadius: 10}, cStyles.column_justify_between]}>
                <Text style={[cStyles.row_align_start,cStyles.txt_title_button, {flex: 1, flexWrap: 'wrap',width:100, fontSize:Devices.fS(22)}, cStyles.ml_15, cStyles.mt_10]}>Products</Text>
                <Image style={[{width: 130, height: 139,position: 'absolute', right: -10, bottom:0},cStyles.row_align_end]} source={Assets.products_image} />
              </View>
            </Pressable>
          </View>
  
          <Content
            style={styles.con_content}
            refreshControl={
              <RefreshControl
                refreshing={state._refreshing}
                onRefresh={onFunction.onRefresh}
              />
            }>
            {!state._loading ?
              settings.order.map((item, index) => {
                /** SLIDER BANNER */
                if (item.acf_fc_layout === Keys.KEY_HOME_BANNERS) {
                  return (
                    <View
                      key={'home_' + Keys.KEY_HOME_BANNERS + moment().valueOf()}>
                      <CCarousel
                        data={item.data}
                        onPressItem={onFunction.onPressStickyPost}
                        height="200"
                      />
                    </View>
                  );
                }
  
                // /** CATEGORIES */
                if (item.acf_fc_layout === Keys.KEY_HOME_CATEGORIES) {
                  return (
                    <View
                      key={'home_' + Keys.KEY_HOME_CATEGORIES + index.toString()}>
                      {renderHeaderList('categories', onFunction.onPressSeeAllCate)}
                      {item.thumb_style === Configs.customThumbCategory.SQUARE && (
                        <CardView
                          data={item.data}
                          onFunction={{
                            onPressItem: onFunction.onPressCategory,
                          }}
                          isCategory
                        />
                      )}
  
                      {item.thumb_style === Configs.customThumbCategory.CIRCLE && (
                        <Column
                          data={item.data}
                          onFunction={{
                            onPressItem: onFunction.onPressCategory,
                          }}
                          isCategory
                          numberOfColumns={2}
                        />
                      )}
                    </View>
                  );
                }
  
                /** VENDORS */
                if (item.acf_fc_layout === Keys.KEY_HOME_VENDORS && item.data.length > 0) {
                  return (
                    <View
                      key={'home_' + Keys.KEY_HOME_VENDORS + index.toString()}>
                      {renderHeaderList('vendors', onFunction.onPressSeeAllVendors)}
                      <CardView
                        data={item.data}
                        onFunction={{
                          onPressItem: onFunction.onPressVendor,
                        }}
                        isVendors
                      />
                    </View>
                  )
                }
  
  
                /** COUPONS */
                if (
                  item.acf_fc_layout === Keys.KEY_HOME_COUPONS &&
                  item.data &&
                  item.data.length > 0 
                ) {
                  return (
                    <View key={'home_' + Keys.KEY_HOME_COUPONS + index.toString()}>
                      {renderHeaderList(
                        'special_coupons',
                        onFunction.onPressListCoupon,
                      )}
                      <FlatList
                        data={item.data}
                        renderItem={(props) =>
                          renderCouponItem(
                            props.index,
                            props.item,
                            item.data.length,
                            onFunction.onPressCoupon,
                          )
                        }
                        inverted={Configs.supportRTL}
                        keyExtractor={(item, index) => index.toString()}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        ListEmptyComponent={_onRenderEmpty}
                      />
                    </View>
                  );
                }
  
                /** FEATURED POSTS */
                // if (item.acf_fc_layout === Keys.KEY_HOME_FEATURED_POSTS) {
                //   return (
                //     <View
                //       key={
                //         'home_' + Keys.KEY_HOME_FEATURED_POSTS + index.toString()
                //       }>
                //       {renderHeaderList('featured_posts', null)}
                //       <Horizontal
                //         contentStyle={{
                //           paddingHorizontal: Devices.pH(layoutWidth.width),
                //         }}
                //         data={item.data}
                //         render={{}}
                //         onFunction={{
                //           onPressItem: onFunction.onPressNewsItem,
                //         }}
                //         isNews
                //         leftThumb
                //       />
                //     </View>
                //   );
                // }
  
                /** LATEST POSTS */
                if (item.acf_fc_layout === Keys.KEY_HOME_LATEST_POSTS) {
                  if (
                    item.layout_style === Configs.customLayout.LEFT_THUMB ||
                    item.layout_style === Configs.customLayout.RIGHT_THUMB
                  ) {
                    return (
                      <View
                        key={
                          'home_' +
                          Keys.KEY_HOME_LATEST_POSTS +
                          Configs.customLayout.LEFT_THUMB +
                          index.toString()
                        }>
                        {renderHeaderList('latest_posts', null)}
                        <Horizontal
                          contentStyle={{
                            paddingHorizontal: Devices.pH(layoutWidth.width),
                          }}
                          data={item.data}
                          onFunction={{
                            onPressItem: onFunction.onPressNewsItem,
                          }}
                          isNews
                          leftThumb={
                            item.layout_style === Configs.customLayout.LEFT_THUMB
                          }
                        />
                      </View>
                    );
                  }
  
                  if (item.layout_style === Configs.customLayout.CARD_THUMB) {
                    return (
                      <View
                        key={
                          'home_' +
                          Keys.KEY_HOME_LATEST_POSTS +
                          Configs.customLayout.CARD_THUMB +
                          index.toString()
                        }>
                        {renderHeaderList('latest_posts', null)}
                        <CardView
                          contentStyle={{
                            paddingHorizontal: Devices.pH(layoutWidth.width),
                          }}
                          data={item.data}
                          onFunction={{
                            onPressItem: onFunction.onPressNewsItem,
                          }}
                          isNews
                        />
                      </View>
                    );
                  }
  
                  if (item.layout_style === Configs.customLayout.GRID_THUMB) {
                    return (
                      <View
                        key={
                          'home_' +
                          Keys.KEY_HOME_LATEST_POSTS +
                          Configs.customLayout.GRID_THUMB +
                          index.toString()
                        }>
                        {renderHeaderList('latest_posts', null)}
                        <Column
                          data={item.data}
                          onFunction={{
                            onPressItem: onFunction.onPressNewsItem,
                          }}
                          isNews
                          numberOfColumns={2}
                        />
                      </View>
                    );
                  }
                }
  
                /** LATEST PRODUCTS */
                if (item.acf_fc_layout === Keys.KEY_HOME_LATEST_PRODUCT) {
                  if (
                    item.layout_style === Configs.customLayout.LEFT_THUMB ||
                    item.layout_style === Configs.customLayout.RIGHT_THUMB
                  ) {
                    return (
                      <View
                        key={
                          'home_' +
                          Keys.KEY_HOME_LATEST_PRODUCT +
                          Configs.customLayout.LEFT_THUMB +
                          index.toString()
                        }>
                        {renderHeaderList('latest_services', null)}
                        <Horizontal
                          contentStyle={{
                            paddingHorizontal: Devices.pH(layoutWidth.width),
                          }}
                          data={item.data}
                          onFunction={{
                            onPressItem: onFunction.onPressServiceItem,
                            onPressAddCart: onFunction.onPressAddCart,
                          }}
                          isService
                          leftThumb={
                            item.layout_style === Configs.customLayout.LEFT_THUMB
                          }
                        />
                      </View>
                    );
                  }
  
                  if (item.layout_style === Configs.customLayout.CARD_THUMB) {
                    return (
                      <View
                        key={
                          'home_' +
                          Keys.KEY_HOME_LATEST_PRODUCT +
                          Configs.customLayout.CARD_THUMB +
                          index.toString()
                        }>
                        {renderHeaderList('latest_services', null)}
                        <CardView
                          contentStyle={{
                            paddingHorizontal: Devices.pH(layoutWidth.width),
                          }}
                          data={item.data}
                          onFunction={{
                            onPressItem: onFunction.onPressServiceItem,
                            onPressAddCart: onFunction.onPressAddCart,
                          }}
                          isService
                        />
                      </View>
                    );
                  }
  
                  if (item.layout_style === Configs.customLayout.GRID_THUMB) {
                    return (
                      <View
                        key={
                          'home_' +
                          Keys.KEY_HOME_LATEST_PRODUCT +
                          Configs.customLayout.GRID_THUMB +
                          index.toString()
                        }>
                        {renderHeaderList('latest_services', null)}
                        <Column
                          data={item.data}
                          onFunction={{
                            onPressItem: onFunction.onPressServiceItem,
                            onPressAddCart: onFunction.onPressAddCart,
                          }}
                          isService
                        />
                      </View>
                    );
                  }
                }
  
                /** FEATURED PRODUCTS */
                if (item.acf_fc_layout === Keys.KEY_HOME_FEATURED_PRODUCT) {
                  return (
                    <View
                      key={
                        'home_' + Keys.KEY_HOME_FEATURED_PRODUCT + index.toString()
                      }>
                      {renderHeaderList('featured_products', null)}
                      <Column
                        data={item.data}
                        onFunction={{
                          onPressItem: onFunction.onPressServiceItem,
                          onPressAddCart: onFunction.onPressAddCart,
                        }}
                        isService
                      />
                    </View>
                  );
                }
  
                /** VIEWED PRODUCTS */
                if (item.acf_fc_layout === Keys.KEY_HOME_VIEWED_PRODUCT) {
                  return (
                    <View
                      key={
                        'home_' + Keys.KEY_HOME_VIEWED_PRODUCT + index.toString()
                      }>
                      {renderHeaderList(
                        'viewed_products',
                        onFunction.onPressSeeAllViewedProducts,
                      )}
                      <Column
                        data={item.data}
                        onFunction={{
                          onPressItem: onFunction.onPressServiceItem,
                          onPressAddCart: onFunction.onPressAddCart,
                        }}
                        isService
                      />
                    </View>
                  );
                }
              })
            :
            <CLoadingPlaceholder />
            }
          </Content>
  
          <CRate
            visible={state._rating}
            onRequestClose={onFunction.onToggleModalRating}
            appName={settings.appName}
            onOK={onFunction.onPressStartRating}
          />
        </>)
      }
      

      {/* <CLoading visible={state._loading} /> */}
    </Container>
  );
};
