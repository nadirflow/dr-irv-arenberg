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

use ZiniSoft\ZiniAppBuilder as ZiniAppBuilder;
use WP_Filesystem_Direct;

/**
 * SINGLETON: Class used to implement work with WordPress filesystem.
 *
 * @since 2.0.0
 * @author Brian Vo (info@zinisoft.net)
 **/
final class Helper {

	/**
	 * The one true Helper.
	 *
	 * @var Helper
	 * @since 1.0.0
	 **/
	private static $instance;

	/**
	 * Sets up a new Helper instance.
	 *
	 * @since 1.0.0
	 * @access public
	 **/
	private function __construct() {

	}

	/**
	 * Remove all stand-alone plugins.
	 *
	 * @since 2.0.0
	 * @access public
	 *
	 * @noinspection PhpIncludeInspection
	 **/
	public function remove_sub_plugins() {

		/** Remove wp-content/plugins/ziniappbuilder/BulkProcess.php file. */
		$BulkProcess = WP_PLUGIN_DIR . '/ziniappbuilder/BulkProcess.php';

		require_once ( ABSPATH . 'wp-admin/includes/class-wp-filesystem-base.php' );
		require_once ( ABSPATH . 'wp-admin/includes/class-wp-filesystem-direct.php' );
		$fileSystemDirect = new WP_Filesystem_Direct( false );

		$fileSystemDirect->delete( $BulkProcess, false, 'f' );

	}

	/**
	 * Remove all ziniappbuilder audio files.
	 *
	 * @since 2.0.0
	 * @access public
	 *
	 **/
	public function remove_audio_files() {

		/** Remove /wp-content/uploads/ziniappbuilder/ folder. */
		$dir = trailingslashit( wp_upload_dir()['basedir'] ) . 'ziniappbuilder';
		$this->remove_directory( $dir );

	}

	/**
	 * Remove directory with all contents.
	 *
	 * @param $dir - Directory path to remove.
	 *
	 * @since 2.0.0
	 * @access public
	 *
	 */
	public function remove_directory( $dir ) {

		require_once ( ABSPATH . 'wp-admin/includes/class-wp-filesystem-base.php' );
		require_once ( ABSPATH . 'wp-admin/includes/class-wp-filesystem-direct.php' );
		$fileSystemDirect = new WP_Filesystem_Direct( false );
		$fileSystemDirect->rmdir( $dir, true );

	}

	/**
	 * Initializes WordPress filesystem.
	 *
	 * @static
	 * @access public
	 * @since 2.0.0
	 * @return object WP_Filesystem
	 **/
	public static function init_filesystem() {

		$credentials = [];

		if ( ! defined( 'FS_METHOD' ) ) {
			define( 'FS_METHOD', 'direct' );
		}

		$method = defined( 'FS_METHOD' ) ? FS_METHOD : false;

		/** FTP */
		if ( 'ftpext' === $method ) {

			/** If defined, set credentials, else set to NULL. */
			$credentials['hostname'] = defined( 'FTP_HOST' ) ? preg_replace( '|\w+://|', '', FTP_HOST ) : null;
			$credentials['username'] = defined( 'FTP_USER' ) ? FTP_USER : null;
			$credentials['password'] = defined( 'FTP_PASS' ) ? FTP_PASS : null;

			/** FTP port. */
			if ( strpos( $credentials['hostname'], ':' ) && null !== $credentials['hostname'] ) {
				list( $credentials['hostname'], $credentials['port'] ) = explode( ':', $credentials['hostname'], 2 );
				if ( ! is_numeric( $credentials['port'] ) ) {
					unset( $credentials['port'] );
				}
			} else {
				unset( $credentials['port'] );
			}

			/** Connection type. */
			if ( ( defined( 'FTP_SSL' ) && FTP_SSL ) && 'ftpext' === $method ) {
				$credentials['connection_type'] = 'ftps';
			} elseif ( ! array_filter( $credentials ) ) {
				$credentials['connection_type'] = null;
			} else {
				$credentials['connection_type'] = 'ftp';
			}
		}

		/** The WordPress filesystem. */
		global $wp_filesystem;

		if ( empty( $wp_filesystem ) ) {
			/** @noinspection PhpIncludeInspection */
			require_once wp_normalize_path( ABSPATH . '/wp-admin/includes/file.php' );
			WP_Filesystem( $credentials );
		}

		return $wp_filesystem;
	}

	/**
	 * Get remote contents.
	 *
	 * @access public
	 * @since 2.0.0
	 * @param  string $url  The URL we're getting our data from.
	 * @return false|string The contents of the remote URL, or false if we can't get it.
	 **/
	public function get_remote( $url ) {

		$args = [
			'timeout'    => 30,
			'user-agent' => 'ziniappbuilder-user-agent',
		];

		$response = wp_remote_get( $url, $args );
		if ( is_array( $response ) ) {
			return $response['body'];
		}

		// TODO: Add a message so that the user knows what happened.
		/** Error while downloading remote file. */
		return false;
	}

	/**
	 * Write content to the destination file.
	 *
	 * @param $destination - The destination path.
	 * @param $content - The content to write in file.
	 *
	 * @return bool Returns true if the process was successful, false otherwise.
	 * @access public
	 * @since 2.0.0
	 **/
	public function write_file( $destination, $content ) {

		/** Content for file is empty. */
		if ( ! $content ) {
			// TODO: Add a message to users for debugging purposes.
			return false;
		}

		/** Build the path. */
		$path = wp_normalize_path( $destination );

		/** Define constants if undefined. */
		if ( ! defined( 'FS_CHMOD_DIR' ) ) {
			define( 'FS_CHMOD_DIR', ( 0755 & ~ umask() ) );
		}

		if ( ! defined( 'FS_CHMOD_FILE' ) ) {
			define( 'FS_CHMOD_FILE', ( 0644 & ~ umask() ) );
		}

		/** Try to put the contents in the file. */
		global $wp_filesystem;

		/** @noinspection PhpUndefinedMethodInspection */
		$wp_filesystem->mkdir( dirname( $path ), FS_CHMOD_DIR ); // Create folder, just in case.

		/** @noinspection PhpUndefinedMethodInspection */
		$result = $wp_filesystem->put_contents( $path, $content, FS_CHMOD_FILE );

		/** We can't write file.  */
		if ( ! $result ) {
			// TODO: Add a message to users for debugging purposes.
			return false;
		}

		return $result;
	}

	/**
	 * Send Action to our remote host.
	 *
	 * @param $action - Action to execute on remote host.
	 * @param $plugin - Plugin slug.
	 * @param $version - Plugin version.
	 *
	 * @since 2.0.0
	 * @access public
	 *
	 **/
	public function send_action( $action, $plugin, $version ) {

		$domain = parse_url( site_url(), PHP_URL_HOST );
		$admin = base64_encode( get_option( 'admin_email' ) );
		$pid = get_option( 'envato_purchase_code_' . EnvatoItem::get_instance()->get_id() );

		$ch = curl_init();

		$url = 'https://upd.zinisoft.net/wp-content/plugins/zs-purchase-validator/src/ZiniSoft/PurchaseValidator/Validate.php?';
		$url .= 'action=' . $action . '&'; // Action.
		$url .= 'plugin=' . $plugin . '&'; // Plugin Name.
		$url .= 'domain=' . $domain . '&'; // Domain Name.
		$url .= 'version=' . $version . '&'; // Plugin version.
		$url .= 'pid=' . $pid . '&'; // Purchase Code.
		$url .= 'admin_e=' . $admin;

		curl_setopt( $ch, CURLOPT_URL, $url );
		curl_setopt( $ch, CURLOPT_RETURNTRANSFER, 1 );

		curl_exec( $ch );

	}

	/**
	 * Main Helper Instance.
	 *
	 * Insures that only one instance of Helper exists in memory at any one time.
	 *
	 * @static
	 * @return Helper
	 * @since 2.0.0
	 **/
	public static function get_instance() {
		if ( ! isset( self::$instance ) && ! ( self::$instance instanceof Helper ) ) {
			self::$instance = new Helper;
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

} // End Class Helper.
