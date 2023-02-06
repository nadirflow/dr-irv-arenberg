<?php
/**
 * API_Registrar class
 */
class WCFMapi_API_Manager {
    /**
     * Class dir and class name mapping
     *
     * @var array
     */
    protected $class_map;
    /**
     * Constructor
     */
    public function __construct() {
      global $WCFMapi;
      if ( ! class_exists( 'WP_REST_Server' ) ) {
          return;
      }
      $this->class_map = apply_filters( 'wcfmapi_class_map', array(
          'product' => 'WCFM_REST_Product_Controller',
          'product-categories' => 'WCFM_REST_Product_Categories_Controller',
          'order'   => 'WCFM_REST_Order_Controller',
          'settings'   => 'WCFM_REST_Settings_Controller',
          'capabilities' => 'WCFM_REST_Capabilities_Controller',
          'notification' => 'WCFM_REST_Notification_Controller',
          'booking' => 'WCFM_REST_Booking_Controller',
          'site_details' => 'WCFM_REST_Site_Details_Controller',
          'sales_stats' => 'WCFM_REST_Sales_Stats_Controller',
          'enquiry' => 'WCFM_REST_Enquiry_Controller',
          'review' => 'WCFM_REST_Review_Controller',
          'store_vendors' => 'WCFM_REST_Store_Vendors_Controller',
          'deliveries'  => 'WCFM_REST_Deliveries_Controller',
          'support' => 'WCFM_REST_Support_Controller',
          'customer_app_settings' => 'WCFM_REST_Customer_App_Settings_Controller',
          'user_profile' => 'WCFM_REST_User_Profile_Controller',
          'wc_cart' => 'WCFM_REST_WC_Cart_Controller',
          'wc_checkout' => 'WCFM_REST_WC_Checkout_Controller',
          'wc_product_variation' => 'WCFM_REST_WC_Product_Variation_Controller'
      ) );
      // Init REST API routes.
      add_action( 'rest_api_init', array( $this, 'wcfmapi_register_rest_routes' ), 10 );
      add_filter( 'wcfmapi_rest_prepare_product_object', array( $this, 'prepeare_product_response' ), 30, 3 );
      add_filter( 'woocommerce_rest_prepare_product_object', array( $this, 'prepeare_product_response' ), 30, 3 );
      add_filter( 'woocommerce_rest_prepare_shop_order_object', array( $this, 'prepeare_order_response' ), 30, 3 );
    }
    
    
 
    /**
     * Register REST API routes.
     *
     * @since 1.2.0
     */
    public function wcfmapi_register_rest_routes() {
        foreach ( $this->class_map as $file_name => $controller ) {
          $this->load_controller($file_name);
          $controller = new $controller();
          $controller->register_routes();
        }
    }
    
    public function load_controller($class_name = '') {
      global $WCFMapi;
      if ('' != $class_name) {
        require_once ($WCFMapi->plugin_path . '/includes/api/class-api-' . $class_name . '-controller.php' );
      } // End If Statement
    }
    /**
     * Prepare object for product response
     *
     * @since 1.0.0
     *
     * @return void
     */
    public function prepeare_product_response( $response, $object, $request ) {
      global $WCFM;
      //print_r($WCFM->wcfm_policy->get_shipping_policy( $object->get_id() )); die;
      $data = $response->get_data();
      $store_formatted_data = (object) array();
      $data['product_units'] = array();
      $data['wcfm_product_policy_data']['visible'] = false;
      $data['showAdditionalInfoTab'] = false;
      $author_id = $WCFM->wcfm_vendor_support->wcfm_get_vendor_id_from_product( $data['id'] );
      if($author_id) {
        $store_vendorController = new WCFM_REST_Store_Vendors_Controller();
        $store_formatted_data = $store_vendorController->get_formatted_item_data($author_id);
      }
      $weight_unit = get_option('woocommerce_weight_unit');
      $dimension_unit = get_option('woocommerce_dimension_unit');

      if( apply_filters( 'wcfm_is_pref_policies', true ) && apply_filters( 'wcfm_is_allow_product_policies', true ) ) {
        $data['wcfm_product_policy_data']['visible'] = true;
        $data['wcfm_product_policy_data']['shipping_policy'] = $WCFM->wcfm_policy->get_shipping_policy( $object->get_id() );
        $data['wcfm_product_policy_data']['shipping_policy_heading'] = apply_filters('wcfm_shipping_policies_heading', __('Shipping Policy', 'wc-frontend-manager'));
        $data['wcfm_product_policy_data']['refund_policy'] = $WCFM->wcfm_policy->get_refund_policy( $object->get_id() );
        $data['wcfm_product_policy_data']['refund_policy_heading'] = apply_filters('wcfm_refund_policies_heading', __('Refund Policy', 'wc-frontend-manager'));
        $data['wcfm_product_policy_data']['cancellation_policy'] = $WCFM->wcfm_policy->get_cancellation_policy( $object->get_id() );
        $data['wcfm_product_policy_data']['cancellation_policy_heading'] = apply_filters('wcfm_cancellation_policies_heading', __('Cancellation / Return / Exchange Policy', 'wc-frontend-manager'));
        $data['wcfm_product_policy_data']['tab_title'] = $WCFM->wcfm_policy->get_policy_tab_title( $object->get_id() );
      }
      // $data['store'] = array(
      //     'id'        => $author_id,
      //     'name'      => $WCFM->wcfm_vendor_support->wcfm_get_vendor_store_name_by_vendor($author_id),
      //     'shop_name' => $WCFM->wcfm_vendor_support->wcfm_get_vendor_store_name_by_vendor($author_id),
      //     'url'       => wcfmmp_get_store_url($author_id),
      //     'address'   => $WCFM->wcfm_vendor_support->wcfm_get_vendor_address_by_vendor($author_id),
      //     'logo'      => $WCFM->wcfm_vendor_support->wcfm_get_vendor_store_name_by_vendor($author_id)
      // );
      $data['store'] = $store_formatted_data;
      $data['product_units']['weight_unit'] = $weight_unit;
      $data['product_units']['dimension_unit'] = $dimension_unit;
      if ( $object && ( $object->has_attributes() || apply_filters( 'wc_product_enable_dimensions_display', $object->has_weight() || $object->has_dimensions() ) ) ) {
        $data['showAdditionalInfoTab'] = true;
      }
      $response->set_data( $data );
      return $response;
    }

    public function prepeare_order_response( $response, $object, $request ) {
      if($object->needs_payment()) {
        $data = $response->get_data();
        $data['payment_url'] = $object->get_checkout_payment_url();
        $response->set_data( $data );
      }
      return $response;
    }
}
