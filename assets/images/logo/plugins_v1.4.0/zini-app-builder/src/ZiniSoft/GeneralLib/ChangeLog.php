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
 * SINGLETON: Class used to implement StatusTab tab on plugin settings page.
 *
 * @since 2.0.0
 * @author Brian Vo (info@zinisoft.net)
 **/
final class ChangeLog {

	/**
	 * The one true StatusTab.
	 *
	 * @var StatusTab
	 * @since 1.0.0
	 **/
	private static $instance;

	/**
	 * Sets up a new StatusTab instance.
	 *
	 * @since 1.0.0
	 * @access public
	 **/
	private function __construct() {

	}


	/**
	 * Render form with all settings fields.
	 *
	 * @access public
	 **/
	public function render_form() {

		settings_fields( 'GeneralLibStatusOptionsGroup' );
		do_settings_sections( 'GeneralLibStatusOptionsGroup' );

		/** Render "Changelog". */
		$this->render_changelog();

	}


	/**
	 * Render "Changelog" field.
	 *
	 * @since 2.0.0
	 * @access public
	 **/
	public function render_changelog() {
		?>
        <table class="table">
            <thead class="thead-dark">
            <tr>
                <th scope="col">#</th>
                <th scope="col">Initial release</th>
                <th scope="col">1.0</th>
            </tr>
            </thead>
        </table>
        <?php
    }

	/**
	 * Render Privacy Notice.
	 *
	 * @since 2.0.0
	 * @access public
	 **/
	public function render_privacy_notice() {
	    ?>
        <div class="mdc-text-field-helper-line">
            <div class="mdc-text-field-helper-text mdc-text-field-helper-text--persistent"><?php esc_html_e( 'We will never collect any confidential data.', 'ziniappbuilder' );?></div>
        </div>
        <?php
    }

	/**
	 * Main StatusTab Instance.
	 *
	 * Insures that only one instance of StatusTab exists in memory at any one time.
	 *
	 * @static
	 * @return StatusTab
	 * @since 2.0.0
	 **/
	public static function get_instance() {
		if ( ! isset( self::$instance ) && ! ( self::$instance instanceof ChangeLog ) ) {
			self::$instance = new ChangeLog;
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

} // End Class StatusTab.
