<?php

/**
 * The public-facing functionality of the plugin.
 * https://docs.woocommerce.com/wc-apidocs/class-WC_Cart.html
 *
 * Defines the plugin name, version, and two examples hooks for how to
 * enqueue the public-facing stylesheet and JavaScript.
 *
 * @package    ZiniAppBuilder
 * @subpackage ZiniAppBuilder/api
 * @author     ZINISOFT <hi@zinisoft.net>
 */
namespace ZiniSoft\AppBuilder; 

/** Exit if accessed directly. */
if ( ! defined( 'ABSPATH' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit;
}

class Cart {

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

		register_rest_route( $this->namespace, 'cart', array(
			array(
				'methods'             => \WP_REST_Server::READABLE,
				'callback'            => array( $this, 'get_cart' ),
				'permission_callback' => array( $this, 'user_permissions_check' ),
			),
			array(
				'methods'             => \WP_REST_Server::CREATABLE,
				'callback'            => array( $this, 'add_to_cart' ),
				'permission_callback' => array( $this, 'user_permissions_check' ),
			)
		) );

		register_rest_route( $this->namespace, 'update-shipping', array(
			'methods'             => \WP_REST_Server::CREATABLE,
			'callback'            => array( $this, 'update_shipping' ),
			'permission_callback' => array( $this, 'user_permissions_check' ),
		) );

		register_rest_route( $this->namespace, 'update-order-review', array(
			'methods'             => \WP_REST_Server::CREATABLE,
			'callback'            => array( $this, 'update_order_review' ),
			'permission_callback' => array( $this, 'user_permissions_check' ),
		) );

		register_rest_route( $this->namespace, 'checkout', array(
			'methods'             => \WP_REST_Server::CREATABLE,
			'callback'            => array( $this, 'checkout' ),
			'permission_callback' => array( $this, 'user_permissions_check' ),
		) );

		register_rest_route( $this->namespace, 'cart-total', array(
			'methods'             => \WP_REST_Server::READABLE,
			'callback'            => array( $this, 'get_total' ),
			'permission_callback' => array( $this, 'user_permissions_check' ),
		) );

		register_rest_route( $this->namespace, 'shipping-methods', array(
			'methods'             => \WP_REST_Server::READABLE,
			'callback'            => array( $this, 'shipping_methods' ),
			'permission_callback' => array( $this, 'user_permissions_check' ),
		) );

		register_rest_route( $this->namespace, 'set-quantity', array(
			'methods'             => \WP_REST_Server::CREATABLE,
			'callback'            => array( $this, 'set_quantity' ),
			'permission_callback' => array( $this, 'user_permissions_check' ),
		) );

		register_rest_route( $this->namespace, 'remove-cart-item', array(
			'methods'             => \WP_REST_Server::CREATABLE,
			'callback'            => array( $this, 'remove_cart_item' ),
			'permission_callback' => array( $this, 'user_permissions_check' ),
		) );

		register_rest_route( $this->namespace, 'add-discount', array(
			'methods'             => \WP_REST_Server::CREATABLE,
			'callback'            => array( $this, 'add_discount' ),
			'permission_callback' => array( $this, 'user_permissions_check' ),
		) );

		register_rest_route( $this->namespace, 'remove-coupon', array(
			'methods'             => \WP_REST_Server::CREATABLE,
			'callback'            => array( $this, 'remove_coupon' ),
			'permission_callback' => array( $this, 'user_permissions_check' ),
		) );

		register_rest_route( $this->namespace, 'analytic', array(
			'methods'             => \WP_REST_Server::CREATABLE,
			'callback'            => array( $this, 'analytic' ),
			'permission_callback' => '__return_true',
		) );

	}

	public function analytic( $request ) {
		$headers = zini_app_builder_headers();

		$data = array(
			"authStatus"        => false,
			"WooCommerce"       => false,
			"wcfm"              => class_exists( 'WCFM' ),
			"jwtAuthKey"        => defined( 'ZINI_APP_BUILDER_JWT_SECRET_KEY' ),
			"googleMapApiKey"   => defined( 'ZINI_APP_BUILDER_GOOGLE_API_KEY' ),
			"facebookAppId"     => defined( 'ZINI_APP_BUILDER_FB_APP_ID' ),
			"facebookAppSecret" => defined( 'ZINI_APP_BUILDER_FB_APP_SECRET' ),
			"oneSignalId"       => defined( 'ZINI_APP_BUILDER_ONESIGNAL_APP_ID' ),
			"oneSignalApiKey"   => defined( 'ZINI_APP_BUILDER_ONESIGNAL_API_KEY' ),
		);

		if ( isset( $headers['Authorization'] ) && $headers['Authorization'] == "Bearer test" ) {
			$data['authStatus'] = true;
		}

		if ( class_exists( 'WooCommerce' ) ) {
			$data['WooCommerce'] = true;
		}

		return $data;
	}

	/**
	 * Restore cart for web
	 */
	public function load_cart_action() {

		global $wpdb;

		$table = $wpdb->prefix . ZINI_APP_BUILDER_TABLE_NAME . '_carts';

		if ( ! isset( $_REQUEST['cart-key'] ) ) {
			return;
		}

		if ( \WC()->is_rest_api_request() ) {
			return;
		}

		wc_nocache_headers();

		$cart_key = trim( wp_unslash( $_REQUEST['cart-key'] ) );

		$value = $wpdb->get_var( $wpdb->prepare( "SELECT cart_value FROM $table WHERE cart_key = %s", $cart_key ) );

		$cart_data = maybe_unserialize( $value );

		// Clear old cart
		\WC()->cart->empty_cart();

		// Set new cart data
		\WC()->session->set( 'cart', maybe_unserialize( $cart_data['cart'] ) );
		\WC()->session->set( 'cart_totals', maybe_unserialize( $cart_data['cart_totals'] ) );
		\WC()->session->set( 'applied_coupons', maybe_unserialize( $cart_data['applied_coupons'] ) );
		\WC()->session->set( 'coupon_discount_totals', maybe_unserialize( $cart_data['coupon_discount_totals'] ) );
		\WC()->session->set( 'coupon_discount_tax_totals', maybe_unserialize( $cart_data['coupon_discount_tax_totals'] ) );
		\WC()->session->set( 'removed_cart_contents', maybe_unserialize( $cart_data['removed_cart_contents'] ) );
		\WC()->session->set( 'customer', maybe_unserialize( $cart_data['customer'] ) );

		if ( ! session_id() ) {
			session_start();
		}
		$_SESSION['cart-key'] = $cart_key;

	}

	/**
	 *
	 * Handle action after user go to checkout success page
	 *
	 * @param $order_id
	 *
	 */
	public function handle_checkout_success( $order_id ) {
		if ( ! session_id() ) {
			session_start();
		}

		if ( ! is_null( $_SESSION['cart-key'] ) ) {
			global $wpdb;

			// Delete cart from database.
			$wpdb->delete( $wpdb->prefix . ZINI_APP_BUILDER_TABLE_NAME . '_carts', array( 'cart_key' => $_SESSION['cart-key'] ) );

			// unset cart key in session
			unset( $_SESSION['cart-key'] );
		}
	}

	public function zini_app_builder_woocommerce_persistent_cart_enabled() {
		return false;
	}

	/**
	 * @throws Exception
	 * @since    1.0.0
	 */
	public function zini_app_builder_pre_car_rest_api() {

		if ( defined( 'WC_VERSION' ) && version_compare( WC_VERSION, '3.6.0', '>=' ) && \WC()->is_rest_api_request() ) {
			require_once( WC_ABSPATH . 'includes/wc-cart-functions.php' );
			require_once( WC_ABSPATH . 'includes/wc-notice-functions.php' );

			// Disable cookie authentication REST check and only if site is secure.
			if ( is_ssl() ) {
				remove_filter( 'rest_authentication_errors', 'rest_cookie_check_errors', 100 );
			}

			if ( is_null( \WC()->session ) ) {
				\WC()->session = SessionHandler::get_instance();
				\WC()->session->init();
			}

			/**
			 * Choose the location save data user
			 */
			if ( is_null( \WC()->customer ) ) {

				$customer_id = strval( get_current_user_id() );

				// If the ID is not ZERO, then the user is logged in.
//				if ( $customer_id > 0 ) {
//					\WC()->customer = new WC_Customer( $customer_id ); // Loads from database.
//				} else {
//					\WC()->customer = new WC_Customer( $customer_id, true ); // Loads from session.
//				}

				\WC()->customer = new \WC_Customer( $customer_id, true ); // Loads from session

				add_action( 'shutdown', array( \WC()->customer, 'save' ), 10 );
			}

			// Init cart if null
			if ( is_null( \WC()->cart ) ) {
				\WC()->cart = new \WC_Cart();
			}
		}
	}

	/**
	 * Get list cart
	 * @return array
	 */
	public function get_cart() {
//		\WC()->cart->calculate_totals();
//		\WC()->cart->calculate_shipping();

		$items = \WC()->cart->get_cart();

		foreach ( $items as $cart_item_key => $cart_item ) {
			$_product  = $cart_item['data'];
			$vendor_id = '';

			if ( function_exists( 'wcfm_get_vendor_id_by_post' ) ) {
				$vendor_id = wcfm_get_vendor_id_by_post( $_product->get_id() );
			}

			$image = wp_get_attachment_image_src( get_post_thumbnail_id( $_product->get_id() ), 'single-post-thumbnail' );
			if ( $_product && $_product->exists() && $cart_item['quantity'] > 0 ) {

				if ( \WC()->cart->display_prices_including_tax() ) {
					$product_price = wc_get_price_including_tax( $_product );
				} else {
					$product_price = wc_get_price_excluding_tax( $_product );
				}

				$items[ $cart_item_key ]['thumbnail']            = $_product->get_image();
				$items[ $cart_item_key ]['thumb']                = $image[0];
				$items[ $cart_item_key ]['is_sold_individually'] = $_product->is_sold_individually();
				$items[ $cart_item_key ]['name']                 = $_product->get_name();
				$items[ $cart_item_key ]['price']                = $product_price;
				$items[ $cart_item_key ]['price_html']           = \WC()->cart->get_product_price( $_product );
				$items[ $cart_item_key ]['vendor_id']            = $vendor_id;
				$items[ $cart_item_key ]['store']                = $vendor_id ? $store_user = get_user_meta( $vendor_id, 'wcfmmp_profile_settings', true ) : null;
			}

		}

		return array(
			'items'   => $items,
			'totals'  => \WC()->cart->get_totals(),
			'coupons' => \WC()->cart->get_applied_coupons(),
		);
	}

	/**
	 *
	 * Method Add to cart
	 *
	 * @param $request
	 *
	 * @return array|WP_Error
	 * @since    1.0.0
	 */
	public function add_to_cart( $request ) {

		try {
			$product_id     = $request->get_param( 'product_id' );
			$quantity       = $request->get_param( 'quantity' );
			$variation_id   = $request->get_param( 'variation_id' );
			$variation      = $request->get_param( 'variation' );
			$cart_item_data = $request->get_param( 'cart_item_data' );

			$product_addons = array(
				'quantity'    => $quantity,
				'add-to-cart' => $product_id,
			);

			// Prepare data validate add-ons
			if ( ! is_null( $cart_item_data['addons'] ) ) {
				foreach ( $cart_item_data['addons'] as $addon ) {
					$product_addons[ 'addon-' . $addon['field_name'] ][] = $addon['value'];
				}
			}

			$passed_validation = apply_filters( 'woocommerce_add_to_cart_validation', true, $product_id, $quantity, $product_addons );

			if ( $passed_validation ) {

				$cart_item_key = \WC()->cart->add_to_cart( $product_id, $quantity, $variation_id, $variation, $cart_item_data );

			}

			if ( ! $passed_validation || ! $cart_item_key ) {
				//if validation failed or add to cart failed, return response from woocommerce
				return new \WP_Error( 'add_to_cart', htmlspecialchars_decode( strip_tags( wc_print_notices( true ) ) ), array(
					'status' => 403,
				) );
			}

			return array(
				"cart_key" => \WC()->session->get_cart_key(),
			);

		} catch ( \Exception $e ) {
			//do something when exception is thrown
			return new \WP_Error( 'add_to_cart', $e->getMessage(), array(
				'status' => 403,
			) );
		}
	}

	/**
	 *
	 * Update shipping method
	 *
	 * @param $request
	 *
	 * @return array
	 * @since    1.0.0
	 */
	public function update_shipping( $request ) {

		$posted_shipping_methods = $request->get_param( 'shipping_method' ) ? wc_clean( wp_unslash( $request->get_param( 'shipping_method' ) ) ) : array();
		$chosen_shipping_methods = \WC()->session->get( 'chosen_shipping_methods' );

		if ( is_array( $posted_shipping_methods ) ) {
			foreach ( $posted_shipping_methods as $i => $value ) {
				$chosen_shipping_methods[ $i ] = $value;
			}
		}

		\WC()->session->set( 'chosen_shipping_methods', $chosen_shipping_methods );

		\WC()->customer->save();

		// Calculate shipping before totals. This will ensure any shipping methods that affect things like taxes are chosen prior to final totals being calculated. Ref: #22708.
		\WC()->cart->calculate_shipping();
		\WC()->cart->calculate_totals();

		// Get messages if reload checkout is not true.
		$reload_checkout = isset( \WC()->session->reload_checkout ) ? true : false;

		unset( \WC()->session->refresh_totals, \WC()->session->reload_checkout );

		return array(
			'messages' => $reload_checkout,
		);

	}

	public function update_order_review( $request ) {
		global $WCFM, $WCFMmp;

//		check_ajax_referer( 'update-order-review', 'security' );

		wc_maybe_define_constant( 'WOOCOMMERCE_CHECKOUT', true );

		if ( \WC()->cart->is_empty() && ! is_customize_preview() && apply_filters( 'woocommerce_checkout_update_order_review_expired', true ) ) {
			return new \WP_Error( 404, __( 'Sorry, your session has expired.', "zini-app-builder" ) );
		}

//		do_action( 'woocommerce_checkout_update_order_review', $request->get_param( 'post_data') ) ? wp_unslash( $request->get_param( 'post_data') ) : '' ); // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized

		$chosen_shipping_methods = \WC()->session->get( 'chosen_shipping_methods' );
		$posted_shipping_methods = $request->get_param( 'shipping_method' ) ? wc_clean( wp_unslash( $request->get_param( 'shipping_method' ) ) ) : array();

		if ( is_array( $posted_shipping_methods ) ) {
			foreach ( $posted_shipping_methods as $i => $value ) {
				$chosen_shipping_methods[ $i ] = $value;
			}
		}

		\WC()->session->set( 'chosen_shipping_methods', $chosen_shipping_methods );
		\WC()->session->set( 'chosen_payment_method', empty( $request->get_param( 'shipping_method' ) ) ? '' : wc_clean( wp_unslash( $request->get_param( 'shipping_method' ) ) ) );
		\WC()->customer->set_props(
			array(
				'billing_country'   => $request->get_param( 'country' ) ? wc_clean( wp_unslash( $request->get_param( 'country' ) ) ) : null,
				'billing_state'     => $request->get_param( 'state' ) ? wc_clean( wp_unslash( $request->get_param( 'state' ) ) ) : null,
				'billing_postcode'  => $request->get_param( 'postcode' ) ? wc_clean( wp_unslash( $request->get_param( 'postcode' ) ) ) : null,
				'billing_city'      => $request->get_param( 'city' ) ? wc_clean( wp_unslash( $request->get_param( 'city' ) ) ) : null,
				'billing_address_1' => $request->get_param( 'address' ) ? wc_clean( wp_unslash( $request->get_param( 'address' ) ) ) : null,
				'billing_address_2' => $request->get_param( 'address_2' ) ? wc_clean( wp_unslash( $request->get_param( 'address_2' ) ) ) : null,
				'billing_company'   => $request->get_param( 'company' ) ? wc_clean( wp_unslash( $request->get_param( 'company' ) ) ) : null,
//				'wcfmmp_user_location'   => $request->get_param( 'wcfmmp_user_location' ) ? wc_clean( wp_unslash( $request->get_param( 'wcfmmp_user_location' ) ) ) : null,
//				'wcfmmp_user_location'   => "12 khuat duy tien thanh xuan hanoi"
			)
		);

		if ( wc_ship_to_billing_address_only() ) {
			\WC()->customer->set_props(
				array(
					'shipping_country'   => $request->get_param( 'country' ) ? wc_clean( wp_unslash( $request->get_param( 'country' ) ) ) : null,
					'shipping_state'     => $request->get_param( 'state' ) ? wc_clean( wp_unslash( $request->get_param( 'state' ) ) ) : null,
					'shipping_postcode'  => $request->get_param( 'postcode' ) ? wc_clean( wp_unslash( $request->get_param( 'postcode' ) ) ) : null,
					'shipping_city'      => $request->get_param( 'city' ) ? wc_clean( wp_unslash( $request->get_param( 'city' ) ) ) : null,
					'shipping_address_1' => $request->get_param( 'address' ) ? wc_clean( wp_unslash( $request->get_param( 'address' ) ) ) : null,
					'shipping_address_2' => $request->get_param( 'address_2' ) ? wc_clean( wp_unslash( $request->get_param( 'address_2' ) ) ) : null,
					'shipping_company'   => $request->get_param( 'company' ) ? wc_clean( wp_unslash( $request->get_param( 'company' ) ) ) : null,
				)
			);
		} else {
			\WC()->customer->set_props(
				array(
					'shipping_country'   => $request->get_param( 's_country' ) ? wc_clean( wp_unslash( $request->get_param( 's_country' ) ) ) : null,
					'shipping_state'     => $request->get_param( 's_state' ) ? wc_clean( wp_unslash( $request->get_param( 's_state' ) ) ) : null,
					'shipping_postcode'  => $request->get_param( 's_postcode' ) ? wc_clean( wp_unslash( $request->get_param( 's_postcode' ) ) ) : null,
					'shipping_city'      => $request->get_param( 's_city' ) ? wc_clean( wp_unslash( $request->get_param( 's_city' ) ) ) : null,
					'shipping_address_1' => $request->get_param( 's_address' ) ? wc_clean( wp_unslash( $request->get_param( 's_address' ) ) ) : null,
					'shipping_address_2' => $request->get_param( 's_address_2' ) ? wc_clean( wp_unslash( $request->get_param( 's_address_2' ) ) ) : null,
					'shipping_company'   => $request->get_param( 's_company' ) ? wc_clean( wp_unslash( $request->get_param( 's_company' ) ) ) : null,
				)
			);
		}

		if ( $request->get_param( 'has_full_address' ) && wc_string_to_bool( wc_clean( wp_unslash( $request->get_param( 'has_full_address' ) ) ) ) ) {
			\WC()->customer->set_calculated_shipping( true );
		} else {
			\WC()->customer->set_calculated_shipping( false );
		}

//		if ( apply_filters( 'wcfmmp_is_allow_checkout_user_location', true ) ) {
//			if ( $request->get_param( 'wcfmmp_user_location' ) ) {
//				\WC()->customer->set_props( array( 'wcfmmp_user_location' => sanitize_text_field( $request->get_param( 'wcfmmp_user_location' ) ) ) );
//				\WC()->session->set( '_wcfmmp_user_location', sanitize_text_field( $request->get_param( 'wcfmmp_user_location' ) ) );
//			}
//			if ( $request->get_param( 'wcfmmp_user_location_lat' ) ) {
//				\WC()->session->set( '_wcfmmp_user_location_lat', sanitize_text_field( $request->get_param( 'wcfmmp_user_location_lat' ) ) );
//			}
//
//			if ( $request->get_param( 'wcfmmp_user_location_lng' ) ) {
//				\WC()->session->set( '_wcfmmp_user_location_lng', sanitize_text_field( $request->get_param( 'wcfmmp_user_location_lng' ) ) );
//			}
//		}

		\WC()->customer->save();

		// Calculate shipping before totals. This will ensure any shipping methods that affect things like taxes are chosen prior to final totals being calculated. Ref: #22708.
		\WC()->cart->calculate_shipping();
		\WC()->cart->calculate_totals();

		// Get order review fragment.
		ob_start();
		woocommerce_order_review();
		$woocommerce_order_review = ob_get_clean();

		// Get checkout payment fragment.
		ob_start();
		woocommerce_checkout_payment();
		$woocommerce_checkout_payment = ob_get_clean();

		// Get messages if reload checkout is not true.
		$reload_checkout = isset( \WC()->session->reload_checkout ) ? true : false;
		if ( ! $reload_checkout ) {
			$messages = wc_print_notices( true );
		} else {
			$messages = '';
		}

		unset( \WC()->session->refresh_totals, \WC()->session->reload_checkout );

		wp_send_json(
			array(
				'result'   => empty( $messages ) ? 'success' : 'failure',
				'messages' => $messages,
				'reload'   => $reload_checkout,
				'nonce'    => wp_create_nonce( 'woocommerce-process_checkout' ),
				'totals'   => \WC()->cart->get_totals(),
			)
		);
	}

	/**
	 *
	 * Checkout progress
	 *
	 * @throws Exception
	 */
	public function checkout() {
		wc_maybe_define_constant( 'WOOCOMMERCE_CHECKOUT', true );
		wc_maybe_define_constant( 'DOING_AJAX', true );
		\WC()->checkout()->process_checkout();
		wp_die( 0 );
	}

	/**
	 * Get shipping methods.
	 *
	 * @since    1.0.0
	 */
	public function shipping_methods() {

		// Calculate shipping before totals. This will ensure any shipping methods that affect things like taxes are chosen prior to final totals being calculated. Ref: #22708.
		\WC()->cart->calculate_shipping();
		\WC()->cart->calculate_totals();

		$packages = \WC()->shipping()->get_packages();

		$first   = true;
		$methods = array();

		foreach ( $packages as $i => $package ) {
			$chosen_method = isset( \WC()->session->chosen_shipping_methods[ $i ] ) ? \WC()->session->chosen_shipping_methods[ $i ] : '';
			$product_names = array();

			if ( count( $packages ) > 1 ) {
				foreach ( $package['contents'] as $item_id => $values ) {
					$product_names[ $item_id ] = $values['data']->get_name() . ' &times;' . $values['quantity'];
				}
				$product_names = apply_filters( 'woocommerce_shipping_package_details_array', $product_names, $package );
			}

			$available_methods = array();

			foreach ( $package['rates'] as $i => $value ) {
				$available_methods[] = array(
					'label' => wc_cart_totals_shipping_method_label( $value ),
					'id'    => $i,
				);
			}

			$methods[] = array(
				'package'                  => $package,
				'available_methods'        => $available_methods,
				'show_package_details'     => count( $packages ) > 1,
				'show_shipping_calculator' => is_cart() && apply_filters( 'woocommerce_shipping_show_shipping_calculator', $first, $i, $package ),
				'package_details'          => implode( ', ', $product_names ),
				/* translators: %d: shipping package number */
				'package_name'             => apply_filters( 'woocommerce_shipping_package_name', ( ( $i + 1 ) > 1 ) ? sprintf( _x( 'Shipping %d', 'shipping packages', 'woocommerce' ), ( $i + 1 ) ) : _x( 'Shipping', 'shipping packages', 'woocommerce' ), $i, $package ),
				'index'                    => $i,
				'chosen_method'            => $chosen_method,
				'formatted_destination'    => \WC()->countries->get_formatted_address( $package['destination'], ', ' ),
				'has_calculated_shipping'  => \WC()->customer->has_calculated_shipping(),
				'store'                    => $store = get_user_meta( $package['vendor_id'], 'wcfmmp_profile_settings', true ),
			);

			$first = false;
		}

		return $methods;

	}

	/**
	 * Get total cart
	 * @return array
	 * @since    1.0.0
	 */
	public function get_total() {
		return \WC()->cart->get_totals();
	}

	/**
	 *
	 * Set cart item quantity
	 *
	 * @param $request
	 *
	 * @return Array | WP_Error
	 * @since    1.0.0
	 */
	public function set_quantity( $request ) {

		$cart_item_key = $request->get_param( 'cart_item_key' ) ? wc_clean( wp_unslash( $request->get_param( 'cart_item_key' ) ) ) : '';
		$quantity      = $request->get_param( 'quantity' ) ? wc_clean( wp_unslash( $request->get_param( 'quantity' ) ) ) : 1;

		if ( ! $cart_item_key ) {
			return new \WP_Error(
				'set_quantity_error',
				__( 'Cart item key not exist.', "zini-app-builder" )
			);
		}

		if ( 0 === $quantity || $quantity < 0 ) {
			return new \WP_Error(
				'set_quantity_error',
				__( 'The quantity not validate', "zini-app-builder" )
			);
		}

		try {
			return array(
				"success" => \WC()->cart->set_quantity( $cart_item_key, $quantity ),
			);
		} catch ( \Exception $e ) {
			return new \WP_Error(
				'set_quantity_error',
				$e->getMessage()
			);
		}
	}

	/**
	 *
	 * Remove cart item
	 *
	 * @param $request
	 *
	 * @return Array |WP_Error
	 * @since    1.0.0
	 */
	public function remove_cart_item( $request ) {

		$cart_item_key = $request->get_param( 'cart_item_key' ) ? wc_clean( wp_unslash( $request->get_param( 'cart_item_key' ) ) ) : '';

		if ( ! $cart_item_key ) {
			return new \WP_Error(
				'remove_cart_item',
				__( 'Cart item key not exist.', "zini-app-builder" )
			);
		}

		\WC()->cart->set_applied_coupons();

		try {
			return array(
				"success" => \WC()->cart->remove_cart_item( $cart_item_key )
			);
		} catch ( \Exception $e ) {
			return new \WP_Error(
				'set_quantity_error',
				$e->getMessage()
			);
		}
	}

	/**
	 *
	 * Add coupon code
	 *
	 * @param $request
	 *
	 * @return Array |WP_Error
	 * @author hi
	 * @since 1.0.0
	 */
	public function add_discount( $request ) {
		$coupon_code = $request->get_param( 'coupon_code' ) ? wc_format_coupon_code( wp_unslash( $request->get_param( 'coupon_code' ) ) ) : "";

		if ( ! $coupon_code ) {
			return new \WP_Error(
				'add_discount',
				__( 'Coupon not exist.', "zini-app-builder" )
			);
		}

		try {
			return array(
				"success" => \WC()->cart->add_discount( $coupon_code ),
			);
		} catch ( \Exception $e ) {
			return new \WP_Error(
				'set_quantity_error',
				$e->getMessage()
			);
		}

	}

	/**
	 *
	 * Remove coupon code
	 *
	 * @param $request
	 *
	 * @return Array |WP_Error
	 * @author hi
	 * @since 1.0.0
	 */
	public function remove_coupon( $request ) {
		$coupon_code = $request->get_param( 'coupon_code' ) ? wc_format_coupon_code( wp_unslash( $request->get_param( 'coupon_code' ) ) ) : "";

		if ( ! $coupon_code ) {
			return new \WP_Error(
				'remove_coupon',
				__( 'Coupon not exist.', "zini-app-builder" )
			);
		}

		try {
			$status = \WC()->cart->remove_coupon( $coupon_code );
			\WC()->cart->calculate_totals();

			return array(
				"success" => $status,
			);
		} catch ( \Exception $e ) {
			return new \WP_Error(
				'set_quantity_error',
				$e->getMessage()
			);
		}

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
