## CHANGE LOG
### V2.2.0:
> - Enhance loading page with placeholder https://www.npmjs.com/package/rn-placeholder
> - Enhance UI / UX icons on the mobile app.

### V2.1.0:
> - [HOT FIX] Fix init select Native Base when have no index

### V2.0.0:
Update React Native to 63.3
Update core Native Base theme

### V1.4.0:
Update flow checkout and payment by WebView

### V1.3.2:

> - [HOT FIX] Fix init shipping method when select zone.

### V1.3.1:

> - [HOT FIX] Bug show vendor when not config vendor.
> - Add vendor at product detail.
> - Optimize code and performance.

### V1.3.0:

> - Add Multi Vendor (use WCFM).
> - Need install more plugin in your backend:
  + WCFM - WooCommerce Frontend Manager.
  + WCFM - WooCommerce Multivendor Marketplace.
  + WCFM - WooCommerce Multivendor Marketplace - REST API.
  + WCFM - WooCommerce Multivendor Membership.
> - Add List Vendor page.
> - Add Detail Vendor page.
  + List products of store.
  + About store.
> - Add vender dashboard for Master of store.
  + View sales of month.
  + View earning of month.
  + List products.
  + List order.
  + Reports.
  + Reviews.
  + Notifications.
> - Optimize code and performance.

### V1.2.0:

> - Fix Ui Login on Android platform.
> - Fix Ui Sign Up on Android platform.
> - Fix Ui Forgot Password on Android platform.
> - Optimize code and performance.

### V1.1.9:

> - Add PayStack Payment.
> - Fix Column layout.
> - Optimize code and performance.

### V1.1.8:

> - Support RTL layout.
> - Fix Signup module.
> - Optimize code and performance.

### V1.1.7:

> - Fix UI Login, Registry, Forgot Password.
> - Fix UI Home.
> - Fix UI Account.
> - Fix bug when add products.
> - Fix bug list products.
> - Fix webview news.
> - Fix Bug Server error Policy and Terms condition.
> - Optimize code and performance.

### V1.1.6:

> - Fix UI Form Address.
> - Fix Bug Server error Policy and Terms condition.

### V1.1.5:

> - Fix Bug loading Cart.
> - Fix Bug Sort high to low.
> - Fix Bug Sign Up error show HTML code.
> - Fix Bug duplicate Policy and Terms condition.
> - Fix Bug remove coupon.
> - Fix Validate email shipping.
> - Fix Mercado Pago config.
> - Fix UI button sign up.
> - Fix bug and Optimize code.

### V1.1.4:

> - Remove modal add address when checkout.
> - Add alert when not install plugin for Woo.
> - Fix UI button sign up.
> - Fix bug and Optimize code.

### V1.1.3:

> - Fix remove product on cart page
> - Fix guest order
> - Fix change country/state

### V1.1.2:

> - Fix new UI for slider in homepage
> - Fix new UI for list product in homepage/products/news
> - Fix bugs when remove product in cart
> - Fix bugs when add product to cart
> - Fix other bug and optimize code

### V1.1.1:

> - Add New payment method: mercadopago
> - Fix order price info

### V1.1.0:

> - Change UI and order flow
> - Add shipping method and delivery charges
> - Add country/state/zone when order
> - Add variations/button buy now/short description on list product
> - Add setting allow guest check out
> - Add setting number related products on product page
> - Add setting show/hide short description in product page
> - Add setting show/hide related products on product page
> - Add setting show/hide social login
> - Add setting show/hide rating app
> - Add setting show/hide variations on list product
> - Add setting show/hide/min/max for WC MinMax plugins
> - Add PayU payment gateway (Android only)
> - Add setting show/hide review product
> - Fix http and https when call API
> - Fix setting blog position on homepage
> - Fix load more list products/news/category/sub category
> - Fix coupon code: restrictions are not working

### V1.0.7:

> - Change UI and flow when order
> - Add shipping methob and delivery charges
> - Add country/state shipping when order
> - Add variations/button buy now/short description on list product
> - Add setting allow guest check out
> - Add setting number related products on product page
> - Add setting show/hide short description in product page
> - Add setting show/hide related products on product page
> - Add setting show/hide login via socials
> - Add setting show/hide rating app
> - Add setting show/hide variations on list product
> - Add setting show/hide/min/max for WC MinMax plugins
> - Add PayFast payment
> - Add PayU payment
> - Fix http and https when call API
> - Fix setting position blog in home page
> - Fix load more list products/news/category/sub category
> - Fix apply coupon code
> - Fix setting review product
> - Fix bug and Optimize code

### V1.0.6:

> - Fix Ui
> - Fix Ui coupon and coupon detail
> - Fix Ui sub category
> - Fix title category and sub category
> - Add setting category and sub category for news
> - Add filter for services
> - Fix bug and Optimize code

### V1.0.4:

> - Fix Ui coupon and coupon detail
> - Fix Ui sub category
> - Fix title category and sub category
> - Add setting category and sub category for news
> - Add filter for services
> - Fix bug and Optimize code

### V1.0.3:

> - Add Paypal payment
> - Add demo setting
> - Fix ads admob
> - Fix list appoinments
> - Fix image sizes
> - Fix bug and Optimize code

### V1.0.2:

> - Add ads firebase
> - Add setting ads firebase from backend
> - Fix title news details
> - Fix UI search
> - Fix bug and Optimize code

### V1.0.1:

> - Add fonts setting
> - Edit color setting
> - Fix bug and Optimize code

### V1.0.0:

> - Release version 1

## COMMANDLINE REFERS

### Export APK debug:

rm -rf android/app/build && react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res && cd android && ./gradlew assembleDebug

### Export APK Release:

cd android && ./gradlew assembleRelease

### Check Keystore cert:

keytool -list -keystore my-release.keystore
