<?php
/**
 * ZiniAppBuilder Wordpress Plugin for Mobile App.
 * Exclusively on Envato Market: https://codecanyon.net/user/zinisoft/portfolio
 *
 * @encoding        UTF-8
 * @version         1.0.0
 * @copyright       Copyright (C) 2018 - 2019 ZiniSoft ( https://zinisoft.net/ ). All rights reserved.
 * @license         Envato License https://1.envato.market/KYbje
 * @contributors    Brian Vo (info@zinisoft.net), ZiniSoft Team (support@zinisoft.net)
 * @support         support@zinisoft.net
 **/

namespace ZiniSoft\AppBuilder; 

/** Exit if accessed directly. */
if ( ! defined( 'ABSPATH' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit;
}


/**
 * SINGLETON: Class contain information about the envato item.
 *
 * @since 1.0.0
 * @author Brian Vo (info@zinisoft.net)
 **/

class Home
{
    /**
	 * The ID of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string $plugin_name The ID of this plugin.
	 */
	private $plugin_name;

	/**
	 * The version of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string $version The current version of this plugin.
	 */
    private $version;
    
    /**
	 * The one true Home.
	 *
	 * @var Home
	 * @since 1.0.0
	 **/
    private static $instance;
    /**
     * Endpoint namespace
     *
     * @var string
     */
    protected $namespace; 


    /**
     * Register all routes releated with stores
     *
     * @return void
     */
    public function __construct( $plugin_name, $version ) {
        $this->plugin_name = $plugin_name;
        $this->version     = $version;
        $this->namespace   = $plugin_name . '/v' . intval( $version );
        /** @noinspection PhpIncludeInspection */
		require_once( ABSPATH . '/wp-load.php' );  
        
    }

    /**
     * This function is where we register our routes for our example endpoint.
     */
    public function add_api_routes() {
        register_rest_route( $this->namespace,'home', array(
                // By using this constant we ensure that when the WP_REST_Server changes our readable endpoints will work as intended.
                'methods'  => \WP_REST_Server::READABLE,
                // Here we register our callback. The callback is fired when this endpoint is matched by the WP_REST_Server class.
                'callback' => array($this, '_endpoint_zinistore_mobile_home_builder'),
            )
        ); 
    } 

    function _endpoint_zinistore_mobile_home_builder($data) {
        // rest_ensure_response() wraps the data we want to return into a WP_REST_Response, and ensures it will be properly returned.
        $post_id = 'option';
        $setting = array();
        $data_home_blocks = get_field( 'zs_mobile_home_builder', $post_id );
        if (!empty($data_home_blocks)) {
            foreach ($data_home_blocks as &$blocks) {
                if(array_key_exists('zs_featured_posts', $blocks)) {
                    foreach ($blocks['zs_featured_posts'] as &$post) {
                        $wp_post = get_post($post->ID);
                        // Borrow prepare_item_for_response method from WP_REST_Posts_Controller.
                        $posts_controller = new \WP_REST_Posts_Controller($wp_post->post_type, $data);
                        $post = $posts_controller->prepare_item_for_response($wp_post, $data);
                        $post = $post->data; //Get data only
                    }
                }
                if(array_key_exists('zm_videos', $blocks)) {
                    foreach ($blocks['zm_videos'] as &$post) {
                        $wp_post = get_post($post->ID);
                        // Borrow prepare_item_for_response method from WP_REST_Posts_Controller.
                        $posts_controller = new \WP_REST_Posts_Controller($wp_post->post_type, $data);
                        $post = $posts_controller->prepare_item_for_response($wp_post, $data);
                        $post = $post->data; //Get data only
                    }
                }

                //Fix coupon
                if(array_key_exists('acf_fc_layout', $blocks) && $blocks['acf_fc_layout'] == 'zs_woo_coupons') {
                    $args = array(
                        'posts_per_page'   => $blocks['num_of_coupon'],
                        'orderby'          => 'title',
                        'order'            => 'asc',
                        'post_type'        => 'shop_coupon',
                        'post_status'      => 'publish',
                    ); 
                    $blocks['zs_woo_coupons'] = get_posts( $args );
                }

                //Fix featured product
                if(array_key_exists('zs_featured_products', $blocks)) {
                    $arrProducts = array();
                    foreach ($blocks['zs_featured_products'] as &$post) { 
                        $api = new \WC_REST_Products_Controller();
                        $req = new \WP_REST_Request('GET');
                        $req->set_query_params(["id"=>$post->ID]);
                        $res = $api->get_item($req);
                        if(! is_wp_error( $res )){
                            $arrProducts[] = $res->get_data();
                        }
                    }
                    $blocks['data'] = $arrProducts;
                }

                if(array_key_exists('num_of_latest_product', $blocks)) {
                    $args = array(
                        'numberposts' => (int)$blocks['num_of_latest_product'],
                        'post_type' => 'product',
                        'orderby' => 'date',
                        'order' => 'DESC',
                        'suppress_filters' => true
                    );
                    
                    $arrLatestProducts = get_posts( $args );
                    foreach ($arrLatestProducts as &$post) {
                        $api = new \WC_REST_Products_Controller();
                        $req = new \WP_REST_Request('GET');
                        $req->set_query_params(["id"=>$post->ID]);
                        $res = $api->get_item($req);
                        if(! is_wp_error( $res )){
                            $arrProducts[] = $res->get_data();
                        }
                    }
                    //$blocks['zs_latest_products'] = $arrLatestProducts;
                    $blocks['data'] = $arrProducts;
                }
            }
        } 
        // Home
        $setting = $data_home_blocks; 
    
        $setting = json_encode($setting);
            
        return rest_ensure_response(json_decode($setting));
    }
    
    function _get_all_image_sizes($attament_id) {
        global $_wp_additional_image_sizes;
        $default_image_sizes = get_intermediate_image_sizes();
        $image_sizes = array();
        $image_sizes['sizes'] = new \stdClass();
        foreach ( $default_image_sizes as $size ) {
            $sizeW = "{$size}-width" ;
            $sizeH = "{$size}-height" ;
            $attament_src = wp_get_attachment_image_src($attament_id, $size);
            if(!empty($attament_src)) {
                $image_sizes['sizes']->{$size} = $attament_src[0];
            } else {
                $image_sizes['sizes']->{$size} = "";
            }
            
            if ( in_array( $size, array( 'thumbnail', 'medium', 'large' ) ) ) {
                $image_sizes['sizes']->{$sizeW} = intval( get_option( "{$size}_size_w" ) );
                $image_sizes['sizes']->{$sizeH} = intval( get_option( "{$size}_size_h" ) );
            } elseif ( isset( $_wp_additional_image_sizes[ $size ] ) ) {
                $image_sizes['sizes']->{$sizeW} = $_wp_additional_image_sizes[ $size ]['width'];
                $image_sizes['sizes']->{$sizeH} = $_wp_additional_image_sizes[ $size ]['height'];
            }
            // $image_sizes['sizes']->{$sizeW} = intval( get_option( "{$size}_size_w" ) );
            // $image_sizes['sizes']->{$sizeH} = intval( get_option( "{$size}_size_h" ) );
        }
        return $image_sizes;
    }
    
    function prefix_get_endpoint_thumbnail($data) {
        $postId = isset($data['id']) ? $data['id']:0 ;
        $thumbSizeArr = array();
        $thumbId = get_post_thumbnail_id($postId);
        if(!empty($thumbId)) {
            $thumbSizeArr = wp_get_attachment_metadata($thumbId);
        } 
        $thumbSizeArr = json_encode($thumbSizeArr);
        return rest_ensure_response(json_decode($thumbSizeArr));
    }
    
    function prefix_get_endpoint_related($data) {
        $postId = isset($data['id']) ? $data['id']: 0 ;
        $relatedArr = array();
        $relatedPlugin = get_field( 'zm_post_related_plugin', 'option' );
        
        if (function_exists('yarpp_get_related') && 'YARPP' == $relatedPlugin) {
            $relatedArr = yarpp_get_related(null, $postId );
            if (!empty($relatedArr)) {
                foreach ($relatedArr as &$related) {
                    $wp_post = get_post($related->ID);
    
                    // Borrow prepare_item_for_response method from WP_REST_Posts_Controller.
                    $posts_controller = new \WP_REST_Posts_Controller($wp_post->post_type, $data);
                    $related = $posts_controller->prepare_item_for_response($wp_post, $data);
                    $related = $related->data; //Get data only
                }
            }
        }
        if (function_exists('get_crp_posts_id') && 'CRPP' == $relatedPlugin) {
            $defaults = array( 'postid' =>$postId );
            $relatedArr = get_crp_posts_id( $defaults );
            if (!empty($relatedArr)) {
                foreach ($relatedArr as &$related) { 
                    $wp_post = get_post($related->ID);
                    // Borrow prepare_item_for_response method from WP_REST_Posts_Controller.
                    $posts_controller = new \WP_REST_Posts_Controller($wp_post->post_type, $data);
                    $related = $posts_controller->prepare_item_for_response($wp_post, $data);
                    $related = $related->data; //Get data only
                }
            }
        }
        
        $relatedArr = json_encode($relatedArr);
        return rest_ensure_response(json_decode($relatedArr));
    }
    
    function prefix_get_endpoint_popular() {
        
        $popularArr = array();
        $popularPlugin = get_field( 'zm_post_popular_plugin', 'option' );
        if (function_exists('wpp_get_mostpopular') && 'WPP' == $popularPlugin) {
            $request = new WP_REST_Request( 'GET', '/wordpress-popular-posts/v1/popular-posts' );
            $response = rest_do_request( $request );
            $server = rest_get_server();
            $popularArr = $server->response_to_data( $response, false );
            
        } 
    
        if ( function_exists( 'get_tptn_pop_posts' ) && 'WTT' == $popularPlugin ) { 
            $popularArr = get_tptn_pop_posts();
            if (!empty($popularArr)) {
                foreach ($popularArr as &$popular) { 
                    $wp_post = get_post($popular->ID);
                    // Borrow prepare_item_for_response method from WP_REST_Posts_Controller.
                    $posts_controller = new \WP_REST_Posts_Controller($wp_post->post_type, $data);
                    $popular = $posts_controller->prepare_item_for_response($wp_post, $data);
                    $popular = $popular->data; //Get data only
                }
            }
        }
        
        return rest_ensure_response( $popularArr );
    }

    /**
	 * Main Helper Instance.
	 *
	 * Insures that only one instance of Helper exists in memory at any one time.
	 *
	 * @static
	 * @return Home
	 * @since 1.0.0
	 **/
	public static function get_instance( $plugin_name, $version ) {

		if ( ! isset( self::$instance ) && ! ( self::$instance instanceof Home ) ) {
			self::$instance = new Home( $plugin_name, $version );
		}

		return self::$instance;

	}
} 
