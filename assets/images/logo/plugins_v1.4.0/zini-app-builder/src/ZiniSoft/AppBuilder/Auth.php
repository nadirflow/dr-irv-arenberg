<?php

/**
 * The public-facing functionality of the plugin.
 * https://docs.woocommerce.com/wc-apidocs/class-WC_Cart.html
 *
 * Defines the plugin name, version, and two examples hooks for how to
 * enqueue the public-facing stylesheet and JavaScript.
 *
 * @package    ZiniSoft
 * @subpackage ZiniAppBuilder
 * @author     ZINISOFT <hi@zinisoft.net>
 */
namespace ZiniSoft\AppBuilder; 

/** Exit if accessed directly. */
if ( ! defined( 'ABSPATH' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit;
}

class Auth {

	/**
	 * The ID of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string $plugin_name The ID of this plugin.
	 */
	private $plugin_name;

	/**
	 * The version of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string $version The current version of this plugin.
	 */
	private $version;

	/**
	 *
	 * REST API name space
	 *
	 * @var string
	 */
	private $namespace;

	/**
	 * Initialize the class and set its properties.
	 *
	 * @param string $plugin_name The name of the plugin.
	 * @param string $version The version of this plugin.
	 *
	 * @since      1.0.0
	 */
	public function __construct( $plugin_name, $version ) {

		$this->plugin_name = $plugin_name;
		$this->version     = $version;
		$this->namespace   = $plugin_name . '/v' . intval( $version );

	}

	/**
	 * Registers a REST API route
	 *
	 * @since 1.0.0
	 */
	public function add_api_routes() {

		register_rest_route( $this->namespace, 'auto-login', array(
			'methods'             => \WP_REST_Server::READABLE,
			'callback'            => array( $this, 'auto_login' ),
			'permission_callback' => '__return_true',
		) );

	}

	/**
	 *
	 * Set user login
	 *
	 * @param $request
	 */
	public function auto_login( $request ) {

		$theme    = $request->get_param( 'theme' );
		$currency = $request->get_param( 'currency' );
		$cart_key = $request->get_param( 'cart-key' );

		$user_id = get_current_user_id();

		if ( $user_id > 0 ) {
			$user = get_user_by( 'id', $user_id );
			wp_set_current_user( $user_id, $user->user_login );
			wp_set_auth_cookie( $user_id );
		} else {
			wp_logout();
		}

		wp_redirect( wc_get_checkout_url() . "?mobile=1&theme=$theme&currency=$currency&cart-key=$cart_key" );
		exit;
	}

	/**
	 *
	 * Check user logged in
	 *
	 * @param $request
	 *
	 * @return bool
	 * @since 1.0.0
	 */
	public function user_permissions_check( $request ) {
		return true;
	}
}
