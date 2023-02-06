<?php

class WCFM_REST_WC_Cart_Controller extends WCFM_REST_Controller {

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
    protected $base = 'cart';

    /**
     * Stores the request.
     * @var array
     */
    protected $request = array();

    /**
     * Load automatically when class initiate
     *
     * @since 1.0.0
     *
     * @return array
     */
    public function __construct() {
        // add_action( 'rest_api_init', array( $this, 'rest_api_includes' ) );
        if ( empty( WC()->cart ) ) {
            WC()->frontend_includes(); 
            wc_load_cart(); 
        }
    }

    public function rest_api_includes() {
        if ( empty( WC()->cart ) ) {
            WC()->frontend_includes(); 
            wc_load_cart(); 
        } 
    }

    /**
     * Register the routes for notifications.
     */
    public function register_routes() {
        register_rest_route( $this->namespace, '/' . $this->base . '/find-item', array(
            array(
                'methods'             => WP_REST_Server::READABLE,
                'callback'            => array( $this, 'find_cart_item' ),
                'permission_callback' => array( $this, 'cart_permissions_check' ),
                'args'                => $this->get_collection_params(),
            )
        ) );
        register_rest_route( $this->namespace, '/' . $this->base . '/get-items', array(
            array(
                'methods'             => WP_REST_Server::READABLE,
                'callback'            => array( $this, 'get_cart_items' ),
                'permission_callback' => array( $this, 'cart_permissions_check' ),
                'args'                => $this->get_collection_params(),
            )
        ) );
        register_rest_route( $this->namespace, '/' . $this->base . '/add-item', array(
            array(
                'methods'             => WP_REST_Server::CREATABLE,
                'callback'            => array( $this, 'add_cart_item' ),
                'permission_callback' => array( $this, 'cart_permissions_check' ),
                'args'                => $this->get_collection_params(),
            )
        ) );
        
        register_rest_route( $this->namespace, '/' . $this->base . '/update-item', array(
            array(
                'methods'             => WP_REST_Server::EDITABLE,
                'callback'            => array( $this, 'update_cart_item' ),
                'permission_callback' => array( $this, 'cart_permissions_check' ),
                'args'                => $this->get_collection_params(),
            )
        ) );

        register_rest_route( $this->namespace, '/' . $this->base . '/remove-item', array(
            array(
                'methods'             => WP_REST_Server::DELETABLE,
                'callback'            => array( $this, 'remove_cart_item' ),
                'permission_callback' => array( $this, 'cart_permissions_check' ),
                'args'                => $this->get_collection_params(),
            )
        ) );

        register_rest_route( $this->namespace, '/' . $this->base . '/empty-cart', array(
            array(
                'methods'             => WP_REST_Server::DELETABLE,
                'callback'            => array( $this, 'empty_cart' ),
                'permission_callback' => array( $this, 'cart_permissions_check' ),
                'args'                => $this->get_collection_params(),
            )
        ) );

        register_rest_route( $this->namespace, '/' . $this->base . '/update-address', array(
            array(
                'methods'             => WP_REST_Server::EDITABLE,
                'callback'            => array( $this, 'update_user_address' ),
                'permission_callback' => array( $this, 'update_address_permissions_check' ),
                'args'                => $this->get_collection_params(),
            )
        ) );
    }

    /**
     * Checking if have any permission to view checkout
     *
     * @since 1.0.0
     *
     * @return boolean
     */
    public function cart_permissions_check() {
        return true;
    }

    public function update_address_permissions_check() {
        return is_user_logged_in() && ! WC()->cart->is_empty();
    }

    private function prepare_cart_item_data( $cart_item, $request ) {
        global $WCFM;
        $variation_id = $cart_item['variation_id'];
        $product_id = $cart_item['product_id'];
        $product = wc_get_product( $variation_id ? $variation_id : $product_id );
        $product_controller = new WCFM_REST_Product_Controller();
        $product_data = $product_controller->prepare_data_for_response($product, $request);
        $data = $product_controller->prepare_response_for_collection( $product_data );
        
        $author_id = $WCFM->wcfm_vendor_support->wcfm_get_vendor_id_from_product( $product->get_id() );
        $store_formatted_data = (object) array();
        if($author_id) {
            $store_vendorController = new WCFM_REST_Store_Vendors_Controller();
            $store_formatted_data = $store_vendorController->get_formatted_item_data($author_id);
        }
        $data['store'] = $store_formatted_data;
        return array_merge( $cart_item, array( 'data' => $data ) );
    }

    public function find_cart_item( $request ) {
        $result = array();

        if ( ! WC()->cart->is_empty() && isset( $request['id'] ) && absint( $request['id'] ) ) {
            foreach ( WC()->cart->get_cart() as $cart_item ) {
                $cart_item_ids = array( $cart_item['product_id'], $cart_item['variation_id'] );

                if ( in_array( $request['id'], $cart_item_ids ) )
                    $result[] = $this->prepare_cart_item_data( $cart_item, $request );
            }
        }
        return rest_ensure_response( $result );
    }
    
    private function find_cart_key($id) {
        if ( ! WC()->cart->is_empty() && absint( $id ) ) {
            foreach ( WC()->cart->get_cart() as $cart_item_key => $cart_item ) {
                $cart_item_ids = array( $cart_item['product_id'], $cart_item['variation_id'] );
                if ( in_array( $id, $cart_item_ids ) ) {
                    return $cart_item_key;
                }
            }
        }
        return false;
    }

    private function add_shipping_package_meta_data($item, $package, $chosen_method) {
        if( !apply_filters( 'wcfm_is_allow_store_shipping', true ) ) return;
        $wcfm_shipping_options = get_option( 'wcfm_shipping_options', array() );
		$wcfmmp_store_shipping_enabled = isset( $wcfm_shipping_options['enable_store_shipping'] ) ? $wcfm_shipping_options['enable_store_shipping'] : 'yes';
        if( $wcfmmp_store_shipping_enabled != 'yes' ) return;
        
        if(!empty($package['vendor_id'])) {
            $item->add_meta_data( 'vendor_id', $package['vendor_id'], true );
        }

        $package_qty = array_sum( wp_list_pluck( $package['contents'], 'quantity' ) );
        $item->add_meta_data( 'package_qty', $package_qty, true );

        $slug = strtok($chosen_method, ':');
        $item->add_meta_data( 'method_slug', $slug, true );

        // Local Pickup Address
        if( ( $slug == 'local_pickup' ) && isset( $package['pickup_address'] ) && apply_filters( 'wcfmmp_is_allow_local_pickup_address', true ) ) {
            $item->add_meta_data( 'pickup_address', $package['pickup_address'], true );
        }
        
        // Processing Time
        if( isset( $package['processing_time'] ) && apply_filters( 'wcfm_is_allow_shipping_processing_time_info', true ) ) {
            $item->add_meta_data( 'processing_time', $package['processing_time'], true );
        }

        do_action( 'wcfmmp_add_shipping_package_meta_data', $slug, $package, $item );

    }

    private function get_shipping_packages() {
        $cart_shipping_packages = WC()->cart->get_shipping_packages();
        $packages = WC()->shipping()->calculate_shipping($cart_shipping_packages);
        $shipping_packages = array();
        foreach ( $packages as $i => $package ) {
            $chosen_method = isset( WC()->session->chosen_shipping_methods[ $i ] ) ? WC()->session->chosen_shipping_methods[ $i ] : '';
            $product_names = array();
    
            if ( count( $packages ) > 1 ) {
                foreach ( $package['contents'] as $item_id => $values ) {
                    $product_names[ $item_id ] = $values['data']->get_name() . ' &times;' . $values['quantity'];
                }
                $product_names = apply_filters( 'woocommerce_shipping_package_details_array', $product_names, $package );
            }
            
            $available_methods = [];
            foreach($package['rates'] as $method) {
                $this->add_shipping_package_meta_data($method, $package, $chosen_method);
                $meta_data = $method->get_meta_data();
                $available_methods[] = array(
                    'id' =>  $method->get_id(),
                    'method_id' => $method->get_method_id(),
                    'label' =>  $method->get_label(),
                    'cost' =>  $method->get_cost(),
                    'taxes' =>  $method->get_taxes(),
                    'label_html' =>  wc_cart_totals_shipping_method_label( $method ),
                    'shipping_tax' => $method->get_shipping_tax(),
                    'meta_data' => $method->get_meta_data(),
                );
            }
            
            $shipping_packages[] = array(
                'package'                  => $package,
                'available_methods'        => $available_methods,
                'show_package_details'     => count( $packages ) > 1,
                'package_details'          => implode( ', ', $product_names ),
                /* translators: %d: shipping package number */
                'package_name'             => apply_filters( 'woocommerce_shipping_package_name', ( ( $i + 1 ) > 1 ) ? sprintf( _x( 'Shipping %d', 'shipping packages', 'woocommerce' ), ( $i + 1 ) ) : _x( 'Shipping', 'shipping packages', 'woocommerce' ), $i, $package ),
                'index'                    => $i,
                'chosen_method'            => $chosen_method,
                'formatted_destination'    => WC()->countries->get_formatted_address( $package['destination'], ', ' ),
                'has_calculated_shipping'  => WC()->customer->has_calculated_shipping(),
            );
        }
        return $shipping_packages;
    }

    public function get_cart_items($request) {
        if(! WC()->cart->is_empty()) {
            $cart = array();
            if(is_user_logged_in()) {
                $cart['customer_id'] = get_current_user_id();
            }
            $cart_items = array();
            foreach ( WC()->cart->get_cart() as $cart_item ) {
                $cart_items[] = $this->prepare_cart_item_data( $cart_item, $request );
            }
            $cart['items'] = $cart_items;
            if(WC()->cart->needs_shipping()) {
                $cart['shipping'] = array(
                    'packages' => $this->get_shipping_packages(),
                    'total' => WC()->cart->get_cart_shipping_total(),
                );
            }
            $available_gateways = array();
            if ( WC()->cart->needs_payment() ) {
                $available_gateways = WC()->payment_gateways()->get_available_payment_gateways();
                // WC()->payment_gateways()->set_current_gateway( $available_gateways );
                $cart['gateways'] = !empty($available_gateways) ? $available_gateways : (object) NULL;
            }
            $cart['total'] = WC()->cart->get_total('api');
            $cart['total_html'] = WC()->cart->get_total();
            return rest_ensure_response( $cart );
        }
        return rest_ensure_response( (object) array() );
    }

    public function add_cart_item( $request ) {
        $id = isset( $request['id'] ) ? absint( $request['id'] ) : 0;
        $qty = isset( $request['qty'] ) ? absint( $request['qty'] ) : 1;
        WC()->cart->get_cart();
        WC()->cart->add_to_cart( $id, $qty );
        return $this->get_cart_items($request);
    }
    
    public function update_cart_item( $request ) {
        $id = isset( $request['id'] ) ? absint( $request['id'] ) : 0;
        $qty = isset( $request['qty'] ) ? absint( $request['qty'] ) : 1;
        $cart_item_key = $this->find_cart_key($id);
        if ( $cart_item_key ) {
            WC()->cart->set_quantity( $cart_item_key, $qty );
        }
        return $this->get_cart_items($request);
    }

    /**
     * Remove item from cart
     *
     * @return boolean
     */
    public function remove_cart_item( $request ) {
        $id = isset( $request['id'] ) ? absint( $request['id'] ) : 0;
        $cart_item_key = $this->find_cart_key($id);
        if($cart_item_key) {
            WC()->cart->remove_cart_item( $cart_item_key );
        }
        return $this->get_cart_items($request);
    }
    
    public function empty_cart( $request ) {
        if(! WC()->cart->is_empty()) {
            WC()->cart->empty_cart(true);
        }
        return true;
    }

    public function update_user_address( $request ) {
        if(empty( $request['address'] )) return false;
        $address = $request['address'];
        WC()->customer->set_props(
			array(
				'billing_country'   => isset( $address['billing_country'] ) ? wc_clean( wp_unslash( $address['billing_country'] ) ) : null,
				'billing_state'     => isset( $address['billing_state'] ) ? wc_clean( wp_unslash( $address['billing_state'] ) ) : null,
				'billing_postcode'  => isset( $address['billing_postcode'] ) ? wc_clean( wp_unslash( $address['billing_postcode'] ) ) : null,
				'billing_city'      => isset( $address['billing_city'] ) ? wc_clean( wp_unslash( $address['billing_city'] ) ) : null,
				'billing_address_1' => isset( $address['billing_address_1'] ) ? wc_clean( wp_unslash( $address['billing_address_1'] ) ) : null,
				'billing_address_2' => isset( $address['billing_address_2'] ) ? wc_clean( wp_unslash( $address['billing_address_2'] ) ) : null,
			)
        );

        if ( !isset($address['differentShippingAddress']) || ! $address['differentShippingAddress'] ) {
			WC()->customer->set_props(
				array(
					'shipping_country'   => isset( $address['billing_country'] ) ? wc_clean( wp_unslash( $address['billing_country'] ) ) : null,
					'shipping_state'     => isset( $address['billing_state'] ) ? wc_clean( wp_unslash( $address['billing_state'] ) ) : null,
					'shipping_postcode'  => isset( $address['billing_postcode'] ) ? wc_clean( wp_unslash( $address['billing_postcode'] ) ) : null,
					'shipping_city'      => isset( $address['billing_city'] ) ? wc_clean( wp_unslash( $address['billing_city'] ) ) : null,
					'shipping_address_1' => isset( $address['billing_address_1'] ) ? wc_clean( wp_unslash( $address['billing_address_1'] ) ) : null,
					'shipping_address_2' => isset( $address['billing_address_2'] ) ? wc_clean( wp_unslash( $address['billing_address_2'] ) ) : null,
				)
			);
		} else {
			WC()->customer->set_props(
				array(
					'shipping_country'   => isset( $address['shipping_country'] ) ? wc_clean( wp_unslash( $address['shipping_country'] ) ) : null,
					'shipping_state'     => isset( $address['shipping_state'] ) ? wc_clean( wp_unslash( $address['shipping_state'] ) ) : null,
					'shipping_postcode'  => isset( $address['shipping_postcode'] ) ? wc_clean( wp_unslash( $address['shipping_postcode'] ) ) : null,
					'shipping_city'      => isset( $address['shipping_city'] ) ? wc_clean( wp_unslash( $address['shipping_city'] ) ) : null,
					'shipping_address_1' => isset( $address['shipping_address_1'] ) ? wc_clean( wp_unslash( $address['shipping_address_1'] ) ) : null,
					'shipping_address_2' => isset( $address['shipping_address_2'] ) ? wc_clean( wp_unslash( $address['shipping_address_2'] ) ) : null,
				)
			);
        }
        WC()->cart->calculate_shipping();
        WC()->customer->save();
        return $this->get_cart_items($request);
    }

}


