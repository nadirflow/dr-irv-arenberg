<?php
class WCFM_REST_Site_Details_Controller extends WCFM_REST_Controller {
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
  protected $base = 'site-details';

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
    register_rest_route( $this->namespace, '/' . $this->base , array(
        array(
            'methods'             => WP_REST_Server::READABLE,
            'callback'            => array( $this, 'get_site_details' ),
            'permission_callback' => array( $this, 'get_site_details_permissions_check' ),
            'args'                => $this->get_collection_params(),
        ),
        'schema' => array( $this, 'get_public_item_schema' ),
    ) );
  }

  public function get_site_details() {
    $return_site_details = array();
    $return_site_details['is_wcfm_ultimate'] = (WCFM_Dependencies::wcfmu_plugin_active_check()) ? true : false;
    $return_site_details['is_wc_booking'] = (WCFM_Dependencies::wcfm_bookings_plugin_active_check()) ? true : false;
    $return_site_details['site_url'] = get_site_url();
    $return_site_details['site_title'] = get_bloginfo('name');
    $return_site_details['wcfm_url'] = get_wcfm_url();
    $return_site_details['wcfm_rest_api_version'] = WCFMapi_VERSION;
    return $return_site_details;
  }

  public function get_site_details_permissions_check() {
    
    return true;
  }


}