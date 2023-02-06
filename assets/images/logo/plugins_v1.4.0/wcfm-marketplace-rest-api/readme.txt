=== WooCommerce Multivendor Marketplace - REST API ===
Contributors: wclovers
Tags: woocommerce marketplace api, rest api, remote api, http api
Donate link: https://www.paypal.me/wclovers/25usd
Requires at least: 4.4
Tested up to: 5.7
WC requires at least: 3.0
WC tested up to: 5.1.0
Requires PHP: 5.6
Stable tag: 1.4.4
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html

REST API for the most featured and powerful multi vendor plugin for your WooCommerce Multi-vendor Marketplace.

== Description ==

WooCommerce Multivendor Marketplace (WCFM Marketplace) - REST API will empower your marketplace site with the most powerful multi-vendor REST API, you will be able to get and send data to your marketplace from other mobile apps or websites using HTTP Rest API request.

> It's an addon plugin for -
> [WooCommerce Multivendor Marketplace](https://wordpress.org/plugins/wc-multivendor-marketplace/)
>
> [Know more about this ...](https://wclovers.com/blog/woocommerce-multivendor-marketplace-wcfm-marketplace/) 
>

= 👉 Product Rest API =

/wp-json/wcfmmp/v1/products

* GET    - Product, Products
* POST   - Create Product
* DELETE - Delete Product
* PUT    - Edit Product

= 👉 Order Rest API =

wp-json/wcfmmp/v1/orders/

* GET - Order, Orders
* PUT    - Edit Order Status

wp-json/wcfmmp/v1/orders/note/=order_id=

* GET - Order Note
* PUT    - Change order note

= 👉 Restricted Capability Rest API =

wp-json/wcfmmp/v1/restricted-capabilities/

* GET - Restricted Capabilities

= 👉 Settings Rest API =

wp-json/wcfmmp/v1/settings/email/=email_id=
wp-json/wcfmmp/v1/settings/id/=vendor_id=

* GET - Vendor Settings

= 👉 Notifications Rest API =

wp-json/wcfmmp/v1/notifications/

* GET - Notificatins

= 👉 Booking Rest API =

wp-json/wcfmmp/v1/bookings/

* GET - Booking, Bookings
* PUT   - Update Booking

wp-json/wcfmmp/v1/bookings/update-status/==booking_id==
* PUT   - Update Booking Status

= 👉 Get Vendor sales stats =

wp-json/wcfmmp/v1/sales-stats/
* GET - Sales Stats

= 👉 Enquiry Rest API =

/wp-json/wcfmmp/v1/enquiries

* GET    - Enquiry, Enquiries

/wp-json/wcfmmp/v1/enquiries/==enquiry_id==/reply

* POST - Enquiry Reply

= 👉 Review Rest API =

/wp-json/wcfmmp/v1/reviews

* GET    - Reviews
* POST   - Approve Review

/wp-json/wcfmmp/v1/store-vendors
/wp-json/wcfmmp/v1/store-vendors/==vendor_id==

* GET    - Store Vendors List

/wp-json/wcfmmp/v1/store-vendors/==vendor_id==/products

* GET    - Store Vendors Product List

/wp-json/wcfmmp/v1/support

* GET    - Supports List

*** Delivery Boy API ***

/wp-json/wcfmmp/v1/deliveries

* GET    - Get Delivery List

/wp-json/wcfmmp/v1/deliveries/==delivery_id==

* GET    - Get Single Delivery

/wp-json/wcfmmp/v1/deliveries/==delivery_id==

* POST    - Update Delivery Status




👉 [Detailed Documentation](https://wclovers.github.io/wcfm-rest-api/)

= Feedback = 

All we want is love. We are extremely responsive about support requests - so if you face a problem or find any bugs, shoot us a mail or post it in the support forum, and we will respond within 6 hours(during business days). If you get the impulse to rate the plugin low because it is not working as it should, please do wait for our response because the root cause of the problem may be something else. 

It is extremely disheartening when trigger happy users downrate a plugin for no fault of the plugin. 


Really proud to serve and enhance [WooCommerce](http://woocommerce.com).

Be with us ... Team [WC Lovers](https://wclovers.com)

== Installation ==

= Minimum Requirements =

* WordPress 4.7 or greater
* WooCommerce 3.0 or greater
* PHP version 5.6 or greater
* MySQL version 5.0 or greater

= Automatic installation =

Automatic installation is the easiest option as WordPress handles the file transfers itself and you don't need to leave your web browser. To do an automatic install of WooCommerce Multivendor Marketplace, log in to your WordPress dashboard, navigate to the Plugins menu and click Add New.

In the search field type "WooCommerce Multivendor Marketplace - Rest API" and click Search Plugins. Once you've found our eCommerce plugin you can view details about it such as the point release, rating and description. Most importantly of course, you can install it by simply clicking "Install Now".

= Manual installation =

The manual installation method involves downloading our eCommerce plugin and uploading it to your webserver via your favourite FTP application. The WordPress codex contains [instructions on how to do this here](https://codex.wordpress.org/Managing_Plugins#Manual_Plugin_Installation).

== FAQ ==

NONE.


== Changelog ==

= 1.4.4 =
*Updated - 29/06/2021 *

* Minor bug fix.

= 1.4.3 =
*Updated - 13/04/2021 *

* Shipment tracking route added to orders.

= 1.4.2 =
*Updated - 2/12/2020 *

* Minor bug fix

= 1.4.1 =
*Updated - 12/10/2020 *

* WooCommerce latest version compatibility.
* WordPress latest version compatibility.
* Minor bug fix

= 1.4.0 =
*Updated - 02/09/2020 *

* WooCommerce latest version compatibility.
* WordPress latest version compatibility.
* Feature - Route added to update booking by vendor
* Feature - Route added to update booking status by vendor
* Feature - Route added to get and add order notes by vendor
* Feature - Route added get store vendor's products
* Enhance - WCFM Store Policies Data added to Woocomerce Product Route
* Enhance - Addeded Vendor's Store policy data, description to Get vendor/vendors route
* Enhance - Strict checking added for vendors trying to access and edit other products, orders, bookings etc


= 1.3.2 =
*Updated - 13/08/2020 *

* Enhance – Bug Fixes

= 1.3.1 =
*Updated - 12/06/2020 *

* Enhance - Delivery Route delivery location added

= 1.3.0 =
*Updated - 04/06/2020 *

* WooCommerce latest version compatibility.
* WordPress latest version compatibility.
* Enhance - Store Data Added to Woocomerce Product Route
* Enhance - Vendor Logo, Banner added to store vendor route
* Enhance - Vendor store vendor search modified
* Feature - Route added to get single store vendor
* Enhance - Support added for WCFM Store Manager App feature image addition


= 1.2.10 =
* Bug-fix - Delivery orders update bugfix

= 1.2.9 =
* Bug-fix - Delivery orders cod amount remaining total fixed
* Enhance - Coordinates added for delivery order store details.

= 1.2.8 =
* Enhance - Support for grouped delivery order added

= 1.2.7 =
* Bugfix - store-vendors route pagination issue fixed

= 1.2.6 =
*Updated - 16/01/2020*

* Enhance - Membership data added in store vendor route

= 1.2.5 =
*Updated - 19/11/2019*

* BugFix - Order items bugfix for vendor orders

= 1.2.4 =
*Updated - 16/11/2019*

* BugFix - Strict permission checking added in all the routes to disallow unauthenticated access.

= 1.2.3 =
*Updated - 26/06/2019*

* WooCommerce latest version compatibility.
* WordPress latest version compatibility.
* Feature - Route added - GET Delivery Boy single and delivery lists.
* Feature - Route added - Update Delivery Boy delivery status.
* Feature - Route added - GET all support list for vendor.
* BugFix - Create Product route stock quantity not saving.

= 1.2.2 =
*Updated - 26/06/2019*

* WooCommerce latest version compatibility
* WordPress latest version compatibility
* Feature - Route added GET all Vendors

= 1.2.1 =
*Updated - 09/05/2019*

* WooCommerce latest version compatibility
* WordPress latest version compatibility
* Minor bug fixes

= 1.2.0 =
*Updated - 20/04/2019*

* Feature - Route added to POST Enquiry Reply
* Feature - Route added get all Reviews
* Feature - Route added approve a Review
* Fix Small bug in Order endpoint

= 1.1.7 =
*Updated - 12/04/2019*

* Enhance - Reply By Name Reply by image added in single enquiry route
* Developer - Response structure of single enquiry route changed. The response now comes as an object instead of array of object

= 1.1.6 =
*Updated - 30/03/2019*

* Enhance - Customer name, email and product name added in booking route

= 1.1.5 =
*Updated - 25/03/2019*

* Feature - Route added to GET Enquiries, Single Enquiry

= 1.1.4 =
*Updated - 19/03/2019*

* Feature - Route added to GET Sales Stats

= 1.1.3 =
*Updated - 17/03/2019*

* Fix - Update Order Status Endpoint

= 1.1.2 =
*Updated - 25/02/2019*

* Feature - Route added to PUT Change Order Status
* Fix - Update Product issue fix

= 1.1.1 =
*Updated - 23/02/2019*

* Feature - Route added to GET Bookings, Single Booking

= 1.1.0 =
*Updated - 14/02/2019*

* Feature - Route added to GET Restricted Capabilities of Vendors
* Feature - Routes added to GET Vendor Settings by ID and Email
* Feature - Route added to GET Notifications
* Enhance - GET Orders route enhanced to filter and retrive orders with pagination, date etc.

= 1.0.0 =
*Updated - 13/12/2018*

* Initial version release


== Upgrade Notice ==

= 1.4.4 =
* Minor Bug Fix

