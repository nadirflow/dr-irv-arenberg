<?php
class WCFM_REST_WC_Checkout_Controller extends WCFM_REST_Controller {
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
  protected $base = 'allowed-countries';
  protected $checkout_base = 'checkout';

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
    register_rest_route( $this->namespace, '/' . $this->base , array(
      array(
          'methods'             => WP_REST_Server::READABLE,
          'callback'            => array( $this, 'get_allowed_supported_countries' ),
          'permission_callback' => array( $this, 'get_checkout_field_permissions_check' ),
          'args'                => $this->get_collection_params(),
      )
    ) );
    
    register_rest_route( $this->namespace, '/' . $this->checkout_base, array(
      array(
          'methods'             => WP_REST_Server::READABLE,
          'callback'            => array( $this, 'get_checkout_settings' ),
          'permission_callback' => array( $this, 'get_checkout_settings_permissions_check' ),
          'args'                => $this->get_collection_params(),
      )
    ) );

    register_rest_route( $this->namespace, '/' . $this->checkout_base . '/validate-cart', array(
        array(
            'methods'             => WP_REST_Server::READABLE,
            'callback'            => array( $this, 'validate_items_in_cart' ),
            'permission_callback' => array( $this, 'get_validate_items_in_cart_permissions_check' ),
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
  public function get_checkout_field_permissions_check() {     
    if( !is_user_logged_in() )
      return false;

    return true;
  }

  public function get_checkout_settings_permissions_check() {
    if ( ! is_user_logged_in() )
        return false;
    $checkout = WC()->checkout();
    if ( ! $checkout->is_registration_enabled() && $checkout->is_registration_required() && ! is_user_logged_in() ) {
        return false;
    }
    return true;
  }

  private function prepare_fields_data($fields, $address_type = 'billing') {
    $customer = new WC_Customer( get_current_user_id() );
    $customer_data = $customer->get_data();
    $addr_type = $address_type === 'shipping' ? 'shipping' : 'billing';
    $user_address = $customer_data[$addr_type];

    $processed_fields = array();
    foreach($fields as $name => $data) {
      $key = str_replace($addr_type.'_', '', $name);
      $processed_fields[$key] = array(
        'label' => $data['label'],
        'required' => $data['required'],
        'priority' => $data['priority'],
        'value' => $user_address[$key],
      );
    }
    return $processed_fields;
  }
    
    /**
     * @param string $key
     *
     * @return mixed
     */
  public function get_allowed_supported_countries() {
      if (!empty($this->allowed_countries)) {
          return $this->allowed_countries;
      }

      $return_object = array();
      
      $countries_object    = new \WC_Countries();
      $raw_selling_counries = $countries_object->get_allowed_countries();
      $raw_selling_counries_state = $countries_object->get_allowed_country_states();

      $raw_shipping_counries = $countries_object->get_shipping_countries();
      $raw_shipping_counries_state = $countries_object->get_shipping_country_states();

      foreach ($raw_selling_counries as $country_code => $country_name) {
        $return_object['billing'][$country_code]['name'] = $country_name;
        $return_object['billing'][$country_code]['states'] = isset($raw_selling_counries_state[$country_code]) ? $raw_selling_counries_state[$country_code] : array();
      }

      foreach ($raw_shipping_counries as $country_code => $country_name) {
        $return_object['shipping'][$country_code]['name'] = $country_name;
        $return_object['shipping'][$country_code]['states'] = isset($raw_selling_counries_state[$country_code]) ? $raw_selling_counries_state[$country_code] : '';
      }

      return $return_object;
  }

  public function get_checkout_settings( $request ) {
    $return_object = array();
    
    $checkout = WC()->checkout();
    $checkout_title = __( 'Billing details', 'woocommerce' );
    if ( wc_ship_to_billing_address_only() && WC()->cart->needs_shipping() ) {
        $checkout_title = __( 'Billing &amp; Shipping', 'woocommerce' );
    }
    $return_object['title'] = $checkout_title;

    $country_list = $this->get_allowed_supported_countries();
    $allowed_billing_countries = !empty($country_list['billing']) ? $country_list['billing'] : (Object) NULL;

    $return_object['billing'] = array();
    $return_object['billing']['fields'] = $this->prepare_fields_data( $checkout->get_checkout_fields( 'billing' ) );
    $return_object['billing']['countries'] = $allowed_billing_countries;
    
    if(true === WC()->cart->needs_shipping_address()) {
      $allowed_shipping_countries = !empty($country_list['shipping']) ? $country_list['shipping'] : (Object) NULL;
      $return_object['shipping']['fields'] =  $this->prepare_fields_data( $checkout->get_checkout_fields( 'shipping' ), 'shipping' );
      $return_object['shipping']['countries'] = $allowed_shipping_countries;
    }
    $return_object['locale'] = WC()->countries->get_country_locale();
    return $return_object;
  }

  public function validate_items_in_cart( $request ) {
    return true;
  }
  
}
