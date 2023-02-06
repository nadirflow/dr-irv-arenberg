<?php
/**
 * ZiniAppBuilder Wordpress Plugin for Mobile App.
 * Exclusively on Envato Market: https://codecanyon.net/user/zinisoft/portfolio
 *
 * @encoding        UTF-8
 * @version         1.0.2
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

class Setting
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
	 * The one true RESTSetting.
	 *
	 * @var RESTSetting
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
        /** @noinspection PhpIncludeInspection */
        require_once( ABSPATH . '/wp-load.php' ); 
        
        $this->plugin_name = $plugin_name;
		$this->version     = $version;
		$this->namespace   = $plugin_name . '/v' . intval( $version );
        
        //add_action('rest_api_init', array($this, 'rest_api_register_routes'));
        add_action( 'rest_api_init', array($this, 'rest_api_filter_add_filters'));
        add_action( 'rest_api_init', array($this,'update_api_posts_meta_field'));
        add_action( 'rest_api_init', array($this,'update_api_categories_meta_field'));
        add_action( 'rest_api_init', array($this,'update_api_products_meta_field'));
        add_action( 'rest_api_init', array($this,'update_api_orders_meta_field'));
        add_filter( 'wp_rest_cache/allowed_endpoints', array($this, 'wprc_add_zinistore_endpoint'), 10, 1);
    }

    function wprc_add_zinistore_endpoint( $allowed_endpoints ) {
        if ( ! isset( $allowed_endpoints[ $this->namespace ] ) || ! in_array( 'settings', $allowed_endpoints[ $this->namespace ] ) ) {
            $allowed_endpoints[ $this->namespace ][] = 'settings'; 
        }
        if ( ! isset( $allowed_endpoints[ $this->namespace ] ) || ! in_array( 'home', $allowed_endpoints[ $this->namespace ] ) ) { 
            $allowed_endpoints[ $this->namespace ][] = 'home';
        } 
        if ( ! isset( $allowed_endpoints[ $this->namespace ] ) || ! in_array( 'getRelated', $allowed_endpoints[ $this->namespace ] ) ) { 
            $allowed_endpoints[ $this->namespace ][] = 'getRelated';
        } 
        if ( ! isset( $allowed_endpoints[ $this->namespace ] ) || ! in_array( 'getPopularPosts', $allowed_endpoints[ $this->namespace ] ) ) { 
            $allowed_endpoints[ $this->namespace ][] = 'getPopularPosts';
        } 
        if ( ! isset( $allowed_endpoints[ 'wc/v3' ] ) || ! in_array( 'products', $allowed_endpoints[ 'wc/v3' ] ) ) { 
            $allowed_endpoints[ 'wc/v3' ][] = 'products';
        } 
        if ( ! isset( $allowed_endpoints[ 'wc/v3' ] ) || ! in_array( 'coupons', $allowed_endpoints[ 'wc/v3' ] ) ) { 
            $allowed_endpoints[ 'wc/v3' ][] = 'coupons';
        } 
        if ( ! isset( $allowed_endpoints[ 'wc/v3' ] ) || ! in_array( 'products/categories', $allowed_endpoints[ 'wc/v3' ] ) ) { 
            $allowed_endpoints[ 'wc/v3' ][] = 'products/categories';
        } 
        if ( ! isset( $allowed_endpoints[ 'wc/v3' ] ) || ! in_array( 'products/attributes', $allowed_endpoints[ 'wc/v3' ] ) ) { 
            $allowed_endpoints[ 'wc/v3' ][] = 'products/attributes';
        } 
        if ( ! isset( $allowed_endpoints[ 'wc/v3' ] ) || ! in_array( 'products/tags', $allowed_endpoints[ 'wc/v3' ] ) ) { 
            $allowed_endpoints[ 'wc/v3' ][] = 'products/tags';
        } 
        if ( ! isset( $allowed_endpoints[ 'wc/v3' ] ) || ! in_array( 'products/reviews', $allowed_endpoints[ 'wc/v3' ] ) ) { 
            $allowed_endpoints[ 'wc/v3' ][] = 'products/reviews';
        } 
        return $allowed_endpoints;
    }
    
    /**
     * Add the necessary filter to each post type
    **/
    function rest_api_filter_add_filters() {
        foreach ( get_post_types( array( 'show_in_rest' => true ), 'objects' ) as $post_type ) {
            add_filter( 'rest_' . $post_type->name . '_query',  array($this, 'rest_api_filter_add_filter_param'), 10, 2 );
        }
        
    }

    /**
     * Add the filter parameter
     *
     * @param  array           $args    The query arguments.
     * @param  WP_REST_Request $request Full details about the request.
     * @return array $args.
     **/
    function rest_api_filter_add_filter_param( $args, $request ) {
        // Bail out if no filter parameter is set.
        if ( empty( $request['filter'] ) || ! is_array( $request['filter'] ) ) {
            return $args;
        }
        $filter = $request['filter'];
        if ( isset( $filter['posts_per_page'] ) && ( (int) $filter['posts_per_page'] >= 1 && (int) $filter['posts_per_page'] <= 100 ) ) {
            $args['posts_per_page'] = $filter['posts_per_page'];
        }
        global $wp;
        $vars = apply_filters( 'rest_query_vars', $wp->public_query_vars );
        // Allow valid meta query vars.
        $vars = array_unique( array_merge( $vars, array( 'meta_query', 'meta_key', 'meta_value', 'meta_compare' ) ) );
        foreach ( $vars as $var ) {
            if ( isset( $filter[ $var ] ) ) {
                $args[ $var ] = $filter[ $var ];
            }
        }
        return $args;
    }

    /**
     * This function is where we register our routes for our example endpoint.
     */
    function add_api_routes() {
        // register_rest_route() handles more arguments but we are going to stick to the basics for now.
        register_rest_route( $this->namespace,'settings', array(
                // By using this constant we ensure that when the WP_REST_Server changes our readable endpoints will work as intended.
                'methods'  => \WP_REST_Server::READABLE,
                // Here we register our callback. The callback is fired when this endpoint is matched by the WP_REST_Server class.
                'callback' => array($this, '_endpoint_zinistore_mobile_settings'),
            )
        );
        register_rest_route( $this->namespace,'getThumb/id=(?P<id>[a-zA-Z0-9-]+)', array(
            // By using this constant we ensure that when the WP_REST_Server changes our readable endpoints will work as intended.
            'methods'  => \WP_REST_Server::READABLE,
            // Here we register our callback. The callback is fired when this endpoint is matched by the WP_REST_Server class.
            'callback' => array($this, '_endpoint_zinistore_thumbnail')
        ));
        
        register_rest_route( $this->namespace,'getRelated/id=(?P<id>[a-zA-Z0-9-]+)', array(
            // By using this constant we ensure that when the WP_REST_Server changes our readable endpoints will work as intended.
            'methods'  => \WP_REST_Server::READABLE,
            // Here we register our callback. The callback is fired when this endpoint is matched by the WP_REST_Server class.
            'callback' => array($this, '_endpoint_zinistore_related')
        ));
        // register_rest_route( $this->namespace,'getPopularPosts', array(
        //     // By using this constant we ensure that when the WP_REST_Server changes our readable endpoints will work as intended.
        //     'methods'  => \WP_REST_Server::READABLE,
        //     // Here we register our callback. The callback is fired when this endpoint is matched by the WP_REST_Server class.
        //     'callback' => array($this, '_endpoint_zinistore_popular')
        // ));
        
        register_rest_route( $this->namespace,'hash', array(
                // By using this constant we ensure that when the WP_REST_Server changes our readable endpoints will work as intended.
                'methods'  => 'POST',
                // Here we register our callback. The callback is fired when this endpoint is matched by the WP_REST_Server class.
                'callback' => array($this, '_endpoint_zinistore_generate_hash'),
            )
        );
    }

    function _endpoint_zinistore_mobile_settings() {
        // rest_ensure_response() wraps the data we want to return into a WP_REST_Response, and ensures it will be properly returned.
        $post_id = 'option';
        $setting = array(); 
        /** General tab settings. */
        $general_settings = get_option( 'zs_ziniappbuilder_settings' );
        /** Color tab settings. */
        $color_settings = get_option( 'zs_ziniappbuilder_color_settings' );
        /** Typography tab settings. */
        $typography_settings = get_option( 'zs_ziniappbuilder_typography_settings' );
        /** Blog tab settings. */
        $blog_settings = get_option( 'zs_ziniappbuilder_blog_settings' );
        /** Ads tab settings. */
        //$ads_settings = get_option( 'zs_ziniappbuilder_ads_settings' );
        /** Woo General tab settings. */
        $woo_general_settings = get_option( 'zs_ziniappbuilder_woo_general_settings' );
        /** Woo Product Listings tab settings. */
        $woo_product_listings_settings = get_option( 'zs_ziniappbuilder_woo_product_listings_settings' );
        /** Woo Single Product tab settings. */
        $woo_single_product_settings = get_option( 'zs_ziniappbuilder_woo_single_product_settings' );

        /** App Name. */
        if ( empty( $general_settings['app_name'] ) ) {
            $general_settings['app_name'] = 'ZiniStore';
        }
    
        // General
        $logo = array();
        if ( isset($general_settings['app_logo']) ) {
            $logo = $this->_get_all_image_sizes( $general_settings['app_logo']);
        }
        $setting['general']['app_logo'] =  $logo;
        $setting['general']['app_name'] =  isset($general_settings['app_name']) ? $general_settings['app_name'] : 'ZiniStore';
        $setting['general']['app_version'] =  isset($general_settings['app_version']) ? $general_settings['app_version'] : '1.0.2';
        $setting['general']['language'] =  isset($general_settings['language']) ? $general_settings['language'] : 'en';
        $setting['general']['date_format'] =  isset($general_settings['date_format']) ? $general_settings['date_format'] : 'MMM, DD, YYYY';
        $setting['general']['time_format'] =  isset($general_settings['time_format']) ? $general_settings['time_format'] : 'HH:mm';
        $setting['general']['layout_width'] =  isset($general_settings['layout_width']) ? (int)$general_settings['layout_width'] : 95;
        $setting['general']['contact'] =  isset($general_settings['contact']) ? $general_settings['contact'] : '(+84) 339 389 179';
        $setting['general']['email'] =  isset($general_settings['email']) ? $general_settings['email'] : 'hi@zinisoft.net';
        $setting['general']['address'] =  isset($general_settings['address']) ? $general_settings['address'] : '6/F, Centana Thu Thiem Tower, 36 Mai Chi Tho, District 2, HCMC, Vietnam';
        $setting['general']['privacy_page'] =  isset($general_settings['privacy_page']) ? $general_settings['privacy_page'] : '0';
        $setting['general']['term_condition_page'] =  isset($general_settings['term_condition_page']) ? $general_settings['term_condition_page'] : '0';
        $setting['general']['is_show_demo_app'] =  (isset($general_settings['is_show_demo_app']) && $general_settings['is_show_demo_app'] == 'true' ) ? true : false;
        $setting['general']['is_rtl'] =  (isset($general_settings['is_rtl']) && $general_settings['is_rtl'] == 'true' ) ? true : false;
        $setting['general']['facebook'] =  isset($general_settings['facebook']) ? $general_settings['facebook'] : 'https://www.facebook.com/';
        $setting['general']['twitter'] =  isset($general_settings['twitter']) ? $general_settings['twitter'] : 'https://twitter.com/';
        $setting['general']['google'] =  isset($general_settings['google']) ? $general_settings['google'] : 'https://www.google.com/';
        $setting['general']['instagram'] =  isset($general_settings['instagram']) ? $general_settings['instagram'] : 'https://www.instagram.com/';
        $setting['general']['menu_categories']['product'] = (isset($general_settings['menu_categories']['product']) && $general_settings['menu_categories']['product'] == 'true' ) ? true : false; 
        $setting['general']['menu_categories']['post'] = (isset($general_settings['menu_categories']['post']) && $general_settings['menu_categories']['post'] == 'true' ) ? true : false; 
        $setting['general']['is_allow_google_login'] =  (isset($general_settings['is_allow_google_login']) && $general_settings['is_allow_google_login'] == 'true' ) ? true : false;
        $setting['general']['is_allow_facebook_login'] =  (isset($general_settings['is_allow_facebook_login']) && $general_settings['is_allow_facebook_login'] == 'true' ) ? true : false;
        $setting['general']['is_allow_apple_login'] =  (isset($general_settings['is_allow_apple_login']) && $general_settings['is_allow_apple_login'] == 'true' ) ? true : false;
        //ADD more here
    
        // Layout
        // $setting['layout']['layout_content_width'] = $layout_content_width;
        // $setting['layout']['main_background_color'] = $main_background_color;
    
        // Color
        $setting['color']['bg_primary_color'] = isset($color_settings['bg_primary_color']) ? $color_settings['bg_primary_color'] : 'rgba(2, 83, 238, 1)';
        $setting['color']['bg_secondary_color'] = isset($color_settings['bg_secondary_color']) ? $color_settings['bg_secondary_color'] : 'rgba(2, 83, 238, 1)';
        $setting['color']['text_header_color'] = isset($color_settings['text_header_color']) ? $color_settings['text_header_color'] : 'rgba(2, 83, 238, 1)'; 
        $setting['color']['text_headline_color'] = isset($color_settings['text_headline_color']) ? $color_settings['text_headline_color'] : 'rgba(2, 83, 238, 1)'; 
        $setting['color']['text_body_color'] = isset($color_settings['text_body_color']) ? $color_settings['text_body_color'] : 'rgba(2, 83, 238, 1)'; 
        $setting['color']['text_body_meta_color'] = isset($color_settings['text_body_meta_color']) ? $color_settings['text_body_meta_color'] : 'rgba(2, 83, 238, 1)';
    
        // Font
        $setting['typography']['font_headline_family'] = isset($typography_settings['font_headline_family']) ? $typography_settings['font_headline_family'] : 'zs_san_francisco' ;
        $setting['typography']['font_headline_size'] = isset($typography_settings['font_headline_size']) ? (int)$typography_settings['font_headline_size'] : 16 ;
        $setting['typography']['font_headline_weight'] = isset($typography_settings['font_headline_weight']) ? $typography_settings['font_headline_weight'] : 'zsBold';
        //$setting['typography']['font_headline_letter_spacing'] = isset($typography_settings['font_headline_letter_spacing']) ? (int)$typography_settings['font_headline_letter_spacing'] : 0;
        $setting['typography']['font_body_family'] = isset($typography_settings['font_body_family']) ? $typography_settings['font_body_family'] : 'zs_san_francisco';
        $setting['typography']['font_body_size'] = isset($typography_settings['font_body_size']) ? (int)$typography_settings['font_body_size'] : 12;
        $setting['typography']['font_body_weight'] = isset($typography_settings['font_body_weight']) ? $typography_settings['font_body_weight'] : 'zsRegular';
        //$setting['typography']['font_body_letter_spacing'] = isset($typography_settings['font_body_letter_spacing']) ? (int)$typography_settings['font_body_letter_spacing'] : 0;
        $setting['typography']['font_small_family'] = isset($typography_settings['font_small_family']) ? $typography_settings['font_small_family'] : 'zs_san_francisco';
        $setting['typography']['font_small_size'] = isset($typography_settings['font_small_size']) ? (int)$typography_settings['font_small_size'] : 10;
        $setting['typography']['font_small_weight'] = isset($typography_settings['font_small_weight']) ? $typography_settings['font_small_weight'] : 'zsLight';
        //$setting['typography']['font_small_letter_spacing'] = isset($typography_settings['font_small_letter_spacing']) ? (int)$typography_settings['font_headline_letter_spacing'] : 0;
    
        // Blog
        $setting['blog']['blog_layout'] = isset($blog_settings['blog_layout']) ? $blog_settings['blog_layout'] : 'grid' ;
        $setting['blog']['blog_categories_content_type'] = isset($blog_settings['blog_categories_content_type']) ? $blog_settings['blog_categories_content_type'] : 'posts' ;
        $setting['blog']['blog_meta_fields']['author'] = (isset($blog_settings['blog_meta_fields']['author']) && $blog_settings['blog_meta_fields']['author'] == 'true' ) ? true : false;
        $setting['blog']['blog_meta_fields']['categories'] = (isset($blog_settings['blog_meta_fields']['categories']) && $blog_settings['blog_meta_fields']['categories'] == 'true' ) ? true : false;
        $setting['blog']['blog_meta_fields']['datetime'] = (isset($blog_settings['blog_meta_fields']['datetime']) && $blog_settings['blog_meta_fields']['datetime'] == 'true' ) ? true : false;
        $setting['blog']['blog_meta_fields']['comments'] = (isset($blog_settings['blog_meta_fields']['comments']) && $blog_settings['blog_meta_fields']['comments'] == 'true' ) ? true : false;
        
        //Single 
        $setting['blog']['single_share_buttons'] = (isset($blog_settings['single_share_buttons']) && $blog_settings['single_share_buttons'] == 'true' ) ? true : false; 
        $setting['blog']['single_show_bookmark'] = (isset($blog_settings['single_show_bookmark']) && $blog_settings['single_show_bookmark'] == 'true' ) ? true : false; 
        $setting['blog']['single_featured_image'] = (isset($blog_settings['single_featured_image']) && $blog_settings['single_featured_image'] == 'true' ) ? true : false; 

        $setting['blog']['single_meta_fields']['author'] = (isset($blog_settings['single_meta_fields']['author']) && $blog_settings['blog_meta_fields']['author'] == 'true' ) ? true : false; 
        $setting['blog']['single_meta_fields']['categories'] = (isset($blog_settings['single_meta_fields']['categories']) && $blog_settings['blog_meta_fields']['categories'] == 'true' ) ? true : false; 
        $setting['blog']['single_meta_fields']['tags'] = (isset($blog_settings['single_meta_fields']['tags']) && $blog_settings['blog_meta_fields']['tags'] == 'true' ) ? true : false; 
        $setting['blog']['single_meta_fields']['comments'] = (isset($blog_settings['single_meta_fields']['comments']) && $blog_settings['blog_meta_fields']['comments'] == 'true' ) ? true : false; 
        
        $setting['blog']['single_show_excerpt'] = (isset($blog_settings['single_show_excerpt']) && $blog_settings['single_show_excerpt'] == 'true' ) ? true : false; 
        $setting['blog']['single_show_description'] = (isset($blog_settings['single_show_description']) && $blog_settings['single_show_description'] == 'true' ) ? true : false; 
        $setting['blog']['single_author_details'] = (isset($blog_settings['single_author_details']) && $blog_settings['single_author_details'] == 'true' ) ? true : false; 
        $setting['blog']['single_related_posts'] = (isset($blog_settings['single_related_posts']) && $blog_settings['single_related_posts'] == 'true' ) ? true : false; 
        $setting['blog']['single_author_details'] = (isset($blog_settings['single_author_details']) && $blog_settings['single_author_details'] == 'true' ) ? true : false;
        $setting['blog']['single_show_tags'] = (isset($blog_settings['single_show_tags']) && $blog_settings['single_show_tags'] == 'true' ) ? true : false; 
        
        //Ads
        // $setting['ads']['is_show_blog_ads_header'] = (isset($ads_settings['is_show_blog_ads_header']) && $ads_settings['is_show_blog_ads_header'] == 'true' ) ? true : false;
        // $setting['ads']['blog_ads_header_id'] =  isset($ads_settings['blog_ads_header_id']) ? $ads_settings['blog_ads_header_id'] : 'ca-app-pub-3940256099942544/6300978111';
        // $setting['ads']['is_show_blog_ads_footer'] = (isset($ads_settings['is_show_blog_ads_footer']) && $ads_settings['is_show_blog_ads_footer'] == 'true' ) ? true : false;
        // $setting['ads']['blog_ads_footer_id'] =  isset($ads_settings['blog_ads_footer_id']) ? $ads_settings['blog_ads_footer_id'] : 'ca-app-pub-3940256099942544/6300978111';
        // $setting['ads']['is_show_blog_interstitial_ads'] = (isset($ads_settings['is_show_blog_interstitial_ads']) && $ads_settings['is_show_blog_interstitial_ads'] == 'true' ) ? true : false;
        // $setting['ads']['blog_interstitial_ads_id'] =  isset($ads_settings['blog_interstitial_ads_id']) ? $ads_settings['blog_interstitial_ads_id'] : 'ca-app-pub-3940256099942544/6300978111';
        
        //Woo General
        $setting['woo_general']['woo_categories_content_type'] = isset($woo_general_settings['woo_categories_content_type']) ? $woo_general_settings['woo_categories_content_type'] : 'posts';
        $setting['woo_general']['woo_is_allow_booking'] = (isset($woo_general_settings['woo_is_allow_booking']) && $woo_general_settings['woo_is_allow_booking']=='true') ? true : false;
        $setting['woo_general']['woo_show_variations'] = (isset($woo_general_settings['woo_show_variations']) && $woo_general_settings['woo_show_variations']=='true') ? true : false;

        // Woo Product Listings
        // $setting['woo_product_listings']['num_of_column'] = isset($woo_product_listings_settings['pl_num_of_column']) ? (int)$woo_product_listings_settings['pl_num_of_column'] : 1;
        // $setting['woo_product_listings']['num_product_per_page'] = isset($woo_product_listings_settings['pl_num_product_per_page']) ? (int)$woo_product_listings_settings['pl_num_product_per_page'] :  12;
        // $setting['woo_product_listings']['is_show_category'] = (isset($woo_product_listings_settings['pl_is_show_category']) && $woo_product_listings_settings['pl_is_show_category'] == 'true' ) ? true : false;
        // $setting['woo_product_listings']['is_show_available_stock'] = (isset($woo_product_listings_settings['pl_is_show_available_stock']) && $woo_product_listings_settings['pl_is_show_available_stock'] == 'true' ) ? true : false;
        // $setting['woo_product_listings']['is_show_out_of_stock'] = (isset($woo_product_listings_settings['pl_is_show_out_of_stock']) && $woo_product_listings_settings['pl_is_show_out_of_stock'] == 'true' ) ? true : false;
        // $setting['woo_product_listings']['is_show_filter'] = (isset($woo_product_listings_settings['pl_is_show_filter']) && $woo_product_listings_settings['pl_is_show_filter'] == 'true' ) ? true : false;

        // Woo Single Product
        $setting['woo_single_product']['thumb_position'] = isset($woo_single_product_settings['sp_thumb_position']) ? $woo_single_product_settings['sp_thumb_position'] : 'bottom';
        $setting['woo_single_product']['is_fullscreen_view'] = (isset($woo_single_product_settings['sp_is_fullscreen_view']) && $woo_single_product_settings['sp_is_fullscreen_view'] == 'true' ) ? true : false;
        $setting['woo_single_product']['is_show_share_button'] = (isset($woo_single_product_settings['sp_is_show_share_button']) && $woo_single_product_settings['sp_is_show_share_button'] == 'true' ) ? true : false;
        $setting['woo_single_product']['is_show_short_description'] = (isset($woo_single_product_settings['sp_is_show_short_description']) && $woo_single_product_settings['sp_is_show_short_description'] == 'true' ) ? true : false;
        $setting['woo_single_product']['is_show_related_product'] = (isset($woo_single_product_settings['sp_is_show_related_product']) && $woo_single_product_settings['sp_is_show_related_product'] == 'true' ) ? true : false;
        $setting['woo_single_product']['related_product_per_page'] = isset($woo_single_product_settings['sp_related_product_per_page']) ? (int)$woo_single_product_settings['sp_related_product_per_page'] : 12;
        $setting['woo_single_product']['show_upsells_products'] = (isset($woo_single_product_settings['sp_show_upsells_products']) && $woo_single_product_settings['sp_show_upsells_products'] =='true') ? true : false;
        $setting['woo_single_product']['upsells_product_per_page'] = isset($woo_single_product_settings['sp_upsells_product_per_page']) ? (int)$woo_single_product_settings['sp_upsells_product_per_page'] : 12;

        /** Onboarding Screen settings. */
        $is_show_intro_screen = get_field( 'is_show_intro_screen', $post_id );
        $intro_screen_gallery = get_field( 'intro_screen_gallery', $post_id );

        $setting['intro_screen']['is_show_intro_screen'] = isset($is_show_intro_screen) ? $is_show_intro_screen : false;
        $setting['intro_screen']['intro_screen_gallery'] = array();
        if($is_show_intro_screen) {
            foreach($intro_screen_gallery as $imgObj) {
                $imgObj['url'] = wp_get_attachment_image_url( $imgObj['ID'], 'zs-intro-screen' );
                unset($imgObj['sizes']);
                array_push($setting['intro_screen']['intro_screen_gallery'], $imgObj);
            }
            // $setting['intro_screen']['intro_screen_gallery'] = $intro_screen_gallery;
        }

        /** Settings for extra plugin */
        $setting['extra'] = array();
        if(class_exists( 'order_delivery_date' )) {

            $orddd['order_delivery_date']['status'] = true; 
            $orddd['order_delivery_date']['orddd_allow_tracking'] = get_option('orddd_allow_tracking');
            $orddd['order_delivery_date']['orddd_custom_settings_9_14'] = get_option('orddd_custom_settings_9_14');
            $orddd['order_delivery_date']['orddd_db_version'] = get_option('orddd_db_version');
            $orddd['order_delivery_date']['orddd_enable_availability_display'] = get_option('orddd_enable_availability_display');
            $orddd['order_delivery_date']['orddd_enable_availability_display_update'] = get_option('orddd_enable_availability_display_update');
            $orddd['order_delivery_date']['orddd_general_settings_9_14'] = get_option('orddd_general_settings_9_14');
            $orddd['order_delivery_date']['orddd_location_field_label	'] = get_option('orddd_location_field_label	');
            $orddd['order_delivery_date']['orddd_mdt_updated'] = get_option('orddd_mdt_updated');
            $orddd['order_delivery_date']['orddd_show_partially_booked_dates'] = get_option('orddd_show_partially_booked_dates');
            $orddd['order_delivery_date']['orddd_show_partially_booked_dates_update'] = get_option('orddd_show_partially_booked_dates_update');
            $orddd['order_delivery_date']['orddd_update_location_label'] = get_option('orddd_update_location_label');
            $orddd['order_delivery_date']['orddd_update_shipping_method_id'] = get_option('orddd_update_shipping_method_id');
            $orddd['order_delivery_date']['orddd_update_shipping_method_id_delete'] = get_option('orddd_update_shipping_method_id_delete');
            $orddd['order_delivery_date']['status'] = true; 
            $orddd['order_delivery_date']['orddd_allow_tracking'] = get_option('orddd_allow_tracking');
            $orddd['order_delivery_date']['orddd_custom_settings_9_14'] = json_decode(get_option('orddd_custom_settings_9_14'));
            $orddd['order_delivery_date']['orddd_db_version'] = get_option('orddd_db_version');
            $orddd['order_delivery_date']['orddd_enable_availability_display'] = get_option('orddd_enable_availability_display');
            $orddd['order_delivery_date']['orddd_enable_availability_display_update'] = get_option('orddd_enable_availability_display_update');
            $orddd['order_delivery_date']['orddd_general_settings_9_14'] = json_decode(get_option('orddd_general_settings_9_14'));
            $orddd['order_delivery_date']['orddd_location_field_label'] = get_option('orddd_location_field_label');
            $orddd['order_delivery_date']['orddd_locations'] = get_option('orddd_locations');

            $orddd['order_delivery_date']['orddd_delivery_time_slot_log'] = array();
            $orddd_delivery_time_slot_log = json_decode(get_option('orddd_delivery_time_slot_log'));
            foreach($orddd_delivery_time_slot_log as &$slot) {
                $slot->dd = json_decode($slot->dd);
                array_push($orddd['order_delivery_date']['orddd_delivery_time_slot_log'], $slot);
            }
            $orddd['order_delivery_date']['orddd_mdt_updated'] = get_option('orddd_mdt_updated');
            $orddd['order_delivery_date']['orddd_show_partially_booked_dates'] = get_option('orddd_show_partially_booked_dates');
            $orddd['order_delivery_date']['orddd_show_partially_booked_dates_update'] = get_option('orddd_show_partially_booked_dates_update');
            $orddd['order_delivery_date']['orddd_update_location_label'] = get_option('orddd_update_location_label');
            $orddd['order_delivery_date']['orddd_update_shipping_method_id'] = get_option('orddd_update_shipping_method_id');
            $orddd['order_delivery_date']['orddd_update_shipping_method_id_delete'] = get_option('orddd_update_shipping_method_id_delete');


            array_push($setting['extra'],$orddd);
        }
        if(class_exists( 'WC_MINMAX' )) {
            $mmSettings['wc_minmax']['status'] = true;
            
            $mmSettings['wc_minmax']['wc_minmax_quantity_advanced_settings'] = get_option('wc_minmax_quantity_advanced_settings');
            $mmSettings['wc_minmax']['wc_minmax_quantity_general_settings'] = get_option('wc_minmax_quantity_general_settings');

            array_push($setting['extra'],$mmSettings);
        }
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
    
    function _endpoint_zinistore_thumbnail($data) {
        $postId = isset($data['id']) ? $data['id']:0 ;
        $thumbSizeArr = array();
        $thumbId = get_post_thumbnail_id($postId);
        if(!empty($thumbId)) {
            $thumbSizeArr = wp_get_attachment_metadata($thumbId);
        } 
        $thumbSizeArr = json_encode($thumbSizeArr);
        return rest_ensure_response(json_decode($thumbSizeArr));
    }
    
    function _endpoint_zinistore_related($data) {
        $postId = isset($data['id']) ? $data['id']: 0 ;
        $relatedArr = array();
        //$relatedPlugin = get_field( 'zm_post_related_plugin', 'option' );
        
        if (function_exists('yarpp_get_related')) {
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
        // if (function_exists('get_crp_posts_id') && 'CRPP' == $relatedPlugin) {
        //     $defaults = array( 'postid' =>$postId );
        //     $relatedArr = get_crp_posts_id( $defaults );
        //     if (!empty($relatedArr)) {
        //         foreach ($relatedArr as &$related) { 
        //             $wp_post = get_post($related->ID);
        //             // Borrow prepare_item_for_response method from WP_REST_Posts_Controller.
        //             $posts_controller = new \WP_REST_Posts_Controller($wp_post->post_type, $data);
        //             $related = $posts_controller->prepare_item_for_response($wp_post, $data);
        //             $related = $related->data; //Get data only
        //         }
        //     }
        // }
        
        $relatedArr = json_encode($relatedArr);
        return rest_ensure_response(json_decode($relatedArr));
    }
    
    function _endpoint_zinistore_popular() {
        /*
        $popularArr = array();
        $popularPlugin = get_field( 'zm_post_popular_plugin', 'option' );
        if (function_exists('wpp_get_mostpopular') && 'WPP' == $popularPlugin) {
        $request = new WP_REST_Request( \WP_REST_Server::READABLE, '/wordpress-popular-posts/v1/popular-posts' );
        $response = rest_do_request( $request );
        $server = rest_get_server();
        if ( ! function_exists('wpp_get_mostpopular') ) {
            $popularArr = $server->response_to_data( $response, false ); 
        } else {
            $popularArr = array();
        }
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
        */
        $popularArr = array();
        return rest_ensure_response( $popularArr );
    } 

    function _endpoint_zinistore_generate_hash($request_data ) {
        // Fetching values from API
        $parameters = $request_data->get_params( );
        $salt = "woJLLco2YV"; 
        $payhash_str = $parameters["key"] . '|' . $parameters["txnid"] . '|' . $parameters["amount"] . '|' . $parameters["productinfo"] . '|' . $parameters["firstname"] . '|' . $parameters["email"] . '|||||||||||' . $salt;
        
        $hash = strtolower(hash('sha512', $payhash_str));
        return rest_ensure_response($hash);
    }

    function checkNull($value)
    {
        if ($value == null) {
            return '';
        } else {
            return $value;
        }
    }
    
    // Return Featured IMAGE OBJECT
    function _render_featured_image_obj( $object, $field_name, $request ) {
        if(isset($object['featured_media']) && $object['featured_media'] > 0) {
            return $this->_get_all_image_sizes($object['featured_media']);
        } else {
            return 0;
        }
    }
    // Return ARRAY CATEGORIES from catID
    function _render_categories_arr( $object, $field_name, $request ) {
        if($object['categories']) {
            $tmpArrCategories = array();
            foreach($object['categories'] as $catId) {
                $tmpArrCategories[] = get_category($catId);
            }
            return $tmpArrCategories;
        } else {
            return array();
        }
    }

    // Return ARRAY TAGS from tagID
    function _render_tags_arr( $object, $field_name, $request ) {
        if(!empty($object['tags'])) {
            $tmpArrTags = array();
            foreach($object['tags'] as $tagId) {
                $tmpArrTags[] = get_tag( $tagId);
            }
            return $tmpArrTags;
        } else {
            return array();
        }
    }

    // Return AUTHOR OBJECT
    function _render_author_obj( $object, $field_name, $request ) {
        if($object['author']) {
            $tmpObj = (object) array('id' =>  $object['author'], 'author_name' => get_the_author_meta('display_name', $object['author']));
            return $tmpObj;
        } else {
            return 0;
        }
    } 

    function _render_meta_data_json(  $object, $field_name, $request  ) {
        $tmpObj = array();

        $zs_gallery = get_field( 'gallery', $object['id'] );
        $zs_audio_url = get_field( 'audio_url', $object['id'] );
        $zs_video_url = get_field( 'video_url', $object['id'] );
        
        if( $zs_gallery ) {
            $tmpObj['gallery'] = $zs_gallery;
        } else {
            $tmpObj['gallery'] = array();
        }
        
        if( $zs_audio_url ) {
            $tmpObj['audio_url'] = $zs_audio_url;
        } else {
            $tmpObj['audio_url'] = '';
        }
        
        if( $zs_video_url ) {
            $tmpObj['video_url'] = $zs_video_url;
        } else {
            $tmpObj['video_url'] = '';
        }
        return $tmpObj;
    }

    function _render_product_meta_data(  $object, $field_name, $request  ) {
        $tmpObj = array();
 
        $product = wc_get_product( $object['id'] );
        if( $product ) {
            $tmpObj['regular_price'] = $product->get_regular_price();
            $tmpObj['sale_price'] = $product->get_sale_price();
            $tmpObj['price'] = $product->get_price();
            $tmpObj['currency_symbol'] =  get_woocommerce_currency_symbol(); 
        } else {
            $tmpObj['gallery'] = array();
        } 
        return $tmpObj;
    }

    // Return Thumbnail category
    function _render_category_thumbnail_obj( $object, $field_name, $request ) {
        $img = get_field( 'thumbnail', "category_".$object['id'] );
        if(isset($img) ){
            return $img;
        } else {
            return 0;
        }
    }
	
	// Re-render line items of order
    function _render_line_items( $object, $field_name, $request ) {
        if(!empty($object['line_items'])) {
            $tmpLineItems = array();
            foreach($object['line_items'] as $item) {
                $product = wc_get_product( $item['product_id'] );
                if(!empty($product)) {
                    $image_id = $product->get_image_id();
                    $images = [];
                    if(isset($image_id) && $image_id > 0) {
                        $images = $this->_get_all_image_sizes($image_id);
                    }
                    $item['images'] = array($images);
                    $item['attributes'] = $product->get_attributes();
                    $tmpLineItems[] = $item ;
                }
                
            }
            return $tmpLineItems;
        } else {
            return array();
        }
    }
     
    function update_api_posts_meta_field() {
        register_rest_field( 'post', 'featured_media', array(
               'get_callback'    => array($this, '_render_featured_image_obj'),
               'schema'          => null,
            )
        );
        register_rest_field( 'post', 'categories', array(
            'get_callback'    => array($this, '_render_categories_arr'),
            'schema'          => null,
            )
        );
        register_rest_field( 'post', 'tags', array(
            'get_callback'    => array($this, '_render_tags_arr'),
            'schema'          => null,
            )
        );

        register_rest_field( 'post', 'author', array(
            'get_callback'    => array($this, '_render_author_obj'),
            'schema'          => null,
            )
        );

        register_rest_field( 'post', 'zs_meta_data', array(
            'get_callback'    => array($this, '_render_meta_data_json'),
            'schema'          => null,
            )
        );
    }
     
    function update_api_categories_meta_field() {
        register_rest_field( 'category', 'thumbnail', array(
                'get_callback'    => array($this, '_render_category_thumbnail_obj'),
                'schema'          => null,
            )
        );
    }
     
    function update_api_products_meta_field() {
        register_rest_field( 'product', 'featured_media', array(
                'get_callback'    => array($this, '_render_featured_image_obj'),
                'schema'          => null,
            )
        );
        register_rest_field( 'product', 'product_meta_fields', array(
            'get_callback'    => array($this, '_render_product_meta_data'),
            'schema'          => null,
        )
    );
    }

	function update_api_orders_meta_field() {
        register_rest_field( 'shop_order', 'line_items', array(
                'get_callback'    => array($this, '_render_line_items'),
                'schema'          => null,
            )
        );
    }
    /**
	 * Main Helper Instance.
	 *
	 * Insures that only one instance of Helper exists in memory at any one time.
	 *
	 * @static
	 * @return Setting
	 * @since 1.0.0
	 **/
	public static function get_instance($plugin_name, $version) {
		if ( ! isset( self::$instance ) && ! ( self::$instance instanceof Setting ) ) {
			self::$instance = new Setting($plugin_name, $version);
		}
		return self::$instance;
	}
} 
