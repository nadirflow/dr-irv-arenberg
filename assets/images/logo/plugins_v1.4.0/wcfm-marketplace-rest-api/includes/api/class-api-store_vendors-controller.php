<?php

class WCFM_REST_Store_Vendors_Controller extends WCFM_REST_Controller {

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
    protected $base = 'store-vendors';

    /**
     * Stores the request.
     * @var array
     */
    protected $request = array();

    protected $post_status = array( 'publish' );

    protected $post_type = 'product';

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
                'callback'            => array( $this, 'get_store_vendors' ),
                'permission_callback' => array( $this, 'get_store_vendors_permissions_check' ),
                'args'                => $this->get_collection_params(),
            ),
            'schema' => array( $this, 'get_public_item_schema' ),
        ) );

        register_rest_route( $this->namespace, '/' . $this->base . '/(?P<id>[\d]+)/', array(
            'args'   => array(
                'id' => array(
                    'description' => __( 'Unique identifier for the object.', 'wcfm-marketplace-rest-api' ),
                    'type'        => 'integer',
                )
            ),
            array(
                'methods'             => WP_REST_Server::READABLE,
                'callback'            => array( $this, 'get_store_vendor' ),
                'permission_callback' => array( $this, 'get_store_vendor_permissions_check' ),
                'args'                => $this->get_collection_params(),
            ),
            'schema' => array( $this, 'get_public_item_schema' ),
        ) );

        register_rest_route( $this->namespace, '/' . $this->base . '/(?P<id>[\d]+)/' . 'products', array(
            'args'   => array(
                'id' => array(
                    'description' => __( 'Unique identifier for the object.', 'wcfm-marketplace-rest-api' ),
                    'type'        => 'integer',
                )
            ),
            array(
                'methods'             => WP_REST_Server::READABLE,
                'callback'            => array( $this, 'get_store_vendor_products' ),
                'permission_callback' => array( $this, 'get_store_vendor_permissions_check' ),
                'args'                => $this->get_collection_params(),
            ),
            'schema' => array( $this, 'get_public_item_schema' ),
        ) );
    }

    public function get_store_vendors( $request ) {
        //print_r('testing');
        global $WCFM;
        $_POST["controller"] = 'wcfm-vendors';
        $_POST['length'] = ! empty( $request['per_page'] ) ? intval( $request['per_page'] ) : 10;
        $_POST['start'] = ! empty( $request['page'] ) ? ( intval( $request['page'] ) - 1 ) * $_POST['length'] : 0;
        $_POST['filter_date_form'] = ! empty( $request['after'] ) ? $request['after'] : '';
        $_POST['filter_date_to'] = ! empty( $request['before'] ) ? $request['before'] : '';
        $queries_data = array();
        parse_str($_SERVER['QUERY_STRING'], $queries_data);

        $_POST['search_data'] = array();
        foreach( $queries_data as $query_key => $query_value ) {
          if( in_array( $query_key, apply_filters( 'wcfmmp_vendor_list_exclude_search_keys', array( 'v', 'search_term', 'wcfmmp_store_search', 'wcfmmp_store_category', 'wcfmmp_radius_addr', 'wcfmmp_radius_lat', 'wcfmmp_radius_lng', 'wcfmmp_radius_range', 'excludes', 'orderby', 'lang' ) ) ) )
          $_POST['search_data'][$query_key] =  $query_value;
        }

        define( 'WCFM_REST_API_CALL', TRUE );
        $WCFM->init();
        $wcfm_vendors_array = array();
        $wcfm_vendors_json_arr = array();
        $response = array();
        $wcfm_vendors_array = $WCFM->ajax->wcfm_ajax_controller();

        //print_r($wcfm_vendors_array);
        // return rest_ensure_response( $wcfm_vendors_array );
        if ( ! empty( $wcfm_vendors_array ) ) {
            $index = 0;
            foreach ( $wcfm_vendors_array as $wcfm_vendors_id => $wcfm_vendors_name ) {
                $response[$index] = $this->get_formatted_item_data( $wcfm_vendors_id, $wcfm_vendors_name );
                $index ++;
            }
            $response = apply_filters( "wcfmapi_rest_prepare_store_vendors_objects", $response, $request );
            $response_final = new WP_REST_Response($response, 200);
            $response_final->header( 'Cache-Control', 'no-cache' );
            return $response_final;
            //return rest_ensure_response( apply_filters( "wcfmapi_rest_prepare_store_vendors_objects", $response, $request ) );
        } else {
            $response_final = new WP_REST_Response($response, 200);
            $response_final->header( 'Cache-Control', 'no-cache' );
            return $response_final;
        }
    }

    public function get_store_vendors_permissions_check() {
        return true;
    }

    public function get_store_vendor( $request ) {
        $wcfm_vendor_data = apply_filters( "wcfmapi_rest_prepare_store_vendor_object", $this->get_formatted_item_data( $request['id'] ), $request );
        $response_final = new WP_REST_Response($wcfm_vendor_data, 200);
        $response_final->header( 'Cache-Control', 'no-cache' );
        return rest_ensure_response( $response_final );
    }

    public function get_store_vendor_permissions_check() {
        return true;
    }

    public function get_formatted_item_data( $wcfm_vendors_id, $formatted_name = '' ) {
        global $WCFM, $WCFMmp;

        $user = get_user_by( 'id', (int) $wcfm_vendors_id );
        $is_vendor_disabled = $user ? get_user_meta( $user->ID, '_disable_vendor', true ) : false;
        if ( ! $user || ( ! wcfm_is_vendor( $user->ID ) && ! $is_vendor_disabled ) ) {
            return new WP_Error( "wcfmapi_rest_invalid_vendor_id", __( 'Vendor id specified is incorrect', 'wcfm-marketplace-rest-api' ), array( 'status' => 404 ) );
        }

        $wcfm_vendor_data = array();
        $wcfm_vendor_data['vendor_id'] = $user->ID;
        $wcfm_vendor_data['vendor_display_name'] = $user->display_name;
        $wcfm_vendor_data['vendor_shop_name'] = wcfm_get_vendor_store_name( $user->ID );

        if ( $formatted_name ) {
            $wcfm_vendor_data['formatted_display_name'] = $formatted_name;
        } else {
            $wcfm_vendor_data['formatted_display_name'] = $wcfm_vendor_data['vendor_shop_name'] . ' - ' . $user->display_name . ' (#' . $user->ID . ' - ' . $user->user_login . ')';
        }

        $store_user = wcfmmp_get_store( $user->ID );
        $store_info = $store_user->get_shop_info();
        $wcfm_vendor_data['store_hide_email'] = isset( $store_info['store_hide_email'] ) ? $store_info['store_hide_email'] : 'no';
        $wcfm_vendor_data['store_hide_phone'] = isset( $store_info['store_hide_phone'] ) ? $store_info['store_hide_phone'] : 'no';
        $wcfm_vendor_data['store_hide_address'] = isset( $store_info['store_hide_address'] ) ? $store_info['store_hide_address'] : 'no';
        $wcfm_vendor_data['store_hide_description'] = isset( $store_info['store_hide_description'] ) ? $store_info['store_hide_description'] : 'no';
        $wcfm_vendor_data['store_hide_policy'] = isset( $store_info['store_hide_policy'] ) ? $store_info['store_hide_policy'] : 'no';
        $wcfm_vendor_data['store_products_per_page'] = isset( $store_info['store_ppp'] ) ? (int) $store_info['store_ppp'] : 10;

        $email = $store_user->get_email();
        if ( $email && $WCFM->wcfm_vendor_support->wcfm_vendor_has_capability( $store_user->get_id(), 'vendor_email' ) ) {
            $wcfm_vendor_data['vendor_email'] = $email;
        }
        $phone = $store_user->get_phone();
        if ( $phone && $WCFM->wcfm_vendor_support->wcfm_vendor_has_capability( $store_user->get_id(), 'vendor_phone' ) ) {
            $wcfm_vendor_data['vendor_phone'] = $phone;
        }
        $address = $store_user->get_address_string();
        if ( $address && $WCFM->wcfm_vendor_support->wcfm_vendor_has_capability( $store_user->get_id(), 'vendor_address' ) ) {
            $wcfm_vendor_data['vendor_address'] = $address;
        }

        $wcfm_vendor_data['disable_vendor'] = wc_bool_to_string( $is_vendor_disabled );
        $wcfm_vendor_data['is_store_offline'] = wc_bool_to_string( get_user_meta( $user->ID, '_wcfm_store_offline', true ) );

        $wcfm_vendor_data['vendor_shop_logo'] = $store_user->get_avatar();
        $banner_type = $store_user->get_banner_type();
        $default_banner = ! empty( $WCFMmp->wcfmmp_marketplace_options['store_default_banner'] ) ? wcfm_get_attachment_url( $WCFMmp->wcfmmp_marketplace_options['store_default_banner'] ) : $WCFMmp->plugin_url . 'assets/images/default_banner.jpg';

        if ( $banner_type == 'slider' ) {
            $slider = array();
            $slider_img_ids = $store_user->get_banner_slider();
            if ( ! empty( $slider_img_ids ) ) {
                foreach ( $slider_img_ids as $slide ) {
                    if ( empty( $slide['image'] ) )
                        continue;
                    $img_url = isset( $slide['image'] ) && is_numeric( $slide['image'] ) ? wcfm_get_attachment_url( $slide['image'] ) : '';
                    array_push( $slider, array(
                        'link'  => isset( $slide['link'] ) ? $slide['link'] : '',
                        'image' => $img_url,
                    ) );
                }
            }
            $wcfm_vendor_data['vendor_banner_type'] = 'slider';
            $wcfm_vendor_data['vendor_banner'] = $slider;
        } elseif ( $banner_type == 'video' ) {
            $wcfm_vendor_data['vendor_banner_type'] = 'video';
            $wcfm_vendor_data['vendor_banner'] = $store_user->get_banner_video();
        } else {
            $wcfm_vendor_data['vendor_banner_type'] = 'image';
            $banner = $store_user->get_banner();
            $wcfm_vendor_data['vendor_banner'] = $banner;
        }
        if ( ! $wcfm_vendor_data['vendor_banner'] ) {
            $banner = apply_filters( 'wcfmmp_store_default_banner', $default_banner );
            $wcfm_vendor_data['vendor_banner'] = $banner;
        }

        $mobile_banner = $store_user->get_mobile_banner();
        if ( ! $mobile_banner ) {
            $mobile_banner = $store_user->get_banner();
            if ( ! $mobile_banner ) {
                $mobile_banner = apply_filters( 'wcfmmp_store_default_banner', $default_banner );
            }
        }
        $wcfm_vendor_data['mobile_banner'] = $mobile_banner;

        $list_banner_type = $store_user->get_list_banner_type();
        if ( $list_banner_type == 'video' ) {
            $wcfm_vendor_data['vendor_list_banner_type'] = 'video';
            $wcfm_vendor_data['vendor_list_banner'] = $store_user->get_list_banner_video();
        } else {
            $list_banner = $store_user->get_list_banner();
            if ( ! $list_banner ) {
                $list_banner = ! empty( $WCFMmp->wcfmmp_marketplace_options['store_list_default_banner'] ) ? wcfm_get_attachment_url( $WCFMmp->wcfmmp_marketplace_options['store_list_default_banner'] ) : $WCFMmp->plugin_url . 'assets/images/default_banner.jpg';
                $list_banner = apply_filters( 'wcfmmp_list_store_default_bannar', $list_banner );
            }
            $wcfm_vendor_data['vendor_list_banner_type'] = 'image';
            $wcfm_vendor_data['vendor_list_banner'] = $list_banner;
        }

        if ( apply_filters( 'wcfm_is_pref_vendor_reviews', true ) ) {
            $wcfm_vendor_data['store_rating'] = $WCFMmp->wcfmmp_reviews->get_vendor_review_rating( $user->ID );
        }

        if ( apply_filters( 'wcfm_is_allow_email_verification', true ) ) {
            $user_email = $user->user_email;
            $email_verified = get_user_meta( $user->ID, '_wcfm_email_verified', true );
            $wcfm_email_verified_for = get_user_meta( $user->ID, '_wcfm_email_verified_for', true );
            if ( $email_verified && ( $user_email != $wcfm_email_verified_for ) )
                $email_verified = false;
            $wcfm_vendor_data['email_verified'] = $email_verified;
        }

        $wcfmvm_registration_custom_fields = get_option( 'wcfmvm_registration_custom_fields', array() );
        $wcfmvm_custom_infos = get_user_meta( $user->ID, 'wcfmvm_custom_infos', true );

        $wcfm_vendor_data['vendor_additional_info'] = array();

        if ( ! empty( $wcfmvm_registration_custom_fields ) ) {
            foreach ( $wcfmvm_registration_custom_fields as $key => $wcfmvm_registration_custom_field ) {
                $wcfmvm_registration_custom_field['name'] = sanitize_title( $wcfmvm_registration_custom_field['label'] );
                $field_value = '';
                if ( ! empty( $wcfmvm_custom_infos ) ) {
                    if ( $wcfmvm_registration_custom_field['type'] == 'checkbox' ) {
                        $field_value = isset( $wcfmvm_custom_infos[$wcfmvm_registration_custom_field['name']] ) ? $wcfmvm_custom_infos[$wcfmvm_registration_custom_field['name']] : 'no';
                    } elseif ( $wcfmvm_registration_custom_field['type'] == 'upload' ) {
                        $field_name = 'wcfmvm_custom_infos[' . $wcfmvm_registration_custom_field['name'] . ']';
                        $field_id = md5( $field_name );
                        $field_value = isset( $wcfmvm_custom_infos[$field_id] ) ? $wcfmvm_custom_infos[$field_id] : '';
                    } else {
                        $field_value = isset( $wcfmvm_custom_infos[$wcfmvm_registration_custom_field['name']] ) ? $wcfmvm_custom_infos[$wcfmvm_registration_custom_field['name']] : '';
                    }
                }
                $wcfm_vendor_data['vendor_additional_info'][$key] = $wcfmvm_registration_custom_field;
                $wcfm_vendor_data['vendor_additional_info'][$key]['value'] = $field_value;
            }
        }

        $wcfm_membership = get_user_meta( $user->ID, 'wcfm_membership', true );
        if ( $wcfm_membership && function_exists( 'wcfm_is_valid_membership' ) && wcfm_is_valid_membership( $wcfm_membership ) ) {
            $wcfm_vendor_data['membership_details']['membership_title'] = get_the_title( $wcfm_membership );
            $wcfm_vendor_data['membership_details']['membership_id'] = $wcfm_membership;

            $next_schedule = get_user_meta( $user->ID, 'wcfm_membership_next_schedule', true );
            if ( $next_schedule ) {
                $subscription = (array) get_post_meta( $wcfm_membership, 'subscription', true );
                $is_free = isset( $subscription['is_free'] ) ? 'yes' : 'no';
                $subscription_type = isset( $subscription['subscription_type'] ) ? $subscription['subscription_type'] : 'one_time';

                if ( ( $is_free == 'no' ) && ( $subscription_type != 'one_time' ) ) {
                    $wcfm_vendor_data['membership_details']['membership_next_payment'] = date_i18n( wc_date_format(), $next_schedule );
                }

                $member_billing_period = get_user_meta( $user->ID, 'wcfm_membership_billing_period', true );
                $member_billing_cycle = get_user_meta( $user->ID, 'wcfm_membership_billing_cycle', true );
                if ( $member_billing_period && $member_billing_cycle ) {
                    $billing_period = isset( $subscription['billing_period'] ) ? $subscription['billing_period'] : '1';
                    $billing_period_count = isset( $subscription['billing_period_count'] ) ? $subscription['billing_period_count'] : '';
                    $billing_period_type = isset( $subscription['billing_period_type'] ) ? $subscription['billing_period_type'] : 'M';
                    $period_options = array( 'D' => 'days', 'M' => 'months', 'Y' => 'years' );

                    if ( $billing_period_count ) {
                        if ( $member_billing_period )
                            $member_billing_period = absint( $member_billing_period );
                        else
                            $member_billing_period = absint( $billing_period_count );
                        if ( ! $member_billing_cycle )
                            $member_billing_cycle = 1;
                        $remaining_cycle = ( $member_billing_period - $member_billing_cycle );
                        if ( $remaining_cycle == 0 ) {
                            $wcfm_vendor_data['membership_details']['membership_expiry_on'] = date_i18n( wc_date_format(), $next_schedule );
                        } else {
                            $expiry_time = strtotime( '+' . $remaining_cycle . ' ' . $period_options[$billing_period_type], $next_schedule );
                            $wcfm_vendor_data['membership_details']['membership_expiry_on'] = date_i18n( wc_date_format(), $expiry_time );
                        }
                    } else {

                        if ( $is_free == 'yes' ) {
                            $wcfm_vendor_data['membership_details']['membership_expiry_on'] = date_i18n( wc_date_format(), $next_schedule );
                        } else {
                            $wcfm_vendor_data['membership_details']['membership_expiry_on'] = __( 'Never Expire', 'wc-frontend-manager' );
                        }
                    }
                } else {
                    $wcfm_vendor_data['membership_details']['membership_expiry_on'] = __( 'Never Expire', 'wc-frontend-manager' );
                }
            }
        }

        $wcfm_shop_description = apply_filters( 'wcfmmp_store_about', apply_filters( 'woocommerce_short_description', $store_user->get_shop_description() ), $store_user->get_shop_description() );
        $wcfm_vendor_data['vendor_description'] = $wcfm_shop_description;


        $wcfm_policy_vendor_options = $store_user->get_store_policies();

        $wcfm_policy_options = wcfm_get_option( 'wcfm_policy_options', array() );

        $shipping_policy = isset( $wcfm_policy_vendor_options['shipping_policy'] ) ? $wcfm_policy_vendor_options['shipping_policy'] : '';
        $_wcfm_shipping_policy = isset( $wcfm_policy_options['shipping_policy'] ) ? $wcfm_policy_options['shipping_policy'] : '';
        if( wcfm_empty($shipping_policy) ) $shipping_policy = $_wcfm_shipping_policy;
            
        $refund_policy = isset( $wcfm_policy_vendor_options['refund_policy'] ) ? $wcfm_policy_vendor_options['refund_policy'] : '';
        $_wcfm_refund_policy = isset( $wcfm_policy_options['refund_policy'] ) ? $wcfm_policy_options['refund_policy'] : '';
        if( wcfm_empty($refund_policy) ) $refund_policy = $_wcfm_refund_policy;
            
        $cancellation_policy = isset( $wcfm_policy_vendor_options['cancellation_policy'] ) ? $wcfm_policy_vendor_options['cancellation_policy'] : '';
        $_wcfm_cancellation_policy = isset( $wcfm_policy_options['cancellation_policy'] ) ? $wcfm_policy_options['cancellation_policy'] : '';
        if( wcfm_empty($cancellation_policy) ) $cancellation_policy = $_wcfm_cancellation_policy;
        $wcfm_vendor_data['vendor_policies'] = array();

        $wcfm_vendor_data['vendor_policies']['shipping_policy_heading'] = apply_filters('wcfm_shipping_policies_heading', __('Shipping Policy', 'wc-frontend-manager'));
        $wcfm_vendor_data['vendor_policies']['shipping_policy'] = $shipping_policy;
        $wcfm_vendor_data['vendor_policies']['refund_policy_heading'] = apply_filters('wcfm_refund_policies_heading', __('Refund Policy', 'wc-frontend-manager'));
        $wcfm_vendor_data['vendor_policies']['refund_policy'] = $refund_policy;
        $wcfm_vendor_data['vendor_policies']['cancellation_policy_heading'] = apply_filters('wcfm_cancellation_policies_heading', __('Cancellation / Return / Exchange Policy', 'wc-frontend-manager'));
        $wcfm_vendor_data['vendor_policies']['cancellation_policy'] = $cancellation_policy;

        $store_tab_headings = $store_user->get_store_tabs();
        $wcfm_vendor_data['store_tab_headings'] = $store_tab_headings;

        return $wcfm_vendor_data;
    }

    public function get_store_vendor_products ($request) {
      //print_r($request['id']);
      $query_args = $this->prepare_objects_query( $request );
      $query  = new WP_Query();
      $result = $query->query( $query_args );
      $data = array();
      $objects = array_map( array( $this, 'get_object' ), $result );
      $data_objects = array();
      foreach ( $objects as $object ) {
          $data           = $this->prepare_data_for_response( $object, $request );
          $data_objects[] = $this->prepare_response_for_collection( $data );
      }
      
      $response_final = new WP_REST_Response($data_objects);
      $response_final->header( 'Cache-Control', 'no-cache' );

      // $response = rest_ensure_response( $data_objects );
      $response_final = $this->format_collection_response( $response_final, $request, $query->found_posts );
      

      return $response_final;
    }


    public function get_object( $id ) {
      if(!wc_get_product($id))
        return new WP_Error( "wcfmapi_rest_invalid_product_id", sprintf( __( "Invalid ID", 'wcfm-marketplace-rest-api' ), __METHOD__ ), array( 'status' => 404 ) );
      return wc_get_product( $id );
    }

    public function prepare_data_for_response( $product, $request ) {
      $context = ! empty( $request['context'] ) ? $request['context'] : 'view';
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
     * Get product attribute taxonomy name.
     *
     * @since  1.0.0
     * @param  string     $slug    Taxonomy name.
     * @param  WC_Product $product Product data.
     * @return string
     */
    protected function get_attribute_taxonomy_name( $slug, $product ) {
      $attributes = $product->get_attributes();

      if ( ! isset( $attributes[ $slug ] ) ) {
          return str_replace( 'pa_', '', $slug );
      }

      $attribute = $attributes[ $slug ];

      // Taxonomy attribute name.
      if ( $attribute->is_taxonomy() ) {
          $taxonomy = $attribute->get_taxonomy_object();
          return $taxonomy->attribute_label;
      }

      // Custom product attribute name.
      return $attribute->get_name();
    }

    /**
     * Get default attributes.
     *
     * @param WC_Product $product Product instance.
     * @return array
     */
    protected function get_default_attributes( $product ) {
      $default = array();

      if ( $product->is_type( 'variable' ) ) {
          foreach ( array_filter( (array) $product->get_default_attributes(), 'strlen' ) as $key => $value ) {
              if ( 0 === strpos( $key, 'pa_' ) ) {
                  $default[] = array(
                      'id'     => wc_attribute_taxonomy_id_by_name( $key ),
                      'name'   => $this->get_attribute_taxonomy_name( $key, $product ),
                      'option' => $value,
                  );
              } else {
                  $default[] = array(
                      'id'     => 0,
                      'name'   => $this->get_attribute_taxonomy_name( $key, $product ),
                      'option' => $value,
                  );
              }
          }
      }

      return $default;
    }

    /**
     * Get attribute options.
     *
     * @param int   $product_id Product ID.
     * @param array $attribute  Attribute data.
     * @return array
     */
    protected function get_attribute_options( $product_id, $attribute ) {
      if ( isset( $attribute['is_taxonomy'] ) && $attribute['is_taxonomy'] ) {
          return wc_get_product_terms( $product_id, $attribute['name'], array(
              'fields' => 'names',
          ) );
      } elseif ( isset( $attribute['value'] ) ) {
          return array_map( 'trim', explode( '|', $attribute['value'] ) );
      }

      return array();
    }

    /**
     * Get the attributes for a product or product variation.
     *
     * @param WC_Product|WC_Product_Variation $product Product instance.
     * @return array
     */
    protected function get_attributes( $product ) {
      $attributes = array();

      if ( $product->is_type( 'variation' ) ) {
          $_product = wc_get_product( $product->get_parent_id() );
          foreach ( $product->get_variation_attributes() as $attribute_name => $attribute ) {
              $name = str_replace( 'attribute_', '', $attribute_name );

              if ( ! $attribute ) {
                  continue;
              }

              // Taxonomy-based attributes are prefixed with `pa_`, otherwise simply `attribute_`.
              if ( 0 === strpos( $attribute_name, 'attribute_pa_' ) ) {
                  $option_term = get_term_by( 'slug', $attribute, $name );
                  $attributes[] = array(
                      'id'     => wc_attribute_taxonomy_id_by_name( $name ),
                      'name'   => $this->get_attribute_taxonomy_name( $name, $_product ),
                      'option' => $option_term && ! is_wp_error( $option_term ) ? $option_term->name : $attribute,
                  );
              } else {
                  $attributes[] = array(
                      'id'     => 0,
                      'name'   => $this->get_attribute_taxonomy_name( $name, $_product ),
                      'option' => $attribute,
                  );
              }
          }
      } else {
          foreach ( $product->get_attributes() as $attribute ) {
              $attributes[] = array(
                  'id'        => $attribute['is_taxonomy'] ? wc_attribute_taxonomy_id_by_name( $attribute['name'] ) : 0,
                  'name'      => $this->get_attribute_taxonomy_name( $attribute['name'], $product ),
                  'position'  => (int) $attribute['position'],
                  'visible'   => (bool) $attribute['is_visible'],
                  'variation' => (bool) $attribute['is_variation'],
                  'options'   => $this->get_attribute_options( $product->get_id(), $attribute ),
              );
          }
      }

      return $attributes;
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
     * Prepare links for the request.
     *
     * @param WC_Data         $object  Object data.
     * @param WP_REST_Request $request Request object.
     *
     * @return array                   Links for the given post.
     */
    protected function prepare_links( $object, $request ) {
      $links = array(
          'self'       => array(
              'href' => rest_url( sprintf( '/%s/%s/%d', $this->namespace, $this->base, $object->get_id() ) ),
          ),
          'collection' => array(
              'href' => rest_url( sprintf( '/%s/%s', $this->namespace, $this->base ) ),
          ),
      );

      if ( $object->get_parent_id() ) {
          $links['up'] = array(
              'href' => rest_url( sprintf( '/%s/products/%d', $this->namespace, $object->get_parent_id() ) ),
          );
      }

      return $links;
    }
    
    protected function prepare_objects_query( $request ) {
      $args = parent::prepare_objects_query( $request );

      // Set post_status.
      $args['post_status'] = isset( $request['status'] ) ? $request['status'] : $request['post_status'];

      // Taxonomy query to filter products by type, category,
      // tag, shipping class, and attribute.
      $tax_query = array();

      // Map between taxonomy name and arg's key.
      $taxonomies = array(
          'product_cat'            => 'category',
          'product_tag'            => 'tag',
          'product_shipping_class' => 'shipping_class',
      );

      // Set tax_query for each passed arg.
      foreach ( $taxonomies as $taxonomy => $key ) {
          if ( ! empty( $request[ $key ] ) ) {
              $tax_query[] = array(
                  'taxonomy' => $taxonomy,
                  'field'    => 'term_id',
                  'terms'    => $request[ $key ],
              );
          }
      }

      // Filter product type by slug.
      if ( ! empty( $request['type'] ) ) {
          $tax_query[] = array(
              'taxonomy' => 'product_type',
              'field'    => 'slug',
              'terms'    => $request['type'],
          );
      }

      // Filter by attribute and term.
      if ( ! empty( $request['attribute'] ) && ! empty( $request['attribute_term'] ) ) {
          if ( in_array( $request['attribute'], wc_get_attribute_taxonomy_names(), true ) ) {
              $tax_query[] = array(
                  'taxonomy' => $request['attribute'],
                  'field'    => 'term_id',
                  'terms'    => $request['attribute_term'],
              );
          }
      }

      if ( ! empty( $tax_query ) ) {
          $args['tax_query'] = $tax_query; // WPCS: slow query ok.
      }

      // Filter featured.
      if ( is_bool( $request['featured'] ) ) {
          $args['tax_query'][] = array(
              'taxonomy' => 'product_visibility',
              'field'    => 'name',
              'terms'    => 'featured',
          );
      }

      // Filter by sku.
      if ( ! empty( $request['sku'] ) ) {
          $skus = explode( ',', $request['sku'] );
          // Include the current string as a SKU too.
          if ( 1 < count( $skus ) ) {
              $skus[] = $request['sku'];
          }

          $args['meta_query'] = $this->add_meta_query( // WPCS: slow query ok.
              $args, array(
                  'key'     => '_sku',
                  'value'   => $skus,
                  'compare' => 'IN',
              )
          );
      }

      // Filter by tax class.
      if ( ! empty( $request['tax_class'] ) ) {
          $args['meta_query'] = $this->add_meta_query( // WPCS: slow query ok.
              $args, array(
                  'key'   => '_tax_class',
                  'value' => 'standard' !== $request['tax_class'] ? $request['tax_class'] : '',
              )
          );
      }

      // Price filter.
      if ( ! empty( $request['min_price'] ) || ! empty( $request['max_price'] ) ) {
          $args['meta_query'] = $this->add_meta_query( $args, wc_get_min_max_price_meta_query( $request ) );  // WPCS: slow query ok.
      }

      // Filter product in stock or out of stock.
      if ( is_bool( $request['in_stock'] ) ) {
          $args['meta_query'] = $this->add_meta_query( // WPCS: slow query ok.
              $args, array(
                  'key'   => '_stock_status',
                  'value' => true === $request['in_stock'] ? 'instock' : 'outofstock',
              )
          );
      }

      // Filter by on sale products.
      if ( is_bool( $request['on_sale'] ) ) {
          $on_sale_key = $request['on_sale'] ? 'post__in' : 'post__not_in';
          $on_sale_ids = wc_get_product_ids_on_sale();

          // Use 0 when there's no on sale products to avoid return all products.
          $on_sale_ids = empty( $on_sale_ids ) ? array( 0 ) : $on_sale_ids;

          $args[ $on_sale_key ] += $on_sale_ids;
      }

      // Force the post_type argument, since it's not a user input variable.
      if ( ! empty( $request['sku'] ) ) {
          $args['post_type'] = array( 'product', 'product_variation' );
      } else {
          $args['post_type'] = $this->post_type;
      }

      return $args;
    }

}
