<?php
class WCFM_REST_Notification_Controller extends WCFM_REST_Controller {
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
  protected $base = 'notifications';
  
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
          'callback'            => array( $this, 'get_notifications' ),
          'permission_callback' => array( $this, 'get_notifications_permissions_check' ),
          'args'                => $this->get_collection_params(),
      ),
      'schema' => array( $this, 'get_public_item_schema' ),
    ) );
  }

  /**
     * Checking if have any permission to view notifications
     *
     * @since 1.0.0
     *
     * @return boolean
     */
  public function get_notifications_permissions_check() {
    if( !is_user_logged_in() )
      return false;
    return true;    
    //if( apply_filters( 'wcfm_is_allow_notification_message', true ) )
      
    //return false;
  }
  
  public function get_notifications($request) {
    global $WCFM;
    $_POST["controller"] = 'wcfm-messages';
    $_POST['length'] = !empty($request['per_page']) ? intval($request['per_page']) : 10;
    $_POST['start'] = !empty($request['page']) ? ( intval($request['page']) - 1 ) * $_POST['length'] : 0;
    //print_r($request['page']); die;
//    if(empty($request['page'])){
//      $_POST['start'] = !empty($request['offset']) ? intval($request['offset']) : 0;
//    }
    $_POST['orderby'] = !empty($request['orderby']) ? $request['orderby'] : '';
    $_POST['order'] = !empty($request['order']) ? $request['order'] : '';
    $_POST['message_status'] = ( !empty($request['notification_status']) &&( $request['notification_status'] == 'read' || $request['notification_status'] == 'unread' ) ) ? $request['notification_status'] : 'unread';
    $_POST['message_type'] = !empty($request['notification_type']) ? $request['notification_type'] : 'all';
    define('WCFM_REST_API_CALL', TRUE);
    $WCFM->init();
    $notifications = $WCFM->ajax->wcfm_ajax_controller();
    //print_r($notifications); die;
    foreach ($notifications as $notification) {
      unset(
        $notification->author_id,
        $notification->reply_to, 
        $notification->author_is_admin,
        $notification->author_is_vendor,
        $notification->author_is_customer,
        $notification->is_notice,
        $notification->is_direct_message,
        $notification->is_pined,
        $notification->message_to
      );
      $notification->message = strip_tags($notification->message);
    }
    
//    $response = rest_ensure_response($notifications);
//    return apply_filters( "wcfmapi_rest_prepare_vendor_capability_object", $response, $request );
    return $notifications;
  }
  
}