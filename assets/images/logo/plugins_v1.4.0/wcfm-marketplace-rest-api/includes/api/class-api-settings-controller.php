<?php
class WCFM_REST_Settings_Controller extends WCFM_REST_Controller {
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
  protected $base = 'settings';

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
    register_rest_route( $this->namespace, '/' . $this->base . '/email/(?P<email>.+)', array(
        array(
            'methods'             => WP_REST_Server::READABLE,
            'callback'            => array( $this, 'get_vendor_settings_by_email' ),
            'permission_callback' => array( $this, 'get_vendor_by_email_permissions_check' ),
            'args'                => $this->get_collection_params(),
        ),
        'schema' => array( $this, 'get_public_item_schema' ),
    ) );

    register_rest_route( $this->namespace, '/' . $this->base . '/id/(?P<id>[\d]+)', array(
      array(
          'methods'             => WP_REST_Server::READABLE,
          'callback'            => array( $this, 'get_vendor_settings_by_id' ),
          'permission_callback' => array( $this, 'get_vendor_settings_by_id_permissions_check' ),
          'args'                => $this->get_collection_params(),
      ),
      'schema' => array( $this, 'get_public_item_schema' ),
    ) );      
  }
  
  public function get_vendor_by_email_permissions_check($request) {
    $current_user = wp_get_current_user();
    $cunnent_user_email = $current_user->user_email;
    $request_email = $request['email'];
    $allowed_roles = apply_filters( 'wcfmapi_allowed_roles_view_vendors', array('administrator') );
    if( $request_email == $cunnent_user_email || array_intersect($allowed_roles, $current_user->roles ) )
      return true;
    return false;
  }
  
  public function get_vendor_settings_by_id_permissions_check($request) {
    $current_user = wp_get_current_user();
    $cunnent_user_id = $current_user->ID;
    $request_id = $request['id'];
    $allowed_roles = apply_filters( 'wcfmapi_allowed_roles_view_vendors', array('administrator') );
    if( $request_id == $cunnent_user_id || array_intersect($allowed_roles, $current_user->roles ) )
      return true;
    return false;
  }
  
  public function get_vendor_settings_by_email( $request ) {
    $vendor_id = $this->get_vendor_id_from_request( $request['email'] , 'email');
    $vendor_settings_data = get_user_meta( $vendor_id, 'wcfmmp_profile_settings', true );

    $response = rest_ensure_response($vendor_settings_data);
    return apply_filters( "wcfmapi_rest_prepare_vendor_settings_object", $response, $request );
  }
  
  public function get_vendor_settings_by_id( $request ) {
    $vendor_id = $this->get_vendor_id_from_request( $request['id'] , 'id');
    $vendor_settings_data = get_user_meta( $vendor_id, 'wcfmmp_profile_settings', true );
    $response = rest_ensure_response($vendor_settings_data);
    return apply_filters( "wcfmapi_rest_prepare_vendor_settings_object", $response, $vendor_settings_data, $request );
  }  
  
  protected function get_vendor_id_from_request($requset_data , $request_data_type = 'email' ) {
    if( $request_data_type == 'id' ){
      $user = get_user_by( $request_data_type , $requset_data );
    } else {
      $user = get_user_by( $request_data_type , $requset_data );
    }
    $vendor_id = $user->ID;
    if ( empty( $vendor_id ) ) {
      return new WP_Error( 'no_vendor_store_found', __( 'No vendor store found', 'wc-frontend-manager-rest-api' ), array( 'status' => 404 ) );
    }
    return $vendor_id;
  }

}