<?php
/**
 * Plugin Name: WCFM - WooCommerce Multivendor Marketplace - REST API
 * Plugin URI: https://wclovers.github.io/wcfm-rest-api/
 * Description: Most featured and flexible marketplace solution for your e-commerce store. Simply and Smoothly.
 * Author: WC Lovers
 * Version: 1.4.4
 * Author URI: https://wclovers.com
 *
 * Text Domain: wcfm-marketplace-rest-api
 * Domain Path: /lang/
 *
 * WC requires at least: 3.0.0
 * WC tested up to: 5.1.0
 *
 */

if(!defined('ABSPATH')) exit; // Exit if accessed directly

if ( ! class_exists( 'WCFMapi_Dependencies' ) )
	require_once 'helpers/class-wcfmapi-dependencies.php';

require_once 'helpers/wcfmapi-core-functions.php';
require_once 'wcfm-marketplace-rest-api-config.php';

if(!defined('WCFMapi_TOKEN')) exit;
if(!defined('WCFMapi_TEXT_DOMAIN')) exit;


if(!WCFMapi_Dependencies::wcfmapi_plugin_active_check() ) {
	add_action( 'admin_notices', 'wcfmapi_woocommerce_inactive_notice' );
} else {
  if(!class_exists('WCFMapi')) {
    include_once( 'core/class-wcfmapi.php' );
    global $WCFMapi;
    $WCFMapi = new WCFMapi( __FILE__ );
    $GLOBALS['WCFMapi'] = $WCFMapi;
  }
}