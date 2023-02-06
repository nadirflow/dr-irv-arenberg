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

/**
 * SINGLETON: Core class used to implement a PostContent.
 *
 * Return Post/Page Content by ID.
 * Many shortcodes do not work in the admin area so we need this trick.
 * We create a frontend page and return content to admin via ajax.
 *
 * @since 1.0.6
 */
final class PostContent {

	/** Plugin version.
	 *
	 * @const VERSION
	 * @since 1.0.6
	 **/
	const VERSION = '1.0.0';

	/**
	 * The one true PostContent.
	 *
	 * @var PostContent
	 * @since 1.0.6
	 **/
	private static $instance;

	/**
	 * Sets up a new plugin instance.
	 *
	 * @since 1.0.6
	 * @access public
	 **/
	private function __construct() {

		/** Get ABSPATH. */
		if ( isset( $_GET['abs_path'] ) ) {

			$abs_path = filter_input( INPUT_GET, 'abs_path' );

			if ( $abs_path === false ) {
				$this->return_content( '' ); // Error.
			}

		} else {
			print ( 'Error: Missing parameters.' ); // Error.
			exit();
		}

		/** Get Post/Page ID. */
		if ( isset( $_GET['post_id'] ) ) {

			$post_id = filter_input( INPUT_GET, 'post_id', FILTER_VALIDATE_INT );

			if ( $post_id === false ) {
				$this->return_content( '' ); // Error.
			}
		} else {
			print ( 'Error: Missing parameters.' ); // Error.
			exit();
		}

		/** Load WordPress. */
		$this->load_wp( $abs_path );

		/** Get post Content. */
		$content = $this->get_content( $post_id );

		/** Return Post Content in JSON. */
		$this->return_content( $content );

	}

	/**
	 * Return Post/Page Content JSON.
	 *
	 * @param $content
	 *
	 * @return string
	 * @since 1.0.6
	 **/
	public function return_content( $content ) {

		header( 'Content-type: application/json;charset=utf-8' );

		if ( function_exists( 'http_response_code' ) ) {
			http_response_code( 200 );
		} else {
			$this->http_response_code( 200 );
		}

		echo json_encode( $content );

		exit;
	}

	/**
	 * Compatibility.
	 * For 4.3.0 <= PHP <= 5.4.0
	 *
	 * @param null $new_code
	 *
	 * @return int|null
	 **/
	public function http_response_code( $new_code = null ) {

		static $code = 200;

		if ( $new_code !== null ) {
			header( 'X-PHP-Response-Code: ' . $new_code, true, $new_code );
			if ( ! headers_sent() ) {
				$code = $new_code;
			}
		}

		return $code;
	}

	/**
	 * Get Post/Page Content.
	 *
	 * @param $post_id
	 *
	 * @return string
	 * @since 1.0.6
	 **/
	public function get_content( $post_id ) {

		/**
		 * Security checks.
		 * GeneralLib work only with public and published content. This is a necessary safety measure.
		 **/
		$status = get_post_status( $post_id );
		if ( 'publish' !== $status ) { return ''; }
		if ( post_password_required( $post_id ) ) { return ''; }

		/** Fix for WPBakery Page Builder. */
		if ( class_exists( '\WPBMap' ) ) {
			/** @noinspection PhpFullyQualifiedNameUsageInspection */
			/** @noinspection PhpUndefinedClassInspection */
			\WPBMap::addAllMappedShortcodes();
		}

		/** Apply other content filters. */
		$content = apply_filters( 'the_content', get_post_field( 'post_content', $post_id ) );

		/** Remove ziniappbuilder player ".zs-ziniappbuilder-wrapper" if we  have one. */
		$content = XMLHelper::get_instance()->remove_ziniappbuilder_player( $content );

		return $content;
	}

	/**
	 * Load WordPress.
	 *
	 * @param $abs_path
	 *
	 * @return void
	 * @since 1.0.6
	 **/
	public function load_wp( $abs_path ) {

		/** @noinspection PhpIncludeInspection */
		require_once( $abs_path . '/wp-load.php' );

		/** @noinspection PhpIncludeInspection */
		require_once( $abs_path . '/wp-blog-header.php' );
	}

	/**
	 * Main PostContent Instance.
	 *
	 * Insures that only one instance of PostContent exists in memory at any one time.
	 *
	 * @static
	 * @return PostContent
	 * @since 1.0.6
	 **/
	public static function get_instance() {
		if ( ! isset( self::$instance ) && ! ( self::$instance instanceof PostContent ) ) {
			self::$instance = new PostContent;
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
	 * @since 1.0.6
	 * @access protected
	 **/
	public function __clone() {
		/** Cloning instances of the class is forbidden. */
		_doing_it_wrong( __FUNCTION__, esc_html__( 'The whole idea of the singleton design pattern is that there is a single object therefore, we don\'t want the object to be cloned.', 'ziniappbuilder' ), self::VERSION );
	}

	/**
	 * Disable unserializing of the class.
	 *
	 * The whole idea of the singleton design pattern is that there is a single
	 * object therefore, we don't want the object to be unserialized.
	 *
	 * @return void
	 * @since 1.0.6
	 * @access protected
	 **/
	public function __wakeup() {
		/** Unserializing instances of the class is forbidden. */
		_doing_it_wrong( __FUNCTION__, esc_html__( 'The whole idea of the singleton design pattern is that there is a single object therefore, we don\'t want the object to be unserialized.', 'ziniappbuilder' ), self::VERSION );
	}

} // End Class PostContent.

/** Run PostContent class. */
PostContent::get_instance();
