<?php

/**
 * Fired during plugin activation
 *
 * @link       https://zinisoft.net
 * @since      1.0.0
 *
 * @package    ZiniSoft
 * @subpackage AppBuilder
 */
namespace ZiniSoft\AppBuilder; 

/** Exit if accessed directly. */
if ( ! defined( 'ABSPATH' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit;
}

/**
 * Fired during plugin activation.
 *
 * This class defines all code necessary to run during the plugin's activation.
 *
 * @since      1.0.0
 * @package    ZAB
 * @subpackage ZAB/includes
 * @author     ZINISOFT <hi@zinisoft.net>
 */
class Activator {

	/**
	 * Active plugin action
	 *
	 * @since    1.1.4
	 */
	public static function activate() {
		// Install database tables.
		self::create_tables();
	}

	/**
	 * Creates database tables which the plugin needs to function.
	 *
	 * @access private
	 * @static
	 * @since  1.1.4
	 * @global $wpdb
	 */
	private static function create_tables() {
		global $wpdb;

		$table_name_templates = $wpdb->prefix . ZINI_APP_BUILDER_TABLE_NAME;
		$table_name_carts     = $wpdb->prefix . ZINI_APP_BUILDER_TABLE_NAME . '_carts';

		$wpdb->hide_errors();

		require_once ABSPATH . 'wp-admin/includes/upgrade.php';

		$collate = '';

		if ( $wpdb->has_cap( 'collation' ) ) {
			$collate = $wpdb->get_charset_collate();
		}

		// Table for cart (add to cart on mobile)
		$table_carts = "CREATE TABLE {$table_name_carts} (
					cart_id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
					blog_id INT NOT NULL,
					cart_key char(42) NOT NULL,
					cart_value longtext NOT NULL,
					cart_expiry BIGINT UNSIGNED NOT NULL,
					PRIMARY KEY (cart_id),
					UNIQUE KEY cart_key (cart_key)
				) $collate;";

		// Table for template
		$table_templates = "CREATE TABLE {$table_name_templates} (
		  id mediumint(9) NOT NULL AUTO_INCREMENT,
		  name VARCHAR(254) NULL DEFAULT 'Template Name',
		  data longtext NULL DEFAULT NULL,
		  settings longtext NULL DEFAULT NULL,
		  status TINYINT NOT NULL DEFAULT '0',
		  date_created DATETIME NOT NULL DEFAULT '0000-00-00 00:00:00',
		  date_updated DATETIME NOT NULL DEFAULT '0000-00-00 00:00:00',
		  PRIMARY KEY (id)
		) $collate;";

		// Execute
		dbDelta( $table_carts );
		dbDelta( $table_templates );
	} // END create_tables()

}
