<?php

namespace ZiniSoft\AppBuilder; 

/** Exit if accessed directly. */
if ( ! defined( 'ABSPATH' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit;
}

/**
 * Session handler class.
 */
class SessionHandler extends \WC_Session {

	/**
	 * Table name for cart data.
	 *
	 * @var string Custom cart table name
	 */
	protected $_table;

	/**
	 * Stores cart expiry.
	 *
	 * @var string cart due to expire timestamp
	 */
	protected $_cart_expiring;

	/**
	 * Stores cart due to expire timestamp.
	 *
	 * @var string cart expiration timestamp
	 */
	protected $_cart_expiration;

	/**
	 * The one true SessionHandler.
	 *
	 * @var SessionHandler
	 * @since 1.0.0
	 **/
    private static $instance;
	/**
	 * Constructor for the session class.
	 */
	public function __construct() {
		global $wpdb;
		$this->_table = $wpdb->prefix . ZINI_APP_BUILDER_TABLE_NAME . '_carts';
	}

	/**
	 * Init hooks and session data.
	 */
	public function init() {

		$this->_cart_expiration = time();

		$customer_id = $this->generate_customer_id();

		if ( ! is_user_logged_in() && isset( $_REQUEST['cart_key'] ) ) {
			$customer_id = $_REQUEST['cart_key'];
		}

		$this->restore_cart( $customer_id );

		add_action( 'shutdown', array( $this, 'save_cart' ), 20 );
		add_action( 'wp_logout', array( $this, 'destroy_cart' ) );

		if ( ! is_user_logged_in() ) {
			add_filter( 'nonce_user_logged_out', array( $this, 'nonce_user_logged_out' ) );
		}
	}

	/**
	 *
	 * Get cart key saved in database
	 *
	 * @return string
	 */
	public function get_cart_key() {
		return $this->_customer_id;
	}

	/**
	 *
	 * Restore cart
	 *
	 * @param $customer_id
	 */
	public function restore_cart( $customer_id ) {
		global $wpdb;

		$this->_customer_id = $customer_id;

		$value = $wpdb->get_var( $wpdb->prepare( "SELECT cart_value FROM $this->_table WHERE cart_key = %s", $customer_id ) );

		$this->_data = maybe_unserialize( $value );

	}

	/**
	 * Delete the cart from the database.
	 *
	 * @access public
	 *
	 * @param string $customer_id Customer ID.
	 *
	 * @global $wpdb
	 */
	public function delete_cart( $customer_id ) {
		global $wpdb;

		// Delete cart from database.
		$wpdb->delete( $this->_table, array( 'cart_key' => $customer_id ) );
	}

	/**
	 * Generate a unique customer ID for guests, or return user ID if logged in.
	 *
	 * Uses Portable PHP password hashing framework to generate a unique cryptographically strong ID.
	 *
	 * @return string
	 */
	public function generate_customer_id() {
		$customer_id = '';

		if ( is_user_logged_in() ) {
			$customer_id = get_current_user_id();
		}

		if ( empty( $customer_id ) ) {
			require_once ABSPATH . 'wp-includes/class-phpass.php';
			$hasher      = new \PasswordHash( 8, false );
			$customer_id = md5( $hasher->get_random_bytes( 32 ) );
		}

		return $customer_id;
	}

	/**
	 * Save data.
	 */
	public function save_cart() {

		global $wpdb;

		if ( $this->_dirty ) {

			$wpdb->query(
				$wpdb->prepare(
					"INSERT INTO {$this->_table} (`cart_key`, `blog_id`, `cart_value`, `cart_expiry`) VALUES (%s, %s, %s, %d)
 					ON DUPLICATE KEY UPDATE `cart_key` = VALUES(`cart_key`), `cart_value` = VALUES(`cart_value`), `cart_expiry` = VALUES(`cart_expiry`)",
					$this->_customer_id,
					get_current_blog_id(),
					maybe_serialize( $this->_data ),
					$this->_cart_expiration
				)
			);

			$this->_dirty = false;
		}
	}

	/**
	 * Destroy all cart data.
	 */
	public function destroy_cart() {
		wc_empty_cart();
		$this->delete_cart( $this->_customer_id );
		$this->_data  = array();
		$this->_dirty = false;
	}

	/**
	 * When a user is logged out, ensure they have a unique nonce by using the customer/session ID.
	 *
	 * @param int $uid User ID.
	 *
	 * @return string
	 */
	public function nonce_user_logged_out( $uid ) {
		return $this->_customer_id ? $this->_customer_id : $uid;
	}

	/**
	 * Main Helper Instance.
	 *
	 * Insures that only one instance of Helper exists in memory at any one time.
	 *
	 * @static
	 * @return SessionHandler
	 * @since 1.0.0
	 **/
	public static function get_instance() {

		if ( ! isset( self::$instance ) && ! ( self::$instance instanceof SessionHandler ) ) {
			self::$instance = new SessionHandler();
		}

		return self::$instance;

	}
}
