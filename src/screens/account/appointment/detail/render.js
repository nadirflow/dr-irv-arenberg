/**
 ** Name: 
 ** Author: 
 ** CreateAt: 
 ** Description: 
**/
/* LIBRARY */
import React from 'react';
import { View, FlatList, PermissionsAndroid, Platform} from 'react-native';
import { Button} from 'native-base';

import Icon from 'react-native-fontawesome-pro';
import {
  Container, Title, Badge, Content, Body
} from 'native-base';
/* COMPONENTS */
import CHaeder from "~/components/CHeader";
import CText from '~/components/CText';
import CViewRow from "~/components/CViewRow";
import CImage from "~/components/CImage";
/* COMMON */
import { cStyles } from '~/utils/styles';
import { Colors } from '~/utils/colors';
import { Configs, Keys , Devices } from '~/config';
import { layoutWidth } from '~/utils/layout_width';
import Payments from '~/utils/payments';
import Helpers from '~/utils/helpers';
import Currency from '~/utils/currency';
/* STYLES */
import styles from './style';

import RNFetchBlob from 'rn-fetch-blob';
import Pdf from 'react-native-pdf';



const fileAction = async (productId) => {
  console.log('start');
  const granted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    {
      title: "Storage Permission",
      message:
        "Press ok to allow storage permissions and download files.",
      buttonNeutral: "Ask Me Later",
      buttonNegative: "Cancel",
      buttonPositive: "OK"
    }
  );
  if (granted === PermissionsAndroid.RESULTS.GRANTED) {
    let fileUrl = Configs.hostApi+'/wp-json/wc/v3/products/'+productId+'?consumer_key='+Configs.cosumerKey+"&consumer_secret="+Configs.consumerSecret;
    console.log(fileUrl);
    let resp = await fetch(fileUrl);
    console.log('---resp----');
    console.log(resp);
    if (resp.ok) {
      let respJSON = await resp.json();
      const { config, fs } = RNFetchBlob
      let DownloadDir = fs.dirs.DownloadDir
      console.log('---down----');
      console.log(DownloadDir);
      const date = new Date();
      const android = RNFetchBlob.android
      let options = {
        fileCache: true,
        addAndroidDownloads : {
          useDownloadManager : true, // setting it to true will use the device's native download manager and will be shown in the notification bar.
          notification : true,
          path:  DownloadDir+"/file"+Math.floor(date.getTime() + date.getSeconds() / 2)+".pdf", // this is the path where your downloaded file will live in
          description : 'Downloading image.',
          mime: 'application/pdf',
          mediaScannable: true,
        }
      }
      let token = await Helpers.getDataStorage(Keys.AS_DATA_JWT);
      config(options).fetch('GET', respJSON.downloads[0].file,{  Authorization: "Bearer "+token,}).then((res) => {
        if (Platform.OS = 'android') {
          //android.actionViewIntent(res.path(), 'application/pdf')
        }
      })
      // Something went wrong:
      .catch((errorMessage, statusCode) => {
        console.log(errorMessage);
      });
  
      console.log(respJSON);
    } else return null;
  } else {
    console.log("Camera permission denied");
  }

  
  
  
};

const RenderProduct = (data, onPressViewPdf, orderData) => {
  let price = (parseFloat(data.total)).toFixed(2);
  price = Helpers.formatNumber(price);
  let currencyPosition = Configs.currencyPosition;
  let symbol = Helpers.symbolCurrency();
  let scaleImage = 1;
  if (data.images.length > 0) {
    scaleImage = data.images[0].sizes["woocommerce_thumbnail-width"] / data.images[0].sizes["woocommerce_thumbnail-height"]
  }
  let size = Devices.sImage("cart_detail", scaleImage);
  // console.log(data.attributes.select.filter(item2=> item.));
  return (
    <CViewRow style={[styles.con_services_content, { paddingHorizontal: Devices.pH(layoutWidth.width) }]}
      leftComp={
        <CViewRow style={{ flex: .6, height:75 }} between
          leftComp={
            <CImage
              style={[styles.img_service, { width: size.width, height: size.height }]}
              source={data.images.length > 0 ? { uri: data.images[0].sizes.woocommerce_thumbnail } : data.images}
            />
          }
          rightComp={
            <CText style={[styles.txt_title_product, {color: '#000'}]} numberOfLines={3}>
              {data.name} {data.variation_id !== 0 && Object.keys(data.attributes)[0].split("_")[1]}
            </CText>
          }
        />
      }
      rightComp={
        <CViewRow style={{ flex: .4, height:75 }} between 
          leftComp={
            <View style={[cStyles.center, Configs.supportRTL ? cStyles.pr_20 : cStyles.pl_20]}>
              <CText style={styles.txt_services_option}>{"x"} {data.quantity}</CText>
            </View>
          }
          rightComp={
            <View>
              { data.attributes.ebook && orderData.status == 'completed' && <View style={[cStyles.row_align_start, cStyles.row_justify_around, { flex:.5, height:75,width:100, }]}>
                {/* <Button style={[cStyles.p_5 ]} onPress={()=>{fileAction(data.product_id)}} title="Download">
                  <CText style={{color: Colors.WHITE_COLOR}} i18nKey={'send'} />
                </Button>
                <Button style={[cStyles.p_5 ]} onPress={()=>{onPressViewPdf(data.product_id)}} title="View">
                  <CText style={{color: Colors.WHITE_COLOR}} i18nKey={'password'} />
                </Button> */}
                <Button transparent onPress={()=>{onPressViewPdf(data.product_id)}}>
                  <Icon
                    name={'eye'}
                    color={Colors.BLACK_COLOR}
                    size={Devices.fS(20)}
                    type={"regular"} />
                </Button>
                <Button transparent onPress={()=>{fileAction(data.product_id)}}>
                  <Icon
                    name={'download'}
                    color={Colors.BLACK_COLOR}
                    size={Devices.fS(20)}
                    type={"regular"} />
                </Button>
              </View>}
              <View style={[{flex:.5}, cStyles.row, cStyles.row_justify_end, cStyles.row_align_end]} >
                <CText  style={[styles.txt_group_right, {color: '#000'}]}>{symbol+" "+price}</CText>
                {currencyPosition === Currency.right &&
                  <CText style={[styles.txt_group_right, {color: '#000'}]}>{symbol}</CText>
                }
              </View>
            </View>
            
          }
        />
      }
    />
  )
}

export const ViewAppointmentDetail = ({
  data = null,
  onFunction = {
    onPressBack: () => { },
    onPressViewPdf: () => { }
  }
}) => {
  let currencyPosition = Configs.currencyPosition;
  let symbol = Helpers.symbolCurrency();
  let statusHeader = { title: "cancelled", color: "warning" };
  let findDay = data.meta_data.find(f => f.key === "day");
  let findTime = data.meta_data.find(f => f.key === "hour");
  let day = "", time = "", payment = Payments[0].value, total = 0, discount = 0, shipping = 0;
  let statusFooter = ''; 
  switch (data.status) {
    case "pending":
      statusHeader = { title: "booking_pending", color: "warning" }
      statusFooter = "booking_pending";
      break;

    case "processing":
      statusHeader = { title: "processing", color: "info" }
      statusFooter = "processing";
      break;

    case "completed":
      statusHeader = { title: "order_success", color: "success" }
      statusFooter = "order_success";
      break;

    case "cancelled":
      statusHeader = { title: "booking_cancelled", color: "danger" }
      statusFooter = "booking_cancelled";
      break;

    case "failed":
      statusHeader = { title: "booking_failed", color: "danger" }
      statusFooter = "booking_failed";
      break;

    case "refunded":
      statusHeader = { title: "refunded", color: "grey" }
      statusFooter = "refunded";
      break;

    case "on-hold":
      statusHeader = { title: "on_hold", color: "grey" }
      statusFooter = "on_hold";
      break;

    case "order-returned":
      statusHeader = { title: "order_returned", color: "grey" }
      statusFooter = "order_returned";
      break;

    case "out-for-delivery":
      statusHeader = { title: "out_for_delivery", color: "info" }
      statusFooter = "out_for_delivery";
      break;

    case "driver-assigned":
      statusHeader = { title: "driver_assigned", color: "info" }
      statusFooter = "driver_assigned";
      break;
  }

  if (findDay) day = findDay.value;
  if (findTime) time = findTime.value;

  let findPayment = Payments.find(f => f.key === data.payment_method);
  if (findPayment) payment = findPayment.value;

  if (data.line_items.length > 0) {
    data.line_items.map(item => {
      return total += (Number(item.total));
    });
  }
  if (data.coupon_lines.length > 0) {
    data.coupon_lines.map(item => {
      return discount += Number(item.discount);
    });
  }
  if (data.shipping_lines.length > 0) {
    data.shipping_lines.map(item => {
      return shipping += Number(item.total);
    });
  }

  let totalParse = Helpers.formatNumber(Number(total));
  let discountParse = Helpers.formatNumber(Number(discount));
  let shippingParse = Helpers.formatNumber(Number(shipping));
  let provisionalParse = Helpers.formatNumber(Number(total - discount + shipping));

  return (
    <Container>
      <CHaeder
        style={{backgroundColor: '#18504D'}}
        titleComponent={
          <Body>
            <Title>
              <CText style={[cStyles.txt_title_header, {color: '#fff'}]} i18nKey={'appointment'} />{" "}
              <CText style={[cStyles.txt_title_header, {color: '#fff'}]}>{"#" + data.number}</CText>
            </Title>
          </Body>
        }
        iconLeft_1={Configs.supportRTL ? "angle-right" : "angle-left"}
        iconRight_1={"none"}
        onPressLeft_1={onFunction.onPressBack}
      />

      <Content>
        <View style={[styles.con_title_group, { marginHorizontal: Devices.pH(layoutWidth.width) }]}>
          <CText style={[styles.txt_title_group, {color: '#18504D'}]} i18nKey={'information'} />
        </View>
        <CViewRow style={styles.con_content_row} between
          leftComp={<CText style={[styles.txt_group_left, {color: '#000'}]} i18nKey={Configs.allowBooking ? "booking_code" : "order_code"} />}
          rightComp={<CText style={[styles.txt_group_left, {color: '#000'}]}>{data.number}</CText>}
        />
        <CViewRow style={styles.con_content_row} between
          leftComp={<CText style={[styles.txt_group_left, {color: '#000'}]} i18nKey={'status'} />}
          rightComp={
            <Badge warning={statusHeader.color === "warning"} success={statusHeader.color === "success"}
              info={statusHeader.color === "info"} danger={statusHeader.color === "danger"}
              style={[statusHeader.color === "grey" && { backgroundColor: "grey" }]}>
              <CText style={styles.txt_status_header} i18nKey={statusHeader.title} />
            </Badge>
          }
        />
        {Configs.allowBooking &&
          <CViewRow style={styles.con_content_row} between
            leftComp={<CText style={[styles.txt_group_left, {color: '#000'}]} i18nKey={'date'} />}
            rightComp={
              <View style={[cStyles.row_align_center, { flex: .4 }]}>
                <CText style={[styles.txt_group_right, {color: '#000'}]}>{`${day} ${time}`}</CText>
              </View>
            }
          />
        }
        <CViewRow style={[styles.con_content_row, { borderBottomWidth: 0 }]} between
          leftComp={<CText style={[styles.txt_group_left, {color: '#000'}]} i18nKey={'payment'} />}
          rightComp={<CText style={[styles.txt_group_left, {color: '#000'}]} i18nKey={payment} />}
        />

        <View style={styles.con_separator} />

        <View style={[styles.con_title_group, { marginHorizontal: Devices.pH(layoutWidth.width) }]}>
          <CText style={[styles.txt_title_group, {color: '#18504D'}]} i18nKey={'services'} />
        </View>

        <FlatList style={{ width: Devices.width }}
          data={data.line_items}
          renderItem={({ item, index }) => RenderProduct(item, onFunction.onPressViewPdf,data)}
          keyExtractor={(item, index) => index.toString()}
          removeClippedSubviews={Devices.OS === 'android'}
          scrollEnabled={false}
          ItemSeparatorComponent={() => <View style={styles.con_separator_option} />}
        />

        <View style={styles.con_separator} />

        <View style={[styles.con_title_group, { marginHorizontal: Devices.pH(layoutWidth.width) }]}>
          <CText style={[styles.txt_title_group, {color: '#18504D'}]} i18nKey={'summary'} />
        </View>
        <CViewRow style={styles.con_content_row} between
          leftComp={<CText style={[styles.txt_group_left, {color: '#000'}]} i18nKey={'total'} />}
          rightComp={
            <View style={styles.con_subtotal}>
              {currencyPosition === Currency.left &&
                <CText style={[styles.txt_group_right, {color: '#000'}]}>{symbol}</CText>
              }
              <CText sstyle={[styles.txt_group_right, {color: '#000'}]}>{totalParse}</CText>
              {currencyPosition === Currency.right &&
                <CText style={[styles.txt_group_right, {color: '#000'}]}>{symbol}</CText>
              }
            </View>
          }
        />

        <CViewRow style={styles.con_content_row} between
          leftComp={<CText style={[styles.txt_group_left, {color: '#000'}]} i18nKey={'discount'} />}
          rightComp={
            <View style={styles.con_subtotal}>
              {discount > 0 && <CText style={[styles.txt_group_right, {color: '#000'}]}>{'- '}</CText>}
              {discount > 0 && currencyPosition === Currency.left &&
                <CText style={[styles.txt_group_right, {color: '#000'}]}>{symbol}</CText>
              }
              <CText style={[styles.txt_group_right, {color: '#000'}]}>{discount > 0 ? discountParse : '-'}</CText>
              {discount > 0 && currencyPosition === Currency.right &&
                <CText style={[styles.txt_group_right, {color: '#000'}]}>{symbol}</CText>
              }
            </View>
          }
        />

        <CViewRow style={styles.con_content_row} between
          leftComp={<CText style={[styles.txt_group_left, {color: '#000'}]} i18nKey={'delivery_charges'} />}
          rightComp={
            <View style={styles.con_subtotal}>
              {shipping > 0 && currencyPosition === Currency.left &&
                <CText style={[styles.txt_group_right, {color: '#000'}]}>{symbol}</CText>
              }
              <CText style={[styles.txt_group_right, {color: '#000'}]}>{shipping > 0 ? shippingParse : '-'}</CText>
              {shipping > 0 && currencyPosition === Currency.right &&
                <CText style={[styles.txt_group_right, {color: '#000'}]}>{symbol}</CText>
              }
            </View>
          }
        />

        <CViewRow style={[styles.con_content_row, { borderBottomWidth: 0 }]} between
          leftComp={<CText style={[styles.txt_group_left, {color: '#000'}]} i18nKey={'provisional'} />}
          rightComp={
            <View style={styles.con_subtotal}>
              {currencyPosition === Currency.left &&
                <CText style={[styles.txt_group_right, styles.txt_group_subtotal, { color: Colors.BLACK_COLOR }]}>{symbol}</CText>
              }
              <CText style={[styles.txt_group_right, styles.txt_group_subtotal, { color: Colors.BLACK_COLOR }]}>{provisionalParse}</CText>
              {currencyPosition === Currency.right &&
                <CText style={[styles.txt_group_right, styles.txt_group_subtotal, { color: Colors.BLACK_COLOR }]}>{symbol}</CText>
              }
            </View>
          }
        />
      </Content>
    </Container >
  )
}