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

use ZiniSoft\GeneralLib;

/** Exit if accessed directly. */
if ( ! defined( 'ABSPATH' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit;
}

/**
 * SINGLETON: Used to implement System report handler class
 * responsible for generating a report for the server environment.
 *
 * @since 2.0.0
 * @author Brian Vo ( info@zinisoft.net )
 **/
final class WordPressReporter {

	/**
	 * The one true WordPressReporter.
	 *
	 * @var WordPressReporter
	 * @since 2.0.0
	 **/
	private static $instance;

	/**
	 * Sets up a new WordPressReporter instance.
	 *
	 * @since 2.0.0
	 * @access public
	 **/
	private function __construct() {

	}

	/**
	 * Get WordPress environment reporter title.
	 *
	 * @since 2.0.0
	 * @access public
	 *
	 * @return string Report title.
	 **/
	public function get_title() {
		return 'WordPress Environment';
	}

	/**
	 * Get WordPress environment report fields.
	 *
	 * @since 2.0.0
	 * @access public
	 *
	 * @return array Required report fields with field ID and field label.
	 **/
	public function get_fields() {
		return [
			'version'               => esc_html__( 'Version', 'ziniappbuilder' ),
			'site_url'              => esc_html__( 'Site URL', 'ziniappbuilder' ),
			'home_url'              => esc_html__( 'Home URL', 'ziniappbuilder' ),
			'abspath'               => esc_html__( 'ABSPATH', 'ziniappbuilder' ),
			'is_multisite'          => esc_html__( 'WP Multisite', 'ziniappbuilder' ),
			'max_upload_size'       => esc_html__( 'Max Upload Size', 'ziniappbuilder' ),
			'memory_limit'          => esc_html__( 'Memory limit', 'ziniappbuilder' ),
			'permalink_structure'   => esc_html__( 'Permalink Structure', 'ziniappbuilder' ),
			'language'              => esc_html__( 'Language', 'ziniappbuilder' ),
			'timezone'              => esc_html__( 'Timezone', 'ziniappbuilder' ),
			'admin_email'           => esc_html__( 'Admin Email', 'ziniappbuilder' ),
			'debug_mode'            => esc_html__( 'Debug Mode', 'ziniappbuilder' ),
		];
	}

	/**
	 * Get report.
	 * Retrieve the report with all it's containing fields.
	 *
	 * @since 2.0.0
	 * @access public
	 *
	 * @return array {
	 *    Report fields.
	 *
	 *    @type string $name Field name.
	 *    @type string $label Field label.
	 * }
	 **/
	final public function get_report() {

		$result = [];

		foreach ( $this->get_fields() as $field_name => $field_label ) {
			$method = 'get_' . $field_name;

			$reporter_field = [
				'name' => $field_name,
				'label' => $field_label,
			];

			$reporter_field = array_merge( $reporter_field, $this->$method() );
			$result[ $field_name ] = $reporter_field;
		}

		return $result;
	}

	/**
	 * Get WordPress memory limit.
	 * Retrieve the WordPress memory limit.
	 *
	 * @since 2.0.0
	 * @access public
	 *
	 * @return array {
	 *    Report data.
	 *
	 *    @type string $value          WordPress memory limit.
	 *    @type string $recommendation Recommendation memory limit.
	 *    @type bool   $warning        Whether to display a warning. True if the limit
	 *                                 is below the recommended 64M, False otherwise.
	 * }
	 **/
	public function get_memory_limit() {
		$result = [
			'value' => ini_get( 'memory_limit' ),
		];

		$min_recommended_memory = '64M';

		$memory_limit_bytes = wp_convert_hr_to_bytes( $result['value'] );

		$min_recommended_bytes = wp_convert_hr_to_bytes( $min_recommended_memory );

		if ( $memory_limit_bytes < $min_recommended_bytes ) {
			$result['recommendation'] = esc_html__( 'We recommend setting memory to at least 64M. For more information, ask your hosting provider.','ziniappbuilder' );

			$result['warning'] = true;
		}

		return $result;
	}

	/**
	 * Get WordPress version.
	 * Retrieve the WordPress version.
	 *
	 * @since 2.0.0
	 * @access public
	 *
	 * @return array {
	 *    Report data.
	 *
	 *    @type string $value WordPress version.
	 * }
	 **/
	public function get_version() {
		return [
			'value' => get_bloginfo( 'version' ),
		];
	}

	/**
	 * Is multisite.
	 * Whether multisite is enabled or not.
	 *
	 * @since 2.0.0
	 * @access public
	 *
	 * @return array {
	 *    Report data.
	 *
	 *    @type string $value Yes if multisite is enabled, No otherwise.
	 * }
	 **/
	public function get_is_multisite() {
		return [
			'value' => is_multisite() ? esc_html__( 'Yes', 'ziniappbuilder' ) : esc_html__( 'No', 'ziniappbuilder' )
		];
	}

	/**
	 * Get site URL.
	 * Retrieve WordPress site URL.
	 *
	 * @since 2.0.0
	 * @access public
	 *
	 * @return array {
	 *    Report data.
	 *
	 *    @type string $value WordPress site URL.
	 * }
	 **/
	public function get_site_url() {
		return [
			'value' => get_site_url(),
		];
	}

	/**
	 * Get home URL.
	 * Retrieve WordPress home URL.
	 *
	 * @since 2.0.0
	 * @access public
	 *
	 * @return array {
	 *    Report data.
	 *
	 *    @type string $value WordPress home URL.
	 * }
	 **/
	public function get_home_url() {
		return [
			'value' => get_home_url(),
		];
	}

	/**
	 * Return WP ABSPATH.
	 *
	 * @since 2.0.4
	 * @access public
	 *
	 * @return array
	 **/
	public function get_abspath() {
		return [
			'value' => ABSPATH
		];
	}

	/**
	 * Get permalink structure.
	 * Retrieve the permalink structure.
	 *
	 * @since 2.0.0
	 * @access public
	 *
	 * @return array {
	 *    Report data.
	 *
	 *    @type string $value WordPress permalink structure.
	 * }
	 **/
	public function get_permalink_structure() {
		global $wp_rewrite;

		$structure = $wp_rewrite->permalink_structure;

		if ( ! $structure ) {
			$structure = esc_html__( 'Plain', 'ziniappbuilder' );
		}

		return [
			'value' => $structure,
		];
	}

	/**
	 * Get site language.
	 * Retrieve the site language.
	 *
	 * @since 2.0.0
	 * @access public
	 *
	 * @return array {
	 *    Report data.
	 *
	 *    @type string $value WordPress site language.
	 * }
	 **/
	public function get_language() {
		return [
			'value' => get_bloginfo( 'language' ),
		];
	}

	/**
	 * Get PHP `max_upload_size`.
	 * Retrieve the value of maximum upload file size defined in `php.ini` configuration file.
	 *
	 * @since 2.0.0
	 * @access public
	 *
	 * @return array {
	 *    Report data.
	 *
	 *    @type string $value Maximum upload file size allowed.
	 * }
	 **/
	public function get_max_upload_size() {
		return [
			'value' => size_format( wp_max_upload_size() ),
		];
	}

	/**
	 * Get WordPress timezone.
	 * Retrieve WordPress timezone.
	 *
	 * @since 2.0.0
	 * @access public
	 *
	 * @return array {
	 *    Report data.
	 *
	 *    @type string $value WordPress timezone.
	 * }
	 **/
	public function get_timezone() {
		$timezone = get_option( 'timezone_string' );
		if ( ! $timezone ) {
			$timezone = get_option( 'gmt_offset' );
		}

		return [
			'value' => $timezone,
		];
	}

	/**
	 * Get WordPress administrator email.
	 * Retrieve WordPress administrator email.
	 *
	 * @since 2.0.0
	 * @access public
	 *
	 * @return array {
	 *    Report data.
	 *
	 *    @type string $value WordPress administrator email.
	 * }
	 **/
	public function get_admin_email() {
		return [
			'value' => get_option( 'admin_email' ),
		];
	}

	/**
	 * Get debug mode.
	 * Whether WordPress debug mode is enabled or not.
	 *
	 * @since 2.0.0
	 * @access public
	 *
	 * @return array {
	 *    Report data.
	 *
	 *    @type string $value Active if debug mode is enabled, Inactive otherwise.
	 * }
	 **/
	public function get_debug_mode() {
		return [
			'value' => WP_DEBUG ? esc_html__('Active', 'ziniappbuilder' ) : esc_html__('Inactive', 'ziniappbuilder' )
		];
	}

	/**
	 * Main WordPressReporter Instance.
	 *
	 * Insures that only one instance of WordPressReporter exists in memory at any one time.
	 *
	 * @static
	 * @return WordPressReporter
	 * @since 2.0.0
	 **/
	public static function get_instance() {
		if ( ! isset( self::$instance ) && ! ( self::$instance instanceof WordPressReporter ) ) {
			self::$instance = new WordPressReporter;
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

} // End Class WordPressReporter.