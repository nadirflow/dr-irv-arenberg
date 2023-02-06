<?php
class WCFM_REST_Capabilities_Controller extends WCFM_REST_Controller {
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
  protected $base = 'restricted-capabilities';
  
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
   * Register the routes for orders.
   */
  public function register_routes() {
      
      register_rest_route( $this->namespace, '/' . $this->base , array(
        array(
            'methods'             => WP_REST_Server::READABLE,
            'callback'            => array( $this, 'get_vendor_capabilities' ),
            'permission_callback' => array( $this, 'get_vendor_capabilities_permissions_check' ),
            'args'                => $this->get_collection_params(),
        ),
        'schema' => array( $this, 'get_public_item_schema' ),
      ) );
      
  }
  
  
  public function get_vendor_capabilities_permissions_check() {
    $current_user = wp_get_current_user();
    $cunnent_user_id = $current_user->ID;
    $allowed_roles = apply_filters( 'wcfmapi_allowed_roles_view_vendors', array('administrator', 'wcfm_vendor') );
    if( !empty( $cunnent_user_id ) && array_intersect($allowed_roles, $current_user->roles ) )
      return true;
    return false;
  }
  

  public function get_vendor_capabilities( $request ) {
    $wcfm_capability_options = apply_filters( 'wcfm_capability_options_rules', get_option( 'wcfm_capability_options', array() ) );
    $response = rest_ensure_response($wcfm_capability_options);
    return apply_filters( "wcfmapi_rest_prepare_vendor_capability_object", $response, $request );
  }

}