/**
 ** Name: 
 ** Author: 
 ** CreateAt: 
 ** Description: 
**/
/** SERVICES */
import SignIn from './authentication/sign_in';
import SignUp from './authentication/sign_up';
import ForgotPassword from './authentication/forgot_password';
import Profile from './profile';
import Coupon from './coupon';
import News from './news';
import Service from './service';
import User from './user';
import Setting from './setting';
import Order from './order';
import Page from './page';
import Stripe from './stripe';
import Firebase from './firebase';
import Pdf from './pdf';
import PayPal from './paypal';
import DataShipping from './data_shipping';
import Vendor from './vendor';
import Cart from './cart';

let Services = {
  SignIn,
  SignUp,
  ForgotPassword,
  Profile,
  News,
  Coupon,
  Service,
  User,
  Setting,
  Order,
  Page,
  Stripe,
  Firebase,
  Pdf,
  DataShipping,
  Vendor,
  Cart
};

export default Services;