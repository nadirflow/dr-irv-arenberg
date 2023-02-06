<?php
/**
 * ZiniAppBuilder Wordpress Plugin for Mobile App.
 * Exclusively on Envato Market: https://codecanyon.net/user/zinisoft/portfolio
 *
 * @encoding        UTF-8
 * @version         1.0.0
 * @copyright       Copyright (C) 2018 - 2019 ZiniSoft ( https://zinisoft.net/ ). All rights reserved.
 * @license         Envato License https://1.envato.market/KYbje
 * @contributors    Brian Vo (info@zinisoft.net), ZiniSoft Team (support@zinisoft.net)
 * @support         support@zinisoft.net
 **/

namespace ZiniSoft;

/** Include plugin autoloader for additional classes. */
require __DIR__ . '/src/autoload.php';

use ZiniSoft\AppBuilder\Helper;
use ZiniSoft\AppBuilder\EnvatoItem;

/** If this file is called directly, abort. */
if ( ! defined( 'WP_UNINSTALL_PLUGIN' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit;
}

/**
 * SINGLETON: Class used to implement Uninstall of ZiniAppBuilder plugin.
 *
 * @since 2.0.0
 * @author Brian Vo (info@zinisoft.net)
 **/
final class Uninstall {

	/**
	 * The one true Uninstall.
	 *
	 * @var Uninstall
	 * @since 2.0.0
	 **/
	private static $instance;

	/**
	 * Sets up a new Uninstall instance.
	 *
	 * @since 2.0.0
	 * @access public
	 **/
	private function __construct() {

		/** Get Uninstall mode. */
		$uninstall_mode = $this->get_uninstall_mode();

		/** Send uninstall Action to our host. */
		Helper::get_instance()->send_action( 'uninstall', 'ziniappbuilder', '1.0.0' );

		/** Remove Plugin and Settings. */
		if ( 'plugin+settings' === $uninstall_mode ) {

			/** Remove Plugin Settings. */
			$this->remove_settings();

			/** Remove Plugin with Settings and Audio files. */
		} elseif ( 'plugin+settings+data' === $uninstall_mode ) {

			/** Remove Plugin Settings. */
			$this->remove_settings();

			/** Remove Plugin Audio files. */
			Helper::get_instance()->remove_audio_files();

		}

	}

	/**
	 * Return uninstall mode.
	 * plugin - Will remove the plugin only. Settings and Audio files will be saved. Used when updating the plugin.
	 * plugin+settings - Will remove the plugin and settings. Audio files will be saved. As a result, all settings will be set to default values. Like after the first installation.
	 * plugin+settings+data - Full Removal. This option will remove the plugin with settings and all audio files. Use only if you are sure what you are doing.
	 *
	 * @since 2.0.0
	 * @access public
	 **/
	public function get_uninstall_mode() {

		$uninstall_settings = get_option( 'zs_ziniappbuilder_uninstall_settings' );

		if( isset( $uninstall_settings['zs_ziniappbuilder_uninstall_settings'] ) AND $uninstall_settings['zs_ziniappbuilder_uninstall_settings'] ) { // Default value.
			$uninstall_settings = [
				'delete_plugin' => 'plugin'
			];
		}

		return $uninstall_settings['delete_plugin'];

	}

	/**
	 * Delete Plugin Options.
	 *
	 * @since 2.0.0
	 * @access public
	 **/
	public function remove_settings() {

		$settings = array(
			'zs_ziniappbuilder_envato_id',
			'zs_ziniappbuilder_settings',
			'zs_ziniappbuilder_color_settings',
			'zs_ziniappbuilder_font_settings',
			'zs_ziniappbuilder_blog_settings',
			'zs_ziniappbuilder_assignments_settings',
			'zs_ziniappbuilder_uninstall_settings',
			'envato_purchase_code_' . EnvatoItem::get_instance()->get_id() // ZiniAppBuilder item ID.
		);

		foreach ( $settings as $key ) {

			if ( is_multisite() ) { // For Multisite.
				if ( get_site_option( $key ) ) {
					delete_site_option( $key );
				}
			} else {
				if ( get_option( $key ) ) {
					delete_option( $key );
				}
			}
		}
	}

	/**
	 * Main Uninstall Instance.
	 *
	 * Insures that only one instance of Uninstall exists in memory at any one time.
	 *
	 * @static
	 * @return Uninstall
	 * @since 2.0.0
	 **/
	public static function get_instance() {
		if ( ! isset( self::$instance ) && ! ( self::$instance instanceof Uninstall ) ) {
			self::$instance = new Uninstall;
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
	 * @since 2.0.0
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
	 * @since 2.0.0
	 * @access protected
	 **/
	public function __wakeup() {
		/** Unserializing instances of the class is forbidden. */
		_doing_it_wrong( __FUNCTION__, esc_html__( 'The whole idea of the singleton design pattern is that there is a single object therefore, we don\'t want the object to be unserialized.', 'ziniappbuilder' ), '1.0.0' );
	}

}

/** Runs on Uninstall of ZiniAppBuilder plugin. */
Uninstall::get_instance();
