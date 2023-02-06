/**
 ** Name: 
 ** Author: 
 ** CreateAt: 
 ** Description: 
**/
/* LIBRARY */
import React from 'react';
import { Root } from "native-base";
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-fontawesome-pro';
/** COMPONENTS */
import CText from '~/components/CText';
/** SCREENS */
import SignInScreen from '~/screens/authentication/sign_in';
import SignUpScreen from '~/screens/authentication/sign_up';
import ForgotPasswordScreen from '~/screens/authentication/forgot_password';
import HomeScreen from '~/screens/home';
import CouponsDetailScreen from '~/screens/home/coupons_detail';
import ProductDetailScreen from '~/screens/product_detail';
import ReviewsScreen from '~/screens/reviews';
import HelpInfoScreen from '~/screens/account/help_info';
import ContactUsScreen from '~/screens/account/contact_us';
import AboutAuthorScreen from '~/screens/account/about_author';
import ViewPdfScreen from '~/screens/account/view_pdf';
import SearchScreen from '~/screens/search';
import ServiceScreen from '~/screens/service';
import CartScreen from '~/screens/cart';
import NewsScreen from '~/screens/news';
import AccountScreen from '~/screens/account';
import ProfileScreen from '~/screens/account/profile';
import AppointmentScreen from '~/screens/account/appointment';
import AppointmentDetailScreen from '~/screens/account/appointment/detail';
import BookmarkScreen from '~/screens/account/bookmark';
import ShareScreen from '~/screens/account/invite_friends';
import PolicyScreen from '~/screens/account/policy';
import HomePostDetailScreen from '~/screens/home/detail';
import NewsPostDetailScreen from '~/screens/news/detail';
import BookPickDayScreen from '~/screens/book/pick_day';
import BookPaymentScreen from '~/screens/book/payment';
import BookConfirmScreen from '~/screens/book/confirm';
import StripePaymentScreen from '~/screens/stripe_payment';
import CategoryScreen from '~/screens/category';
import ProductScreen from '~/screens/category/detail';
import CouponScreen from '~/screens/coupon';
import AppIntroScreen from '~/screens/app_intro';
import DemoScreen from '~/screens/demo';
import LinkDemoScreen from '~/screens/demo/link';
import PayPalPaymentScreen from '~/screens/paypal';
import RefineScreen from '~/screens/service/refine';
import NewsCategoriesScreen from '~/screens/news/detail_cate';
import PayFastPaymentScreen from '~/screens/payfast';
import MercadoPaymentScreen from '~/screens/mercado_pago';
import PayStackPaymentScreen from '~/screens/paystack';
import ViewedProductsScreen from '~/screens/viewed_products';
import ViewVendorsScreen from '~/screens/vendors'
import VendorDetailScreen from '~/screens/vendor_detail';
import VendorDashboardScreen from '~/screens/vendor_manager/dashboard';
import VendorOrdersScreen from '~/screens/vendor_manager/orders';
import VendorProductsScreen from '~/screens/vendor_manager/products';
import VendorReportsScreen from '~/screens/vendor_manager/reports';
/** COMMON */
import { Colors } from '~/utils/colors';
import { cStyles } from '~/utils/styles';
import { Devices } from '~/config';
import VendorNotificationsScreen from '~/screens/vendor_manager/notifications';
import VendorReviewsScreen from '~/screens/vendor_manager/reviews';
import WebviewCheckoutScreen from '~/screens/webview_checkout';
import WebviewPaymentScreen from '~/screens/webview_payment';
import WebviewThankYouScreen from '~/screens/webview_thankyou';
/** INIT NAVIGATOR OF APP */
const StackMain = createStackNavigator();
const TabMain = createBottomTabNavigator();
const TabVendor = createBottomTabNavigator();

export class VendorTab extends React.Component {
  /** RENDER */
  render() {
    return (
      <TabVendor.Navigator
        initialRouteName={'VendorDashboard'}
        headerMode={'none'}
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName = 'home';
            switch (route.name) {
              case 'Account':
                iconName = 'user-alt';
                break;
            }
            return <Icon name={iconName} size={Devices.fS(22)} color={color} type={focused ? "regular" : 'light'} />
          },
          tabBarLabel: ({ focused, color, size }) => {
            let title = 'home';
            switch (route.name) {
              case 'Account':
                title = 'account';
                break;
            }
            return <CText style={[cStyles.txt_body_meta_item, { fontSize: Devices.fS(10) }, focused && { color }]} i18nKey={title} />
          }
        })}
        tabBarOptions={{
          activeTintColor: Colors.PRIMARY_COLOR,
          inactiveTintColor: Colors.PLACEHOLDER_COLOR,
        }}
      >
        <TabVendor.Screen name="VendorDashboard" component={VendorDashboardScreen} />
        <TabVendor.Screen name="Account" component={AccountScreen} />
      </TabVendor.Navigator>
    )
  }
}

export class RootTab extends React.Component {

  /** RENDER */
  render() {
    return (
      <TabMain.Navigator
        
        initialRouteName={'Home'}
        headerMode={'none'}
        
        screenOptions={ ({ route }) => ({  
          
          tabBarIcon: ({ focused, color, size }) => {
            let iconName = 'home';
            switch (route.name) {
              case 'Service':
                iconName = 'shopping-bag';
                break;
              case 'News':
                iconName = 'newspaper';
                break;
              case 'Account':
                iconName = 'user-alt';
                break;
            }
            return <Icon name={iconName} style={[{position: 'absolute'}]} size={Devices.fS(24)} color={color} type={focused ? "regular" : 'light'} />
          },
          tabBarLabel: ({ focused, color, size }) => {
            let title = 'home';
            switch (route.name) {
              case 'Service':
                title = 'services';
                break;
              case 'News':
                title = 'news';
                break;
              case 'Account':
                title = 'account';
                break;
            }
            return <CText style={[  {position: 'absolute', color:'#fff', top: Devices.sH(6.2), fontSize: Devices.fS(9),  }, focused && { color:'#fff' }]} i18nKey={ title} />
          },
          // tabBarVisible : false,
        })}
        tabBarOptions={{
          activeTintColor: '#fff',
          inactiveTintColor: '#fff',
          
          style: {  flexDirection: 'row', height: Devices.sH('8%'), backgroundColor:'#18504D', borderTopLeftRadius:30, borderTopRightRadius:30,   shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,}
        }}
        tab
      >
        <TabMain.Screen name={"Home"} component={HomeScreen} />
        <TabMain.Screen name={"Service"} component={ServiceScreen} />
        <TabMain.Screen name={"News"} component={NewsScreen} />
        <TabMain.Screen name={"Account"} component={AccountScreen} />
      </TabMain.Navigator>
    )
  }
}

class RootMain extends React.Component {

  /** RENDER */
  render() {
    return (
      <Root>
        <StackMain.Navigator
          initialRouteName={this.props.initRoute}
          headerMode={'none'}
          screenOptions={{ gestureEnabled: false }}>
          <StackMain.Screen name="SignIn" component={SignInScreen} />
          <StackMain.Screen name="SignUp" component={SignUpScreen} />
          <StackMain.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
          <StackMain.Screen name="RootTab" component={RootTab} />
          <StackMain.Screen name="HomeDetail" component={HomePostDetailScreen} />
          <StackMain.Screen name="Cart" component={CartScreen} />
          <StackMain.Screen name="Profile" component={ProfileScreen} />
          <StackMain.Screen name="Appointment" component={AppointmentScreen} />
          <StackMain.Screen name="AppointmentDetail" component={AppointmentDetailScreen} />
          <StackMain.Screen name="ViewPdf" component={ViewPdfScreen} />
          <StackMain.Screen name="CouponsDetail" component={CouponsDetailScreen} />
          <StackMain.Screen name="Bookmark" component={BookmarkScreen} />
          <StackMain.Screen name="Share" component={ShareScreen} />
          <StackMain.Screen name="Policy" component={PolicyScreen} />
          <StackMain.Screen name="NewsDetail" component={NewsPostDetailScreen} />
          <StackMain.Screen name="BookPickDay" component={BookPickDayScreen} />
          <StackMain.Screen name="BookPayment" component={BookPaymentScreen} />
          <StackMain.Screen name="BookConfirm" component={BookConfirmScreen} />
          <StackMain.Screen name="StripePayment" component={StripePaymentScreen} />
          <StackMain.Screen name="Search" component={SearchScreen} />
          <StackMain.Screen name="Category" component={CategoryScreen} />
          <StackMain.Screen name="Product" component={ProductScreen} />
          <StackMain.Screen name="Coupon" component={CouponScreen} />
          <StackMain.Screen name="ProductDetail" component={ProductDetailScreen} />
          <StackMain.Screen name="Reviews" component={ReviewsScreen} />
          <StackMain.Screen name="HelpInfo" component={HelpInfoScreen} />
          <StackMain.Screen name="ContactUs" component={ContactUsScreen} />
          <StackMain.Screen name="AboutAuthor" component={AboutAuthorScreen} />
          <StackMain.Screen name="AppIntro" component={AppIntroScreen} />
          <StackMain.Screen name="Demo" component={DemoScreen} />
          <StackMain.Screen name="LinkDemo" component={LinkDemoScreen} />
          <StackMain.Screen name="PayPalPayment" component={PayPalPaymentScreen} />
          <StackMain.Screen name="Refine" component={RefineScreen} />
          <StackMain.Screen name="NewsCategories" component={NewsCategoriesScreen} />
          <StackMain.Screen name="News" component={NewsScreen} />
          <StackMain.Screen name="PayFastPayment" component={PayFastPaymentScreen} />
          <StackMain.Screen name="MercadoPayment" component={MercadoPaymentScreen} />
          <StackMain.Screen name="PayStackPayment" component={PayStackPaymentScreen} />
          <StackMain.Screen name="ViewedProducts" component={ViewedProductsScreen} />
          <StackMain.Screen name="Vendors" component={ViewVendorsScreen} />
          <StackMain.Screen name="VendorDetail" component={VendorDetailScreen} />
          <StackMain.Screen name="VendorTab" component={VendorTab} />
          <StackMain.Screen name="VendorOrders" component={VendorOrdersScreen} />
          <StackMain.Screen name="VendorProducts" component={VendorProductsScreen} />
          <StackMain.Screen name="VendorReports" component={VendorReportsScreen} />
          <StackMain.Screen name="VendorNotifications" component={VendorNotificationsScreen} />
          <StackMain.Screen name="VendorReviews" component={VendorReviewsScreen} />
          <StackMain.Screen name="WebviewCheckout" component={WebviewCheckoutScreen} />
          <StackMain.Screen name="WebviewPayment" component={WebviewPaymentScreen} />
          <StackMain.Screen name="WebviewThankyou" component={WebviewThankYouScreen} />
        </StackMain.Navigator>
      </Root>
    )
  }
}

export default RootMain;