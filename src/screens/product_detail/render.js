/**
** Name: 
** Author: 
** CreateAt: 
** Description: 
**/
/* LIBRARY */
import React from 'react';
import { View, FlatList, TouchableOpacity, Animated } from 'react-native';
import {
    Container, Left, Body, Right, Content, Button
} from 'native-base';
import Icon from 'react-native-fontawesome-pro';
import HTML from 'react-native-render-html';
import firebase from 'react-native-firebase';
/* COMPONENTS */
import CText from '~/components/CText';
import CImage from '~/components/CImage';
import CLoading from '~/components/CLoading';
import CSwiper from '~/components/CSwiper';
import CViewRow from "~/components/CViewRow";
import { CRateStar } from '~/components/CRateStar';
import { CVendor } from '~/components/CVendor'
import { BallIndicator } from '~/components/CIndicator';
/* COMMON */
import { Colors } from '~/utils/colors';
import { Devices, Languages, Configs, Assets } from '~/config';
import { cStyles } from '~/utils/styles';
import { layoutWidth } from '~/utils/layout_width';
import Helpers from '~/utils/helpers';
import Currency from '~/utils/currency';
/* STYLES */
import styles from './style';
import CLoadingPlaceholder from '~/components/CLoadingPlaceholder';

const Banner = firebase.admob.Banner;
const AdRequest = firebase.admob.AdRequest;
const request = new AdRequest();
const MIN_HEIGHT = 80;
const MAX_HEIGHT = Devices.sW('80%');

/** OTHER RENDER */
const RenderEmptySlider = () => {
    return (
        <CImage
            style={styles.img_header}
            source={Assets.image_failed}
        />
    )
}

const RenderSlider = (data, size) => {
    return (
        <CImage
            style={[styles.img_header, { width: size.width, height: size.height }]}
            source={{ uri: data.sizes ? data.sizes.woocommerce_single : data.src }}
        />
    )
}

const RenderSeparatorOption = () => {
    return (
        <View style={styles.con_separator_option} />
    )
}

const RenderContentAccordion = (content) => {
    return (
        <View style={styles.con_content_accordion}>
            <HTML
                html={content}
                tagsStyles={{
                    p: {
                        fontFamily: cStyles.txt_base_item.fontFamily,
                        fontSize: cStyles.txt_base_item.fontSize,
                        color: '#000',
                        textAlign: Configs.supportRTL ? "right" : "left"
                    }
                }}
            />
        </View>
    )
}

const RenderRelatedProduct = (index, data, dataLength, onPress) => {
    let price = 0, currencyPosition = Configs.currencyPosition, symbol = "",
        source = Assets.image_failed,
        title = data.name;
    let percentSale = 0;
    let scaleImage = 1;
    if (data.on_sale && data.sale_price !== "") {
        percentSale = Helpers.parsePercentSale(data.regular_price, data.sale_price);
        price = Helpers.formatNumber(data.regular_price);
    } else {
        price = Helpers.formatNumber(data.price);
    }
    if (data.images && data.images.length > 0) {
        source = { uri: data.images[0].sizes.thumbnail };
        scaleImage = data.images[0].sizes["woocommerce_thumbnail-width"] / data.images[0].sizes["woocommerce_thumbnail-height"];
    }
    currencyPosition = Configs.currencyPosition;
    symbol = Helpers.symbolCurrency();

    let size = Devices.sImage("column", scaleImage);

    return (
        <TouchableOpacity onPress={() => onPress(data)}>
            <View style={[
                styles.con_store_service,
                (index !== dataLength - 1 && !Configs.supportRTL) && { marginRight: 30 },
                (index !== dataLength - 1 && Configs.supportRTL) && { marginLeft: 30 },
                (index === dataLength - 1 && !Configs.supportRTL) && cStyles.pr_20,
                (index === dataLength - 1 && Configs.supportRTL) && cStyles.pl_20,
                (index === 0 && !Configs.supportRTL) && cStyles.pl_20,
                (index === 0 && Configs.supportRTL) && cStyles.pr_20
            ]} >
                <View style={cStyles.column_align_center}>
                    <CImage style={[styles.img_product, { width: size.width, height: size.height }]}
                        source={source} />

                    {(data.featured && !data.on_sale) ?
                        <View style={[styles.con_content_image, !Configs.supportRTL ? { left: 5 } : { right: 5 }]}>
                            <View style={styles.con_product_new}>
                                <CText style={styles.txt_product_new} i18nKey={'new'} upperCase />
                            </View>
                        </View>
                        : (!data.featured && data.on_sale) ?
                            <View style={[styles.con_content_image, !Configs.supportRTL ? { left: 5 } : { right: 5 }]}>
                                <View style={styles.con_product_sale}>
                                    <CText style={styles.txt_product_sale} i18nKey={'sale'} upperCase />
                                </View>
                            </View>
                            : (data.featured && data.on_sale) &&
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

                <View style={[styles.con_info_store, { width: Devices.sW("33%") }]}>
                    <View style={styles.con_title_store}>
                        <CText style={[styles.txt_title_store, {color:'#C1A050'}]} numberOfLines={2}>{title}</CText>
                    </View>

                    {data.stock_status === Configs.stockStatus.IN_STOCK ?
                        <View style={[styles.con_cart_service_selected, Configs.supportRTL && cStyles.row_justify_end]}>
                            {percentSale !== 0 &&
                                <View style={styles.con_content_price_2}>
                                    {currencyPosition === Currency.left &&
                                        <CText style={[styles.txt_content_price_sale]}>{symbol}</CText>
                                    }
                                    <CText style={styles.txt_content_price_sale}>{Helpers.formatNumber(data.sale_price)}</CText>
                                    {currencyPosition === Currency.right &&
                                        <CText style={[styles.txt_content_price_sale]}>{symbol}</CText>
                                    }
                                </View>
                            }
                            <View style={[cStyles.row_align_center, percentSale !== 0 && (!Configs.supportRTL ? cStyles.pl_5 : cStyles.pr_5)]}>
                                {data.variations.length > 0 &&
                                    <CText style={[cStyles.txt_body_meta_item, Configs.supportRTL ? cStyles.pr_5 : cStyles.pl_5]} i18nKey={"from_price"} />}
                                <View style={cStyles.row_align_center}>
                                    {currencyPosition === Currency.left &&
                                        <CText style={[styles.txt_price_item, percentSale !== 0 && styles.txt_regular_price]}>{symbol}</CText>
                                    }
                                    <CText style={[styles.txt_price_item, percentSale !== 0 && styles.txt_regular_price]}>{price}</CText>
                                    {currencyPosition === Currency.right &&
                                        <CText style={[styles.txt_price_item, percentSale !== 0 && styles.txt_regular_price]}>{symbol}</CText>
                                    }
                                </View>
                            </View>
                        </View>
                        :
                        <CText style={styles.txt_out_of_stock_2} i18nKey={"out_of_stock"} />
                    }


                    {data.reviews_allowed &&
                        <CRateStar containerStyle={{ marginTop: 0 }}
                            averageRating={data.average_rating}
                            ratingCount={data.rating_count} />
                    }
                </View>
            </View>
        </TouchableOpacity>
    )
}

export const ViewProductDetail = ({
    state = null,
    props = null,
    settings = {
        ads: null
    },
    onFunctions = {
        onPressBack: () => { },
        onAddOrUpdate: () => { },
        onPressOption: () => { },
        onPressCart: () => { },
        onPressRelatedProducts: () => { },
        onPressReviews: () => { },
        onPressDescription: () => { },
        onChange: () => { },
        onPressStore: () => { },
    }
}) => {
    let price = Helpers.formatNumber(Number(state._price));
    let priceSale = 0, percentSale = 0, currencyPosition = Configs.currencyPosition;
    let currency = Configs.html5Entities.decode(Configs.currency);
    let imageOpacity = state._scrollY.interpolate({
        inputRange: [0, (MAX_HEIGHT - MIN_HEIGHT)],
        outputRange: [1, 0],
        extrapolate: 'clamp',
    });
    let headerOpacity = state._scrollY.interpolate({
        inputRange: [0, (MAX_HEIGHT - MIN_HEIGHT)],
        outputRange: [0, 1],
        extrapolate: 'clamp',
    });
    let scaleImage = 1;
    if (state._product.images.length > 0) {
        if (state._product.images.sizes) {
            let height = state._product.images[0].sizes["woocommerce_single-height"]
                ? state._product.images[0].sizes["woocommerce_single-height"]
                : state._product.images[0].sizes["woocommerce_single-width"]
            scaleImage = state._product.images[0].sizes["woocommerce_single-width"] / height
        }
    }
    if (state._product.on_sale && state._product.sale_price !== "") {
        percentSale = Helpers.parsePercentSale(state._product.regular_price, state._product.sale_price);
        priceSale = Helpers.formatNumber(state._product.sale_price);
        price = Helpers.formatNumber(state._product.regular_price);

    } else if (state._product.salePrice && state._product.salePrice !== 0) {
        percentSale = Helpers.parsePercentSale(state._product.originPrice, state._product.salePrice);
        priceSale = Helpers.formatNumber(state._product.salePrice);
        price = Helpers.formatNumber(state._product.originPrice);

    } else if (state._optionSelected && state._optionSelected.on_sale && state._optionSelected.sale_price !== "") {
        percentSale = Helpers.parsePercentSale(state._optionSelected.regular_price, state._optionSelected.sale_price);
        priceSale = Helpers.formatNumber(state._optionSelected.sale_price);
        price = Helpers.formatNumber(state._optionSelected.regular_price);
    }
    let size = Devices.sImage("product_detail", scaleImage);

    return (
        <Container style={cStyles.custom_margin}>
            <Animated.View style={[styles.con_header_fixed, { opacity: headerOpacity }]} />

            {!Configs.supportRTL ?
                <View style={[styles.con_header_fixed, {
                    backgroundColor: "transparent", borderBottomWidth: 0, paddingHorizontal: Devices.pH(layoutWidth.width)
                }]}>
                    <Left style={[styles.con_header_left, { marginLeft:Devices.sW(1.5)}]}>
                        <TouchableOpacity onPress={onFunctions.onPressBack}>
                            <Icon
                                containerStyle={[cStyles.mv_20, cStyles.mr_20]}
                                name={"angle-left"}
                                size={Devices.fS(20)}
                                color={Colors.BLACK_COLOR}
                                type={"regular"}
                            />
                        </TouchableOpacity>
                    </Left>
                    <Body style={styles.con_header_title}>
                        <Animated.View style={{ opacity: headerOpacity }}>
                            <CText style={styles.txt_title_header_fixed}>{state._product ? state._product.name : ""}</CText>
                        </Animated.View>
                    </Body>
                    <Right style={[styles.con_header_right,{ marginRight:Devices.sW(4)}]}>
                        <Button transparent onPress={onFunctions.onPressCart} style={[{backgroundColor:Colors.WHITE_COLOR, paddingHorizontal:Devices.sW(2),  height:Devices.sH(6), borderRadius: 5, }]}>
                            <Icon containerStyle={[cStyles.mv_20]}
                                name={'shopping-cart'}
                                color={Colors.BLACK_COLOR}
                                size={Devices.fS(18)}
                                type={'regular'}
                            />
                            {props.cart.length > 0 &&
                                <View style={styles.con_badge}>
                                    <CText style={styles.txt_badge}>{props.cart.length > 9 ? "+9" : props.cart.length}</CText>
                                </View>
                            }
                        </Button>
                    </Right>
                </View>
                :
                <View style={[styles.con_header_fixed, {
                    backgroundColor: "transparent", borderBottomWidth: 0, paddingHorizontal: Devices.pH(layoutWidth.width)
                }]}>
                    <Left style={[styles.con_header_left]}>
                        <Button transparent onPress={onFunctions.onPressCart}>
                            <Icon name={'shopping-cart'} color={Colors.BLACK_COLOR} size={Devices.fS(20)} type={'regular'} />
                            {props.cart.length > 0 &&
                                <View style={styles.con_badge}>
                                    <CText style={styles.txt_badge}>{props.cart.length > 9 ? "+9" : props.cart.length}</CText>
                                </View>
                            }
                        </Button>

                    </Left>
                    <Body style={styles.con_header_title}>
                        <Animated.View style={{ opacity: headerOpacity }}>
                            <CText style={styles.txt_title_header_fixed}>{state._product ? state._product.name : ""}</CText>
                        </Animated.View>
                    </Body>
                    <Right style={styles.con_header_right}>
                        <TouchableOpacity onPress={onFunctions.onPressBack}>
                            <Icon
                                name={"angle-right"}
                                size={Devices.fS(20)}
                                color={Colors.BLACK_COLOR}
                                type={"regular"}
                            />
                        </TouchableOpacity>
                    </Right>
                </View>
            }

            <Content style={styles.con_content_full}
                showsVerticalScrollIndicator={false}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: state._scrollY } } }]
                )}>
                <Animated.View style={[styles.con_header, { opacity: imageOpacity, width: size.width, height: size.height }]}>
                    <CSwiper autoScroll={true}
                        key={state._currSlick}
                        data={state._product.images}
                        renderItem={(item) => RenderSlider(item, size)}
                        renderEmptyItem={RenderEmptySlider}
                        isHome={false}
                        isProduct={true} />
                </Animated.View>

                <View style={styles.con_content}>
                    <View style={[styles.con_content_title, {
                        paddingHorizontal: Devices.pH(layoutWidth.width)
                    }]}>
                        <CViewRow style={styles.con_category_star} between
                            leftComp={state._categories !== "" ?
                                <CText style={[styles.txt_content_categories, {color:'#18504D'}]} numberOfLines={1}>{state._categories}</CText> :
                                <View />
                            }
                            rightComp={state._product.reviews_allowed ?
                                <CRateStar containerStyle={{ marginTop: 0 }}
                                    averageRating={state._product.average_rating}
                                    ratingCount={state._product.rating_count} /> : <View />
                            }
                        />

                        <CText style={[styles.txt_content_title, { color: '#18504D' }]} numberOfLines={3}>
                            {state._product ? state._product.name : ""}
                        </CText>

                        {state._optionSelected && priceSale !== 0 ?
                            <CViewRow
                                leftComp={
                                    <CViewRow
                                        leftComp={
                                            <View style={styles.con_content_price_2}>
                                                {currencyPosition === Currency.left &&
                                                    <CText style={[styles.txt_main_price, percentSale !== 0 && styles.txt_maint_regular_price,]}>
                                                        {currency}
                                                    </CText>
                                                }
                                                <CText style={[styles.txt_main_price, percentSale !== 0 && styles.txt_maint_regular_price]}>{price}</CText>
                                                {currencyPosition === Currency.right &&
                                                    <CText style={[styles.txt_main_price, percentSale !== 0 && styles.txt_maint_regular_price]}>
                                                        {currency}
                                                    </CText>
                                                }
                                            </View>
                                        }
                                        rightComp={
                                            <View style={[styles.con_content_price_2, Configs.supportRTL ? cStyles.mr_5 : cStyles.ml_5]}>
                                                {currencyPosition === Currency.left &&
                                                    <CText style={[styles.txt_maint_price_sale, {color:'#000'}]}>{currency}</CText>
                                                }
                                                <CText style={[styles.txt_maint_price_sale, {color:'#000'}]}>{priceSale}</CText>
                                                {currencyPosition === Currency.right &&
                                                    <CText style={[styles.txt_maint_price_sale, {color:'#000'}]}>{currency}</CText>
                                                }
                                            </View>
                                        }
                                    />
                                }
                                rightComp={
                                    <CViewRow style={[Configs.supportRTL ? cStyles.mr_5 : cStyles.ml_5]}
                                        leftComp={<View style={styles.con_sale}>
                                            <CText style={styles.txt_sale_tag} i18nKey={'sale'} />
                                            <CText style={styles.txt_sale_tag}>{" " + percentSale + "%"}</CText>
                                        </View>
                                        }
                                        rightComp={
                                            state._product.featured ?
                                                <View style={styles.con_featured}>
                                                    <CText style={styles.txt_featured_tag} i18nKey={'featured'} />
                                                </View> : <View />
                                        }
                                    />
                                }
                            />
                            :
                            <View style={[styles.con_content_price, Configs.supportRTL && cStyles.row_justify_end]}>
                                <View style={styles.con_content_price_2}>
                                    <CViewRow
                                        leftComp={
                                            <View style={styles.con_content_price_2}>
                                                {currencyPosition === Currency.left &&
                                                    <CText style={[styles.txt_main_price, percentSale !== 0 && styles.txt_maint_regular_price, {color: '#000'}]}>
                                                        {currency}
                                                    </CText>
                                                }
                                                <CText style={[styles.txt_main_price, percentSale !== 0 && styles.txt_regular_price, {color: '#000'}]}>{price}</CText>
                                                {currencyPosition === Currency.right &&
                                                    <CText style={[styles.txt_main_price, percentSale !== 0 && { color: Colors.PLACEHOLDER_COLOR }]}>
                                                        {currency}
                                                    </CText>
                                                }
                                            </View>
                                        }
                                        rightComp={
                                            percentSale !== 0 ?
                                                <CViewRow
                                                    leftComp={
                                                        <View style={[styles.con_content_price_2, Configs.supportRTL ? cStyles.mr_5 : cStyles.ml_5]}>
                                                            {currencyPosition === Currency.left &&
                                                                <CText style={styles.txt_maint_price_sale}>{currency}</CText>
                                                            }
                                                            <CText style={styles.txt_maint_price_sale}>{priceSale}</CText>
                                                            {currencyPosition === Currency.right &&
                                                                <CText style={styles.txt_maint_price_sale}>{currency}</CText>
                                                            }
                                                        </View>
                                                    }
                                                    rightComp={
                                                        <CViewRow style={[Configs.supportRTL ? cStyles.mr_5 : cStyles.ml_5]}
                                                            leftComp={
                                                                <View style={[styles.con_sale, {backgroundColor:'#18504D'}]}>
                                                                    <CText style={styles.txt_sale_tag} i18nKey={'sale'} />
                                                                    <CText style={styles.txt_sale_tag}>{" " + percentSale + "%"}</CText>
                                                                </View>
                                                            }
                                                            rightComp={
                                                                state._product.featured ?
                                                                    <View style={styles.con_featured}>
                                                                        <CText style={styles.txt_featured_tag} i18nKey={'new'} />
                                                                    </View> : <View />
                                                            }
                                                        />
                                                    }
                                                /> : <View />
                                        }
                                    />
                                </View>
                            </View>
                        }

                        {state._product.sku !== "" &&
                            <View style={[cStyles.row_align_center, Configs.supportRTL && cStyles.row_justify_end]}>
                                <CText style={styles.txt_content_sku}>{"sku: "}</CText>
                                <CText style={styles.txt_content_sku}>{state._product.sku}</CText>
                            </View>
                        }

                        {state._product.short_description !== "" && Configs.showShortDescriptionProduct &&
                            <View style={styles.con_content_short_des}>
                                <HTML
                                    html={state._product.short_description}
                                    tagsStyles={{
                                        p: {
                                            color: '#fff',
                                            fontFamily: cStyles.txt_body_meta_item.fontFamily,
                                            fontSize: cStyles.txt_base_item.fontSize,
                                            textAlign: Configs.supportRTL ? "right" : "left"
                                        }
                                    }}
                                />
                            </View>
                        }
                    </View>
                    {state._loading ?
                        <CLoadingPlaceholder />
                    :
                    <>
                    {state._options &&
                        state._options.length > 0 &&
                        <View style={{ paddingHorizontal: Devices.pH(layoutWidth.width) }}>
                            <View style={styles.con_content_option}>
                                <CText style={[styles.txt_header_accordion, {color: '#000'}]} i18nKey={'options'} />

                                <FlatList style={styles.con_list_option}
                                    data={state._options}
                                    renderItem={({ item, index }) => {
                                        let price = Number(item.price) - Number(props.route.params.product.price);
                                        let priceToString = Helpers.formatNumber(price);
                                        let selected = state._optionSelected ? state._optionSelected.id === item.id : false;
                                        let outOfStock = item.stock_status === Configs.stockStatus.OUT_OF_STOCK;
                                        let label = "";
                                        for (let std of item.attributes) label += `${std.option}, `;
                                        label = label.substr(0, label.length - 2);
                                        return (
                                            <TouchableOpacity disabled={outOfStock} onPress={() => onFunctions.onPressOption(item)}>
                                                <CViewRow style={cStyles.pb_10} between
                                                    leftComp={
                                                        <CViewRow style={[styles.con_content_left_option, Configs.supportRTL && cStyles.row_justify_end]}
                                                            leftComp={
                                                                <Icon
                                                                    name={selected ? "check-circle" : "circle"}
                                                                    size={Devices.fS(20)}
                                                                    color={selected ? '#18504D' : Colors.ICON_COLOR}
                                                                    type={"regular"}
                                                                />
                                                            }
                                                            rightComp={
                                                                <CText style={[Configs.supportRTL ? cStyles.pr_10 [{color:'#000'}] : cStyles.pl_10, selected ?
                                                                    [styles.txt_option_title_active, { color: '#000' }] :
                                                                    [styles.txt_option_title, outOfStock && styles.txt_options_out_stock, {color:'#000'}]]}>
                                                                    {label}
                                                                </CText>
                                                            }
                                                        />
                                                    }
                                                    rightComp={price > 0 ?
                                                        <View style={[styles.con_content_right_option, Configs.supportRTL && cStyles.row_justify_start]}>
                                                            <CText style={selected ?
                                                                [styles.txt_option_price_active, { color: '#000' }] :
                                                                [styles.txt_option_price, outOfStock && styles.txt_options_out_stock]}>{'+ '}</CText>

                                                            {currencyPosition === Currency.left &&
                                                                <CText style={selected ?
                                                                    [styles.txt_option_price_active, { color: '#000' }] :
                                                                    [styles.txt_option_price, outOfStock && styles.txt_options_out_stock, { color: '#000' }]}>{currency}</CText>
                                                            }
                                                            <CText style={selected ?
                                                                [styles.txt_option_price_active, { color: '#000' }] :
                                                                [styles.txt_option_price, outOfStock && styles.txt_options_out_stock]}>{priceToString}</CText>
                                                            {currencyPosition === Currency.right &&
                                                                <CText style={selected ?
                                                                    [styles.txt_option_price_active, { color: '#000' }] :
                                                                    [styles.txt_option_price, outOfStock && styles.txt_options_out_stock, { color: '#000' }]}>{currency}</CText>
                                                            }
                                                        </View> : <View style={styles.con_content_right_option} />
                                                    }
                                                />
                                            </TouchableOpacity>
                                        )
                                    }}
                                    showsHorizontalScrollIndicator={false}
                                    keyExtractor={(item, index) => index.toString()}
                                    ItemSeparatorComponent={RenderSeparatorOption}
                                />
                            </View>

                            <View style={styles.con_separator} />
                        </View>
                    }

                    {state._product.description !== "" &&
                        <View style={{ paddingHorizontal: Devices.pH(layoutWidth.width) }}>
                            <TouchableOpacity onPress={onFunctions.onPressDescription}>
                                <CViewRow style={[styles.con_header_accordion, { paddingTop: 0 }]}
                                    leftComp={<CText style={[styles.txt_header_accordion, {color:'#000'}]} i18nKey={'description'} />}
                                    rightComp={
                                        <Icon name={state._isShowDescription ? 'angle-up' : 'angle-down'}
                                            color={cStyles.ic_right_detail.color}
                                            size={cStyles.ic_right_detail.size}
                                            type={cStyles.ic_right_detail.type} />
                                    }
                                />
                            </TouchableOpacity>

                            {state._isShowDescription && RenderContentAccordion(state._product.description)}
                        </View>
                    }

                    {state._product.reviews_allowed &&
                        <TouchableOpacity onPress={onFunctions.onPressReviews}>
                            <CViewRow style={[styles.con_header_accordion, { paddingHorizontal: Devices.pH(layoutWidth.width) }]}
                                leftComp={<CText style={styles.txt_header_accordion} i18nKey={'reviews'} />}
                                rightComp={
                                    <Icon name={'angle-down'}
                                        color={cStyles.ic_right_detail.color}
                                        size={cStyles.ic_right_detail.size}
                                        type={cStyles.ic_right_detail.type} />
                                }
                            />
                        </TouchableOpacity>
                    }

                    {state._product.store?.vendor_id &&
                        <View style={[cStyles.mv_10, { paddingHorizontal: Devices.pH(layoutWidth.width) }]}>
                            <CVendor data={state._product.store} onPress={onFunctions.onPressStore} />
                        </View>
                    }

                    {/* Related products */}
                    {Configs.showRelatedProduct &&
                        <View style={styles.con_list_store}>
                            <CText style={[styles.txt_title_related, { paddingHorizontal: Devices.pH(layoutWidth.width), color:"#C1A050" }]}
                                i18nKey={"related_products"} upperCase />

                            <FlatList contentContainerStyle={{ paddingHorizontal: Devices.pH(layoutWidth.width) }}
                                data={state._relatedProduct}
                                renderItem={({ item, index }) =>
                                    RenderRelatedProduct(index, item, state._relatedProduct.length, onFunctions.onPressRelatedProducts)}
                                keyExtractor={(item, index) => index.toString()}
                                inverted={Configs.supportRTL}
                                horizontal={true}
                                showsHorizontalScrollIndicator={false}
                            />
                        </View>
                    }
                    </>
                    }
 
                </View>
            </Content>

            <View style={styles.con_footer}>
                <CViewRow between style={[styles.con_btn_group, { paddingHorizontal: Devices.pH(layoutWidth.width) }, cStyles.pb_10 ]}
                    leftComp={
                        state._product.stock_status === Configs.stockStatus.IN_STOCK ?
                            <Button style={[styles.con_btn,
                            !Configs.supportRTL ? cStyles.mr_10 : cStyles.ml_5,
                            { backgroundColor: '#18504D', height:Devices.sH(4.5) }]}
                            onPress={onFunctions.onAddOrUpdate}
                            disabled={state._loadingBtnWebview || state._loading}
                            >
                                {state._loadingBtnWebview ?
                                    <BallIndicator color={Colors.WHITE_COLOR} size={20} />
                                :
                                    <CText style={[styles.txt_add_cart, { fontSize:Devices.fS(12) }]}>{Languages[props.language].add_to_cart}</CText>
                                }
                                
                            </Button>
                            :
                            <CText style={[cStyles.txt_title_button, { color: Colors.GOOGLE_PLUS_COLOR }]} i18nKey={"out_of_stock"} />
                    }
                    rightComp={
                        state._isAdd ?
                            <Button style={[styles.con_btn,
                            !Configs.supportRTL ? cStyles.ml_5 : cStyles.mr_5,
                            { backgroundColor: '#18504D', height:Devices.sH(4.5)  }]}
                                onPress={onFunctions.onPressCart}
                                disabled={state._loading}
                            >
                                <CText style={[styles.txt_add_cart, {fontSize:Devices.fS(12)}]}>{Languages[props.language].view_cart}</CText>
                            </Button> : <View />
                    }
                /> 
            </View>

            {/* <CLoading visible={state._loading} /> */}
        </Container>
    )
}