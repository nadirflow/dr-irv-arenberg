/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-shadow */
/* eslint-disable no-catch-shadow */
/* eslint-disable react-hooks/exhaustive-deps */
/**
 ** Name: Navigator.js
 ** Author: ZiniSoft Ltd
 ** CreatedAt: 2020
 ** Description: Description of Navigator.js
 **/
/* LIBRARY */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Image, ImageBackground, Button } from 'react-native';
 
import { View, Text,  Animation, Direction, } from 'react-native-animatable';
import SplashScreen from 'react-native-splash-screen';
import firebase from 'react-native-firebase';
import Modal from 'react-native-modal';
import Icon from 'react-native-fontawesome-pro';
/* CONPONENT */
import AppContainer from './Root';
import CText from '~/components/CText';
import { BallIndicator } from "~/components/CIndicator"; 

/** COMMON */
import NavigationService from './NavigationService';
import { Configs, Keys, Devices, Assets, Languages } from '~/config';
import { cStyles } from '~/utils/styles';
import { Colors } from '~/utils/colors';
import { layoutWidth } from '~/utils/layout_width';
import { Fonts } from '~/utils/fonts';
import Helpers from '~/utils/helpers';
import Plugins from '~/utils/plugins';
import { WooCommerce } from '~/services/apiWoo';
import Services from '~/services';
import WooCommerceAPI from '~/services/WooCommerceAPI';
/** REDUX */ 
import * as SettingActions from '~/redux/actions/setting';
import * as UserActions from '~/redux/actions/user';
const Analytics = firebase.analytics();
Analytics.setAnalyticsCollectionEnabled(true);

function Navigator(props) {
  const dispatch = useDispatch();
  const settingState = useSelector(({ setting }) => setting.app);

  const [loading, setLoading] = useState(true);
  const [initRoute, setInitRoute] = useState(null);
  const [error, setError] = useState({
    error: false,
    errorHelper_1: '',
    errorHelper_2: '',
  });

  /** HANDLE FUNCTIONS */
  const onTryAgain = () => {
    setError({
      error: false,
      errorHelper_1: '',
      errorHelper_2: '',
    });
    onGetSettings();
  };

  /** FUNCTIONS */
  const createNotificationListeners = async () => {
    /*
     * If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows:
     * */
    const notificationOpen = await firebase
      .notifications()
      .getInitialNotification();
    if (notificationOpen) {
      firebase.notifications().removeAllDeliveredNotifications();
    }

    // /*
    //  * If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows:
    //  * */
    // const notificationOpenedListener = firebase
    //   .notifications()
    //   .onNotificationOpened((notificationOpen) => {
    //     firebase.notifications().removeAllDeliveredNotifications();
    //   });

    // const channel = new firebase.notifications.Android.Channel(
    //   'bibicare-channel',
    //   'BibiCare Channel',
    //   firebase.notifications.Android.Importance.Max,
    // ).setDescription('BibiCare Channel');

    // // Create the channel
    // firebase.notifications().android.createChannel(channel);
    // /*
    //  * Triggered when a particular notification has been received in foreground
    //  * */
    // const notificationListener = firebase
    //   .notifications()
    //   .onNotification((notification) => {
    //     // Process your notification as required
    //     notification
    //       .setSound('default')

    //       .android.setChannelId('bibicare-channel')
    //       .android.setSmallIcon('ic_launcher')
    //       .android.setLargeIcon('ic_launcher')
    //       .android.setPriority(firebase.notifications.Android.Priority.High)
    //       .android.setBadgeIconType(
    //         firebase.notifications.Android.BadgeIconType.None,
    //       )
    //       .android.setDefaults(firebase.notifications.Android.Defaults.All)

    //       .ios.setBadge(notification.ios.badge);

    //     firebase.notifications().displayNotification(notification);
    //   });

    // const notificationDisplayedListener = firebase
    //   .notifications()
    //   .onNotificationDisplayed((notification) => {});
  };

  const onCheckPermission = async () => {
    let enabled = await firebase.messaging().hasPermission();
    if (enabled) {
      if (Helpers.OS === 'ios') {
        onRegisterTokenFCM();
      } else {
        onGetToken();
      }
    } else {
      onRequestPermission();
    }
  };

  const onRequestPermission = async () => {
    try {
      await firebase.messaging().requestPermission();
      onGetToken();
    } catch (error) {
      console.log('Permission rejected');
    }
  };

  const onGetToken = async () => {
    let fcmToken = await firebase.messaging().getToken();
    if (fcmToken) {
      // Register token
      onRegisterTokenFCM(fcmToken);
    } else {
      onRequestPermission();
    }
  };

  const onRegisterTokenFCM = async (fcmToken = null) => {
    let token = '',
      os = '';
      try {
        if (!fcmToken) {
          await firebase.messaging().ios.registerForRemoteNotifications();
          token = await firebase.messaging().ios.getAPNSToken();
          if (token) {
            os = 'iOS';
            let params = { os, token };
            await Services.FCMToken.register(params);
          }
        } else {
          token = fcmToken;
          os = 'Android';
          let params = { os, token };
          await Services.FCMToken.register(params);
        }
      } catch (error) {
        
      }
  }; 

  const onSetRouteAndNext = (routeName) => {
    setInitRoute(routeName);
    SplashScreen.hide();
  };

  /** GET HOST API */
  const onGetHostApi = async () => {
    let api = await Helpers.getDataStorage(Keys.AS_DATA_DEMO_API_CHOOSE);
    if (api && api !== "") {
      api = JSON.parse(api);
      Configs.hostApi = api.hostUrl;
      Configs.cosumerKey = api.cosumerKey;
      Configs.consumerSecret = api.consumerSecret;
    } else {
      api = Configs;
      api.hostUrl = Configs.hostApi;
    }

    WooCommerce.api = new WooCommerceAPI({
      url: api.hostUrl,
      consumerKey: api.cosumerKey,
      consumerSecret: api.consumerSecret,
      wpAPI: true,
      version: Configs.versionApi,
      queryStringAuth: true,
      wpAPIPrefix: Configs.wpAPIPrefix
    }); 
  } 

  /**
   * Fetch settings
   */
  const onGetSettings = async () => {
    let res = null, settingWoo = null, settingHome = null, settingAccount = null, settingCateProduct = null;
    /** Get categories product for app */
    res = await Services.Service.listCategories();
    if (res.length > 0) {
        let _tmpCategoriesChild = [];
        let _tmpCategoriesParent = [];
        let i, j;

        for (i = 0; i < res.length; i++) {
          if (res[i].parent === 0) {
            res[i].subs = [];
            _tmpCategoriesParent.push(res[i]);
          } else _tmpCategoriesChild.push(res[i]);
        }

        if (_tmpCategoriesChild.length > 0) {
          let find = null;
          for (j = 0; j < _tmpCategoriesChild.length; j++) {
            find = _tmpCategoriesParent.findIndex(f => f.id === _tmpCategoriesChild[j].parent);
            if (find !== -1) {
              _tmpCategoriesParent[find].subs.push(_tmpCategoriesChild[j]);
            }
          }
        }
        settingCateProduct = _tmpCategoriesParent; 
    } 

    /** FOR GET SETTINGS WOO API */
    /** Get settings for currency */
    settingWoo = await Services.Setting.get();
    
    /** Get setting account of woocommerce */
    settingAccount = await Services.Setting.getAllowGuestCheckout();
    
    /** FOR GET SETTINGS ZINI API */
    /** Get settings home for app */
    settingHome = await Services.Setting.homeSetting();
    
    /** Get settings admin for app */
    Configs.settingLocal = await Services.Setting.appSetting();
    
    await _applyToApp(Configs.settingLocal, {
      settingWoo,
      settingHome,
      settingCateProduct,
      settingAccount
    }); 
  }

  const _applyToApp = async (settings, allSetting) => {
    let settingLanguage = "en";
    /** APP INTRO */


    /** LANGUAGE */
    if (settings.general && settings.general.language) {
      settingLanguage = settings.general.language;
    }  

    /** PAGES */
    if (settings.general && settings.general.privacy_page) Configs.idPagePolicy = settings.general.privacy_page;
    if (settings.general && settings.general.term_condition_page) Configs.idPageTerm = settings.general.term_condition_page;

    /** DATE/TIME FORMAT */
    if ( settings.general && settings.general.date_format) Configs.formatDate = settings.general.date_format;
    if ( settings.general && settings.general.time_format) Configs.formatTime = settings.general.time_format;

    /** LAYOUT WIDTH */
    if ( settings.general && settings.general.layout_width) layoutWidth.width = settings.general.layout_width;

    /** BACKGROUND/TEXT COLOR */
    if (settings.color && settings.color.bg_primary_color) {
      Colors.BACKGROUND_PRIMARY_COLOR = settings.color.bg_primary_color;
      Colors.PRIMARY_COLOR = settings.color.bg_primary_color;
      // cStyles.con_header.backgroundColor = settings.color.bg_primary_color;
    }
    if (settings.color && settings.color.bg_secondary_color) {
      Colors.BACKGROUND_SECONDARY_COLOR = settings.color.bg_secondary_color;
      Colors.SECONDARY_COLOR = settings.color.bg_secondary_color;
    }
    if (settings.color && settings.color.text_headline_color) {
      Colors.TEXT_HEADLINE_COLOR = settings.color.text_headline_color;
      cStyles.txt_title_header.color = settings.color.text_header_color;
      cStyles.txt_title_group.color = settings.color.text_headline_color;
      cStyles.txt_title_item.color = settings.color.text_headline_color;
      cStyles.txt_title_group_drawer.color = settings.color.text_headline_color;
    }
    if (settings.color && settings.color.text_body_meta_color) {
      Colors.TEXT_BODY_META_COLOR = settings.color.text_body_meta_color;
      cStyles.txt_body_meta_item.color = settings.color.text_body_meta_color;
    }
    if (settings.color && settings.color.text_body_color) {
      Colors.TEXT_BASE_COLOR = settings.color.text_body_color;
      Colors.TEXT_COLOR = settings.color.text_body_color;
      cStyles.txt_base_item.color = settings.color.text_body_color;
    }

    /** TYPOGRAPHY HEADLINE */
    if (settings.typography && settings.typography.font_headline_family) {
      if (Fonts[settings.typography.font_headline_family]) {
        Devices.zsHeadlineLight = Fonts[settings.typography.font_headline_family].LIGHT;
        Devices.zsHeadlineRegular = Fonts[settings.typography.font_headline_family].REGULAR;
        Devices.zsHeadlineMedium = Fonts[settings.typography.font_headline_family].MEDIUM;
        Devices.zsHeadlineSemiBold = Fonts[settings.typography.font_headline_family].SEMI_BOLD;
        Devices.zsHeadlineBold = Fonts[settings.typography.font_headline_family].BOLD;
      }
      if (settings.typography && settings.typography.font_headline_weight) {
        let fWeight = settings.typography.font_headline_weight;
        cStyles.txt_title_header.fontFamily = Fonts[settings.typography.font_headline_family][Configs.fontWeight[fWeight]];
        cStyles.txt_title_group_drawer.fontFamily = Fonts[settings.typography.font_headline_family][Configs.fontWeight[fWeight]];
        cStyles.txt_title_group.fontFamily = Fonts[settings.typography.font_headline_family][Configs.fontWeight[fWeight]];
        cStyles.txt_title_button.fontFamily = Fonts[settings.typography.font_headline_family][Configs.fontWeight[fWeight]];
        cStyles.xx_large.fontFamily = Fonts[settings.typography.font_headline_family][Configs.fontWeight[fWeight]];
        cStyles.xxx_large.fontFamily = Fonts[settings.typography.font_headline_family][Configs.fontWeight[fWeight]];
        cStyles.super_large.fontFamily = Fonts[settings.typography.font_headline_family][Configs.fontWeight[fWeight]];
        cStyles.super_x_large.fontFamily = Fonts[settings.typography.font_headline_family][Configs.fontWeight[fWeight]];
      }
    }
    if (settings.typography && settings.typography.font_headline_size) {
      cStyles.txt_title_header.fontSize = Devices.fS(settings.typography.font_headline_size);
      cStyles.txt_title_group_drawer.fontSize = Devices.fS(settings.typography.font_headline_size);
      cStyles.txt_title_group.fontSize = Devices.fS(settings.typography.font_headline_size);
      cStyles.txt_title_button.fontSize = Devices.fS(settings.typography.font_headline_size);
      cStyles.xx_large.fontSize = Devices.fS(settings.typography.font_headline_size);
      cStyles.xxx_large.fontSize = Devices.fS(settings.typography.font_headline_size);
      cStyles.super_large.fontSize = Devices.fS(settings.typography.font_headline_size);
      cStyles.super_x_large.fontSize = Devices.fS(settings.typography.font_headline_size);
    }

    /** TYPOGRAPHY SMALL */
    if (settings.typography && settings.typography.font_small_family) {
      if (Fonts[settings.typography.font_small_family]) {
        Devices.zsBodyMetaLight = Fonts[settings.typography.font_small_family].LIGHT;
        Devices.zsBodyMetaRegular = Fonts[settings.typography.font_small_family].REGULAR;
        Devices.zsBodyMetaMedium = Fonts[settings.typography.font_small_family].MEDIUM;
        Devices.zsBodyMetaSemiBold = Fonts[settings.typography.font_small_family].SEMI_BOLD;
        Devices.zsBodyMetaBold = Fonts[settings.typography.font_small_family].BOLD;
      }
      if (settings.typography.font_small_weight) {
        let fWeight = settings.typography.font_small_weight;
        cStyles.txt_body_meta_item.fontFamily = Fonts[settings.typography.font_small_family][Configs.fontWeight[fWeight]];

        cStyles.super_x_small.fontFamily = Fonts[settings.typography.font_small_family][Configs.fontWeight[fWeight]];
        cStyles.super_small.fontFamily = Fonts[settings.typography.font_small_family][Configs.fontWeight[fWeight]];
        cStyles.xxx_small.fontFamily = Fonts[settings.typography.font_small_family][Configs.fontWeight[fWeight]];
      }
    }
    if (settings.typography && settings.typography.font_small_size) {
      cStyles.txt_body_meta_item.fontSize = Devices.fS(settings.typography.font_small_size);

      cStyles.super_x_small.fontSize = Devices.fS(settings.typography.font_small_size);
      cStyles.super_small.fontSize = Devices.fS(settings.typography.font_small_size);
      cStyles.xxx_small.fontSize = Devices.fS(settings.typography.font_small_size);
    }

    /** TYPOGRAPHY BODY */
    if (settings.typography && settings.typography.font_body_family) {
      if (Fonts[settings.typography.font_body_family]) {
        Devices.zsBodyLight = Fonts[settings.typography.font_body_family].LIGHT;
        Devices.zsBodyRegular = Fonts[settings.typography.font_body_family].REGULAR;
        Devices.zsBodyMedium = Fonts[settings.typography.font_body_family].MEDIUM;
        Devices.zsBodySemiBold = Fonts[settings.typography.font_body_family].SEMI_BOLD;
        Devices.zsBodyBold = Fonts[settings.typography.font_body_family].BOLD;
      }
      if (settings.typography.font_body_weight) {
        let fWeight = settings.typography.font_body_weight;
        cStyles.txt_title_item.fontFamily = Fonts[settings.typography.font_body_family][Configs.fontWeight[fWeight]];
        cStyles.txt_no_data.fontFamily = Fonts[settings.typography.font_body_family][Configs.fontWeight[fWeight]];
        cStyles.txt_base_item.fontFamily = Fonts[settings.typography.font_body_family][Configs.fontWeight[fWeight]];
        cStyles.txt_base_price.fontFamily = Fonts[settings.typography.font_body_family][Configs.fontWeight[fWeight]];

        cStyles.xx_small.fontFamily = Fonts[settings.typography.font_body_family][Configs.fontWeight[fWeight]];
        cStyles.x_small.fontFamily = Fonts[settings.typography.font_body_family][Configs.fontWeight[fWeight]];
        cStyles.small.fontFamily = Fonts[settings.typography.font_body_family][Configs.fontWeight[fWeight]];
        cStyles.medium.fontFamily = Fonts[settings.typography.font_body_family][Configs.fontWeight[fWeight]];
        cStyles.large.fontFamily = Fonts[settings.typography.font_body_family][Configs.fontWeight[fWeight]];
        cStyles.x_large.fontFamily = Fonts[settings.typography.font_body_family][Configs.fontWeight[fWeight]];
      }
    }
    if (settings.typography && settings.typography.font_body_size) {
      cStyles.txt_title_item.fontSize = Devices.fS(settings.typography.font_body_size);
      cStyles.txt_no_data.fontSize = Devices.fS(settings.typography.font_body_size);
      cStyles.txt_base_item.fontSize = Devices.fS(settings.typography.font_body_size);
      cStyles.txt_base_price.fontSize = Devices.fS(settings.typography.font_body_size);

      cStyles.xx_small.fontSize = Devices.fS(settings.typography.font_body_size);
      cStyles.x_small.fontSize = Devices.fS(settings.typography.font_body_size);
      cStyles.small.fontSize = Devices.fS(settings.typography.font_body_size);
      cStyles.medium.fontSize = Devices.fS(settings.typography.font_body_size);
      cStyles.large.fontSize = Devices.fS(settings.typography.font_body_size);
      cStyles.x_large.fontSize = Devices.fS(settings.typography.font_body_size);
    }

    /** OTHER SETTINGS */
    /** PLUGINS */
    /** Find currency */
    let find = allSetting.settingWoo.find(
      f => f.id === 'woocommerce_currency',
    );
    if (find) {
      let value = find.value;
      let options = find.options;
      let currency = options[value];
      Configs.currencyValue = value;
      currency = currency.substring(
        currency.lastIndexOf('(') + 1,
        currency.lastIndexOf(')'),
      );
      Configs.currency = currency;
    }
    /** Find position currency */
    find = allSetting.settingWoo.find(
      f => f.id === 'woocommerce_currency_pos',
    );
    if (find) {
      Configs.currencyPosition = find.value;
    }
    /** Find thousand separator currency */
    find = allSetting.settingWoo.find(
      f => f.id === 'woocommerce_price_thousand_sep',
    );
    if (find) {
      Configs.currencyThousandSeparator = find.value;
    }

    Configs.allowBooking = false;
    if(settings.woo_general && settings.woo_general.woo_is_allow_booking ) {
      Configs.allowBooking = settings.woo_general.woo_is_allow_booking;
    }
    
    if (settings.extra && settings.extra.length > 0) {
      // Custom plugins 1
      let findPlugins1 = settings.extra.find(f => (f.plugin_name === Plugins.ORDER_DELIVERY_DATE && f.plugin_status));
      if (findPlugins1) Configs.allowBooking = findPlugins1.plugin_status;

      // Custom plugins 2
      let findPlugins2 = settings.extra.find(f => (f.plugin_name === Plugins.WC_MINMAX && f.plugin_status));
      if (findPlugins2) {
        if (findPlugins2.plugin_settings.wc_minmax_quantity_advanced_settings.min_cart_total_price !== "") {
          Configs.minCartTotalPrice = Number(findPlugins2.plugin_settings.wc_minmax_quantity_advanced_settings.min_cart_total_price);
        }
        if (findPlugins2.plugin_settings.wc_minmax_quantity_advanced_settings.max_cart_total_price !== "") {
          Configs.maxCartTotalPrice = Number(findPlugins2.plugin_settings.wc_minmax_quantity_advanced_settings.max_cart_total_price);
        }
        if (findPlugins2.plugin_settings.wc_minmax_quantity_general_settings.min_product_quantity !== "") {
          Configs.minProductQuantity = Number(findPlugins2.plugin_settings.wc_minmax_quantity_general_settings.min_product_quantity);
        }
        if (findPlugins2.plugin_settings.wc_minmax_quantity_general_settings.max_product_quantity !== "") {
          Configs.maxProductQuantity = Number(findPlugins2.plugin_settings.wc_minmax_quantity_general_settings.max_product_quantity);
        }
      }
    }
    /** OTHER SETTINGS */
    if(settings.general) {
      if (settings.general.is_rtl) Configs.supportRTL = settings.general.is_rtl;
      if (settings.general.facebook) Configs.fanpageFB = settings.general.facebook;
      if (settings.general.google) Configs.fanpageGG = settings.general.google;
      if (settings.general.twitter) Configs.fanpageTW = settings.general.twitter;
      if (settings.general.instagram) Configs.fanpageIN = settings.general.instagram;
      Configs.showVariationsProducts = settings.woo_general.woo_show_variations;
      Configs.showRatingApp = settings.general.is_show_rating_app;
    }
    if(settings.woo_single_product) {
      Configs.showShortDescriptionProduct = settings.woo_single_product.is_show_short_description;
      Configs.showRelatedProduct = settings.woo_single_product.is_show_related_product;
      Configs.numberRelatedProductPerPage = settings.woo_single_product.related_product_per_page;
    }
    for (let std of allSetting.settingWoo) {
      if (std.id === Keys.KEY_WOO_NUMBER_DECIMAL) {
        Configs.decimalValue = Number(std.value)
      } else if (std.id === Keys.KEY_WOO_DECIMAL_SEP) {
        Configs.decimalSep = std.value
      } else if (std.id === Keys.KEY_WOO_THOUSAND_SEP) {
        Configs.thousandSep = std.value
      }
    }

    /*****************/
    /** Update settings + Cate product + Cate news */
    allSetting.settingApp = settings;
    allSetting.settingLanguage = settingLanguage;

    //Finally update ALL SETTINGS to Redux
    dispatch(SettingActions.updateAllSettings(allSetting));
    //Navigate to homescreen
    onSetRouteAndNext("RootTab");
  }
  /****************************/


  /** LIFE CYCLE */
  useEffect(() => {
    if (loading) {
      if (settingState && initRoute) {
        setLoading(false);
      }
    }
  }, [loading, initRoute, settingState]);

  useEffect(() => {
    createNotificationListeners();
    onGetHostApi();
    onCheckPermission();
    onGetSettings();
  }, []);

  /** RENDER */
  return (
    <ImageBackground style={[cStyles.container, styles.con_image_bg]}
      source={Assets.splash} resizeMode={"cover"}>
      {loading  &&
        <View style={{position: 'absolute', left: 0, right: 0, bottom: '50%', alignItems: 'center'}}>
          <Text  animation='slideInLeft' iterationCount={1} direction="alternate" style={{ fontSize: Devices.fS(45), fontWeight:'700', color: '#fff', marginRight:Devices.sW(20) }}>Killing</Text>
          <Text animation='slideInRight' iterationCount={1} direction="alternate" style={{ fontSize: Devices.fS(45), fontWeight:'700', color: '#fff', marginLeft:Devices.sW(20), }}>Vincent</Text>
        </View>
      }

      {!loading &&
        <AppContainer
          ref={nav => {
            this.navigator = nav;
            NavigationService.setTopLevelNavigator(nav);
          }}
          uriPrefix="/app"
          screenProps={this.props}
          initRoute={initRoute}
        />
      }

      <Modal
        animationIn={'fadeIn'}
        animationOut={'fadeOut'}
        useNativeDriver={true}
        isVisible={error.error}
        onBackdropPress={() => { }}
        onBackButtonPress={() => { }}
      >
        <View style={cStyles.full_center}>
          <View style={styles.con_modal_content}>
            <Image style={{ height: Devices.sW("30%"), width: Devices.sW("30%") }} source={Assets.image_speaker} resizeMode={"contain"} />

            <View style={styles.con_modal_header}>
              <CText style={[cStyles.small, { fontWeight: "bold" }]}>{"Something wen't wrong"}</CText>
            </View>

            <View style={styles.con_modal_body}>
              <CText style={[cStyles.x_small]} numberOfLines={10}>{error.errorHelper1}</CText>
              {error.errorHelper2 !== "" &&
                <CText style={[cStyles.x_small, { paddingTop: 20 }]} numberOfLines={10}>{error.errorHelper2}</CText>
              }
            </View>

            <View style={styles.con_modal_footer}>
              <Button block style={[styles.con_btn, { backgroundColor: Colors.PRIMARY_COLOR }]} onPress={onTryAgain} >
                <Icon name={"redo-alt"} color={"white"} size={Devices.fS(20)} type={"solid"} />
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </ImageBackground>
  ) 
}

export default Navigator;
