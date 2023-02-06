<?php
/**
 * GeneralLib Wordpress Plugin for Mobile App.
 * Exclusively on Envato Market: https://codecanyon.net/user/zinisoft/portfolio
 *
 * @encoding        UTF-8
 * @version         1.0.0
 * @copyright       Copyright (C) 2018 - 2019 ZiniSoft ( https://zinisoft.net/ ). All rights reserved.
 * @license         Envato License https://1.envato.market/KYbje
 * @contributors    Brian Vo (info@zinisoft.net), ZiniSoft Team (support@zinisoft.net)
 * @support         support@zinisoft.net
 **/

namespace ZiniSoft\GeneralLib;

/** Exit if accessed directly. */
if ( ! defined( 'ABSPATH' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit;
}

/**
 * SINGLETON: Class contain information about the envato item.
 *
 * @since 1.0.0
 * @author Brian Vo (info@zinisoft.net)
 **/
final class EnvatoItem {

	/**
	 * The one true EnvatoItem.
	 *
	 * @var EnvatoItem
	 * @since 1.0.0
	 **/
	private static $instance;

	/**
	 * Return CodeCanyon Item ID.
	 *
	 * @since 1.0.0
	 * @access public
	 * @return string
	 **/
	public function get_url() {

		return 'https://codecanyon.net/user/zinisoft/portfolio';

	}

	/**
	 * Return CodeCanyon Item ID.
	 *
	 * @since 1.0.0
	 * @access public
	 * @return string
	 **/
	public function get_id() {

		/** Do we have stored Envato ID? */
		$item_id = get_option( 'zs_ziniappbuilder_envato_id' );

		/** If we have stored Envato ID, return it. */
		if ( $item_id ) {
			return $item_id;
		}

		/** Else get id from our server. */
		//$item_id = $this->get_remote_plugin_id();

		/** Store local option if this is real item ID. */
		$item_id = 54336046;
		if ( (int)$item_id > 0 ) {
			update_option( 'zs_ziniappbuilder_envato_id', $item_id );
		}

		return (string)$item_id;
	}

	/**
	 * Return CodeCanyon Plugin ID from out server.
	 *
	 * @since 1.0.0
	 * @access public
	 **/
	private function get_remote_plugin_id() {

		/** Get Plugin name. */
		if ( ! function_exists('get_plugin_data') ) {
			require_once( ABSPATH . 'wp-admin/includes/plugin.php' );
		}

		$plugin_data = get_plugin_data( WP_PLUGIN_DIR . '/ziniappbuilder/ziniappbuilder.php' );
		$plugin_name = $plugin_data['Name'];

		/** Build URL. */
		$url = 'https://upd.zinisoft.net/wp-content/plugins/zs-purchase-validator/src/ZiniSoft/PurchaseValidator/GetMyId.php';
		$url .= '?plugin_name=' . urlencode( $plugin_name );

		/** Suppress warning, if file not exist. */
		$context = stream_context_create( ['http' => ['ignore_errors' => true] ] );
		$plugin_id = file_get_contents( $url, false, $context );

		/** We don't have plugin ID. */
		if ( false === $plugin_id ) { return '0'; }

		$plugin_id = json_decode( $plugin_id );

		/** Wrong JSON. */
		if ( null === $plugin_id ) { return '0'; }

		return $plugin_id;
	}

	/**
	 * Main EnvatoItem Instance.
	 *
	 * Insures that only one instance of EnvatoItem exists in memory at any one time.
	 *
	 * @static
	 * @return EnvatoItem
	 * @since 1.0.0
	 **/
	public static function get_instance() {
		if ( ! isset( self::$instance ) && ! ( self::$instance instanceof EnvatoItem ) ) {
			self::$instance = new EnvatoItem;
		}

		return self::$instance;
	}

	/**
	 * Throw error on object clone.
	 *
	 * The whole idea of the singleton design pattern is that there is a single
	 * object therefore, we don't want the object to be cloned.
	 *
	 * @return void
	 * @since 1.0.0
	 * @access protected
	 **/
	public function __clone() {
		/** Cloning instances of the class is forbidden. */
		_doing_it_wrong( __FUNCTION__, esc_html__( 'The whole idea of the singleton design pattern is that there is a single object therefore, we don\'t want the object to be cloned.', 'ziniappbuilder' ), '1.0.0' );
	}

	/**
	 * Disable unserializing of the class.
	 *
	 * The whole idea of the singleton design pattern is that there is a single
	 * object therefore, we don't want the object to be unserialized.
	 *
	 * @return void
	 * @since 1.0.0
	 * @access protected
	 **/
	public function __wakeup() {
		/** Unserializing instances of the class is forbidden. */
		_doing_it_wrong( __FUNCTION__, esc_html__( 'The whole idea of the singleton design pattern is that there is a single object therefore, we don\'t want the object to be unserialized.', 'ziniappbuilder' ), '1.0.0' );
	}

} // End Class EnvatoItem.
