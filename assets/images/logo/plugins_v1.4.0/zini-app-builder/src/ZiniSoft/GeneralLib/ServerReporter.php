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

use DateTime;
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
final class ServerReporter {

	/**
	 * The one true ServerReporter.
	 *
	 * @var ServerReporter
	 * @since 2.0.0
	 **/
	private static $instance;

	/**
	 * Sets up a new ServerReporter instance.
	 *
	 * @since 2.0.0
	 * @access public
	 **/
	private function __construct() {

	}

	/**
	 * Get server environment reporter title.
	 *
	 * @since 2.0.0
	 * @access public
	 *
	 * @return string Report title.
	 **/
	public function get_title() {
		return 'Server Environment';
	}

	/**
	 * Retrieve the required fields for the server environment report.
	 *
	 * @since 2.0.0
	 * @access public
	 *
	 * @return array Required report fields with field ID and field label.
	 **/
	public function get_fields() {
		return [
			'os'                    => esc_html__( 'Operating System', 'ziniappbuilder' ),
			'software'              => esc_html__( 'Software','ziniappbuilder' ),
			'mysql_version'         => esc_html__( 'MySQL version','ziniappbuilder' ),
			'php_version'           => esc_html__( 'PHP Version','ziniappbuilder' ),
			'write_permissions'     => esc_html__( 'Write Permissions','ziniappbuilder' ),
			'zip_installed'         => esc_html__( 'ZIP Installed','ziniappbuilder' ),
			'curl_installed'        => esc_html__( 'cURL Installed','ziniappbuilder' ),
			'dom_installed'         => esc_html__( 'DOM Installed','ziniappbuilder' ),
			'xml_installed'         => esc_html__( 'XML Installed','ziniappbuilder' ),
			'bcmath_installed'      => esc_html__( 'BCMath Installed','ziniappbuilder' ),
			'server_time'           => esc_html__( 'Server Time Sync','ziniappbuilder' ),
		];
	}

	/**
	 * Get server operating system.
	 * Retrieve the server operating system.
	 *
	 * @since 2.0.0
	 * @access public
	 *
	 * @return array {
	 *    Report data.
	 *
	 *    @type string $value Server operating system.
	 * }
	 */
	public function get_os() {
		return [
			'value' => PHP_OS,
		];
	}

	/**
	 * Get server software.
	 * Retrieve the server software.
	 *
	 * @since 2.0.0
	 * @access public
	 *
	 * @return array {
	 *    Report data.
	 *
	 *    @type string $value Server software.
	 * }
	 **/
	public function get_software() {
		return [
			'value' => $_SERVER['SERVER_SOFTWARE'],
		];
	}

	/**
	 * Get PHP version.
	 * Retrieve the PHP version.
	 *
	 * @since 2.0.0
	 * @access public
	 *
	 * @return array {
	 *    Report data.
	 *
	 *    @type string $value          PHP version.
	 *    @type string $recommendation Minimum PHP version recommendation.
	 *    @type bool   $warning        Whether to display a warning.
	 * }
	 **/
	public function get_php_version() {
		$result = [
			'value' => PHP_VERSION,
		];

		if ( version_compare( $result['value'], '5.6', '<' ) ) {
			$result['recommendation'] = esc_html__( 'We recommend to use php 5.6 or higher', 'ziniappbuilder' );

			$result['warning'] = true;
		}

		return $result;
	}

	/**
	 * Get ZIP installed.
	 * Whether the ZIP extension is installed.
	 *
	 * @since 2.0.0
	 * @access public
	 *
	 * @return array {
	 *    Report data.
	 *
	 *    @type string $value   Yes if the ZIP extension is installed, NO otherwise.
	 *    @type bool   $warning Whether to display a warning. True if the ZIP extension is installed, False otherwise.
	 * }
	 **/
	public function get_zip_installed() {
		$zip_installed = extension_loaded( 'zip' );

		return [
			'value' => $zip_installed ? '<i class="material-icons mdc-system-yes">check_circle</i>' . esc_html__('YES', 'ziniappbuilder') : '<i class="material-icons mdc-system-no">error</i>' . esc_html__('NO', 'ziniappbuilder' ),
			'warning' => ! $zip_installed,
		];
	}

	/**
	 * Get cURL installed.
	 * Whether the cURL extension is installed.
	 *
	 * @since 2.0.0
	 * @access public
	 *
	 * @return array {
	 *    Report data.
	 *
	 *    @type string $value   YES if the cURL extension is installed, NO otherwise.
	 *    @type bool   $warning Whether to display a warning. True if the cURL extension is installed, False otherwise.
	 * }
	 **/
	public function get_curl_installed() {

		$curl_installed = extension_loaded( 'curl' );

		return [
			'value' => $curl_installed ? '<i class="material-icons mdc-system-yes">check_circle</i>' . esc_html__('YES', 'ziniappbuilder') : '<i class="material-icons mdc-system-no">error</i>' . esc_html__('NO', 'ziniappbuilder' ),
			'warning' => ! $curl_installed,
			'recommendation' => esc_html__('You must enable CURL (Client URL Library) in PHP. Contact the support service of your hosting provider. They know what to do.', 'ziniappbuilder' )
		];
	}

	/**
	 * Get DOM installed.
	 * Whether the DOM extension is installed.
	 *
	 * @since 2.0.0
	 * @access public
	 *
	 * @return array {
	 *    Report data.
	 *
	 *    @type string $value   YES if the DOM extension is installed, NO otherwise.
	 *    @type bool   $warning Whether to display a warning. True if the DOM extension is installed, False otherwise.
	 * }
	 **/
	public function get_dom_installed() {

		$dom_installed = extension_loaded( 'dom' );

		return [
			'value' => $dom_installed ? '<i class="material-icons mdc-system-yes">check_circle</i>' . esc_html__('YES', 'ziniappbuilder') : '<i class="material-icons mdc-system-no">error</i>' . esc_html__('NO', 'ziniappbuilder' ),
			'warning' => ! $dom_installed,
			'recommendation' => esc_html__('You must enable DOM extension (Document Object Model) in PHP. It\'s used for HTML processing. Contact the support service of your hosting provider. They know what to do.', 'ziniappbuilder' )
		];
	}

	/**
	 * Get XML installed.
	 * Whether the XML extension is installed.
	 *
	 * @since 2.0.0
	 * @access public
	 *
	 * @return array {
	 *    Report data.
	 *
	 *    @type string $value   YES if the XML extension is installed, NO otherwise.
	 *    @type bool   $warning Whether to display a warning. True if the XML extension is installed, False otherwise.
	 * }
	 **/
	public function get_xml_installed() {

		$xml_installed = extension_loaded( 'xml' );

		return [
			'value' => $xml_installed ? '<i class="material-icons mdc-system-yes">check_circle</i>' . esc_html__('YES', 'ziniappbuilder') : '<i class="material-icons mdc-system-no">error</i>' . esc_html__('NO', 'ziniappbuilder' ),
			'warning' => ! $xml_installed,
			'recommendation' => esc_html__('You must enable XML extension in PHP. It\'s used for XML processing. Contact the support service of your hosting provider. They know what to do.', 'ziniappbuilder' )
		];
	}

	/**
	 * Get BCMath installed.
	 * Whether the BCMath extension is installed.
	 *
	 * @since 2.0.0
	 * @access public
	 *
	 * @return array {
	 *    Report data.
	 *
	 *    @type string $value   YES if the BCMath extension is installed, NO otherwise.
	 *    @type bool   $warning Whether to display a warning. True if the BCMath extension is installed, False otherwise.
	 * }
	 **/
	public function get_bcmath_installed() {

		$bcmath_installed = extension_loaded( 'bcmath' );

		return [
			'value' => $bcmath_installed ? '<i class="material-icons mdc-system-yes">check_circle</i>' . esc_html__('YES', 'ziniappbuilder') : '<i class="material-icons mdc-system-no">error</i>' . esc_html__('NO', 'ziniappbuilder' ),
			'warning' => ! $bcmath_installed,
			'recommendation' => esc_html__('You must enable BCMath extension (Arbitrary Precision Mathematics) in PHP. Contact the support service of your hosting provider. They know what to do.', 'ziniappbuilder' )
		];
	}

	/**
	 * Get server time and compare it with NTP.
	 *
	 * @since 2.0.4
	 * @access public
	 *
	 **/
	public function get_server_time() {

		/** Get current time from google. */
		$url = 'https://www.google.com/';
		$curl = curl_init();
		curl_setopt( $curl, CURLOPT_URL, $url );
		curl_setopt( $curl, CURLOPT_NOBODY, true );
		curl_setopt( $curl, CURLOPT_RETURNTRANSFER, true );
		curl_setopt( $curl, CURLOPT_HEADER, true );
		curl_setopt( $curl, CURLOPT_SSL_VERIFYPEER, false );
		curl_setopt( $curl, CURLOPT_SSL_VERIFYHOST, 0 );
		$header = curl_exec( $curl );
		$curl_errno = curl_errno( $curl );
		$curl_info = curl_getinfo( $curl );
		curl_close( $curl );

		/** On cURL Error. */
		if ( $curl_errno ) {
			$time_ok = false;
			return [
				'value' => $time_ok ? '<i class="material-icons mdc-system-yes">check_circle</i>' . esc_html__('YES', 'ziniappbuilder') : '<i class="material-icons mdc-system-no">error</i>' . esc_html__('NO', 'ziniappbuilder' ),
				'warning' => ! $time_ok,
				'recommendation' => esc_html__('Failed to check time synchronization on your server. Your server\'s clock must be in sync with network time protocol - NTP.', 'ziniappbuilder' )
			];
		}

		/** Error If cone not 200. */
		if ( 200 !== $curl_info['http_code'] ) {
			$time_ok = false;
			return [
				'value' => $time_ok ? '<i class="material-icons mdc-system-yes">check_circle</i>' . esc_html__('YES', 'ziniappbuilder') : '<i class="material-icons mdc-system-no">error</i>' . esc_html__('NO', 'ziniappbuilder' ),
				'warning' => ! $time_ok,
				'recommendation' => esc_html__('Failed to check time synchronization on your server. Your server\'s clock must be in sync with network time protocol - NTP.', 'ziniappbuilder' )
			];
		}

		/** Convert header to array. */
		$headers = $this->get_headers_from_curl_response( $header );

		$date = '';
		if ( isset( $headers['date'] ) ) {
			$date = $headers['date'];
		}

		$date = DateTime::createFromFormat( 'D, d M Y H:i:s e', $date );

		if ( ! $date ) {
			$time_ok = false;
			return [
				'value' => $time_ok ? '<i class="material-icons mdc-system-yes">check_circle</i>' . esc_html__('YES', 'ziniappbuilder') : '<i class="material-icons mdc-system-no">error</i>' . esc_html__('NO', 'ziniappbuilder' ),
				'warning' => ! $time_ok,
				'recommendation' => esc_html__('Failed to check time synchronization on your server. Your server\'s clock must be in sync with network time protocol - NTP.', 'ziniappbuilder' )
			];
		}

		/** Time from Google. */
		$google_time = $date->format( 'Y-m-d H:i:s e' );

		/** Your Server time in 'GMT' */
		$timezone = date_default_timezone_get();
		date_default_timezone_set( 'GMT' );
		$server_time = date('Y-m-d H:i:s e');
		date_default_timezone_set( $timezone );

		$to_time = strtotime( $google_time );
		$from_time = strtotime( $server_time );
		$diff = abs($to_time - $from_time);
		$diff = (int)$diff;

		/** If time difference more than 120 sec, show warning. */
		if ( $diff > 120 ) {
			$time_ok = false;
		} else {
			$time_ok = true;
		}

		return [
			'value' => $time_ok ? '<i class="material-icons mdc-system-yes">check_circle</i>' . esc_html__('YES', 'ziniappbuilder') : '<i class="material-icons mdc-system-no">error</i>' . esc_html__('NO', 'ziniappbuilder' ) . '<br>Google Time: ' . $google_time . '<br>&nbsp;&nbsp;&nbsp;Local Time: ' . $server_time,
			'warning' => ! $time_ok,
			'recommendation' => esc_html__( ' Your server\'s clock is not in sync with network time protocol - NTP. Contact the support service of your hosting provider. They know what to do.', 'ziniappbuilder' )
		];

	}

	/**
	 * Convert header string to array of header values.
	 * @see https://stackoverflow.com/a/10590242
	 *
	 * @param $header_text string - Header from cURL request.
	 *
	 * @return array
	 * @since 2.0.4
	 * @access private
	 **/
	private function get_headers_from_curl_response( $header_text ) {

		/** Everybody out of the dusk. */
		$header_text = json_encode( $header_text );

		$headers = [];
		foreach ( explode( '\\r\\n', $header_text ) as $i => $line ) {

			/** Skip garbage. */
			if (  strlen( $line ) < 3 ) { continue; }

			if ( $i === 0 ) {
				$headers['http_code'] = $line;
			} else {
				list ( $key, $value ) = explode( ': ', $line );
				$headers[strtolower( $key )] = $value;
			}
		}

		return $headers;
	}

	/**
	 * Get MySQL version.
	 * Retrieve the MySQL version.
	 *
	 * @since 2.0.0
	 * @access public
	 *
	 * @return array {
	 *    Report data.
	 *
	 *    @type string $value MySQL version.
	 * }
	 **/
	public function get_mysql_version() {
		global $wpdb;

		$db_server_version = $wpdb->get_results( "SHOW VARIABLES WHERE `Variable_name` IN ( 'version_comment', 'innodb_version' )", OBJECT_K );

		return [
			'value' => $db_server_version['version_comment']->Value . ' v' . $db_server_version['innodb_version']->Value,
		];
	}

	/**
	 * Get write permissions.
	 * Check whether the required folders has writing permissions.
	 *
	 * @since 2.0.0
	 * @access public
	 *
	 * @return array {
	 *    Report data.
	 *
	 *    @type string $value   Writing permissions status.
	 *    @type bool   $warning Whether to display a warning. True if some required
	 *                          folders don't have writing permissions, False otherwise.
	 * }
	 **/
	public function get_write_permissions() {

		$paths_to_check = [
			ABSPATH => esc_html__('WordPress root directory', 'ziniappbuilder' )
		];

		$write_problems = [];

		$wp_upload_dir = wp_upload_dir();

		if ( $wp_upload_dir['error'] ) {
			$write_problems[] = esc_html__('WordPress root uploads directory', 'ziniappbuilder' );
		}

		$ziniappbuilder_uploads_path = $wp_upload_dir['basedir'] . '/ziniappbuilder';

		if ( is_dir( $ziniappbuilder_uploads_path ) ) {
			$paths_to_check[ $ziniappbuilder_uploads_path ] = esc_html__('GeneralLib uploads directory', 'ziniappbuilder' );
		}

		$htaccess_file = ABSPATH . '/.htaccess';

		if ( file_exists( $htaccess_file ) ) {
			$paths_to_check[ $htaccess_file ] = esc_html__('.htaccess file', 'ziniappbuilder' );
		}

		foreach ( $paths_to_check as $dir => $description ) {

			if ( ! is_writable( $dir ) ) {
				$write_problems[] = $description;
			}
		}

		if ( $write_problems ) {
			$value = '<i class="material-icons mdc-system-no">error</i>' . esc_html__('There are some writing permissions issues with the following directories/files:', 'ziniappbuilder' ) . "<br> &nbsp;&nbsp;&nbsp;&nbsp;– ";

			$value .= implode( "<br> &nbsp;&nbsp;&nbsp;&nbsp;– ", $write_problems );
		} else {
			$value = '<i class="material-icons mdc-system-yes">check_circle</i>' . esc_html__('All right', 'ziniappbuilder' );
		}

		return [
			'value' => $value,
			'warning' => ! ! $write_problems,
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
	 * Main ServerReporter Instance.
	 *
	 * Insures that only one instance of ServerReporter exists in memory at any one time.
	 *
	 * @static
	 * @return ServerReporter
	 * @since 2.0.0
	 **/
	public static function get_instance() {
		if ( ! isset( self::$instance ) && ! ( self::$instance instanceof ServerReporter ) ) {
			self::$instance = new ServerReporter;
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

} // End Class ServerReporter.