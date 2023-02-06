<?php

/**
 * The public-facing functionality of the plugin.
 *
 * @link       https://zinisoft.net
 * @since      1.0.0
 *
 * @package    ZiniAppBuilder
 * @subpackage ZiniAppBuilder/cart
 */

/**
 * The public-facing functionality of the plugin.
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

class Vendor {

	public $google_map_api = 'https://maps.googleapis.com/maps/api';

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

	}

	/**
	 * Registers a REST API route
	 *
	 * @since 1.0.0
	 */
	public function add_api_routes() {
		$namespace = $this->plugin_name . '/v' . intval( $this->version );

		register_rest_route( $namespace, 'vendors', array(
			array(
				'methods'             => \WP_REST_Server::READABLE,
				'callback'            => array( $this, 'vendors' ),
				'permission_callback' => '__return_true',
			),
			array(
				'methods'             => \WP_REST_Server::CREATABLE,
				'callback'            => array( $this, 'vendors' ),
				'permission_callback' => '__return_true',
			)
		) );

		register_rest_route( $namespace, 'directions', array(
			'methods'             => \WP_REST_Server::READABLE,
			'callback'            => array( $this, 'directions' ),
			'permission_callback' => '__return_true',
		) );

		register_rest_route( $namespace, 'vendor' . '/(?P<id>[\d]+)', array(
			'methods'             => \WP_REST_Server::READABLE,
			'callback'            => array( $this, 'vendor' ),
			'permission_callback' => '__return_true',
		) );

		register_rest_route( $namespace, 'delivery-boy-delivery-stat', array(
			'methods'             => \WP_REST_Server::READABLE,
			'callback'            => array( $this, 'delivery_boy_delivery_stat' ),
			'permission_callback' => '__return_true',
		) );

		register_rest_route( $namespace, 'messages-mark-read', array(
			'methods'             => \WP_REST_Server::CREATABLE,
			'callback'            => array( $this, 'messages_mark_read' ),
			'permission_callback' => '__return_true',
		) );

		register_rest_route( $namespace, 'messages-delete', array(
			'methods'             => \WP_REST_Server::CREATABLE,
			'callback'            => array( $this, 'messages_delete' ),
			'permission_callback' => '__return_true',
		) );

		register_rest_route( $namespace, 'mark-order-delivered', array(
			'methods'             => \WP_REST_Server::CREATABLE,
			'callback'            => array( $this, 'mark_order_delivered' ),
			'permission_callback' => '__return_true',
		) );

	}

	/**
	 * Get vendors
	 * @return array
	 */
	public function vendors( $request ) {
		global $WCFM, $WCFMmp, $wpdb, $wcfmmp_radius_lat, $wcfmmp_radius_lng, $wcfmmp_radius_range;

		$search_term     = $request->get_param( 'search_term' ) ? sanitize_text_field( $request->get_param( 'search_term' ) ) : '';
		$search_category = $request->get_param( 'wcfmmp_store_category' ) ? sanitize_text_field( $request->get_param( 'wcfmmp_store_category' ) ) : '';
		$paged           = $request->get_param( 'paged' ) ? absint( $request->get_param( 'paged' ) ) : 1;
		$per_page        = $request->get_param( 'per_page' ) ? absint( $request->get_param( 'per_page' ) ) : 10;
		$includes        = $request->get_param( 'includes' ) ? sanitize_text_field( $request->get_param( 'includes' ) ) : '';
		$excludes        = $request->get_param( 'excludes' ) ? sanitize_text_field( $request->get_param( 'excludes' ) ) : '';
		$has_product     = $request->get_param( 'has_product' ) ? sanitize_text_field( $request->get_param( 'has_product' ) ) : '';
		$units           = $request->get_param( 'units' ) ? sanitize_text_field( $request->get_param( 'units' ) ) : 'metric';

		$search_data = array();

		$length = absint( $per_page );
		$offset = ( $paged - 1 ) * $length;

		$search_data['excludes'] = $excludes;

		if ( $includes ) {
			$includes = explode( ",", $includes );
		} else {
			$includes = array();
		}

		$wcfmmp_radius_lat   = $request->get_param( 'wcfmmp_radius_lat' );
		$wcfmmp_radius_lng   = $request->get_param( 'wcfmmp_radius_lng' );
		$wcfmmp_radius_range = $request->get_param( 'wcfmmp_radius_range' );

		if ( $wcfmmp_radius_lat && $wcfmmp_radius_lng && $wcfmmp_radius_range ) {
			$search_data['wcfmmp_radius_lat']   = $wcfmmp_radius_lat;
			$search_data['wcfmmp_radius_lng']   = $wcfmmp_radius_lng;
			$search_data['wcfmmp_radius_range'] = $wcfmmp_radius_range;
		}

		$stores = $WCFMmp->wcfmmp_vendor->wcfmmp_search_vendor_list( true, $offset, $length, $search_term, $search_category, $search_data, $has_product, $includes );

		$vendor_stores = [];
		$origins       = [];

		foreach ( $stores as $key => $value ) {

			$store     = get_user_meta( $key, 'wcfmmp_profile_settings', true );
			$origins[] = $store['store_lat'] . ',' . $store['store_lng'];

			// Gravatar image
			$gravatar_url = $store['gravatar'] ? wp_get_attachment_url( $store['gravatar'] ) : '';

			// List Banner URL
			$list_banner_url = $store['list_banner'] ? wp_get_attachment_url( $store['list_banner'] ) : '';

			// Banner URL
			$banner_url = $store['banner'] ? wp_get_attachment_url( $store['banner'] ) : '';

			// Mobile Banner URL
			$mobile_banner_url = $store['mobile_banner'] ? wp_get_attachment_url( $store['mobile_banner'] ) : '';

			$shipping_methods = \WCFMmp_Shipping_Zone::get_shipping_methods( 0, $key );

			$store_user = wcfmmp_get_store( $key );

			$vendor_stores[] = array_merge( $store, array(
				'id'                  => $key,
				'gravatar'            => $gravatar_url,
				'list_banner_url'     => $list_banner_url,
				'banner_url'          => $banner_url,
				'mobile_banner_url'   => $mobile_banner_url,
				'avg_review_rating'   => $store_user->get_avg_review_rating(),
				'total_review_rating' => $store_user->get_total_review_rating(),
				'total_review_count'  => $store_user->get_total_review_count(),
				'rating'              => array(
					'rating' => $store_user->get_total_review_rating(),
					'count'  => $store_user->get_total_review_count(),
					'avg'    => $store_user->get_avg_review_rating(),
				),
				'shipping_methods'    => array_column( $shipping_methods, 'id' ),
			) );
		}

		$origin_string       = implode( '|', $origins );
		$destinations_string = "$wcfmmp_radius_lat,$wcfmmp_radius_lng";
		$key                 = ZINI_APP_BUILDER_GOOGLE_API_KEY;

		$url = "$this->google_map_api/distancematrix/json?units=$units&origins=$origin_string&destinations=$destinations_string&key=$key";

		$distance_matrix = json_decode( zini_app_builder_request( 'GET', $url ) )->rows;

		foreach ( $vendor_stores as $key => $value ) {
			$vendor_stores[ $key ] = array_merge( $value, array(
				'matrix' => $distance_matrix[ $key ]->elements,
			) );
		}

		return $vendor_stores;
	}

	/**
	 * @param $request
	 *
	 * @return array
	 * @since    1.0.0
	 */
	public function vendor( $request ) {

		$params = $request->get_params();

		$id                = $params['id'];
		$wcfmmp_radius_lat = $params['wcfmmp_radius_lat'];
		$wcfmmp_radius_lng = $params['wcfmmp_radius_lng'];

		$store      = get_user_meta( $id, 'wcfmmp_profile_settings', true );
		$store_user = wcfmmp_get_store( $id );

		// Gravatar image
		$gravatar_url = $store['gravatar'] ? wp_get_attachment_url( $store['gravatar'] ) : '';

		// List Banner URL
		$list_banner_url = $store['list_banner'] ? wp_get_attachment_url( $store['list_banner'] ) : '';

		// Banner URL
		$banner_url = $store['banner'] ? wp_get_attachment_url( $store['banner'] ) : '';

		// Mobile Banner URL
		$mobile_banner_url = $store['mobile_banner'] ? wp_get_attachment_url( $store['mobile_banner'] ) : '';

		$shipping_methods = WCFMmp_Shipping_Zone::get_shipping_methods( 0, $id );

		$distance_matrix = array();

		if ( $wcfmmp_radius_lat && $wcfmmp_radius_lng && $store['store_lat'] && $store['store_lng'] ) {
			$origin_string       = $store['store_lat'] . ',' . $store['store_lng'];
			$destinations_string = "$wcfmmp_radius_lat,$wcfmmp_radius_lng";
			$key                 = ZINI_APP_BUILDER_GOOGLE_API_KEY;
			$distance_matrix     = zini_app_builder_distance_matrix( $origin_string, $destinations_string, $key );
		}

		return array_merge( $store, array(
			'id'                  => $id,
			'gravatar'            => $gravatar_url,
			'list_banner_url'     => $list_banner_url,
			'banner_url'          => $banner_url,
			'mobile_banner_url'   => $mobile_banner_url,
			'avg_review_rating'   => $store_user->get_avg_review_rating(),
			'total_review_rating' => $store_user->get_total_review_rating(),
			'total_review_count'  => $store_user->get_total_review_count(),
			'shipping_methods'    => array_column( $shipping_methods, 'id' ),
			'matrix'              => $distance_matrix[0]->elements,
		) );

	}

	/**
	 *
	 * Filter products by vendors
	 *
	 * @param $args
	 * @param $wp_query
	 *
	 * @return mixed
	 */
	public function mbd_product_list_by_vendor( $args, $wp_query ) {

		global $wpdb;

		if ( ! empty ( $_GET['vendor_id'] ) ) {
			$vendor_id     = $_GET['vendor_id'];
			$args['where'] .= " AND $wpdb->posts.post_author = $vendor_id";
		}

		return $args;
	}

	/**
	 *
	 * Product distance
	 *
	 * @param $args
	 * @param $wp_query
	 *
	 * @return mixed
	 */
	public function mbd_product_distance( $args, $wp_query ) {

		global $wpdb;

		if ( ! empty( $_GET['lat'] ) && ! empty( $_GET['lng'] ) ) {

			$lat      = $_GET['lat'];
			$lng      = $_GET['lng'];
			$distance = ! empty( $_GET['radius'] ) ? esc_sql( $_GET['radius'] ) : 50;

			$earth_radius = 6371;
			$units        = 'km';
			$degree       = 111.045;

			// add units to locations data.
			$args['fields'] .= ", '{$units}' AS units";

			$args['fields'] .= ", ROUND( {$earth_radius} * acos( cos( radians( {$lat} ) ) * cos( radians( gmw_locations.latitude ) ) * cos( radians( gmw_locations.longitude ) - radians( {$lng} ) ) + sin( radians( {$lat} ) ) * sin( radians( gmw_locations.latitude ) ) ),1 ) AS distance";
			$args['join']   .= " INNER JOIN {$wpdb->base_prefix}gmw_locations gmw_locations ON $wpdb->posts.ID = gmw_locations.object_id ";

			// calculate the between point.
			$bet_lat1 = $lat - ( $distance / $degree );
			$bet_lat2 = $lat + ( $distance / $degree );
			$bet_lng1 = $lng - ( $distance / ( $degree * cos( deg2rad( $lat ) ) ) );
			$bet_lng2 = $lng + ( $distance / ( $degree * cos( deg2rad( $lat ) ) ) );

			$args['where'] .= " AND gmw_locations.object_type = 'post'";
			$args['where'] .= " AND gmw_locations.latitude BETWEEN {$bet_lat1} AND {$bet_lat2}";
			//$args['where'] .= " AND gmw_locations.longitude BETWEEN {$bet_lng1} AND {$bet_lng2} ";

			// filter locations based on the distance.
			$args['having'] = "HAVING distance <= {$distance} OR distance IS NULL";

			$args['orderby'] .= ', distance ASC';

		}

		return $args;
	}

	/**
	 * @param $args
	 * @param $wp_query
	 *
	 * @return mixed
	 * @since    1.0.0
	 */
	public function mbd_product_list_geo_location_filter_post_clauses( $args, $wp_query ) {
		global $WCFM, $WCFMmp, $wpdb, $wcfmmp_radius_lat, $wcfmmp_radius_lng, $wcfmmp_radius_range;

		$wcfm_google_map_api = isset( $WCFMmp->wcfmmp_marketplace_options['wcfm_google_map_api'] ) ? $WCFMmp->wcfmmp_marketplace_options['wcfm_google_map_api'] : '';
		$wcfm_map_lib        = isset( $WCFMmp->wcfmmp_marketplace_options['wcfm_map_lib'] ) ? $WCFMmp->wcfmmp_marketplace_options['wcfm_map_lib'] : '';
		if ( ! $wcfm_map_lib && $wcfm_google_map_api ) {
			$wcfm_map_lib = 'google';
		} elseif ( ! $wcfm_map_lib && ! $wcfm_google_map_api ) {
			$wcfm_map_lib = 'leaftlet';
		}
		if ( ( $wcfm_map_lib == 'google' ) && empty( $wcfm_google_map_api ) ) {
			return $args;
		}

		$enable_wcfm_product_radius = isset( $WCFMmp->wcfmmp_marketplace_options['enable_wcfm_product_radius'] ) ? $WCFMmp->wcfmmp_marketplace_options['enable_wcfm_product_radius'] : 'no';
		if ( $enable_wcfm_product_radius !== 'yes' ) {
			return $args;
		}

		if ( ( ! isset( $_GET['radius_range'] ) && ! isset( $_GET['radius_lat'] ) && ! isset( $_GET['radius_lng'] ) ) ) {
			return $args;
		}

		$max_radius_to_search = isset( $WCFMmp->wcfmmp_marketplace_options['max_radius_to_search'] ) ? $WCFMmp->wcfmmp_marketplace_options['max_radius_to_search'] : '100';

		$radius_addr  = isset( $_GET['radius_addr'] ) ? wc_clean( $_GET['radius_addr'] ) : '';
		$radius_range = isset( $_GET['radius_range'] ) ? wc_clean( $_GET['radius_range'] ) : ( absint( apply_filters( 'wcfmmp_radius_filter_max_distance', $max_radius_to_search ) ) / 10 );
		$radius_lat   = isset( $_GET['radius_lat'] ) ? wc_clean( $_GET['radius_lat'] ) : '';
		$radius_lng   = isset( $_GET['radius_lng'] ) ? wc_clean( $_GET['radius_lng'] ) : '';

		if ( ! empty( $radius_lat ) && ! empty( $radius_lng ) && ! empty( $radius_range ) ) {
			$wcfmmp_radius_lat   = $radius_lat;
			$wcfmmp_radius_lng   = $radius_lng;
			$wcfmmp_radius_range = $radius_range;

			$user_args = array(
				'role__in'    => apply_filters( 'wcfmmp_allwoed_vendor_user_roles', array( 'wcfm_vendor' ) ),
				'count_total' => false,
				'fields'      => array( 'ID', 'display_name' ),
			);
			$all_users = get_users( $user_args );

			$available_vendors = array();
			if ( ! empty( $all_users ) ) {
				foreach ( $all_users as $all_user ) {
					$available_vendors[ $all_user->ID ] = $all_user->ID;
				}
			} else {
				$available_vendors = array( 0 );
			}

			$args['where'] .= " AND $wpdb->posts.post_author in (" . implode( ',', $available_vendors ) . ")";
		}

		return $args;
	}

	/**
	 *
	 * Get directions for vendors
	 *
	 * @param $request
	 *
	 * @return bool|string
	 * @since    1.0.0
	 */
	public function directions( $request ) {
		$origin      = $request->get_param( 'origin' );
		$destination = $request->get_param( 'destination' );
		$key         = ZINI_APP_BUILDER_GOOGLE_API_KEY;

		$url = "$this->google_map_api/directions/json?origin=$origin&destination=$destination&key=$key";

		return json_decode( zini_app_builder_request( 'GET', $url ) );
	}

	/**
	 *
	 * Get delivery boy delivery stat
	 *
	 * @param $request
	 *
	 * @return array
	 */
	public function delivery_boy_delivery_stat( $request ) {
		$delivery_boy_id = $request->get_param( 'delivery_boy_id' );

		return array(
			"delivered" => function_exists( 'wcfm_get_delivery_boy_delivery_stat' ) ? wcfm_get_delivery_boy_delivery_stat( $delivery_boy_id, 'delivered' ) : 0,
			"pending"   => function_exists( 'wcfm_get_delivery_boy_delivery_stat' ) ? wcfm_get_delivery_boy_delivery_stat( $delivery_boy_id, 'pending' ) : 0,
		);
	}

	/**
	 *
	 * Send notification for user
	 *
	 * @param $order_id
	 * @param $order_item_id
	 * @param $wcfm_tracking_data
	 * @param $product_id
	 * @param $wcfm_delivery_boy
	 * @param $wcfm_messages
	 */
	public function delivery_boy_assigned_notification( $order_id, $order_item_id, $wcfm_tracking_data, $product_id, $wcfm_delivery_boy, $wcfm_messages ) {
		$content = array(
			"en" => strip_tags( $wcfm_messages )
		);

		$fields = array(
			'app_id'   => ZINI_APP_BUILDER_ONESIGNAL_APP_ID_DELIVERY_APP,
			'filters'  => array(
				array(
					"field"    => "tag",
					"key"      => "user_id",
					"relation" => "=",
					"value"    => $wcfm_delivery_boy
				)
			),
			'data'     => array( "user_id" => $wcfm_delivery_boy ),
			'contents' => $content
		);

		zini_app_builder_send_notification( $fields, ZINI_APP_BUILDER_ONESIGNAL_API_KEY_DELIVERY_APP );
	}

	function custom_after_wcfm_notification( $author_id, $message_to, $author_is_admin, $author_is_vendor, $wcfm_messages, $message_type ) {
		$message_to = absint( $message_to );
		if ( $message_to ) {
			$content = array(
				"en" => strip_tags( $wcfm_messages )
			);

			$fields = array(
				'app_id'   => ZINI_APP_BUILDER_ONESIGNAL_APP_ID_STORE_MANAGER_APP,
				'filters'  => array(
					array(
						"field"    => "tag",
						"key"      => "user_id",
						"relation" => "=",
						"value"    => $message_to
					)
				),
				'data'     => array( "user_id" => $message_to ),
				'contents' => $content
			);

			zini_app_builder_send_notification( $fields, ZINI_APP_BUILDER_ONESIGNAL_API_KEY_STORE_MANAGER_APP );
		}
	}


	/**
	 * Send a Notification event when an order status is changed.
	 *
	 * @param int $id Order id.
	 * @param string $previous_status the old WooCommerce order status.
	 * @param string $next_status the new WooCommerce order status.
	 */
	public function notification_order_status_changed( $id, $previous_status, $next_status ) {

		$order = wc_get_order( $id );

		$content = array(
			"en" => sprintf( __( 'Order %s changed to %s' ), $order->get_order_number(), $next_status ),
		);

		$fields = array(
			'app_id'   => ZINI_APP_BUILDER_ONESIGNAL_APP_ID,
			'filters'  => array(
				array(
					"field"    => "tag",
					"key"      => "user_id",
					"relation" => "=",
					"value"    => $order->get_user_id(),
				)
			),
			'data'     => array( "user_id" => $order->get_user_id() ),
			'contents' => $content
		);

		zini_app_builder_send_notification( $fields, ZINI_APP_BUILDER_ONESIGNAL_API_KEY );
	}

	/**
	 * Handle Message mark as Read
	 *
	 * @since 1.0.2
	 */
	function messages_mark_read( $request ) {
		global $WCFM, $wpdb, $_POST;

		$messageid  = absint( $request->get_param( 'message_id' ) );
		$message_to = get_current_user_id();
		$todate     = date( 'Y-m-d H:i:s' );

		$wcfm_read_message = "INSERT into {$wpdb->prefix}wcfm_messages_modifier 
																(`message`, `is_read`, `read_by`, `read_on`)
																VALUES
																({$messageid}, 1, {$message_to}, '{$todate}')";
		$result            = $wpdb->query( $wcfm_read_message );

		if ( wcfm_is_vendor() || ( function_exists( 'wcfm_is_delivery_boy' ) && wcfm_is_delivery_boy() ) || ( function_exists( 'wcfm_is_affiliate' ) && wcfm_is_affiliate() ) ) {
			$cache_key = $this->cache_group . '-message-' . $message_to;
		} else {
			$cache_key = $this->cache_group . '-message-0';
		}
		delete_transient( $cache_key );

		return $result;
	}

	/**
	 * Handle delete message
	 *
	 * @since 1.0.2
	 */
	function messages_delete( $request ) {
		global $WCFM, $wpdb, $_POST;

		$messageid = absint( $request->get_param( 'message_id' ) );
		$result    = $wpdb->query( "DELETE FROM {$wpdb->prefix}wcfm_messages WHERE `ID` = {$messageid}" );
		$result2   = $wpdb->query( "DELETE FROM {$wpdb->prefix}wcfm_messages_modifier WHERE `message` = {$messageid}" );

		if ( wcfm_is_vendor() || ( function_exists( 'wcfm_is_delivery_boy' ) && wcfm_is_delivery_boy() ) || ( function_exists( 'wcfm_is_affiliate' ) && wcfm_is_affiliate() ) ) {
			$message_to = apply_filters( 'wcfm_message_author', get_current_user_id() );
			$cache_key  = $this->cache_group . '-message-' . $message_to;
		} else {
			$cache_key = $this->cache_group . '-message-0';
		}
		delete_transient( $cache_key );

		return $result;
	}

	/**
	 * Handle Message mark order delivered
	 *
	 * @since 1.0.2
	 */
	public function mark_order_delivered( $request ) {
		global $WCFM, $WCFMd, $wpdb;

		$delivery_ids = $request->get_param( 'delivery_id' );

		$delivery_ids = explode( ",", $delivery_ids );

		$delivered_not_notified = false;

		if ( $delivery_ids ) {
			foreach ( $delivery_ids as $delivery_id ) {
				$sql              = "SELECT * FROM `{$wpdb->prefix}wcfm_delivery_orders`";
				$sql              .= " WHERE 1=1";
				$sql              .= " AND ID = {$delivery_id}";
				$delivery_details = $wpdb->get_results( $sql );

				if ( ! empty( $delivery_details ) ) {
					foreach ( $delivery_details as $delivery_detail ) {

						// Update Delivery Order Status Update
						$wpdb->update( "{$wpdb->prefix}wcfm_delivery_orders", array(
							'delivery_status' => 'delivered',
							'delivery_date'   => date( 'Y-m-d H:i:s', current_time( 'timestamp', 0 ) )
						), array( 'ID' => $delivery_id ), array( '%s', '%s' ), array( '%d' ) );

						$order                  = wc_get_order( $delivery_detail->order_id );
						$wcfm_delivery_boy_user = get_userdata( $delivery_detail->delivery_boy );

						if ( apply_filters( 'wcfm_is_show_marketplace_itemwise_orders', true ) ) {
							// Admin Notification
							$wcfm_messages = sprintf( __( 'Order <b>%s</b> item <b>%s</b> delivered by <b>%s</b>.', 'wc-frontend-manager-delivery' ), '#<a class="wcfm_dashboard_item_title" target="_blank" href="' . get_wcfm_view_order_url( $delivery_detail->order_id ) . '">' . $order->get_order_number() . '</a>', get_the_title( $delivery_detail->product_id ), '<a class="wcfm_dashboard_item_title" target="_blank" href="' . get_wcfm_delivery_boys_stats_url( $delivery_detail->delivery_boy ) . '">' . $wcfm_delivery_boy_user->first_name . ' ' . $wcfm_delivery_boy_user->last_name . '</a>' );
							$WCFM->wcfm_notification->wcfm_send_direct_message( - 2, 0, 0, 0, $wcfm_messages, 'delivery_complete' );

							// Vendor Notification
							if ( $delivery_detail->vendor_id ) {
								$WCFM->wcfm_notification->wcfm_send_direct_message( - 1, $delivery_detail->vendor_id, 1, 0, $wcfm_messages, 'delivery_complete' );
							}

							// Order Note
							$wcfm_messages = sprintf( __( 'Order <b>%s</b> item <b>%s</b> delivered by <b>%s</b>.', 'wc-frontend-manager-delivery' ), '#<span class="wcfm_dashboard_item_title">' . $order->get_order_number() . '</span>', get_the_title( $delivery_detail->product_id ), $wcfm_delivery_boy_user->first_name . ' ' . $wcfm_delivery_boy_user->last_name );
							$comment_id    = $order->add_order_note( $wcfm_messages, apply_filters( 'wcfm_is_allow_delivery_note_to_customer', '1' ) );
						} elseif ( ! $delivered_not_notified ) {
							// Admin Notification
							$wcfm_messages = sprintf( __( 'Order <b>%s</b> delivered by <b>%s</b>.', 'wc-frontend-manager-delivery' ), '#<a class="wcfm_dashboard_item_title" target="_blank" href="' . get_wcfm_view_order_url( $delivery_detail->order_id ) . '">' . $order->get_order_number() . '</a>', '<a class="wcfm_dashboard_item_title" target="_blank" href="' . get_wcfm_delivery_boys_stats_url( $delivery_detail->delivery_boy ) . '">' . $wcfm_delivery_boy_user->first_name . ' ' . $wcfm_delivery_boy_user->last_name . '</a>' );
							$WCFM->wcfm_notification->wcfm_send_direct_message( - 2, 0, 0, 0, $wcfm_messages, 'delivery_complete' );

							// Vendor Notification
							if ( $delivery_detail->vendor_id ) {
								$WCFM->wcfm_notification->wcfm_send_direct_message( - 1, $delivery_detail->vendor_id, 1, 0, $wcfm_messages, 'delivery_complete' );
							}

							// Order Note
							$wcfm_messages = sprintf( __( 'Order <b>%s</b> delivered by <b>%s</b>.', 'wc-frontend-manager-delivery' ), '#<span class="wcfm_dashboard_item_title">' . $order->get_order_number() . '</span>', $wcfm_delivery_boy_user->first_name . ' ' . $wcfm_delivery_boy_user->last_name );
							$comment_id    = $order->add_order_note( $wcfm_messages, apply_filters( 'wcfm_is_allow_delivery_note_to_customer', '1' ) );

							$delivered_not_notified = true;
						}
					}

					//if( defined('WCFM_REST_API_CALL') ) {
					//return '{"status": true, "message": "' . __( 'Delivery status updated.', 'wc-frontend-manager-delivery' ) . '"}';
					//}
				}
			}
		}

		return array(
			"status"  => true,
			"message" => __( 'Delivery status updated.', 'wc-frontend-manager-delivery' )
		);

	}
}
