<?php
class WCFM_REST_Booking_Controller extends WCFM_REST_Controller {
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
  protected $base = 'bookings';

  /**
    * Post type
    *
    * @var string
    */
  protected $post_type = 'wc_booking';
  
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
     * @since 1.1.1
     *
     * @return array
     */
    public function __construct() {
    }
    
  /**
   * Register the routes for bookings.
   */
  public function register_routes() {
      register_rest_route( $this->namespace, '/' . $this->base, array(
          array(
            'methods'             => WP_REST_Server::READABLE,
            'callback'            => array( $this, 'get_items' ),
            'permission_callback' => array( $this, 'get_bookings_permissions_check' ),
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
                'permission_callback' => array( $this, 'get_single_booking_permissions_check' ),
            ),
            array(
                'methods'             => WP_REST_Server::EDITABLE,
                'callback'            => array( $this, 'update_booking' ),
                'args'                => $this->get_endpoint_args_for_item_schema( WP_REST_Server::EDITABLE ),
                'permission_callback' => array( $this, 'update_single_booking_permissions_check' ),
            ),
      ));

      register_rest_route( $this->namespace, '/' . $this->base . '/update-status/(?P<id>[\d]+)/', array(
            'args' => array(
                'id' => array(
                    'description' => __( 'Unique identifier for the object.', 'wcfm-marketplace-rest-api' ),
                    'type'        => 'integer',
                )
            ),
            array(
                'methods'             => WP_REST_Server::EDITABLE,
                'callback'            => array( $this, 'update_booking_status' ),
                /*'args'                => array(
                    'status' => array(
                        'type'        => 'string',
                        'description' => __( 'Booking Status', 'wcfm-marketplace-rest-api' ),
                        'required'    => true,
                        'sanitize_callback' => 'sanitize_text_field',
                    )
                ),*/
                'permission_callback' => array( $this, 'update_booking_status_permissions_check' ),
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
      if(!get_wc_booking($id))
        return new WP_Error( "wcfmapi_rest_invalid_{$this->post_type}_id", sprintf( __( "Invalid ID", 'wcfm-marketplace-rest-api' ), __METHOD__ ), array( 'status' => 404 ) );
      return get_wc_booking( $id );
    }
  
  
  /**
     * Checking if have any permission to view bookings
     *
     * @since 1.0.0
     *
     * @return boolean
     */
  public function get_bookings_permissions_check() {
    if( !is_user_logged_in() )
      return false;     
    if( apply_filters( 'wcfm_is_allow_booking_list', true ) )
      return true;
    return false;
  }
  
  public function get_single_booking_permissions_check() {
    if( !is_user_logged_in() )
      return false;
    if( apply_filters( 'wcfm_is_allow_booking_list', true ) )
      return true;
    return false;
  }

  public function update_single_booking_permissions_check() {
    if( !is_user_logged_in() )
      return false;
    if( apply_filters( 'wcfm_is_allow_booking_list', true ) )
      return true;
    return false;
  }

  public function update_booking_status_permissions_check() {
    if( !is_user_logged_in() )
      return false;
    if( apply_filters( 'wcfm_is_allow_booking_list', true ) )
      return true;
    return false;
  }
    
  
  public function get_post_type_items( $request ) {
    global $WCFM;
    if(!wcfm_is_booking())
      return new WP_Error( "wcfmapi_rest_forbidden", sprintf( __( "Booking plugin is not active", 'wcfm-marketplace-rest-api' ), __METHOD__ ), array( 'status' => 403 ) );
    $bookings = $this->get_objects_from_database($request);
    $booking_return_obj = array();
    foreach ($bookings as $each_booking ) {
        $booking_object = $this->get_object($each_booking->ID);
        $formated_booking_data = $this->get_formatted_item_data( $booking_object );
        $booking_return_obj[] = $formated_booking_data;
    }
    $response = rest_ensure_response($booking_return_obj);
    return apply_filters( "wcfmapi_rest_prepare_{$this->post_type}_objects", $response, $bookings, $request );
  }
  
  public function get_post_type_item( $request , $id ) {
    global $WCFM;
    
    if(!wcfm_is_booking())
      return new WP_Error( "wcfmapi_rest_forbidden", sprintf( __( "Booking plugin is not active", 'wcfm-marketplace-rest-api' ), __METHOD__ ), array( 'status' => 403 ) );
    //$booking_return_obj = array();
    $booking_object = $this->get_object($id);
    //return $booking_object->get_data();die;
    $formated_booking_data = $this->get_formatted_item_data( $booking_object );
    //$order = wc_get_order($formated_booking_data['order_id']);
    //$formated_booking_data['order'] = $order->get_data();
    
    $booking_return_obj = $formated_booking_data;
    $response = rest_ensure_response($booking_return_obj);
    return apply_filters( "wcfmapi_rest_prepare_{$this->post_type}_object", $response, $booking_object, $request );
  }
  
  protected function get_objects_from_database( $request ) {
    global $WCFM;
    $_POST["controller"] = 'wcfm-bookings';
    
    $_POST['length'] = !empty($request['per_page']) ? intval($request['per_page']) : 10;
    $_POST['start'] = !empty($request['page']) ? ( intval($request['page']) - 1 ) * $_POST['length'] : 0;

    $_POST['filter_date_form'] = !empty($request['after']) ? $request['after'] : '';
    $_POST['filter_date_to'] = !empty($request['before']) ? $request['before'] : '';
    $_POST['search']['value'] = !empty($request['search']) ? $request['search'] : '';
    $_POST['booking_status'] = !empty($request['booking_status']) ? $request['booking_status'] : '';
    $_POST['booking_filter'] = !empty($request['booking_filter']) ? $request['booking_filter'] : '';
    
    define('WCFM_REST_API_CALL', TRUE);
    
    $WCFM->init();
    if(wcfm_is_booking()) {
      $bookings = $WCFM->wcfm_wcbooking->wcb_ajax_controller();
    }
    //print_r($bookings);
    return $bookings;
  }
  
  
  protected function get_formatted_item_data( $object ) {
    $data = $object->get_data();
    $customer = $object->get_customer();
    //print_r($customer);    
    $order_object = wc_get_order($data['order_id']);
    if($order_object) {
      $data['order'] = $order_object->get_data();
    }

    $booking_product_id = $data['product_id'];
    $product_object = wc_get_product($booking_product_id);
    if($product_object) {
        $data['product_title'] = $product_object->get_title();
    }
    if($customer->user_id) {
        $data['customer_name'] = $customer->name;
        $data['customer_email'] = $customer->email;
    } else {
        $data['customer_name'] = __( "Guest", 'wcfm-marketplace-rest-api' );
        $data['customer_email'] = '';
    }
    $format_date       = array( 'date_created', 'date_modified', 'end', 'start' );
    // Format date values.
    foreach ( $format_date as $key ) {
      $datetime              = $data[ $key ];
      $data[ $key ]          = wc_rest_prepare_date_response( $datetime, false );
      $data[ $key . '_gmt' ] = wc_rest_prepare_date_response( $datetime );
    }
    return $data;
  }

  public function update_booking( $request ) {
    $id = isset( $request['id'] ) ? absint( $request['id'] ) : 0;
    if ( isset( $request['id'] ) ) {
      $booking = $this->get_object( $id );      
    }
    if(isset($booking) && !is_wp_error($booking)) { 

      $start_date = explode( '-', wc_clean( $request['start_date'] ) );

      $end_date   = explode( '-', wc_clean( $request['end_date'] ) );

      $start_time = explode( ':', wc_clean( $request['start_time'] ) );

      $end_time   = explode( ':', wc_clean( $request['end_time'] ) );

      $start      = mktime( $start_time[0], $start_time[1], 0, $start_date[1], $start_date[2], $start_date[0] );

      $end        = mktime( $end_time[0], $end_time[1], 0, $end_date[1], $end_date[2], $end_date[0] ); 

      $booking->set_props( array(

        'all_day'       => $request['all_day'],

        'end'           => $end,

        'start'         => $start,

      ) );  

      $booking->save();
    }
    $response = rest_ensure_response( $this->get_post_type_item( $request, $id ) );
    return $response;
  }

  public function update_booking_status( $request ) {

    global $WCFM;

    $id             = isset( $request['id'] ) ? absint( $request['id'] ) : 0;
    $status         = isset( $request['status'] ) ? $request['status'] : '';
    

    /*if ( empty( $id ) ) {
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
    }*/

    $booking = get_wc_booking( $id );

    $booking->update_status( $status );

    $response = rest_ensure_response( $this->get_post_type_item( $request, $id ) );
    return $response;
  }
}