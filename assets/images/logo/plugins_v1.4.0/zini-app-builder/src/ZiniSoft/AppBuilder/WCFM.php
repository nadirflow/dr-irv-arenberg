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

class WCFM {

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

		register_rest_route( $namespace, 'wcfm-report-data', array(
			'methods'             => \WP_REST_Server::READABLE,
			'callback'            => array( $this, 'get_report_data' ),
			'permission_callback' => array( $this, 'user_permissions_check' ),
		) );

		register_rest_route( $namespace, 'wcfm-report-chart', array(
			'methods'             => \WP_REST_Server::READABLE,
			'callback'            => array( $this, 'get_report_chart' ),
			'permission_callback' => array( $this, 'user_permissions_check' ),
		) );

		register_rest_route( $namespace, 'wcfm-profile-settings', array(
			'methods'             => \WP_REST_Server::CREATABLE,
			'callback'            => array( $this, 'wcfmmp_profile_settings' ),
			'permission_callback' => array( $this, 'user_permissions_check' ),
		) );

	}

	public function wcfmmp_profile_settings( $request ) {
		$key     = $request->get_param( 'key' );
		$data    = $request->get_param( 'data' );
		$user_id = get_current_user_id();

		$accept = [ 'wcfmmp_profile_settings', 'store_name', 'wcfmmp_store_name', '_store_description' ];

		if ( in_array( $key, $accept ) || strpos( $key, 'zini_app_builder' ) == 0 ) {
			return update_user_meta( $user_id, $key, $data );
		}

		return new \WP_Error(
			'not_allow_edit',
			__( 'We not allow you edit that info.', "zini-app-builder" ),
			array(
				'status' => 403,
			)
		);
	}

	/**
	 *
	 * Get report for vendors
	 *
	 * @param $request
	 *
	 * @return bool|string
	 * @since    1.0.0
	 */
	public function get_report_data( $request ) {
		global $WCMp, $WCFM, $wpdb;

		$range = $request->get_param( 'range' ) ? $request->get_param( 'range' ) : 'month';

		include_once( $WCFM->plugin_path . 'includes/reports/class-wcfmmarketplace-report-sales-by-date.php' );
		$wcfm_report_sales_by_date = new \WCFM_Marketplace_Report_Sales_By_Date( $range );
		$wcfm_report_sales_by_date->calculate_current_range( $range );

		return $wcfm_report_sales_by_date->get_report_data();
	}

	/**
	 *
	 * Get report for vendors
	 *
	 * @param $request
	 *
	 * @return array
	 */
	public function get_report_chart( $request ) {
		global $wp_locale, $wpdb, $WCFM, $WCFMmp;

		$range = $request->get_param( 'range' ) ? $request->get_param( 'range' ) : 'month';

		include_once( $WCFM->plugin_path . 'includes/reports/class-wcfmmarketplace-report-sales-by-date.php' );
		$wcfm_report_sales_by_date = new \WCFM_Marketplace_Report_Sales_By_Date( $range );
		$wcfm_report_sales_by_date->calculate_current_range( $range );

		$report_data = $wcfm_report_sales_by_date->get_report_data();

		// Admin Fee Mode Commission
		$admin_fee_mode = apply_filters( 'wcfm_is_admin_fee_mode', false );
		//$wcfm_commission_options = get_option( 'wcfm_commission_options', array() );
		//$vendor_commission_for = isset( $wcfm_commission_options['commission_for'] ) ? $wcfm_commission_options['commission_for'] : 'vendor';
		//if( $vendor_commission_for == 'admin' ) $is_admin_fee = true;


		$vendor_id = $WCFMmp->vendor_id; //apply_filters( 'wcfm_current_vendor_id', get_current_user_id() );

		$select = "SELECT GROUP_CONCAT(ID) commission_ids, GROUP_CONCAT(item_id) order_item_ids, COUNT( DISTINCT commission.order_id ) AS count, SUM( commission.quantity ) AS order_item_count, COALESCE( SUM( commission.item_total ), 0 ) AS total_item_total, COALESCE( SUM( commission.item_sub_total ), 0 ) AS total_item_sub_total, COALESCE( SUM( commission.shipping ), 0 ) AS total_shipping, COALESCE( SUM( commission.tax ), 0 ) AS total_tax, COALESCE( SUM( commission.shipping_tax_amount ), 0 ) AS total_shipping_tax_amount, COALESCE( SUM( commission.total_commission ), 0 ) AS total_commission, COALESCE( SUM( commission.refunded_amount ), 0 ) AS total_refund, commission.created AS time";

		$sql = $select;
		$sql .= " FROM {$wpdb->prefix}wcfm_marketplace_orders AS commission";
		$sql .= " WHERE 1=1";
		$sql .= " AND commission.vendor_id = %d";
		//$status = get_wcfm_marketplace_active_withdrwal_order_status_in_comma();
		//$sql .= " AND commission.order_status IN ({$status})";
		$sql .= apply_filters( 'wcfm_order_status_condition', '', 'commission' );
		$sql .= " AND commission.is_trashed != 1";
		$sql = wcfm_query_time_range_filter( $sql, 'created', $wcfm_report_sales_by_date->current_range );

		$sql .= " GROUP BY DATE( commission.created )";

		// Enable big selects for reports
		$wpdb->query( 'SET SESSION SQL_BIG_SELECTS=1' );

		$results = $wpdb->get_results( $wpdb->prepare( $sql, $vendor_id ) );

		// Prepare net sales data
		if ( ! empty( $results ) ) {
			foreach ( $results as $result ) {
				$gross_sales    = 0.00;
				$commission_ids = explode( ",", $result->commission_ids );

				if ( apply_filters( 'wcfmmmp_gross_sales_respect_setting', true ) ) {
					$gross_sales = (float) $WCFMmp->wcfmmp_commission->wcfmmp_get_commission_meta_sum( $commission_ids, 'gross_total' );
				} else {
					$gross_sales = (float) $WCFMmp->wcfmmp_commission->wcfmmp_get_commission_meta_sum( $commission_ids, 'gross_sales_total' );
				}


				/*if( $WCFMmp->wcfmmp_vendor->is_vendor_deduct_discount( $vendor_id ) ) {
					$gross_sales = (float) $result->total_item_total;
				} else {
					$gross_sales = (float) $result->total_item_sub_total;
				}
				if($is_vendor_get_tax = $WCFMmp->wcfmmp_vendor->is_vendor_get_tax( $vendor_id )) {
					$gross_sales += (float) $result->total_tax;
				}
				if($WCFMmp->wcfmmp_vendor->is_vendor_get_shipping( $vendor_id )) {
					$gross_sales += (float) apply_filters( 'wcfmmmp_gross_sales_shipping_cost', $result->total_shipping, $vendor_id );
					if($is_vendor_get_tax) {
						$gross_sales += (float) $result->total_shipping_tax_amount;
					}
				}*/

				// Deduct Refunded Amount
				$gross_sales         -= (float) $result->total_refund;
				$result->gross_sales = $gross_sales;
			}
		}

		// Prepare data for report
		$order_counts = $wcfm_report_sales_by_date->prepare_chart_data( $results, 'time', 'count', $wcfm_report_sales_by_date->chart_interval, $wcfm_report_sales_by_date->start_date, $wcfm_report_sales_by_date->chart_groupby );

		$order_item_counts = $wcfm_report_sales_by_date->prepare_chart_data( $results, 'time', 'order_item_count', $wcfm_report_sales_by_date->chart_interval, $wcfm_report_sales_by_date->start_date, $wcfm_report_sales_by_date->chart_groupby );

		$shipping_amounts = $wcfm_report_sales_by_date->prepare_chart_data( $results, 'time', 'total_shipping', $wcfm_report_sales_by_date->chart_interval, $wcfm_report_sales_by_date->start_date, $wcfm_report_sales_by_date->chart_groupby );

		$tax_amounts = $wcfm_report_sales_by_date->prepare_chart_data( $results, 'time', 'total_tax', $wcfm_report_sales_by_date->chart_interval, $wcfm_report_sales_by_date->start_date, $wcfm_report_sales_by_date->chart_groupby );

		$shipping_tax_amounts = $wcfm_report_sales_by_date->prepare_chart_data( $results, 'time', 'total_shipping_tax_amount', $wcfm_report_sales_by_date->chart_interval, $wcfm_report_sales_by_date->start_date, $wcfm_report_sales_by_date->chart_groupby );

		$total_commission = $wcfm_report_sales_by_date->prepare_chart_data( $results, 'time', 'total_commission', $wcfm_report_sales_by_date->chart_interval, $wcfm_report_sales_by_date->start_date, $wcfm_report_sales_by_date->chart_groupby );

		$total_gross_sales = $wcfm_report_sales_by_date->prepare_chart_data( $results, 'time', 'gross_sales', $wcfm_report_sales_by_date->chart_interval, $wcfm_report_sales_by_date->start_date, $wcfm_report_sales_by_date->chart_groupby );

		$total_refund = $wcfm_report_sales_by_date->prepare_chart_data( $results, 'time', 'total_refund', $wcfm_report_sales_by_date->chart_interval, $wcfm_report_sales_by_date->start_date, $wcfm_report_sales_by_date->chart_groupby );

		$total_earned_commission = array();
		if ( $admin_fee_mode ) {
			foreach ( $total_commission as $order_amount_key => $order_amount_value ) {
				$total_earned_commission[ $order_amount_key ] = $order_amount_value;
				if ( $admin_fee_mode && isset ( $total_gross_sales[ $order_amount_key ] ) && isset ( $total_gross_sales[ $order_amount_key ][1] ) ) {
					$total_earned_commission[ $order_amount_key ][1] = round( ( $total_gross_sales[ $order_amount_key ][1] - $total_earned_commission[ $order_amount_key ][1] ), 2 );
				}
			}
		} else {
			foreach ( $total_commission as $order_amount_key => $order_amount_value ) {
				$total_earned_commission[ $order_amount_key ] = $order_amount_value;
				if ( isset ( $total_gross_sales[ $order_amount_key ] ) && isset ( $total_gross_sales[ $order_amount_key ][1] ) ) {
					$total_earned_commission[ $order_amount_key ][1] = round( $total_earned_commission[ $order_amount_key ][1], 2 );
				}
			}
			//$total_earned_commission = $total_commission;
		}

		// Total Paid Commission
		$select = "SELECT GROUP_CONCAT(ID) commission_ids, GROUP_CONCAT(item_id) order_item_ids, COUNT( DISTINCT commission.order_id ) AS count, SUM( commission.quantity ) AS order_item_count, COALESCE( SUM( commission.item_total ), 0 ) AS total_item_total, COALESCE( SUM( commission.item_sub_total ), 0 ) AS total_item_sub_total, COALESCE( SUM( commission.shipping ), 0 ) AS total_shipping, COALESCE( SUM( commission.tax ), 0 ) AS total_tax, COALESCE( SUM( commission.shipping_tax_amount ), 0 ) AS total_shipping_tax_amount, COALESCE( SUM( commission.total_commission ), 0 ) AS total_commission, COALESCE( SUM( commission.refunded_amount ), 0 ) AS total_refund, commission.commission_paid_date AS time";

		$sql = $select;
		$sql .= " FROM {$wpdb->prefix}wcfm_marketplace_orders AS commission";
		$sql .= " WHERE 1=1";
		$sql .= " AND commission.vendor_id = %d";
		//$status = get_wcfm_marketplace_active_withdrwal_order_status_in_comma();
		//$sql .= " AND commission.order_status IN ({$status})";
		$sql .= apply_filters( 'wcfm_order_status_condition', '', 'commission' );
		$sql .= " AND commission.is_trashed != 1";
		$sql .= " AND ( commission.withdraw_status = 'paid' OR commission.withdraw_status = 'completed' )";
		$sql = wcfm_query_time_range_filter( $sql, 'commission_paid_date', $wcfm_report_sales_by_date->current_range );

		$sql .= " GROUP BY DATE( commission.commission_paid_date )";

		// Enable big selects for reports
		$wpdb->query( 'SET SESSION SQL_BIG_SELECTS=1' );

		$results = $wpdb->get_results( $wpdb->prepare( $sql, $vendor_id ) );

		// Prepare paid net sales data
		if ( ! empty( $results ) ) {
			foreach ( $results as $result ) {
				$paid_gross_sales = 0.00;
				$commission_ids   = explode( ",", $result->commission_ids );
				if ( apply_filters( 'wcfmmmp_gross_sales_respect_setting', true ) ) {
					$paid_gross_sales = (float) $WCFMmp->wcfmmp_commission->wcfmmp_get_commission_meta_sum( $commission_ids, 'gross_total' );
				} else {
					$paid_gross_sales = (float) $WCFMmp->wcfmmp_commission->wcfmmp_get_commission_meta_sum( $commission_ids, 'gross_sales_total' );
				}

				/*if( $WCFMmp->wcfmmp_vendor->is_vendor_deduct_discount( $vendor_id ) ) {
					$paid_gross_sales = (float) $result->total_item_total;
				} else {
					$paid_gross_sales = (float) $result->total_item_sub_total;
				}
				if($is_vendor_get_tax = $WCFMmp->wcfmmp_vendor->is_vendor_get_tax( $vendor_id )) {
					$paid_gross_sales += (float) $result->total_tax;
				}
				if($WCFMmp->wcfmmp_vendor->is_vendor_get_shipping( $vendor_id )) {
					$paid_gross_sales += (float) apply_filters( 'wcfmmmp_gross_sales_shipping_cost', $result->total_shipping, $vendor_id );
					if($is_vendor_get_tax) {
						$paid_gross_sales += (float) $result->total_shipping_tax_amount;
					}
				}*/

				$paid_gross_sales         -= (float) $result->total_refund;
				$result->paid_gross_sales = $paid_gross_sales;
			}
		}

		$paid_gross_sales = $wcfm_report_sales_by_date->prepare_chart_data( $results, 'time', 'paid_gross_sales', $wcfm_report_sales_by_date->chart_interval, $wcfm_report_sales_by_date->start_date, $wcfm_report_sales_by_date->chart_groupby );

		$total_commission = $wcfm_report_sales_by_date->prepare_chart_data( $results, 'time', 'total_commission', $wcfm_report_sales_by_date->chart_interval, $wcfm_report_sales_by_date->start_date, $wcfm_report_sales_by_date->chart_groupby );

		$total_paid_commission = array();
		if ( $admin_fee_mode ) {
			foreach ( $total_commission as $order_amount_key => $order_amount_value ) {
				$total_paid_commission[ $order_amount_key ] = $order_amount_value;
				if ( isset ( $paid_gross_sales[ $order_amount_key ] ) && isset ( $paid_gross_sales[ $order_amount_key ][1] ) ) {
					$total_paid_commission[ $order_amount_key ][1] = round( ( $paid_gross_sales[ $order_amount_key ][1] - $total_paid_commission[ $order_amount_key ][1] ), 2 );
				}
			}
		} else {
			foreach ( $total_commission as $order_amount_key => $order_amount_value ) {
				$total_paid_commission[ $order_amount_key ] = $order_amount_value;
				if ( isset ( $paid_gross_sales[ $order_amount_key ] ) && isset ( $paid_gross_sales[ $order_amount_key ][1] ) ) {
					$total_paid_commission[ $order_amount_key ][1] = round( $total_paid_commission[ $order_amount_key ][1], 2 );
				}
			}
			//$total_paid_commission = $total_commission;
		}
		//$total_paid_commission = $total_commission;

		$chart_data = '{'
		              . '  "order_counts"             : ' . $WCFM->wcfm_prepare_chart_data( $order_counts )
		              . ', "order_item_counts"        : ' . $WCFM->wcfm_prepare_chart_data( $order_item_counts )
		              . ', "tax_amounts"              : ' . $WCFM->wcfm_prepare_chart_data( $tax_amounts )
		              . ', "shipping_amounts"         : ' . $WCFM->wcfm_prepare_chart_data( $shipping_amounts )
		              . ', "total_earned_commission"  : ' . $WCFM->wcfm_prepare_chart_data( $total_earned_commission )
		              . ', "total_paid_commission"    : ' . $WCFM->wcfm_prepare_chart_data( $total_paid_commission )
		              . ', "total_gross_sales"        : ' . $WCFM->wcfm_prepare_chart_data( $total_gross_sales )
		              . ', "total_refund"             : ' . $WCFM->wcfm_prepare_chart_data( $total_refund )
		              . '}';

		return array(
			'chart' => json_decode( $chart_data ),
			'total' => $report_data,
		);
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
		$user = wp_get_current_user();

		return $user->exists();
	}

}
