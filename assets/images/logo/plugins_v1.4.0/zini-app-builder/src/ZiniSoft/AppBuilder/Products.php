<?php

/**
 * The public-facing functionality of the plugin.
 *
 * @link       https://zinisoft.net
 * @since      1.0.0
 *
 * @package    ZiniAppBuilder
 * @subpackage ZiniAppBuilder/products
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

class Products {

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

		$product = new \WC_REST_Products_Controller();

		register_rest_route( 'wc/v3', 'min-max-prices', array(
			'methods'             => \WP_REST_Server::READABLE,
			'callback'            => array( $this, 'get_min_max_prices' ),
			'permission_callback' => array( $product, 'get_items_permissions_check' ),
		) );
	}

	public function get_min_max_prices( $request ) {
		global $wpdb;

		$tax_query = array();

		if ( isset( $request['category'] ) && $request['category'] ) {
			$tax_query[] = array(
				'relation' => 'AND',
				array(
					'taxonomy' => 'product_cat',
					'field'    => 'cat_id',
					'terms'    => array( $request['category'] ),
				),
			);
		}

		$meta_query = array();

		$meta_query = new \WP_Meta_Query( $meta_query );
		$tax_query  = new \WP_Tax_Query( $tax_query );

		$meta_query_sql = $meta_query->get_sql( 'post', $wpdb->posts, 'ID' );
		$tax_query_sql  = $tax_query->get_sql( $wpdb->posts, 'ID' );

		$sql = "
			SELECT min( min_price ) as min_price, MAX( max_price ) as max_price
			FROM {$wpdb->wc_product_meta_lookup}
			WHERE product_id IN (
				SELECT ID FROM {$wpdb->posts}
				" . $tax_query_sql['join'] . $meta_query_sql['join'] . "
				WHERE {$wpdb->posts}.post_type IN ('" . implode( "','", array_map( 'esc_sql', apply_filters( 'woocommerce_price_filter_post_type', array( 'product' ) ) ) ) . "')
				AND {$wpdb->posts}.post_status = 'publish'
				" . $tax_query_sql['where'] . $meta_query_sql['where'] . '
			)';

		$sql = apply_filters( 'woocommerce_price_filter_sql', $sql, $meta_query_sql, $tax_query_sql );

		return $wpdb->get_row( $sql );
	}

	public function woocommerce_rest_product_object_query( $args, $request ) {
		$tax_query = array();

		if ( isset( $request['attrs'] ) && $request['attrs'] ) {
			$attrs = $request['attrs'];
			foreach ( $attrs as $attr ) {
				$tax_query[] = array(
					'taxonomy' => $attr['taxonomy'],
					'field'    => $attr['field'],
					'terms'    => $attr['terms'],
				);
			}
			$args['tax_query'] = $tax_query;
		}

		return $args;
	}

	/**
	 * Pre product attribute
	 *
	 * @param $response
	 * @param $item
	 * @param $request
	 *
	 * @return mixed
	 * @since    1.0.0
	 */
	public function custom_woocommerce_rest_prepare_product_attribute( $response, $item, $request ) {

		$taxonomy = wc_attribute_taxonomy_name( $item->attribute_name );

		$options = get_terms( array(
			'taxonomy'   => $taxonomy,
			'hide_empty' => false,
		) );

		$terms = $this->term_counts( $request, $taxonomy );

		foreach ( $options as $key => $term ) {
			if ( $item->attribute_type == 'color' ) {
				$term->value = sanitize_hex_color( get_term_meta( $term->term_id, 'product_attribute_color',
					true ) );
			}

			if ( $item->attribute_type == 'image' ) {
				$attachment_id = absint( get_term_meta( $term->term_id, 'product_attribute_image', true ) );
				$image_size    = function_exists( 'woo_variation_swatches' ) ? woo_variation_swatches()->get_option( 'attribute_image_size' ) : 'thumbnail';

				$term->value = wp_get_attachment_image_url( $attachment_id,
					apply_filters( 'wvs_product_attribute_image_size', $image_size ) );
			}

			$options[ $key ] = $term;
		}

		$_terms = array();
		foreach ( $terms as $key => $term ) {
			$i = array_search( $term['term_count_id'], array_column( $options, 'term_id' ) );
			if ( $i >= 0 ) {
				$option        = $options[ $i ];
				$option->count = intval( $term['term_count'] );
				$_terms[]      = $option;
			}
		}
		$response->data['options'] = $options;
		$response->data['terms']   = $_terms;

		return $response;
	}

	public function term_counts( $request, $taxonomy ) {
		global $wpdb;

		$term_ids = wp_list_pluck( get_terms( array(
			'taxonomy'   => $taxonomy,
			'hide_empty' => true,
		) ), 'term_id' );

		$tax_query  = array();
		$meta_query = array();

		if ( isset( $request['attrs'] ) && $request['attrs'] ) {
			$attrs = $request['attrs'];
			foreach ( $attrs as $attr ) {
//				foreach ( $attr['terms'] as $term ) {
//					$tax_query[] = array(
//						'taxonomy' => $attr['taxonomy'],
//						'field'    => $attr['field'],
//						'terms'    => $term,
//					);
//				}
				$tax_query[] = array(
					'taxonomy' => $attr['taxonomy'],
					'field'    => $attr['field'],
					'terms'    => $attr['terms'],
				);
			}
		}

		$meta_query     = new \WP_Meta_Query( $meta_query );
		$tax_query      = new \WP_Tax_Query( $tax_query );
		$meta_query_sql = $meta_query->get_sql( 'post', $wpdb->posts, 'ID' );
		$tax_query_sql  = $tax_query->get_sql( $wpdb->posts, 'ID' );

		// Generate query.
		$query           = array();
		$query['select'] = "SELECT COUNT( DISTINCT {$wpdb->posts}.ID ) as term_count, terms.term_id as term_count_id";
		$query['from']   = "FROM {$wpdb->posts}";
		$query['join']   = "
			INNER JOIN {$wpdb->term_relationships} AS term_relationships ON {$wpdb->posts}.ID = term_relationships.object_id
			INNER JOIN {$wpdb->term_taxonomy} AS term_taxonomy USING( term_taxonomy_id )
			INNER JOIN {$wpdb->terms} AS terms USING( term_id )
			" . $tax_query_sql['join'] . $meta_query_sql['join'];

		$query['where'] = "
			WHERE {$wpdb->posts}.post_type IN ( 'product' )
			AND {$wpdb->posts}.post_status = 'publish'"
		                  . $tax_query_sql['where'] . $meta_query_sql['where'] .
		                  'AND terms.term_id IN (' . implode( ',', array_map( 'absint', $term_ids ) ) . ')';

		$query['group_by'] = 'GROUP BY terms.term_id';
		$query             = apply_filters( 'woocommerce_get_filtered_term_product_counts_query', $query );
		$query             = implode( ' ', $query );


		return $wpdb->get_results( $query, ARRAY_A );
	}

	/**
	 * @param $product_data
	 *
	 * @return mixed
	 * @since    1.0.0
	 */
	public function custom_woocommerce_rest_prepare_product_variation_object( $product_data ) {

		global $woocommerce_wpml;

		if ( ! empty( $woocommerce_wpml->multi_currency ) && ! empty( $woocommerce_wpml->settings['currencies_order'] ) ) {

			$product_data->data['multi-currency-prices'] = array();

			$custom_prices_on = get_post_meta( $product_data->data['id'], '_wcml_custom_prices_status', true );

			foreach ( $woocommerce_wpml->settings['currencies_order'] as $currency ) {

				if ( $currency != get_option( 'woocommerce_currency' ) ) {

					if ( $custom_prices_on ) {

						$custom_prices = (array) $woocommerce_wpml->multi_currency->custom_prices->get_product_custom_prices( $product_data->data['id'],
							$currency );
						foreach ( $custom_prices as $key => $price ) {
							$product_data->data['multi-currency-prices'][ $currency ][ preg_replace( '#^_#', '',
								$key ) ] = $price;

						}

					} else {
						$product_data->data['multi-currency-prices'][ $currency ]['regular_price'] =
							$woocommerce_wpml->multi_currency->prices->raw_price_filter( $product_data->data['regular_price'],
								$currency );
						if ( ! empty( $product_data->data['sale_price'] ) ) {
							$product_data->data['multi-currency-prices'][ $currency ]['sale_price'] =
								$woocommerce_wpml->multi_currency->prices->raw_price_filter( $product_data->data['sale_price'],
									$currency );
						}
					}

				}
			}

		}

		return $product_data;
	}

	/**
	 * @param $response
	 * @param $post
	 * @param $request
	 *
	 * @return mixed
	 * @since    1.0.0
	 */
	public function prepare_product_images( $response, $post, $request ) {
		global $_wp_additional_image_sizes;

		if ( empty( $response->data ) ) {
			return $response;
		}

		foreach ( $response->data['images'] as $key => $image ) {
			$image_urls = [];
			foreach ( $_wp_additional_image_sizes as $size => $value ) {
				$image_info                                = wp_get_attachment_image_src( $image['id'], $size );
				$response->data['images'][ $key ][ $size ] = $image_info[0];
			}
		}

		return $response;

	}

	/**
	 * @param $response
	 * @param $post
	 * @param $request
	 *
	 * @return mixed
	 * @since    1.0.0
	 */
	public function prepare_product_variation_images( $response, $post, $request ) {
		global $_wp_additional_image_sizes;

		if ( empty( $response->data ) || empty( $response->data['image'] ) ) {
			return $response;
		}

		foreach ( $_wp_additional_image_sizes as $size => $value ) {
			$image_info                       = wp_get_attachment_image_src( $response->data['image']['id'], $size );
			$response->data['image'][ $size ] = $image_info[0];
		}

		return $response;

	}

	public function add_value_pa_color( $response ) {

		$term_id                 = $response->data['id'];
		$response->data['value'] = sanitize_hex_color( get_term_meta( $term_id, 'product_attribute_color', true ) );

		return $response;
	}

	public function add_value_pa_image( $response ) {

		$term_id       = $response->data['id'];
		$attachment_id = absint( get_term_meta( $term_id, 'product_attribute_image', true ) );
		$image_size    = woo_variation_swatches()->get_option( 'attribute_image_size' );

		$response->data['value'] = wp_get_attachment_image_url( $attachment_id,
			apply_filters( 'wvs_product_attribute_image_size', $image_size ) );

		return $response;
	}
}
