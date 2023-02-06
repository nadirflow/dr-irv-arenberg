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

use ZiniSoft\ZiniAppBuilder as ZiniAppBuilder;

/** Exit if accessed directly. */
if ( ! defined( 'ABSPATH' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit;
}

/**
 * SINGLETON: Class used to implement UninstallTab tab on plugin settings page.
 *
 * @since 1.0.0
 * @author Brian Vo (info@zinisoft.net)
 **/
final class UninstallTab {

	/**
	 * The one true UninstallTab.
	 *
	 * @var UninstallTab
	 * @since 2.0.0
	 **/
	private static $instance;

	/**
	 * Sets up a new UninstallTab instance.
	 *
	 * @since 2.0.0
	 * @access public
	 **/
	private function __construct() {

	}

	/**
	 * Render form with all settings fields.
	 *
	 * @access public
	 * @since 2.0.0
	 **/
	public function render_form() {

		settings_fields( 'GeneralLibUninstallOptionsGroup' );
		do_settings_sections( 'GeneralLibUninstallOptionsGroup' );

	}

	/**
	 * Generate Activation Tab.
	 *
	 * @since 2.0.0
	 * @access public
	 **/
	public function add_settings() {

		/** Uninstall Tab. */
		register_setting( 'GeneralLibUninstallOptionsGroup', 'zs_ziniappbuilder_uninstall_settings' );
		add_settings_section( 'zs_ziniappbuilder_settings_page_uninstall_section', '', null, 'GeneralLibUninstallOptionsGroup' );

		/** Delete plugin. */
		add_settings_field( 'delete_plugin', esc_html__( 'Removal settings:', 'ziniappbuilder' ), [$this, 'render_delete_plugin'], 'GeneralLibUninstallOptionsGroup', 'zs_ziniappbuilder_settings_page_uninstall_section' );

	}

	/**
	 * Render "Delete Plugin" field.
	 *
	 * @since 2.0.0
	 * @access public
	 **/
	public function render_delete_plugin() {

		/** Get uninstall settings. */
		$uninstall_settings = get_option( 'zs_ziniappbuilder_uninstall_settings' );

		/** Set Default value 'plugin' . */
		if ( ! isset( $uninstall_settings['delete_plugin'] ) ) {
			$uninstall_settings = [
				'delete_plugin' => 'plugin'
			];
		}

		$options = [
			'plugin' => esc_html__( 'Delete plugin only', 'ziniappbuilder' ),
			'plugin+settings' => esc_html__( 'Delete plugin and settings', 'ziniappbuilder' ),
			'plugin+settings+data' => esc_html__( 'Delete plugin, settings and data', 'ziniappbuilder' ),
		];

		/** Prepare description. */
		$helper_text = esc_html__( 'Choose which data to delete upon using the "Delete" action in the "Plugins" admin page.', 'ziniappbuilder' );

		/** Render select. */
		UI::get_instance()->render_select(
			$options,
			$uninstall_settings['delete_plugin'], // Selected option.
			esc_html__('Delete plugin', 'ziniappbuilder' ),
			$helper_text,
			['name' => 'zs_ziniappbuilder_uninstall_settings[delete_plugin]']
		);

	}

	/**
	 * Main UninstallTab Instance.
	 *
	 * Insures that only one instance of UninstallTab exists in memory at any one time.
	 *
	 * @static
	 * @return UninstallTab
	 * @since 2.0.0
	 **/
	public static function get_instance() {
		if ( ! isset( self::$instance ) && ! ( self::$instance instanceof UninstallTab ) ) {
			self::$instance = new UninstallTab;
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
		_doing_it_wrong( __FUNCTION__, esc_html__( 'The whole idea of the singleton design pattern is that there is a single object therefore, we don\'t want the object to be cloned.', 'ziniappbuilder' ), ZiniAppBuilder::$version );
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
		_doing_it_wrong( __FUNCTION__, esc_html__( 'The whole idea of the singleton design pattern is that there is a single object therefore, we don\'t want the object to be unserialized.', 'ziniappbuilder' ), ZiniAppBuilder::$version );
	}

} // End Class UninstallTab.
