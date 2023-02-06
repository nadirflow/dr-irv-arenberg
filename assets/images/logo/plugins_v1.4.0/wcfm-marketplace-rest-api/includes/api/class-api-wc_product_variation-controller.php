<?php
class WCFM_REST_WC_Product_Variation_Controller extends WCFM_REST_Controller {
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
  protected $base = 'product';
  

    /**
     * Stores the request.
     * @var array
     */
    protected $request = array();
    protected $required_checkout_fields;
    protected $oUserMeta;
    protected $allowed_countries;

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
    register_rest_route( $this->namespace, '/' . $this->base . '/(?P<id>\d+)/variations' , array(
      array(
          'methods'             => WP_REST_Server::READABLE,
          'callback'            => array( $this, 'get_product_variations' ),
          'permission_callback' => array( $this, 'get_product_variation_permissions_check' ),
          'args'                => $this->get_collection_params(),
      )
    ) );


    // register_rest_route( $this->namespace, '/' . $this->base . '/(?P<id>[\d]+)/', array(
    //         'args' => array(
    //             'id' => array(
    //                 'description' => __( 'Unique identifier for the object.', 'wcfm-marketplace-rest-api' ),
    //                 'type'        => 'integer',
    //             ),
    //         ),
    //         array(
    //             'methods'             => WP_REST_Server::CREATABLE,
    //             'callback'            => array( $this, 'review_manage' ),
    //             'args'                => $this->get_collection_params(),
    //             'permission_callback' => array( $this, 'review_manage_permissions_check' ),
    //         )
    //       )
    //     );
  }

  /**
     * Checking if have any permission to view enquiry
     *
     * @since 1.0.0
     *
     * @return boolean
     */
  public function get_product_variation_permissions_check() {     
    if( !is_user_logged_in() )
      return false;

    return true;
  }

    
    /**
     * @param string $key
     *
     * @return mixed
     */
  public function get_product_variations($oRequest)
  {
      $productID      = $oRequest->get_param('id');
      $oProduct       = wc_get_product($productID);
      $aRawAttributes = $oProduct->get_attributes();
      
      $aAttributes = [];
      foreach ($aRawAttributes as $attrKey => $aAttribute) {
          if ($aAttribute['data']['variation']) {
              $aAttributeNames = [];
              $aAttributeSlugs = [];
              foreach ($aAttribute['data']['options'] as $termID) {
                  $oTerm = get_term($termID);
                  if (!empty($oTerm) && !is_wp_error($oTerm)) {
                      $aAttributeNames[] = $oTerm->name;
                      $aAttributeSlugs[] = $oTerm->slug;
                  }
              }
              
              $aAttributes[$attrKey] = [
                  'id'      => $attrKey,
                  'name'    => wc_attribute_label($attrKey),
                  'options' => $aAttributeNames,
                  'slugs'   => $aAttributeSlugs
              ];
          }
      }

      return $aAttributes;
  }

  // public function review_manage($request) {
    
  // }
  
}
