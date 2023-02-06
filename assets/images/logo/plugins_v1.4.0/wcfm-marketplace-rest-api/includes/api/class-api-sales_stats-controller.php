<?php
class WCFM_REST_Sales_Stats_Controller extends WCFM_REST_Controller {
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
  protected $base = 'sales-stats';

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
            'callback'            => array( $this, 'get_sales_stats' ),
            'permission_callback' => array( $this, 'get_sales_stats_permissions_check' ),
            'args'                => $this->get_collection_params(),
        ),
        'schema' => array( $this, 'get_public_item_schema' ),
    ) );
  }

  public function get_sales_stats() {
    global $WCFM;
    $price_decimal = get_option('woocommerce_price_num_decimals', 2);
    $sales_stats['gross_sales']['last_month'] = round( $WCFM->wcfm_vendor_support->wcfm_get_gross_sales_by_vendor( get_current_user_id() , 'last_month' ), $price_decimal );
    $sales_stats['gross_sales']['month'] = round( $WCFM->wcfm_vendor_support->wcfm_get_gross_sales_by_vendor( get_current_user_id() , 'month' ), $price_decimal);
    $sales_stats['gross_sales']['week'] = round( $WCFM->wcfm_vendor_support->wcfm_get_gross_sales_by_vendor( get_current_user_id() , '7day' ), $price_decimal);;
    $sales_stats['earnings']['last_month'] = round( $WCFM->wcfm_vendor_support->wcfm_get_commission_by_vendor( get_current_user_id() , 'last_month' ), $price_decimal);;
    $sales_stats['earnings']['month'] = round( $WCFM->wcfm_vendor_support->wcfm_get_commission_by_vendor( get_current_user_id() , 'month' ), $price_decimal);;
    $sales_stats['earnings']['week'] = round( $WCFM->wcfm_vendor_support->wcfm_get_commission_by_vendor( get_current_user_id() , '7day' ), $price_decimal);;
    $sales_stats['currency'] = get_woocommerce_currency();
    return $sales_stats;
  }

  public function get_sales_stats_permissions_check() {
    if( !is_user_logged_in() )
      return false;
    if( apply_filters( 'wcfm_is_allow_reports', true ) )
      return true; 
    return false;
  }


}