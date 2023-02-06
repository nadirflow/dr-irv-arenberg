<?php
class WCFM_REST_Enquiry_Controller extends WCFM_REST_Controller {
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
  protected $base = 'enquiries';
  
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
      
    }
    
  /**
   * Register the routes for notifications.
   */
  public function register_routes() {
    register_rest_route( $this->namespace, '/' . $this->base, array(
      array(
          'methods'             => WP_REST_Server::READABLE,
          'callback'            => array( $this, 'get_enquiries' ),
          'permission_callback' => array( $this, 'get_enquiry_permissions_check' ),
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
          'callback'            => array( $this, 'get_single_enquiry' ),
          'args'                => $this->get_collection_params(),
          'permission_callback' => array( $this, 'get_single_enquiry_permissions_check' ),
      )
    ));

    register_rest_route( $this->namespace, '/' . $this->base . '/(?P<id>[\d]+)/' . 'reply', array(
            'args' => array(
                'id' => array(
                    'description' => __( 'Unique identifier for the object.', 'wcfm-marketplace-rest-api' ),
                    'type'        => 'integer',
                ),
            ),
            array(
                'methods'             => WP_REST_Server::CREATABLE,
                'callback'            => array( $this, 'post_reply' ),
                'args'                => $this->get_collection_params(),
                'permission_callback' => array( $this, 'post_enquiry_reply_permissions_check' ),
            )
          )
        );
  }

  /**
     * Checking if have any permission to view enquiry
     *
     * @since 1.0.0
     *
     * @return boolean
     */
  public function get_enquiry_permissions_check() {   
    if( !is_user_logged_in() )
      return false;  
    if( apply_filters( 'wcfm_is_allow_enquiry', true ) )
      return true;
    return false;
  }

  public function get_single_enquiry_permissions_check() {
    if( !is_user_logged_in() )
      return false;
    if( apply_filters( 'wcfm_is_allow_enquiry', true ) )
      return true;
    return false;
  }

  public function post_enquiry_reply_permissions_check() {
    if( !is_user_logged_in() )
      return false;
    if( apply_filters( 'wcfm_is_allow_enquiry', true ) )
      return true;
    return false;
  }


  public function get_enquiries($request) {
    global $WCFM;
    $_POST["controller"] = 'wcfm-enquiry';
    $_POST['length'] = !empty($request['per_page']) ? intval($request['per_page']) : 10;
    $_POST['start'] = !empty($request['page']) ? ( intval($request['page']) - 1 ) * $_POST['length'] : 0;
    $_POST['orderby'] = !empty($request['orderby']) ? $request['orderby'] : '';
    $_POST['order'] = !empty($request['order']) ? $request['order'] : '';
    
    define('WCFM_REST_API_CALL', TRUE);
    $WCFM->init();
    $enquiries = $WCFM->wcfm_enquiry->ajax_controller();
    // print_r($enquiries); die;
    foreach ($enquiries as $each_enquiry) {
      $product_object = wc_get_product( $each_enquiry->product_id );
      if($product_object) {
        $each_enquiry->product_title = $product_object->get_title();
      }
      $each_enquiry->enquiry = str_replace( "<br/>"," \n ", $each_enquiry->enquiry );
      $each_enquiry->enquiry = str_replace( "<br />"," \n ", $each_enquiry->enquiry );
    }
    return $enquiries;
  }

  public function get_single_enquiry($request) {
    global $WCFM, $wpdb, $blog_id;
    $is_private = 'no';
    $inquiry_id = 0;
    $inquiry_content = '';
    $inquiry_product_id = 0;
    $inquiry_vendor_id = 0;
    $inquiry_customer_id = 0;
    $inquiry_customer_name = 0;
    $inquiry_customer_email = 0;
    $inquiry_id = absint( $request['id'] );
    if( !$inquiry_id ) {
      return new WP_Error( "wcfmapi_rest_invalid_enquiry_id", sprintf( __( "Invalid ID", 'wcfm-marketplace-rest-api' ), __METHOD__ ), array( 'status' => 404 ) );
    }

    $enquiry_datas = $wpdb->get_results( "SELECT * FROM {$wpdb->prefix}wcfm_enquiries WHERE `ID` = {$inquiry_id}" );

    if( empty($enquiry_datas ) ) {
      return new WP_Error( "wcfmapi_rest_invalid_enquiry_id", sprintf( __( "Invalid ID", 'wcfm-marketplace-rest-api' ), __METHOD__ ), array( 'status' => 404 ) );
    }

    $product_object = wc_get_product( $enquiry_datas[0]->product_id );

    if($product_object) {
      $enquiry_datas[0]->product_title = $product_object->get_title();
    }

    $inquiry_vendor_id = $enquiry_datas[0]->vendor_id;

    $enquiry_meta_values = $wpdb->get_results("SELECT * FROM {$wpdb->prefix}wcfm_enquiries_meta WHERE `enquiry_id` = " . $inquiry_id);
    $enquiry_datas[0]->additional_datas = $enquiry_meta_values;

    if( $wcfm_is_allow_view_enquiry_reply_view = apply_filters( 'wcfmcap_is_allow_enquiry_reply_view', true ) ) {
      $wcfm_enquiry_replies = $wpdb->get_results( "SELECT * from {$wpdb->prefix}wcfm_enquiries_response WHERE `enquiry_id` = " . $inquiry_id );
      if( !empty( $wcfm_enquiry_replies ) ) {
        foreach( $wcfm_enquiry_replies as $key => $wcfm_enquiry_reply ) {
          $author_id = $wcfm_enquiry_reply->reply_by;
          if( wcfm_is_vendor( $author_id ) ) {
            $wp_user_avatar = $WCFM->wcfm_vendor_support->wcfm_get_vendor_logo_by_vendor( $author_id );
            if( !$wp_user_avatar ) {
              $wp_user_avatar = apply_filters( 'wcfmmp_store_default_logo', $WCFM->plugin_url . 'assets/images/wcfmmp.png' );
            }
          } else {
            $wp_user_avatar_id = get_user_meta( $author_id, $wpdb->get_blog_prefix($blog_id).'user_avatar', true );
            $wp_user_avatar = wp_get_attachment_url( $wp_user_avatar_id );
            if ( !$wp_user_avatar ) {
              $wp_user_avatar = $WCFM->plugin_url . 'assets/images/user.png';
            }
          }

          if( apply_filters( 'wcfm_allow_view_customer_name', true ) || ( $author_id == $inquiry_vendor_id ) ) {
            if( wcfm_is_vendor( $author_id ) ) {
              $reply_by_name = $WCFM->wcfm_vendor_support->wcfm_get_vendor_store_name_by_vendor( $author_id );
            } elseif( $author_id != $wcfm_enquiry_reply->customer_id ) {
              $reply_by_name = get_bloginfo( 'name' );
            } else {
              $userdata = get_userdata( $author_id );
              $first_name = $userdata->first_name;
              $last_name  = $userdata->last_name;
              $display_name  = $userdata->display_name;
              if( $first_name ) {
                $reply_by_name = $first_name . ' ' . $last_name;
              } else {
                $reply_by_name = $display_name;
              }
            }
          }

          $wcfm_enquiry_replies[$key]->reply_by_image = $wp_user_avatar;
          $wcfm_enquiry_replies[$key]->reply_by_name = $reply_by_name;
        }
      }

      $enquiry_datas[0]->reply_count = count( $wcfm_enquiry_replies );
      $enquiry_datas[0]->all_replies = $wcfm_enquiry_replies;
    }
    $response = $enquiry_datas[0];

    return $response;
  }

  public function post_reply($request) {
    $enquiry_to_post_reply = $this->get_single_enquiry($request);
    global $WCFM;
    $_POST["controller"] = 'wcfm-enquiry-manage';
    $_POST['inquiry_reply'] = $request['enquiry_reply'];
    $_POST['wcfm_inquiry_reply_form'] = array(
      'inquiry_id'              => absint( $request['id'] ),
      'inquiry_product_id'      => absint( $enquiry_to_post_reply->product_id ),
      'inquiry_vendor_id'       => absint( $enquiry_to_post_reply->vendor_id ),
      'inquiry_customer_id'     => absint( $enquiry_to_post_reply->customer_id ),
      'inquiry_customer_name'   => $enquiry_to_post_reply->customer_name,
      'inquiry_customer_email'  => $enquiry_to_post_reply->customer_email,
    );
    define('WCFM_REST_API_CALL', TRUE);
    $WCFM->init();
    $reply_id = $WCFM->wcfm_enquiry->ajax_controller();
    if($reply_id) {
      $response = $this->get_single_enquiry($request);
    }
    return $response;
  }
  
}
