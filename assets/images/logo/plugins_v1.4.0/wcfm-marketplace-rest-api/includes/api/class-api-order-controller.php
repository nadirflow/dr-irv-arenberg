<?php
class WCFM_REST_Order_Controller extends WCFM_REST_Controller {
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
  protected $base = 'orders';

  /**
    * Post type
    *
    * @var string
    */
  protected $post_type = 'shop_order';
  
   /**
     * Post status
     */
    protected $post_status = array();

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
        $this->post_status = array_keys( wc_get_order_statuses() );

//        add_filter( 'woocommerce_new_order_data', array( $this, 'set_order_vendor_id' ) );
//        add_action( 'woocommerce_rest_insert_shop_order_object', array( $this, 'after_order_create' ), 10, 2 );
    }
    
  /**
   * Register the routes for orders.
   */
  public function register_routes() {
      register_rest_route( $this->namespace, '/' . $this->base, array(
          array(
              'methods'             => WP_REST_Server::READABLE,
              'callback'            => array( $this, 'get_items' ),
              'permission_callback' => array( $this, 'get_orders_permissions_check' ),
              'args'                => $this->get_collection_params(),
          ),
          'schema' => array( $this, 'get_public_item_schema' ),
      ) );
      
      register_rest_route( $this->namespace, '/' . $this->base . '/(?P<id>[\d]+)/', array(
            'args' => array(
                'id' => array(
                    'description' => __( 'Unique identifier for the object.', 'wcfm-marketplace-rest-api' ),
                    'type'        => 'integer',
                )
            ),
            array(
                'methods'             => WP_REST_Server::READABLE,
                'callback'            => array( $this, 'get_item' ),
                'args'                => $this->get_collection_params(),
                'permission_callback' => array( $this, 'get_single_order_permissions_check' ),
            ),
            array(
                'methods'             => WP_REST_Server::EDITABLE,
                'callback'            => array( $this, 'update_order_status' ),
                'args'                => array(
                    'status' => array(
                        'type'        => 'string',
                        'description' => __( 'Order Status', 'wcfm-marketplace-rest-api' ),
                        'required'    => true,
                        'sanitize_callback' => 'sanitize_text_field',
                    )
                ),
                'permission_callback' => array( $this, 'update_order_status_permissions_check' ),
            ),
      ));

      register_rest_route( $this->namespace, '/' . $this->base . '/note/(?P<id>[\d]+)/', array(
            'args' => array(
                'id' => array(
                    'description' => __( 'Unique identifier for the object.', 'wcfm-marketplace-rest-api' ),
                    'type'        => 'integer',
                )
            ),
            array(
                'methods'             => WP_REST_Server::READABLE,
                'callback'            => array( $this, 'get_order_notes' ),
                'args'                => $this->get_collection_params(),
                'permission_callback' => array( $this, 'get_order_note_permissions_check' ),
            ),
            array(
                'methods'             => WP_REST_Server::EDITABLE,
                'callback'            => array( $this, 'add_order_note' ),  
                'args'                => $this->get_endpoint_args_for_item_schema( WP_REST_Server::EDITABLE ),              
                'permission_callback' => array( $this, 'add_order_note_permissions_check' ),
            ),
      ));

      register_rest_route( $this->namespace, '/' . $this->base . '/shipment_tracking/', array(            
            array(
                'methods'             => WP_REST_Server::EDITABLE,
                'callback'            => array( $this, 'update_shipment_tracking' ),
                'args'                => $this->get_endpoint_args_for_item_schema( WP_REST_Server::EDITABLE ),
                'permission_callback' => array( $this, 'update_shipment_tracking_permissions_check' ),
            ),
      ));
  }
  
  /**
     * Get object.
     *
     * @since  1.0.0
     * @param  int $id Object ID.
     * @return WC_Data
     */
    public function get_object( $id ) {
      if(!wc_get_order($id))
        return new WP_Error( "wcfmapi_rest_invalid_{$this->post_type}_id", sprintf( __( "Invalid ID", 'wcfm-marketplace-rest-api' ), __METHOD__ ), array( 'status' => 404 ) );
      return wc_get_order( $id );
    }
  
  
  /**
     * Checking if have any permission to view orders
     *
     * @since 1.0.0
     *
     * @return boolean
     */
  public function get_orders_permissions_check() {
    if( !is_user_logged_in() )
      return false;
    if( apply_filters( 'wcfm_is_allow_orders', true ) )
      return true;
    return false;
  }
    
  public function update_order_status_permissions_check() {
    if( !is_user_logged_in() )
      return false;
    if( apply_filters( 'wcfm_is_allow_order_status_update', true ) )
      return true;
    return false;
  }
    
  public function get_single_order_permissions_check() {
    if( !is_user_logged_in() )
      return false;
    if( apply_filters( 'wcfm_is_allow_order_details', true ) )
      return true;
    return false;
  }

  public function get_order_note_permissions_check() {
    if( !is_user_logged_in() )
      return false;
    if( apply_filters( 'wcfm_is_allow_manage_order', true ) )
      return true;
    return false;
  }

  public function add_order_note_permissions_check() {
    if( !is_user_logged_in() )
      return false;
    if( apply_filters( 'wcfm_is_allow_manage_order', true ) )
      return true;
    return false;
  }

  public function update_shipment_tracking_permissions_check() {
    if( !is_user_logged_in() )
      return false;
    if( apply_filters( 'wcfm_is_allow_manage_order', true ) )
      return true;
    return false;
  }
    
  
  public function get_post_type_items( $request ) {
    global $WCFM;
      
    $orders = $this->get_objects_from_database($request);
    $order_return_obj = array();
    foreach ($orders as $each_order ) {
      
      if($each_order->vendor_id) {
        $order_object = $this->get_object( $each_order->order_id );
        $formated_order_data = $this->get_formatted_item_data($order_object, $each_order->vendor_id );
        $formated_order_data['vendor_order_details'] = $each_order;
        $order_return_obj[] =  $formated_order_data;
      } else {
        $order_object = $this->get_object($each_order->ID);
        
        $order_return_obj[] = $this->get_formatted_item_data($order_object, 0 );
      }
    }
    $response = rest_ensure_response($order_return_obj);
    return apply_filters( "wcfmapi_rest_prepare_{$this->post_type}_objects", $response, $orders, $request );
  }
  
  protected function get_objects_from_database( $request ) {
    global $WCFM;
    $_POST["controller"] = 'wcfm-orders';
    $_POST['length'] = !empty($request['per_page']) ? intval($request['per_page']) : 10;
    $_POST['start'] = !empty($request['page']) ? ( intval($request['page']) - 1 ) * $_POST['length'] : 0;
//    if(empty($request['page'])){
//      $_POST['start'] = !empty($request['offset']) ? intval($request['offset']) : 0;
//    }
    $_POST['filter_date_form'] = !empty($request['after']) ? $request['after'] : '';
    $_POST['filter_date_to'] = !empty($request['before']) ? $request['before'] : '';
    $_POST['search']['value'] = !empty($request['search']) ? $request['search'] : '';    
    $_POST['orderby'] = !empty($request['orderby']) ? $request['orderby'] : '';
    $_POST['order'] = !empty($request['order']) ? $request['order'] : '';
    
    define('WCFM_REST_API_CALL', TRUE);
    $WCFM->init();
    $orders = $WCFM->ajax->wcfm_ajax_controller();
    return $orders;
  }
  
  
  public function get_post_type_item( $request , $id ) {
    global $WCFM;
    $order_return_obj = array();
    if( wcfm_is_vendor() ) {
      
      $is_order_for_vendor = $WCFM->wcfm_vendor_support->wcfm_is_order_for_vendor( $id );
      if( $is_order_for_vendor ) {
        $current_vendor   = apply_filters( 'wcfm_current_vendor_id', get_current_user_id() );
        $order_object = $this->get_object( $id );
        $order_return_obj = $this->get_formatted_item_data($order_object, $current_vendor );
      } else {
        return new WP_Error( "wcfmapi_rest_invalid_vendor", sprintf( __( "Invalid Vendor - Order Id do not belong to the loggedin vendor", 'wcfm-marketplace-rest-api' ), __METHOD__ ), array( 'status' => 404 ) );
      }
      
    } else {
      $order_object = $this->get_object( $id );
      $order_return_obj = $this->get_formatted_item_data($order_object, 0 );
    }
    $response = rest_ensure_response($order_return_obj);
    return apply_filters( "wcfmapi_rest_prepare_{$this->post_type}_object", $response, $order_object, $request );
  }
  
  
  protected function get_formatted_item_data( $object, $each_order_vendor_id ) {
    $data = $object->get_data();
    $order_id = $data['id'];
    $order_status = $data['status'];
    //print_r($data);die;
    $format_date       = array( 'date_created', 'date_modified', 'date_completed', 'date_paid' );
    $format_line_items = array( 'line_items', 'tax_lines', 'shipping_lines', 'fee_lines', 'coupon_lines' );

    // Format date values.
    foreach ( $format_date as $key ) {
      $datetime              = $data[ $key ];
      $data[ $key ]          = wc_rest_prepare_date_response( $datetime, false );
      $data[ $key . '_gmt' ] = wc_rest_prepare_date_response( $datetime );
    }

    // Format state and country
    if($data['billing']['state']) {
      $data['billing']['state'] = WC()->countries->get_states( $data['billing']['country'] )[$data['billing']['state']];
    }
    if($data['shipping']['state']) {
      $data['shipping']['state'] = WC()->countries->get_states( $data['shipping']['country'] )[$data['shipping']['state']];
    }

    // Add Commission Head
    $data['commission_head'] = $this->wcfmmp_line_item_commission_head($object, $each_order_vendor_id);

    // Add Delivery datetime & location
    $data['user_delivery_location'] = $object->get_meta('_wcfmmp_user_location', true);
    $wcfmd_delvery_times = $object->get_meta('_wcfmd_delvery_times', true);
    if( !empty(  $wcfmd_delvery_times ) ) {
      $data['user_delivery_time'] = date('Y-m-d H:i:s', $wcfmd_delvery_times[$each_order_vendor_id]);
    }    
    
    // Format line items.
    
    foreach ( $format_line_items as $key ) {
      if( $each_order_vendor_id ) {
        $line_item_datas = array_values( array_map( array( $this, 'get_order_item_data' ),  $data[ $key ] ) );
        $line_item_datas_final = array();
        //print_r($line_item_datas);
        if($key == 'line_items') {
          //print_r($line_item_datas);
          foreach( $line_item_datas as $item_key => $line_item ) {
            $order_item_product = new WC_Order_Item_Product($line_item['id']);
            $order_product_vendor_id = $order_item_product->get_meta('_vendor_id', true);
            if( $order_product_vendor_id && $order_product_vendor_id  == $each_order_vendor_id ) {

              // Add Store Name
              if( $this->is_vendor_sold_by( absint($order_product_vendor_id) ) ) {

                $shop_name = wcfm_get_vendor_store_name( absint($order_product_vendor_id) );

                $line_item['store_name'] = $shop_name;

              }
              // Add Commission Value
              $line_item['commission_value'] = $this->wcfmmp_line_item_commission($order_item_product, $object, $order_product_vendor_id);

              $line_item_datas_final[] = $line_item;
            }
            // $line_item_datas_final[] = $line_item;
          } 
        } 
        else if( $key == 'shipping_lines' ) {
          foreach( $line_item_datas as $item_key => $line_item ) {
            //var_dump($line_item['id']);
            $order_item_shipping = new WC_Order_Item_Shipping($line_item['id']);
            $shipping_vendor_id = $order_item_shipping->get_meta('vendor_id', true);
            if( $shipping_vendor_id && $shipping_vendor_id  == $each_order_vendor_id ) {

              // Add Store Name
              if( $this->is_vendor_sold_by( absint($shipping_vendor_id) ) ) {

                $shop_name = wcfm_get_vendor_store_name( absint($shipping_vendor_id) );

                $line_item['store_name'] = $shop_name;

              }
              $line_item_datas_final[] = $line_item;
            }
            // $line_item_datas_final[] = $line_item;
          }
        } 
        else {
          $line_item_datas_final = $line_item_datas;
        }
        $data[ $key ] = $line_item_datas_final;
        
      } else {
        $data[ $key ] = array_values( array_map( array( $this, 'get_order_item_data' ),  $data[ $key ] ) );
      }
    }

    // Add Shipment Tracking
    if( ( ( $object->needs_shipping_address() && $object->get_formatted_shipping_address() ) || apply_filters( 'wcfm_is_force_shipping_address', false ) ) && ( !function_exists( 'wcs_order_contains_subscription' ) || ( !wcs_order_contains_subscription( $order_id, 'renewal' ) && !wcs_order_contains_subscription( $order_id, 'renewal' ) ) ) && apply_filters( 'wcfm_is_pref_shipment_tracking', true ) && apply_filters( 'wcfm_is_allow_shipping_tracking', true ) && !in_array( $order_status, apply_filters( 'wcfm_shipment_disable_order_status', array( 'failed', 'cancelled', 'refunded', 'pending' ) ) ) ) {

      $data['shipment_tracking'] = $this->get_order_shipping_data( $object );
    }

    $data['status'] = apply_filters( 'wcfm_current_order_status', $data['status'], $data['id'] );
    
    // Format the order status.
    $data['status'] = 'wc-' === substr( $data['status'], 0, 3 ) ? substr( $data['status'], 3 ) : $data['status'];
    return $data;
  }
  
  
  /**
    * Expands an order item to get its data.
    *
    * @param WC_Order_item $item
    *
    * @return array
    */
  protected function get_order_item_data( $item ) { 

      $data           = $item->get_data();

      // Add Shop Name
      /*$meta_data         = $item->get_meta_data();
      foreach ( $meta_data as $meta ) {

        if( !is_array( $meta->key ) ) {

          $meta->key     = rawurldecode( (string) $meta->key );

          if( $meta->key == '_vendor_id' ) {

            $meta->value   = rawurldecode( (string) $meta->value );

            if( $this->is_vendor_sold_by( absint($meta->value) ) ) {

              $shop_name = wcfm_get_vendor_store_name( absint($meta->value) );

              $data['shop_name'] = $shop_name;

            }            

          }

        }

      } */     

      $format_decimal = array( 'subtotal', 'subtotal_tax', 'total', 'total_tax', 'tax_total', 'shipping_tax_total' );

      // Format decimal values.
      foreach ( $format_decimal as $key ) {
          if ( isset( $data[ $key ] ) ) {
              $data[ $key ] = wc_format_decimal( $data[ $key ], ( isset($this->request['dp']) ) ? $this->request['dp'] : false );
          }
      }

      // Add SKU, THUMBNAIL and PRICE to products.
      if ( is_callable( array( $item, 'get_product' ) ) ) {
          $_product = $item->get_product();
          $data['sku']   = $_product ? $_product->get_sku(): null;
          $data['thumbnail']     = $_product ? apply_filters( 'woocommerce_admin_order_item_thumbnail', $_product->get_image( 'thumbnail', array( 'title' => '' ), false ), $data['id'], $item ) : '';
          $data['image_url'] = $_product ? wp_get_attachment_image_url( $_product->get_image_id(), 'thumbnail' ) : null;
          $data['price'] = (float)( $item->get_total() / max( 1, $item->get_quantity() ) );
      }

      // Format taxes.
      if ( ! empty( $data['taxes']['total'] ) ) {
          $taxes = array();

          foreach ( $data['taxes']['total'] as $tax_rate_id => $tax ) {
              $taxes[] = array(
                  'id'       => $tax_rate_id,
                  'total'    => $tax,
                  'subtotal' => isset( $data['taxes']['subtotal'][ $tax_rate_id ] ) ? $data['taxes']['subtotal'][ $tax_rate_id ] : '',
              );
          }
          $data['taxes'] = $taxes;
      } elseif ( isset( $data['taxes'] ) ) {
          $data['taxes'] = array();
      }

      // Remove names for coupons, taxes and shipping.
      if ( isset( $data['code'] ) || isset( $data['rate_code'] ) || isset( $data['method_title'] ) ) {
          unset( $data['name'] );
      }

      // Remove props we don't want to expose.
      unset( $data['order_id'] );
      unset( $data['type'] );

      return $data;
  }

  /**

   * Return is show sold by label

   * @return boolean

   */

  public function is_vendor_sold_by( $vendor_id = '' ) {

    global $WCFM, $WCFMmp;

    

    $wcfmmp_marketplace_options   = get_option( 'wcfm_marketplace_options', array() );

    $vendor_sold_by = isset( $wcfmmp_marketplace_options['vendor_sold_by'] ) ? $wcfmmp_marketplace_options['vendor_sold_by'] : 'yes';

    if( $vendor_sold_by == 'yes' ) {

      if( !$vendor_id || ( $vendor_id && apply_filters( 'wcfmmp_is_allow_sold_by', true, $vendor_id ) && $WCFM->wcfm_vendor_support->wcfm_vendor_has_capability( $vendor_id, 'sold_by' ) ) ) {

        return true;

      } else {

        return false;

      }

    }

    return false;

  }

  // WCFMmp Line Item Commission Head

  protected function wcfmmp_line_item_commission_head( $order, $vendor_id ) {

    global $WCFM, $WCFMmp;
    

    if( wcfm_vendor_has_capability( $vendor_id, 'view_commission' ) ) {

      $admin_fee_mode = apply_filters( 'wcfm_is_admin_fee_mode', false );

      if( $admin_fee_mode ) {

        return __( 'Fees', 'wc-frontend-manager' );

      } else {

        return __( 'Earning', 'wc-frontend-manager' );

      }

    }

  }

  // WCFMmp Line item Commission

  protected function wcfmmp_line_item_commission( $item, $order, $vendor_id ) {

    global $WCFM, $wpdb, $WCFMmp;

    if( !wcfm_vendor_has_capability( $vendor_id, 'view_commission' ) ) return;    

    $order_currency = $order->get_currency();

    $admin_fee_mode = apply_filters( 'wcfm_is_admin_fee_mode', false );    

    $qty = ( isset( $item['qty'] ) ? esc_html( $item['qty'] ) : '1' );    

    if ( $WCFMmp->wcfmmp_vendor->is_vendor_deduct_discount( $vendor_id, $order->get_id() ) ) {

      $line_total = $item->get_total();

    } else {

      $line_total = $item->get_subtotal();

    }    

    if( $item->get_product_id() ) {

      $product_id = $item->get_product_id();

      $variation_id = $item->get_variation_id();

    } else {

      $product_id = wc_get_order_item_meta( $item->get_id(), '_product_id', true );

      $variation_id = wc_get_order_item_meta( $item->get_id(), '_variation_id', true );

    }    

    $sql = "

      SELECT item_id, is_refunded, commission_amount AS line_total, shipping AS total_shipping, tax, shipping_tax_amount 

      FROM {$wpdb->prefix}wcfm_marketplace_orders

      WHERE (product_id = " . $product_id . " OR variation_id = " . $variation_id . ")

      AND   order_id    = " . $order->get_id() . "

      AND   item_id     = " . $item->get_id() . "

      AND   `vendor_id` = " . $vendor_id;

    $order_line_due = $wpdb->get_results( $sql );

    

    if( !empty( $order_line_due ) && !$order_line_due[0]->is_refunded ) {

      if ( $get_shipping = $WCFMmp->wcfmmp_vendor->is_vendor_get_shipping( $vendor_id ) ) {

        //$line_total += $order_line_due[0]->total_shipping;

      }

      if ( $WCFMmp->wcfmmp_vendor->is_vendor_get_tax( $vendor_id ) ) {

        $line_total += $order_line_due[0]->tax; 

        $order_line_due[0]->line_total += $order_line_due[0]->tax;

        if( $get_shipping ) {

          //$line_total += $order_line_due[0]->shipping_tax_amount;

        }

      }

      if( $admin_fee_mode ) {

        $refunded = $order->get_total_refunded_for_item( $item->get_id() );

        return $line_total - $refunded - $order_line_due[0]->line_total;

      } else {

        return $order_line_due[0]->line_total;

      }

    } else {

      return 0;

    }

  }

  /**
   *
   *
   */
  protected function get_order_shipping_data( $order ) {

    global $WCFM;

    $needs_shipping_tracking = false; 

    $product_ids = array();

    $order_item_ids = array();

    $line_items = $order->get_items( 'line_item' );

    $line_items = apply_filters( 'wcfm_valid_line_items', $line_items, $order->get_id() );

    $shipment_tracking_data = array();

    foreach ( $line_items as $item_id => $item ) {

      $each_data = array();

      $_product  = $item->get_product();            

      $needs_shipping = $WCFM->frontend->is_wcfm_needs_shipping( $_product );

      $shipped = true;

      $tracking_url  = '';

      $tracking_code = '';

      $delivery_boy  = '';

      $delivery_boy_name = '';

      if( $needs_shipping ) {

        $shipped = false;

        foreach ( $item->get_formatted_meta_data() as $meta_id => $meta ) {

          if( $meta->key == 'wcfm_tracking_url' ) {

            $tracking_url  = $meta->value;

            $shipped = true;

          } elseif( $meta->key == 'wcfm_tracking_code' ) {

            $tracking_code  = $meta->value;

          } elseif( $meta->key == 'wcfm_delivery_boy' ) {

            $delivery_boy  = $meta->value;

          }

        }

      } else {

        continue;

      }      

      $order_item_ids[] = $item->get_id();

      $product_ids[]    = $item->get_product_id();

      $each_data['item_id'] = $item->get_id();
      $each_data['product_id'] = $item->get_product_id();

      //if( $shipped ) continue;

      $needs_shipping_tracking = true;
    

      if( ( !empty( $product_ids ) && ( count( $product_ids ) == 1 ) ) || apply_filters( 'wcfm_is_allow_itemwise_notification', true ) ) {

          $each_data['product_name'] = esc_html( $item->get_name() );

          if ( $_product && $_product->get_sku() ) {

            $each_data['sku'] = esc_html( $_product->get_sku() );

          }

          if ( $tracking_code ) {
            
            $each_data['tracking_code'] = $tracking_code;

          }          

          if ( $tracking_url ) {

            $each_data['tracking_url'] = $tracking_url;

          }

          if ( $delivery_boy ) {

            $each_data['delivery_boy'] = $delivery_boy;
            $wcfm_delivery_boy_user = get_userdata( absint( $delivery_boy ) );
            if ( $wcfm_delivery_boy_user ) {
              $delivery_boy_name = apply_filters( 'wcfm_delivery_boy_display', $wcfm_delivery_boy_user->first_name . ' ' . $wcfm_delivery_boy_user->last_name, $delivery_boy );
              $each_data['delivery_boy_name'] = $delivery_boy_name;
            }

          }

          if ( function_exists( 'wcfm_is_order_delivered' ) ) {

            $is_order_delivered = wcfm_is_order_delivered( $order->get_id(), $item_id );

            if( $is_order_delivered ) {

              $each_data['delivery_status'] = 'completed';

            } else {

              $each_data['delivery_status'] = 'pending';

            }
          }
    
          if( $_product ) {

            $each_data['mark_shipped'] = true;

          }
      }

      $shipment_tracking_data['each_data'][] = $each_data;

    }

    if( !empty( $product_ids ) && ( count( $product_ids ) > 1 ) ) {

        $shipment_tracking_data['mark_all'] = array(

          'product_ids' => $product_ids,
          'order_item_ids' => $order_item_ids

        );

    }

    $wcfm_delivery_boys_array = function_exists( 'wcfm_get_delivery_boys' ) ? wcfm_get_delivery_boys() : array();

    if(!empty($wcfm_delivery_boys_array)) {

      $delivery_users = array();

      foreach( $wcfm_delivery_boys_array as $wcfm_delivery_boys_single ) {

        $delivery_users[] = array( 'id' => $wcfm_delivery_boys_single->ID,
                                   'name' => $wcfm_delivery_boys_single->first_name . ' ' . $wcfm_delivery_boys_single->last_name . ' (' . $wcfm_delivery_boys_single->user_email . ')');

      }

      $shipment_tracking_data['delivery_boys'] = $delivery_users;
      
    }    

    return $shipment_tracking_data;

  }

  public function update_shipment_tracking( $request ) {
    global $WCFM, $WCFMu;
    
    $_POST['orderid'] = !empty($request['order_id']) ? $request['order_id'] : '';

    $_POST['tracking_data'] = "";

    $_POST['tracking_data'] .= "wcfm_tracking_order_id=";
    $_POST['tracking_data'] .= !empty($request['order_id']) ? $request['order_id'] : "";
    $_POST['tracking_data'] .= "&wcfm_tracking_product_id=";
    $_POST['tracking_data'] .= !empty($request['product_id']) ? $request['product_id'] : "";
    $_POST['tracking_data'] .= "&wcfm_tracking_order_item_id=";
    $_POST['tracking_data'] .= !empty($request['item_id']) ? $request['item_id'] : "";
    $_POST['tracking_data'] .= "&wcfm_tracking_url=";
    $_POST['tracking_data'] .= !empty($request['tracking_url']) ? $request['tracking_url'] : "";
    $_POST['tracking_data'] .= "&wcfm_tracking_code=";
    $_POST['tracking_data'] .= !empty($request['tracking_code']) ? $request['tracking_code'] : "";
    $_POST['tracking_data'] .= "&wcfm_delivery_boy=";
    $_POST['tracking_data'] .= !empty($request['delivery_boy']) ? $request['delivery_boy'] : "";
       
    define('WCFM_REST_API_CALL', TRUE);
    $WCFMu->init_wcfmu();
    $wcfm_tracking_data = $WCFMu->wcfmu_shipment_tracking->wcfm_wcfmmarketplace_order_mark_shipped();
    
    $order_id = absint( $wcfm_tracking_data['wcfm_tracking_order_id'] );
    $order    = wc_get_order( $order_id );
    $response = array('order_id' => $order_id);
    $response['order_status'] = apply_filters( 'wcfm_current_order_status', $order->get_status(), $order->get_id() );
    $response['tracking_data'] = $wcfm_tracking_data;
    
    return rest_ensure_response( $response );

  }

  public function update_order_status( $request ) {

    global $WCFM;

      $id             = isset( $request['id'] ) ? absint( $request['id'] ) : 0;
      $status         = isset( $request['status'] ) ? $request['status'] : '';
      
      if(substr($status, 0, 2) !== 'wc-'){
        $status = 'wc-' . $status;
      }
      $order_statuses = wc_get_order_statuses();

      if ( empty( $id ) ) {
          return new WP_Error( "wcfmapi_rest_invalid_{$this->post_type}_id", __( 'Invalid order ID', 'wcfm-marketplace-rest-api' ), array(
              'status' => 404,
          ) );
      }

      if ( empty( $status ) ) {
          return new WP_Error( "wcfmapi_rest_empty_{$this->post_type}_status", __( 'Order status must me required', 'wcfm-marketplace-rest-api' ), array(
              'status' => 404,
          ) );
      }

      if ( ! in_array( $status, array_keys( $order_statuses ) ) ) {
          return new WP_Error( "wcfmapi_rest_invalid_{$this->post_type}_status", __( 'Order status not valid', 'wcfm-marketplace-rest-api' ), array(
              'status' => 404,
          ) );
      }

      // $order = $this->get_object( $id );
      // $order->set_status( $status );
      // $order =  apply_filters( "wcfmapi_rest_pre_insert_{$this->post_type}_object", $order, $request );
      // $order->save();
      $_POST['order_id'] = $id;
      $_POST['order_status'] = $status;
      define('WCFM_REST_API_CALL', TRUE);
      $WCFM->init();
      $order_status_change = $WCFM->ajax->wcfm_modify_order_status();
      return $this->get_post_type_item($request, $id);
  }

  /**

   * Handle Order Note Add

   */

  public function add_order_note( $request ) {

    global $WCFM, $WCFMu, $woocommerce;
    

    $user_id   = apply_filters( 'wcfm_current_vendor_id', get_current_user_id() );

    $user      = $user_id;
    $comment_id = '';
    

    //parse_str($_POST['note_data'], $wcfm_note_data);

    $order_id   = absint( $request['id'] );
    //$noteData = $request['noteData'];

    $note       = apply_filters( 'wcfm_editor_content_before_save', wp_kses_post( trim( stripslashes( $request['note'] ) ) ) );

    $note_type  = $request['note_type'];



    $is_customer_note = $note_type == 'customer' ? 1 : 0;

    $note_class = '';

    if($is_customer_note) $note_class = 'customer-note';



    if ( $order_id > 0 ) {

      $order      = wc_get_order( $order_id );      

      if( apply_filters( 'wcfm_is_allow_order_note_attachments', true ) ) {

        $attachments = $request['attachments'];

        if( !empty( $attachments ) ) {

          $attachment_data = '';

          foreach( $attachments as $index => $attachment ) {

            if( isset( $attachment['attachmentData'] ) && !empty( $attachment['attachmentData'] ) ) {

              $name = !empty( $attachment['attachmentText'] ) ? $attachment['attachmentText'] : __  ( 'Attachment', 'wc-frontend-manager-ultimate' ) . ' ' . $index;

              if( $index != 0  ) $note .= ',&nbsp;';

              $attachment_data .= '<a class="wcfm_dashboard_item_title wcfm_linked_attached" target="_blank" href="' . $attachment['attachmentData']['source_url'] . '">' . $name . '</a>';

            }

          }

          if( !empty( $attachment_data ) ) {

            $note .= "<br />" . __  ( 'Attachments', 'wc-frontend-manager-ultimate' ) . ': ' . $attachment_data;

          }

        }

      }

      

      $note = apply_filters( 'wcfm_order_note_before_save', $note, $request );

      

      // Vendor association

      if( wcfm_is_vendor() ) {

        if( apply_filters( 'wcfmmp_is_allow_sold_by', true, $user_id ) && $WCFM->wcfm_vendor_support->wcfm_vendor_has_capability( $user_id, 'sold_by' ) && apply_filters( 'wcfm_is_allow_order_note_vendor_reference', true ) ) {

          $note = sprintf( __( '%s has added the following note', 'wc-frontend-manager-ultimate' ), wcfm_get_vendor_store( $user_id ) ) . ': ' . "<br />"  . $note;

        }

        

        add_filter( 'woocommerce_new_order_note_data', array( $WCFMu->wcfmu_marketplace, 'filter_wcfm_vendors_comment' ), 10, 2 );

      }

      

      $comment_id = $order->add_order_note( $note, $is_customer_note, true );

      

      // Vendor association

      if( wcfm_is_vendor() ) remove_filter( 'woocommerce_new_order_note_data', array( $WCFMu->wcfmu_marketplace, 'filter_wcfm_vendors_comment' ), 10, 2 );      

    }

    $notes = $this->get_order_notes(array('id' => $request['id']));
    $response = rest_ensure_response($notes);
    return $response;

  }


  public function get_order_notes( $request ) {

    $args = array(

        'post_id'   => $request['id'],

        'orderby'   => 'comment_ID',

        'order'     => 'DESC',

        'approve'   => 'approve',

        'type'      => 'order_note'

      );

    $args = apply_filters( 'wcfm_order_notes_args', $args );

    //$notes = apply_filters( 'wcfm_order_notes', get_comments( $args ), $request['id'] );

    $notes = wc_get_order_notes( $args );

    $response = rest_ensure_response($notes);
    
    return $response;
  }


}