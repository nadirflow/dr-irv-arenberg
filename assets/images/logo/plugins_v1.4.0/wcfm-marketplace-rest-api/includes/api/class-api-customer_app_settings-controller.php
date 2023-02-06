<?php

class WCFM_REST_Customer_App_Settings_Controller extends WCFM_REST_Controller {

    /**
     * Endpoint namespace
     *
     * @var string
     */
    protected $namespace = 'wcfmmp/v1';

    /**
     * Route name
     *
     * @var string
     */
    protected $base = 'customer-app-settings';

    /**
     * Stores the request.
     * @var array
     */
    protected $request = array();

    /**
     * Load autometically when class initiate
     *
     * @since 1.0.0
     *
     * @return array
     */
    public function __construct() {
        
    }

    /**
     * Register the routes for settings.
     */
    public function register_routes() {
        register_rest_route( $this->namespace, '/' . $this->base, array(
            array(
                'methods'             => WP_REST_Server::READABLE,
                'callback'            => array( $this, 'get_customer_app_settings' ),
                'permission_callback' => array( $this, 'get_customer_app_settings_permission_check' ),
                'args'                => $this->get_collection_params(),
            ),
            'schema' => array( $this, 'get_public_item_schema' ),
        ) );
    }

    public function get_customer_app_settings_permission_check() {
        return true;
    }

    public function get_customer_app_settings($request) {
        $wcfm_cas_options = wcfm_get_option( 'wcfm_cas', array() );

        $response = $this->get_formatted_item_data($wcfm_cas_options, $request);
        $response = apply_filters( "wcfmapi_rest_prepare_customer_app_settings_object", $response, $request );

        $response_final = new WP_REST_Response($response, 200);
        $response_final->header( 'Cache-Control', 'no-cache' );
        return $response_final;
    }

    protected function get_formatted_item_data( $wcfm_cas_options, $request ) {
        global $WCFM, $WCFMmp;
        $wcfm_cas_data = array();
        $wcfm_cas_data['logo'] = $this->get_img_url_by_id( $wcfm_cas_options, 'logo' );
        $slider = array();
        if ( ! empty( $wcfm_cas_options['banner_slider'] ) ) {
            foreach ( $wcfm_cas_options['banner_slider'] as $slide ) {
                if ( empty( $slide['image'] ) )
                    continue;
                array_push( $slider, array(
                    'link'  => isset( $slide['link'] ) ? $slide['link'] : '',
                    'image' => $this->get_img_url_by_id( $slide, 'image' ),
                ) );
            }
        }
        $wcfm_cas_data['slider'] = $slider;
        
        $product_controller = new WCFM_REST_Product_Controller();
        $ps1_data = array();
        if ( ! empty( $wcfm_cas_options['items_ps1'] ) ) {
            foreach ( $wcfm_cas_options['items_ps1'] as $id ) {
                $product = wc_get_product($id);
                if ( !$product ) continue;
                $data = $product_controller->prepare_data_for_response( $product, $request );
                $ps1_data[] = $this->prepare_response_for_collection($data);
            }
        }
        $wcfm_cas_data['product_section1'] = array(
            'title' => isset($wcfm_cas_options['label_ps1']) ? $wcfm_cas_options['label_ps1'] : '',
            'items' => $ps1_data
        );
        
        $wcfm_cas_data['hero_img'] = $this->get_img_url_by_id( $wcfm_cas_options, 'hero_img' );
        
        $ps2_data = array();
        if ( ! empty( $wcfm_cas_options['items_ps2'] ) ) {
            foreach ( $wcfm_cas_options['items_ps2'] as $id ) {
                $product = wc_get_product($id);
                if ( !$product ) continue;
                $data = $product_controller->prepare_data_for_response( $product, $request );
                $ps2_data[] = $this->prepare_response_for_collection($data);
            }
        }
        $wcfm_cas_data['product_section2'] = array(
            'title' => isset($wcfm_cas_options['label_ps2']) ? $wcfm_cas_options['label_ps2'] : '',
            'items' => $ps2_data
        );
        
        $vendor_controller = new WCFM_REST_Store_Vendors_Controller();
        $vs_data = array();
        if ( ! empty( $wcfm_cas_options['stores_vs'] ) ) {
            foreach ( $wcfm_cas_options['stores_vs'] as $id ) {
                if( !wcfm_is_vendor( $id ) ) continue;
                $vs_data[] = $vendor_controller->get_formatted_item_data( $id );
            }
        }
        $wcfm_cas_data['vendor_section'] = array(
            'title' => isset($wcfm_cas_options['label_vs']) ? $wcfm_cas_options['label_vs'] : '',
            'items' => $vs_data
        );
//        $wcfm_cas_data['logo'] = $this->get_img_url_by_id( $wcfm_cas_options, 'logo' );
        return $wcfm_cas_data;
    }

    protected function get_img_url_by_id( $data, $key ) {
        return isset( $data[$key] ) && is_numeric( $data[$key] ) ? wcfm_get_attachment_url( $data[$key] ) : '';
    }
    
    protected function prepare_product_data( $product, $request ) {
        $context = 'view';
        $data = array(
            'id'                    => $product->get_id(),
            'name'                  => $product->get_name( $context ),
            'slug'                  => $product->get_slug( $context ),
            'post_author'           => get_post_field( 'post_author', $product->get_id() ),
            'permalink'             => $product->get_permalink(),
            'date_created'          => wc_rest_prepare_date_response( $product->get_date_created( $context ), false ),
            'date_created_gmt'      => wc_rest_prepare_date_response( $product->get_date_created( $context ) ),
            'date_modified'         => wc_rest_prepare_date_response( $product->get_date_modified( $context ), false ),
            'date_modified_gmt'     => wc_rest_prepare_date_response( $product->get_date_modified( $context ) ),
            'type'                  => $product->get_type(),
            'status'                => $product->get_status( $context ),
            'featured'              => $product->is_featured(),
            'catalog_visibility'    => $product->get_catalog_visibility( $context ),
            'description'           => 'view' === $context ? wpautop( do_shortcode( $product->get_description() ) ) : $product->get_description( $context ),
            'short_description'     => 'view' === $context ? apply_filters( 'woocommerce_short_description', $product->get_short_description() ) : $product->get_short_description( $context ),
            'sku'                   => $product->get_sku( $context ),
            'price'                 => $product->get_price( $context ),
            'regular_price'         => $product->get_regular_price( $context ),
            'sale_price'            => $product->get_sale_price( $context ) ? $product->get_sale_price( $context ) : '',
            'date_on_sale_from'     => wc_rest_prepare_date_response( $product->get_date_on_sale_from( $context ), false ),
            'date_on_sale_from_gmt' => wc_rest_prepare_date_response( $product->get_date_on_sale_from( $context ) ),
            'date_on_sale_to'       => wc_rest_prepare_date_response( $product->get_date_on_sale_to( $context ), false ),
            'date_on_sale_to_gmt'   => wc_rest_prepare_date_response( $product->get_date_on_sale_to( $context ) ),
            'price_html'            => $product->get_price_html(),
            'on_sale'               => $product->is_on_sale( $context ),
            'purchasable'           => $product->is_purchasable(),
            'total_sales'           => $product->get_total_sales( $context ),
            'virtual'               => $product->is_virtual(),
            'downloadable'          => $product->is_downloadable(),
            'downloads'             => $this->get_downloads( $product ),
            'download_limit'        => $product->get_download_limit( $context ),
            'download_expiry'       => $product->get_download_expiry( $context ),
            'external_url'          => $product->is_type( 'external' ) ? $product->get_product_url( $context ) : '',
            'button_text'           => $product->is_type( 'external' ) ? $product->get_button_text( $context ) : '',
            'tax_status'            => $product->get_tax_status( $context ),
            'tax_class'             => $product->get_tax_class( $context ),
            'manage_stock'          => $product->managing_stock(),
            'stock_quantity'        => $product->get_stock_quantity( $context ),
            'low_stock_amount'      => version_compare( WC_VERSION, '3.4.7', '>' ) ? $product->get_low_stock_amount( $context ) : '',
            'in_stock'              => $product->is_in_stock(),
            'backorders'            => $product->get_backorders( $context ),
            'backorders_allowed'    => $product->backorders_allowed(),
            'backordered'           => $product->is_on_backorder(),
            'sold_individually'     => $product->is_sold_individually(),
            'weight'                => $product->get_weight( $context ),
            'dimensions'            => array(
                'length' => $product->get_length( $context ),
                'width'  => $product->get_width( $context ),
                'height' => $product->get_height( $context ),
            ),
            'shipping_required'     => $product->needs_shipping(),
            'shipping_taxable'      => $product->is_shipping_taxable(),
            'shipping_class'        => $product->get_shipping_class(),
            'shipping_class_id'     => $product->get_shipping_class_id( $context ),
            'reviews_allowed'       => $product->get_reviews_allowed( $context ),
            'average_rating'        => 'view' === $context ? wc_format_decimal( $product->get_average_rating(), 2 ) : $product->get_average_rating( $context ),
            'rating_count'          => $product->get_rating_count(),
            'related_ids'           => array_map( 'absint', array_values( wc_get_related_products( $product->get_id() ) ) ),
            'upsell_ids'            => array_map( 'absint', $product->get_upsell_ids( $context ) ),
            'cross_sell_ids'        => array_map( 'absint', $product->get_cross_sell_ids( $context ) ),
            'parent_id'             => $product->get_parent_id( $context ),
            'purchase_note'         => 'view' === $context ? wpautop( do_shortcode( wp_kses_post( $product->get_purchase_note() ) ) ) : $product->get_purchase_note( $context ),
            'categories'            => $this->get_taxonomy_terms( $product ),
            'tags'                  => $this->get_taxonomy_terms( $product, 'tag' ),
            'images'                => $this->get_images( $product ),
            'attributes'            => $this->get_attributes( $product ),
            'default_attributes'    => $this->get_default_attributes( $product ),
            'variations'            => array(),
            'grouped_products'      => array(),
            'menu_order'            => $product->get_menu_order( $context ),
            'meta_data'             => $product->get_meta_data(),
        );

        $response = rest_ensure_response( $data );
        $response->add_links( $this->prepare_links( $product, $request ) );
        return apply_filters( "wcfmapi_rest_prepare_{$this->post_type}_object", $response, $product, $request );
    }
    
    /**
     * Get the downloads for a product or product variation.
     *
     * @param WC_Product|WC_Product_Variation $product Product instance.
     * @return array
     */
    protected function get_downloads( $product ) {
        $downloads = array();

        if ( $product->is_downloadable() ) {
            foreach ( $product->get_downloads() as $file_id => $file ) {
                $downloads[] = array(
                    'id'   => $file_id, // MD5 hash.
                    'name' => $file['name'],
                    'file' => $file['file'],
                );
            }
        }

        return $downloads;
    }
    
    /**
     * Get taxonomy terms.
     *
     * @param WC_Product $product  Product instance.
     * @param string     $taxonomy Taxonomy slug.
     * @return array
     */
    protected function get_taxonomy_terms( $product, $taxonomy = 'cat' ) {
        $terms = array();

        foreach ( wc_get_object_terms( $product->get_id(), 'product_' . $taxonomy ) as $term ) {
            $terms[] = array(
                'id'   => $term->term_id,
                'name' => $term->name,
                'slug' => $term->slug,
            );
        }

        return $terms;
    }
    
    /**
     * Get the images for a product or product variation.
     *
     * @param WC_Product|WC_Product_Variation $product Product instance.
     * @return array
     */
    protected function get_images( $product ) {
        $images = array();
        $attachment_ids = array();

        // Add featured image.
        if ( has_post_thumbnail( $product->get_id() ) ) {
            $attachment_ids[] = $product->get_image_id();
        }

        // Add gallery images.
        $attachment_ids = array_merge( $attachment_ids, $product->get_gallery_image_ids() );

        // Build image data.
        foreach ( $attachment_ids as $position => $attachment_id ) {
            $attachment_post = get_post( $attachment_id );
            if ( is_null( $attachment_post ) ) {
                continue;
            }

            $attachment = wp_get_attachment_image_src( $attachment_id, 'full' );
            if ( ! is_array( $attachment ) ) {
                continue;
            }

            $images[] = array(
                'id'                => (int) $attachment_id,
                'date_created'      => wc_rest_prepare_date_response( $attachment_post->post_date, false ),
                'date_created_gmt'  => wc_rest_prepare_date_response( strtotime( $attachment_post->post_date_gmt ) ),
                'date_modified'     => wc_rest_prepare_date_response( $attachment_post->post_modified, false ),
                'date_modified_gmt' => wc_rest_prepare_date_response( strtotime( $attachment_post->post_modified_gmt ) ),
                'src'               => current( $attachment ),
                'name'              => get_the_title( $attachment_id ),
                'alt'               => get_post_meta( $attachment_id, '_wp_attachment_image_alt', true ),
                'position'          => (int) $position,
            );
        }

        // Set a placeholder image if the product has no images set.
        if ( empty( $images ) ) {
            $images[] = array(
                'id'                => 0,
                'date_created'      => wc_rest_prepare_date_response( current_time( 'mysql' ), false ), // Default to now.
                'date_created_gmt'  => wc_rest_prepare_date_response( current_time( 'timestamp', true ) ), // Default to now.
                'date_modified'     => wc_rest_prepare_date_response( current_time( 'mysql' ), false ),
                'date_modified_gmt' => wc_rest_prepare_date_response( current_time( 'timestamp', true ) ),
                'src'               => wc_placeholder_img_src(),
                'name'              => __( 'Placeholder', 'wcfm-marketplace-rest-api' ),
                'alt'               => __( 'Placeholder', 'wcfm-marketplace-rest-api' ),
                'position'          => 0,
            );
        }

        return $images;
    }
    
    /**
	 * Returns product attributes.
	 *
	 * @param  string $context What the value is for. Valid values are view and edit.
	 * @return array
	 */
	public function get_attributes( $context = 'view' ) {
		return $this->get_prop( 'attributes', $context );
	}

}
