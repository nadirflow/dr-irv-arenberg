/* eslint-disable radix */
/**
 ** Name:
 ** Author:
 ** CreateAt:
 ** Description:
 **/
/* LIBRARY */
import { Dimensions, Platform, PixelRatio } from 'react-native';
import { Html5Entities } from 'html-entities';
import moment from 'moment';
import 'moment/locale/vi';
moment.locale('vi');
moment.locale('en-SG');
/** COMMON */
import en from '~/utils/languages/locales/en';
import vi from '~/utils/languages/locales/vi';
import es from '~/utils/languages/locales/es';

/* INIT */
const STANDARD_SIZE = { width: 375 };
const OS = Platform.OS;
const HEIGHT_SCREEN = Dimensions.get('window').height;
const WIDTH_SCREEN = Dimensions.get('window').width;

/* CHECK TIME OVER NOW  */
const parseTimestamp = (datetime) => {
    try {
        let timestamp = moment(datetime, 'YYYY-MM-DDTHH:mm:ss').valueOf();
        let _tmpNow = moment();
        let compare = _tmpNow.diff(timestamp, 'days');

        if (compare > 0) {
            return {
                time: moment.unix(timestamp / 1000).format(Configs.formatDate),
                type: 'days',
                des: '',
            };
        } else if (compare === 0) {
            let _tmpTime = moment
                .unix(timestamp / 1000)
                .format('YYYY-MM-DDTHH:mm:ss');
            let result = {
                time: _tmpNow.diff(_tmpTime, 'hours'),
                type: 'hours',
                des: '',
            };
            if (result.time === 0) {
                result = {
                    time: _tmpNow.diff(_tmpTime, 'minutes'),
                    type: 'minutes',
                    des: '',
                };
            }
            return result;
        } else {
            return null;
        }
    } catch (e) {
        console.log('ERROR parseTimestamp: ', e);
        return {
            time: '',
            type: '',
            des: '',
        };
    }
};

/* PARSE FONT SYSTEM WITH SREEN SIZE */
const fS = (size) => {
    return (parseInt(size) * WIDTH_SCREEN) / STANDARD_SIZE.width;
};

/* PARSE BORDER RADIUS WITH SREEN SIZE */
const bR = (param) => {
    if (OS === 'android') {
        return param;
    } else if (OS === 'ios') {
        return param / 2;
    }
};

/* PARSE WIDTH WITH SREEN SIZE */
const sW = (widthPercent) => {
    let screenWidth = Dimensions.get('window').width;
    // Convert string input to decimal number
    let elemWidth = parseFloat(widthPercent);
    return PixelRatio.roundToNearestPixel((screenWidth * elemWidth) / 100);
};

/* PARSE HEIGHT WITH SREEN SIZE */
const sH = (heightPercent) => {
    let screenHeight = Dimensions.get('window').height;
    // Convert string input to decimal number
    let elemHeight = parseFloat(heightPercent);
    return PixelRatio.roundToNearestPixel((screenHeight * elemHeight) / 100);
};

/* PARSE PADDING HORIZONTAL WITH SREEN SIZE */
const pH = (layoutWidth) => {
    let screenWidth = Dimensions.get('window').width;
    let paddingPercent = (100 - layoutWidth) / 2;
    return PixelRatio.roundToNearestPixel((screenWidth * paddingPercent) / 100);
};

const sImage = (layout, scale, widthCardView) => {
    /** Default value */
    const heightHorizontal = sW('30%');
    const widthColumn = sW('23%');
    const widthCard = sW(`${widthCardView}%`) || sW('100%');
    const widthProduct = sW('100%');
    const heightCart = sW('20%');

    let size = {
        width: 0,
        height: 0,
    };
    if (layout === 'horizontal') {
        size = {
            width: PixelRatio.roundToNearestPixel(scale * heightHorizontal),
            height: heightHorizontal,
        };
        return size;
    }
    if (layout === 'column') {
        size = {
            width: widthColumn,
            height: PixelRatio.roundToNearestPixel(widthColumn / scale),
        };
        return size;
    }
    if (layout === 'card') {
        size = {
            width: widthCard,
            height: PixelRatio.roundToNearestPixel(widthCard / scale),
        };
        return size;
    }
    if (layout === 'product_detail') {
        size = {
            width: widthProduct,
            height: PixelRatio.roundToNearestPixel(widthProduct / scale),
        };
        return size;
    }
    if (layout === 'cart_detail') {
        size = {
            width: PixelRatio.roundToNearestPixel(scale * heightCart),
            height: heightCart,
        };
        return size;
    }
};

/* LOGIN FACEBOOK */
const PERMISSIONS_LOGIN_FB = ['public_profile', 'email'];

const DISCOUNT_TYPE = [
    {
        id: 'fixed_cart',
        slug: '',
    },
    {
        id: 'fixed_product',
        slug: '',
    },
    {
        id: 'percent',
        slug: '%',
    },
];

const ORDER_STATUS = {
    PENDING: 'pending',
    PROCESSING: 'processing',
    HOLD: 'on-hold',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled',
    FAILED: 'failed',
    TRASH: 'trasH',
};

const LAYOUT = {
    LEFT_THUMB: 'left_thumb',
    RIGHT_THUMB: 'right_thumb',
    GRID_THUMB: 'grid_thumb',
    CARD_THUMB: 'card_thumb',
};

const THUMB_CATEGORY = {
    SQUARE: 'square',
    CIRCLE: 'circle',
};

const FONT_WEIGHT = {
    zsBold: 'BOLD',
    zsLight: 'LIGHT',
    zsRegular: 'REGULAR',
    zsSemiBold: 'SEMI_BOLD',
    zsMedium: 'MEDIUM',
};

const STOCK_STATUS = {
    IN_STOCK: 'instock',
    OUT_OF_STOCK: 'outofstock',
    ON_BACK_ORDER: 'onbackorder',
};

const SOCIALS = {
    FACEBOOK: {
        key: 'fb',
        url: 'https://www.facebook.com/killingvincent/',
    },
};

/** For Authenticate */
const LOGIN_SOCIAL_TYPE = {
    GOOGLE: 'Google',
    FACEBOOK: 'Facebook',
    APPLE: 'Apple',
};

const LOGIN_TYPE = {
    SOCIAL: 'social',
    DEFAULT: 'default',
};

const USER_ROLE = {
    STORE_MANAGER: 'wcfm_vendor'
}

export const Languages = Object.assign({}, { en }, { vi }, { es });
export const Configs = {
    /** URL API PAYPAL TEST */
    hostPayPal: 'https://api.sandbox.paypal.com',
    /** URL API STRIPE */
    hostStripe: 'https://api.stripe.com',
    /* URL API */ 
    hostApi: 'https://killingvincent.com/',
    parseTimestamp,
    formatDate: 'DD/MM/YYYY',
    formatTime: 'hh:MM:ss',
    layoutWidth: 96,
    discountType: DISCOUNT_TYPE,
    versionApi: 'wc/v3',
    wpAPIPrefix: 'wp-json',
    versionApiForLogin: 'v3',
    wpAPIPrefixForLogin: 'wp-json/wc',
    // cosumerKey: 'ck_67571b1f53703718fec324b256c7fb45f9b2d993', //For ZiniStore
    // consumerSecret: 'cs_f89cbc7c9bcc88e6e950a31b46e584146512eef6',//For ZiniStore
    cosumerKey: 'ck_226a9a757044d152d0758e4a95cab540b2ce5819', 
    consumerSecret: 'cs_9817a83078f4b3ec7bbef8b11572ec0705889e1c',
    email : '',
    bookmarks: [],
    /** AUTH */
    IOS_CLIENT_ID:
        '793140404870-qura0p54rgptruvbs109bq5itf4qkmf6.apps.googleusercontent.com',
    INFO_NEED_FB: 'name,email,picture.type(large)',
    PERMISSIONS_LOGIN_FB,
    /** SOCIALS */
    SOCIALS,
    /** SETTING */
    currencyValue: 'GBP',
    currency: '&#36;',
    currencyPosition: 'left',
    currencyThousandSeparator: ',',
    currencyDecimalSeparator: '.',
    currencyNumberDecimal: '2',
    passwordSocialDefault: 'qWeRtYuIoP',
    idPagePolicy: '3',
    idPageTerm: '3',
    order: ORDER_STATUS,
    supportRTL: false,
    fanpageFB: 'https://www.facebook.com/',
    fanpageTW: 'https://twitter.com/',
    fanpageGG: 'https://business.google.com/',
    fanpageIN: 'https://www.instagram.com/',

    /** SHIPPING */
    shipping: {
        visible: true,
        price_default: 100,
        zoneId: 0, // depend on your woocommerce
        methods: {
            free_shipping: 'free_shipping',
            flat_rate: 'flat_rate',
        },
        time: {
            free_shipping: '4 - 7 Days',
            flat_rate: '1 - 4 Days',
        },
    },

    /** RATING */
    ratingAppleAppID: '345345656',
    ratingGooglePackageName: 'com.insideout', 

    /** STRIPE */
    stripeMethod: 'stripe',
    stripePublishKey: 'pk_test_tlh7gpOTCB0CrulG3u1qOQVO002ZtUJruB',
    stripeSecret: 'sk_test_rGARQzzCIWDzqfSzEt94gnFD00mhijMPYQ',

    avatarUrlDefault: 'http://1.gravatar.com/avatar/4456f23e6de5424fb8ca08be40e30cb7?s=192&d=mm&r=g',
    customLayout: LAYOUT,
    customThumbCategory: THUMB_CATEGORY,
    fontWeight: FONT_WEIGHT,
    settingLocal: null,

    /** PAYPAL SETTING */
    payPalMethod: 'ppec_paypal',
    payPalClientId:
        'ASg_Tzb3HXiLMCJ2z4CTkHYi-g45n5n7NDm9sFTa5VwDUPWpQQoPNtwA96udAJPDdJkFCJOS-7YP3Uco',
    payPalSecret:
        'EDYeoyPmSFXHQjJnmBebFZ_C81fGGA9bmiXyKqlUwv_A1E5i4fdxF4e9l3JWRa58eAA10jDPIROWKfZ6',

    /** OTHER SETTINGS */
    allowBooking: true,
    showVariationsProducts: true,
    showRatingApp: true,
    showShortDescriptionProduct: true,
    showRelatedProduct: true,
    numberRelatedProductPerPage: 5,
    stockStatus: STOCK_STATUS,
    html5Entities: new Html5Entities(),
    minCartTotalPrice: null,
    maxCartTotalPrice: null,
    minProductQuantity: null,
    maxProductQuantity: null,
    decimalValue: 2,
    decimalSep: '.',
    thousandSep: ',',

    /** VENDOR */
    vendor: 'wcfm',

    USER_ROLE,

    isPaymentWebview: true
};
export const Devices = {
    moment,
    OS,
    height: HEIGHT_SCREEN,
    width: WIDTH_SCREEN,
    sW,
    sH,
    bR,
    fS,
    pH,
    sImage,
    zsHeadlineBold: 'SFCompactDisplay-Black',
    zsHeadlineRegular: 'Poppins-Regular',
    zsHeadlineLight: 'Poppins-Light',
    zsHeadlineSemiBold: 'Poppins-SemiBold',
    zsHeadlineMedium: 'Poppins-Medium',

    zsBodyMetaBold: 'Poppins-Bold',
    zsBodyMetaRegular: 'Poppins-Regular',
    zsBodyMetaLight: 'Poppins-Light',
    zsBodyMetaSemiBold: 'Poppins-Bold',
    zsBodyMetaMedium: 'Poppins-Medium',

    zsBodyBold: 'Poppins-Bold',
    zsBodyRegular: 'Poppins-Regular',
    zsBodyLight: 'Poppins-Light',
    zsBodySemiBold: 'Poppins-Semibold',
    zsBodyMedium: 'Poppins-Medium',
};
export const Assets = {
    logo: require('../../assets/images/logo/logo.png'),
    wel: require('../../assets/images/bg.png'),
    splash: require('../../assets/images/logo/_splash.png'),
    full_logo_vertical: require('../../assets/images/logo/full_logo_vertical.png'),
    full_logo_horizontal: require('../../assets/images/logo/full_logo_horizontal.png'),
    image_failed: require('../../assets/images/image_failed.png'),
    image_slider_failed: require('../../assets/images/image_slider_failed.jpg'),
    image_share: require('../../assets/images/image_share.png'),
    image_coupon: require('../../assets/images/image_coupon.png'),
    image_cart: require('../../assets/images/image_cart.png'),
    image_store_demo: require('../../assets/images/image_store_demo.png'),
    image_beauty: require('../../assets/images/image_beauty.jpeg'),
    image_hair: require('../../assets/images/image_hair.jpeg'),
    image_nail: require('../../assets/images/image_nail.jpeg'),
    image_spa: require('../../assets/images/image_spa.jpeg'),
    image_bg_coupons: require('../../assets/images/image_bg_coupons.png'),
    image_speaker: require('../../assets/images/image_speaker.png'),
    icon_wallet: require('../../assets/icons/icon_wallet.png'),
    book_success: require('../../assets/images/book_success.png'),
    book_failed: require('../../assets/images/book_failed.png'),
    icon_facebook: require('../../assets/icons/icon_facebook.png'),
    icon_instagram: require('../../assets/icons/icon_instagram.png'),
    icon_twitter: require('../../assets/icons/icon_twitter.png'),
    icon_coupon: require('../../assets/icons/icon_coupon.png'),
    icon_calendar: require('../../assets/icons/icon_calendar.png'),

    // Custom
    header_background: require('../../assets/images/home/header_background.png'),
    about_author: require('../../assets/images/home/about_author.png'),
    about_author_detail: require('../../assets/images/4.jpg'),
    book_overview: require('../../assets/images/home/book_overview.png'),
    products_image: require('../../assets/images/home/products_image.png'),
    video_image: require('../../assets/images/home/video_image.png'),
};
export const Keys = {
    KEY_PLATFORM_IOS: 'ios',
    KEY_PLATFORM_ANDROID: 'android',

    AS_DATA_USER: 'AS_DATA_USER',
    AS_DATA_USER_APPLE: 'AS_DATA_USER_APPLE',
    AS_DATA_JWT: 'AS_DATA_JWT',
    AS_DATA_LANGUAGE: 'AS_DATA_LANGUAGE',
    AS_DATA_SETTING_ALLOW_GUEST_CHECKOUT: 'AS_DATA_SETTING_ALLOW_GUEST_CHECKOUT',
    AS_DATA_SETTING_APP: 'AS_DATA_SETTING_APP',
    AS_DATA_SETTING_WOO: 'AS_DATA_SETTING_WOO',
    AS_DATA_SETTING_SHIPPING_ZONES: 'AS_DATA_SETTING_SHIPPING_ZONES',
    AS_DATA_SETTING_PAYMENT: 'AS_DATA_SETTING_PAYMENT',
    AS_DATA_SETTING_HOME: 'AS_DATA_SETTING_HOME',
    AS_DATA_SETTING_CATE_PRODUCT: 'AS_DATA_SETTING_CATE_PRODUCT',
    AS_DATA_SETTING_CATE_NEWS: 'AS_DATA_SETTING_CATE_NEWS',
    AS_DATA_HOME_FEATURE_PRODUCTS: 'AS_DATA_HOME_FEATURE_PRODUCTS',
    AS_DATA_HOME_LATEST_PRODUCTS: 'AS_DATA_HOME_LATEST_PRODUCTS',
    AS_DATA_HOME_LATEST_POSTS: 'AS_DATA_HOME_LATEST_POSTS',
    AS_DATA_HOME_LATEST_COUPONS: 'AS_DATA_HOME_LATEST_COUPONS',
    AS_DATA_HOME_COUNTRYS: 'AS_DATA_HOME_COUNTRYS',

    AS_DATA_CART_KEY: 'AS_DATA_CART_KEY',
    AS_DATA_CART: 'AS_DATA_CART',
    AS_DATA_HISTORY_SEARCH: 'AS_DATA_HISTORY_SEARCH',
    AS_APP_INTRO: 'AS_APP_INTRO',
    AS_APP_RATING: 'AS_APP_RATING',
    AS_NUMBER_TO_RATING: 'AS_NUMBER_TO_RATING',

    AS_DATA_DEMO_API_CUSTOM: 'AS_DATA_DEMO_API_CUSTOM',
    AS_DATA_DEMO_API_CHOOSE: 'AS_DATA_DEMO_API_CHOOSE',

    AS_NEWS_BOOKMARK: 'AS_NEWS_BOOKMARK',

    KEY_HOME_VENDORS: 'zs_woo_vendors',
    KEY_HOME_LATEST_PRODUCT: 'zs_woo_latest_products',
    KEY_HOME_CATEGORIES: 'zs_woo_categories',
    KEY_HOME_COUPONS: 'zs_woo_coupons',
    KEY_HOME_FEATURED_POSTS: 'zs_featured_posts',
    KEY_HOME_LATEST_POSTS: 'zs_latest_posts',
    KEY_HOME_BANNERS: 'zs_woo_banners',
    KEY_HOME_FEATURED_PRODUCT: 'zs_woo_featured_products',
    KEY_HOME_VIEWED_PRODUCT: 'zs_woo_seen_products',

    LOAD_MORE: 'LOAD_MORE',
    REFRESH: 'REFRESH',

    KEY_POST_VIDEO_YOUTUBE: 'KEY_POST_VIDEO_YOUTUBE',

    KEY_ALLOW_GUEST_CHECKOUT: 'woocommerce_enable_guest_checkout',

    AS_DATA_TOKEN_NOTIFICATION: 'AS_DATA_TOKEN_NOTIFICATION',

    KEY_WOO_NUMBER_DECIMAL: 'woocommerce_price_num_decimals',
    KEY_WOO_DECIMAL_SEP: 'woocommerce_price_decimal_sep',
    KEY_WOO_THOUSAND_SEP: 'woocommerce_price_thousand_sep',
    LOGIN_SOCIAL_TYPE,
    LOGIN_TYPE,
};
export function isIphoneX() {
    const dim = Dimensions.get('window');
    return Platform.OS === 'ios' && (isIPhoneXSize(dim) || isIPhoneXrSize(dim));
}
export function isIPhoneXSize(dim) {
    return dim.height === 812 || dim.width === 812;
}
export function isIPhoneXrSize(dim) {
    return dim.height === 896 || dim.width === 896;
}
