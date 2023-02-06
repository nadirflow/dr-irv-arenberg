/**
 ** Name:
 ** Author:
 ** CreateAt:
 ** Description:
 **/
/* LIBRARY */
import {Platform} from 'react-native';
import {Toast} from 'native-base';
import {PERMISSIONS, request} from 'react-native-permissions';
import ImagePicker from 'react-native-image-crop-picker';
import AsyncStorage from '@react-native-community/async-storage';
import {CommonActions} from '@react-navigation/native';
// import RNFetchBlob from 'rn-fetch-blob';
/** COMMON */
import {Colors} from '~/utils/colors';
import {Configs, Devices, Keys} from '~/config';
// const { fs: { dirs } } = RNFetchBlob;
const exts = {
  pdf: {
    name: 'pdf',
    path: '/pdfs/',
  },
  imageJPG: {
    name: 'jpg',
    path: '/images/',
  },
  imagePNG: {
    name: 'png',
    path: '/images/',
  },
  videoMP4: {
    name: 'jpg',
    path: '/videos/',
  },
};

export default (Helpers = {
  /**
   * On Remove all news of bookmark
   */
  removeAllBookmark: async () => {
    try {
      await AsyncStorage.setItem(Keys.AS_NEWS_BOOKMARK, JSON.stringify([]));
      Configs.bookmarks = [];
      return true;
    } catch (e) {
      return false;
    }
  },

  /**
   * On Add/Remove news into bookmark
   */
  addOrRemoveBookmark: async id => {
    try {
      if (Configs.bookmarks.length > 0) {
        let findIdx = Configs.bookmarks.findIndex(f => f === id);
        if (findIdx !== -1) {
          Configs.bookmarks.splice(findIdx, 1);
        } else {
          Configs.bookmarks.push(id);
        }
      } else {
        Configs.bookmarks.push(id);
      }

      AsyncStorage.setItem(
        Keys.AS_NEWS_BOOKMARK,
        JSON.stringify(Configs.bookmarks),
      );
      return true;
    } catch (e) {
      return false;
    }
  },

  /**
   * Get name file
   */
  getFileName: link => {
    let tmp = link.substring(link.lastIndexOf('/') + 1, link.length);
    return tmp;
  },

  /**
   * Get ext file
   */
  getFileExt: link => {
    let name = link.substring(link.lastIndexOf('/') + 1, link.lastIndexOf('.'));
    let ext = link.substring(link.lastIndexOf('.') + 1, link.length);
    return {name, ext};
  },

  /**
   * Parse percent sale on product
   */
  parsePercentSale: (strNumberRegular, strNumberSale) => {
    let tmpRegular = Number(strNumberRegular);
    let tmpSale = Number(strNumberSale);
    let percent = (tmpSale * 100) / tmpRegular;
    percent = 100 - percent;
    return percent.toFixed(0);
  },

  /**
   * Toast an message
   */
  showToastDuration: (
    style = {},
    message = '',
    type = 'success',
    position = 'bottom',
  ) => {
    Toast.show({
      style,
      position,
      textStyle: {
        fontSize: Devices.fS(14),
        fontFamily: Devices.zsHeadlineMedium,
        color: Colors.WHITE_COLOR,
      },
      text: message,
      duration: 2000,
      type,
    });
  },

  /**
   * Validate email
   */
  validateEmail: email => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return reg.test(email);
  },

  /**
   * Validate specific phone
   */
  validatePhone: phone => {
    let reg = /^(([+]{0,1}\d{2})|\d?)[\s-]?[0-9]{2}[\s-]?[0-9]{3}[\s-]?[0-9]{4}$/;
    return reg.test(phone);
  },

  /**
   ** Convert number to "XXX,XXX,XXX"
   **/
  formatNumber: (
    amount,
    decimalCount = Configs.decimalValue,
    decimal = Configs.decimalSep,
    thousands = Configs.thousandSep,
  ) => {
    try {
      decimalCount = Math.abs(decimalCount);
      decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

      const negativeSign = amount < 0 ? '-' : '';

      let i = parseInt(
        (amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)),
      ).toString();
      let j = i.length > 3 ? i.length % 3 : 0;

      return (
        negativeSign +
        (j ? i.substr(0, j) + thousands : '') +
        i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + thousands) +
        (decimalCount
          ? decimal +
            Math.abs(amount - i)
              .toFixed(decimalCount)
              .slice(2)
          : '')
      );
    } catch (e) {
      console.log(e);
    }
  },

  /**
   ** Format currency symbol html
   **/
  symbolCurrency: () => {
    return Configs.html5Entities.decode(Configs.currency);
  },

  /**
   ** Convert second number to "hh:mm:ss"
   **/
  secondsToHms: d => {
    d = Number(d);
    let h = Math.floor(d / 3600);
    let m = Math.floor((d % 3600) / 60);
    let s = Math.floor((d % 3600) % 60);

    let hDisplay = h > 0 ? (h < 10 ? '0' + h : h) : '00';
    let mDisplay = m > 0 ? (m < 10 ? '0' + m : m) : '00';
    let sDisplay = s > 0 ? (s < 10 ? '0' + s : s) : '00';
    return {h: hDisplay, m: mDisplay, s: sDisplay};
  },

  /**
   ** Reset navigation to index 0
   ** Apply for login, logout, etc.
   **/
  resetNavigation: (navigation, routeName, params) => {
    return navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: routeName, params}],
      }),
    );
  },

  /**
   ** Remove multi data local storage
   **/
  removeMultiKeyStorage: async keys => {
    try {
      await AsyncStorage.multiRemove(keys);
    } catch (e) {
      console.log('Error: ', e);
      return null;
    }
  },

  /**
   ** Remove data local storage
   **/
  removeKeyStorage: async key => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (e) {
      console.log('Error: ', e);
      return null;
    }
  },

  /**
   ** Save data to local storage
   **/
  setDataStorage: async (key, data) => {
    try {
      await AsyncStorage.setItem(
        key,
        data === '' ? data : JSON.stringify(data),
      );
    } catch (e) {
      console.log('Error: ', e);
      return null;
    }
  },

  /**
   ** Get data from local storage
   **/
  getDataStorage: async key => {
    try {
      let res = await AsyncStorage.getItem(key);
      if (res) {
        if (res === '') return null;
        res = JSON.parse(res);
        return res;
      } else {
        return null;
      }
    } catch (e) {
      console.log('Error: ', e);
      return null;
    }
  },

  /**
   ** Get permission for access camera
   **/
  askPermissionsCamera: async () => {
    let perCamera =
      Platform.OS === 'android'
        ? PERMISSIONS.ANDROID.CAMERA
        : PERMISSIONS.IOS.CAMERA;
    let result = await request(perCamera);
    if (result !== 'granted') {
      alert(
        'You need allow permission for Camera to upload avatar or album in Settings!',
      );
      return false;
    } else {
      let perGallery =
        Platform.OS === 'android'
          ? PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE
          : PERMISSIONS.IOS.PHOTO_LIBRARY;
      result = await request(perGallery);
      if (result !== 'granted') {
        alert(
          'You need allow permission for Gallery to upload avatar or album in Settings!',
        );
        return false;
      } else {
        return true;
      }
    }
  },

  /**
   ** Choose photo from camera
   **/
  choosePhotoFromCamera: async () => {
    let result = await ImagePicker.openCamera({
      mediaTypes: 'photo',
      cropping: false,
      includeBase64: true,
      includeExif: true,
    });

    return result;
  },

  /**
   ** Choose photo from gallery
   **/
  choosePhotoFromGallery: async () => {
    let result = await ImagePicker.openPicker({
      mediaTypes: 'photo',
      cropping: false,
      includeBase64: true,
      includeExif: true,
    });

    return result;
  },

  /**
   ** Prepare item add to cart
   **/
  prepareItemCart: (id, variation_id = 0, variation = null, cart_item_data = {}, quantity = 1) => {
    let dataVariation = {};
    if (variation) {
      const nameAttr = `attribute_${variation.attributes[0].name}`;
      dataVariation[nameAttr] = variation.attributes[0].option;
    }
    return {
      product_id: id,
      quantity,
      variation_id,
      cart_item_data,
      variation: dataVariation,
    }
  }
});
