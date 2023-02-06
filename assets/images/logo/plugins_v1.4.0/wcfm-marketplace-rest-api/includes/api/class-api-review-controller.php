<?php
class WCFM_REST_Review_Controller extends WCFM_REST_Controller {
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
  protected $base = 'reviews';
  
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
          'callback'            => array( $this, 'get_reviews' ),
          'permission_callback' => array( $this, 'get_review_permissions_check' ),
          'args'                => $this->get_collection_params(),
      ),
      'schema' => array( $this, 'get_public_item_schema' ),
    ) );

    // register_rest_route( $this->namespace, '/' . $this->base . '/(?P<id>[\d]+)/', array(
    //   'args' => array(
    //       'id' => array(
    //           'description' => __( 'Unique identifier for the object.', 'wcfm-marketplace-rest-api' ),
    //           'type'        => 'integer',
    //       )
    //   ),
    //   array(
    //       'methods'             => WP_REST_Server::READABLE,
    //       'callback'            => array( $this, 'get_single_enquiry' ),
    //       'args'                => $this->get_collection_params(),
    //       'permission_callback' => array( $this, 'get_single_enquiry_permissions_check' ),
    //   )
    // ));

    register_rest_route( $this->namespace, '/' . $this->base . '/(?P<id>[\d]+)/', array(
            'args' => array(
                'id' => array(
                    'description' => __( 'Unique identifier for the object.', 'wcfm-marketplace-rest-api' ),
                    'type'        => 'integer',
                ),
            ),
            array(
                'methods'             => WP_REST_Server::CREATABLE,
                'callback'            => array( $this, 'review_manage' ),
                'args'                => $this->get_collection_params(),
                'permission_callback' => array( $this, 'review_manage_permissions_check' ),
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
  public function get_review_permissions_check() {     
    if( apply_filters( 'wcfm_is_allow_manage_review', true ) )
      return true;
    return false;
  }

  public function review_manage_permissions_check() {
    if( apply_filters( 'wcfm_is_allow_manage_review', true ) )
      return true;
    return false;
  }

  public function get_reviews($request) {
    //print_r('aaaa'); die;
    global $WCFM, $WCFMmp;
    $_POST["controller"] = 'wcfm-reviews';
    $_POST['length'] = !empty($request['per_page']) ? intval($request['per_page']) : 10;
    $_POST['start'] = !empty($request['page']) ? ( intval($request['page']) - 1 ) * $_POST['length'] : 0;
    $_POST['orderby'] = !empty($request['orderby']) ? $request['orderby'] : '';
    $_POST['order'] = !empty($request['order']) ? $request['order'] : '';
    $_POST['status_type'] = !empty($request['status_type']) ? $request['status_type'] : '';
    
    define('WCFM_REST_API_CALL', TRUE);
    $WCFM->init();
    $reviews = $WCFMmp->wcfmmp_reviews->wcfm_reviews_ajax_controller();
    foreach ($reviews as $each_review) {
      $wp_user_avatar_id = get_user_meta( $each_review->author_id, 'wp_user_avatar', true );
        $wp_user_avatar = wp_get_attachment_url( $wp_user_avatar_id );
        if ( !$wp_user_avatar ) {
          $wp_user_avatar = $WCFM->plugin_url . 'assets/images/avatar.png';
        }
        $each_review->author_image = $wp_user_avatar;
    }
     return $reviews;
  }

  public function review_manage($request) {
    
    global $WCFM, $WCFMmp, $wpdb;
    
    $review_data = $wpdb->get_row( "SELECT * FROM {$wpdb->prefix}wcfm_marketplace_reviews WHERE `ID`= " . absint( $request['id'] ) ); 
    if(!$review_data || empty( $review_data ) || !is_object( $review_data )) {
      return new WP_Error( "wcfmapi_rest_invalid_review_id", sprintf( __( "Invalid ID", 'wcfm-marketplace-rest-api' ), __METHOD__ ), array( 'status' => 404 ) );
    } else {
      $_POST['reviewid'] = absint( $request['id'] );
    }
    if( isset( $request['review_status'] ) && $request['review_status'] == 'approve' ) {
      $_POST['status'] = 1;
    } elseif (isset( $request['review_status'] ) && $request['review_status'] == 'unapprove') {
      $_POST['status'] = 0;
    } else {
      return new WP_Error( "wcfmapi_rest_invalid_review_status", sprintf( __( "Status Invalid", 'wcfm-marketplace-rest-api' ), __METHOD__ ), array( 'status' => 404 ) );
    }
    define('WCFM_REST_API_CALL', TRUE);
    $WCFM->init();
    $reply_id = $WCFMmp->wcfmmp_reviews->wcfmmp_reviews_status_update();
    if($reply_id) {
      $response = $review_data;
    }
    return $response;
  }
  
}
