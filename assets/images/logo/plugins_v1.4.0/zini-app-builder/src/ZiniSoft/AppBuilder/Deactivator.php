<?php

/**
 * Fired during plugin deactivation
 *
 * @link       https://zinisoft.net
 * @since      1.0.0
 *
 * @package    ZAB
 * @subpackage ZAB/includes
 */
namespace ZiniSoft\AppBuilder; 

/** Exit if accessed directly. */
if ( ! defined( 'ABSPATH' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit;
}

/**
 * Fired during plugin deactivation.
 *
 * This class defines all code necessary to run during the plugin's deactivation.
 *
 * @since      1.0.0
 * @package    ZAB
 * @subpackage ZAB/includes
 * @author     ZINISOFT <hi@zinisoft.net>
 */
class Deactivator {

	/**
	 * Short Description. (use period)
	 *
	 * Long Description.
	 *
	 * @since    1.0.0
	 */
	public static function deactivate() {

	}

}
