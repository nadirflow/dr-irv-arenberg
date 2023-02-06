<?php
/**
 * Plugin Name: ZiniAppBuilder
 * Plugin URI: https://codecanyon.net/user/zinisoft/portfolio
 * Description: ZiniAppBuilder - Mobile Builder Plugin and API generation for WooCommerce App (React Native).
 * Author: ZiniSoft
 * Version: 2.0.0
 * Author URI: https://codecanyon.net/user/zinisoft
 * Requires PHP: 7.0
 * Requires at least: 4.0
 * Tested up to: 5.3
 **/

/**
 * ZiniAppBuilder Wordpress Plugin for Mobile App.
 * Exclusively on Envato Market: https://codecanyon.net/user/zinisoft/portfolio
 *
 * @encoding        UTF-8
 * @version         1.0.0
 * @copyright       Copyright (C) 2018 - 2019 ZiniSoft ( https://zinisoft.net/ ). All rights reserved.
 * @license         Envato License https://1.envato.market/KYbje
 * @contributors    Brian Vo (info@zinisoft.net), ZiniSoft Team (hi@zinisoft.net)
 * @support         hi@zinisoft.net
 **/

namespace ZiniSoft;

/** Exit if accessed directly. */
if ( ! defined( 'ABSPATH' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit;
}

/** Include plugin autoloader for additional classes. */
require __DIR__ . '/src/autoload.php';

/** Include ACF. */
require __DIR__ . '/acf_ext/acf_fields.php';

use AppleKey as GlobalAppleKey;
use ZiniSoft\GeneralLib\ChangeLog;
use ZiniSoft\GeneralLib\EnvatoItem;
use ZiniSoft\GeneralLib\Helper;
use ZiniSoft\GeneralLib\PluginUpdater;
use ZiniSoft\GeneralLib\Shortcodes; 
use ZiniSoft\GeneralLib\StatusTab;
use ZiniSoft\GeneralLib\PluginActivation;
use ZiniSoft\GeneralLib\AssignmentsTab;
use ZiniSoft\GeneralLib\UninstallTab;
use ZiniSoft\GeneralLib\PluginHelper;
use ZiniSoft\GeneralLib\UI;
use ZiniSoft\GeneralLib\User;

use ZiniSoft\AppBuilder\Loader;
use ZiniSoft\AppBuilder\Auth;
use ZiniSoft\AppBuilder\Setting;
use ZiniSoft\AppBuilder\Home;
use ZiniSoft\AppBuilder\Cart;
use ZiniSoft\AppBuilder\Activator;
use ZiniSoft\AppBuilder\AppleKey;
use ZiniSoft\AppBuilder\Deactivator;
use ZiniSoft\AppBuilder\Products;
use ZiniSoft\AppBuilder\Vendor;
use ZiniSoft\AppBuilder\WCFM;
use DOMDocument;
use DOMXPath;

/** Includes the autoloader for libraries installed with Composer. */
require __DIR__ . '/vendor/autoload.php';
require_once __DIR__ . '/helpers/zini-app-builder-functions.php';

/**
 * SINGLETON: Core class used to implement a ZiniAppBuilder plugin.
 *
 * This is used to define internationalization, admin-specific hooks, and
 * public-facing site hooks.
 *
 * @since 1.0.0
 */

define( 'ZINI_APP_BUILDER_CONTROL_VERSION', '2.0.0' );
define( 'ZINI_APP_BUILDER_PLUGIN_NAME', 'zini-app-builder' );
define( 'ZINI_APP_BUILDER_TABLE_NAME', 'zini_app_builder' );

final class ZiniAppBuilder {
    /**
	 * The unique identifier of this plugin.
	 *
	 * @since    1.0.0
	 * @var      string $plugin_name The string used to uniquely identify this plugin.
	 */
	public static $plugin_name;

    /**
     * Plugin version.
     *
     * @string version
     * @since 1.0.0
     **/
    public static $version = '';

    /**
     * ZiniAppBuilder Plugin settings.
     *
     * @var array()
     * @since 1.0.0
     **/
    public $options = [];

    /**
     * Use minified libraries if SCRIPT_DEBUG is turned off.
     *
     * @since 1.0.0
     **/
    public static $suffix = '';

    /**
     * URL (with trailing slash) to plugin folder.
     *
     * @var string
     * @since 1.0.0
     **/
    public static $url = '';

    /**
     * PATH to plugin folder.
     *
     * @var string
     * @since 1.0.0
     **/
    public static $path = '';

    /**
     * Plugin base name.
     *
     * @var string
     * @since 1.0.0
     **/
    public static $basename = '';

    /**
	 * The loader that's responsible for maintaining and registering all hooks that power
	 * the plugin.
	 *
	 * @since    1.0.0
	 * @access   protected
	 * @var      Loader $loader Maintains and registers all hooks for the plugin.
	 */
	protected $loader;

    /**
     * The one true ZiniAppBuilder.
     *
     * @var ZiniAppBuilder
     * @since 1.0.0
     **/
    private static $instance; 

    /**
     * Sets up a new plugin instance.
     *
     * @since 1.0.0
     * @access public
     **/
    private function __construct() {

        /** Initialize main variables. */
        $this->init();

        if ( !class_exists( 'WooCommerce' ) ) {
            add_action( 'admin_notices', [ $this, 'active_woo_commerce_notice' ] );
        } else {
            /** Custom Woo Commerce. */
            $this->add_filter_woo_commerce();
        }
        /** Initialize RESTBase */
        /** Show admin warning, if we need ACFpro. */
	    if (  !is_plugin_active( 'advanced-custom-fields-pro/acf.php' ) ) {
            add_action( 'admin_notices', [ $this, 'key_notice' ] );
        } else {
            if ( function_exists('acf_add_options_page') ) {
                acf_add_options_page(array(
                    'page_title' 	=> 'Zini App Builder',
                    'menu_title'	=> 'Zini App Builder',
                    'menu_slug' 	=> 'zs_zinistore_builder',
                    'capability'	=> 'edit_posts',
                    'redirect'		=> false
                ));
                acf_add_options_page(array(
                    'page_title' 	=> 'ZiniStore Onboarding Screen',
                    'menu_title'	=> 'ZiniStore Onboarding Screen',
                    'menu_slug' 	=> 'zs_zinistore_intro_screen',
                    'capability'	=> 'edit_posts',
                    'redirect'		=> false
                ));
            } 
        } 

        /** Add plugin settings page. */
        $this->add_settings_page();

        /** Add image size. */
        $this->add_image_size();

        /** Load JS and CSS for Backend Area. */
        $this->enqueue_backend();

        /** Load JS and CSS for Frontend Area. */
        $this->enqueue_frontend();  

        /** Add Meta Box for Post/Page. */
        add_action( 'add_meta_boxes', [ $this, 'meta_box' ] );  

	    /** Load stand-alone plugins. */
        //$this->load_sub_plugins();

        $this->define_api_hooks();

        $this->run_api_hooks();
    }

    
    public function prepare_product_list($response, $post, $request)
    {
        if (empty($response->data)) {
            return $response;
        }

        //get all product image size
        global $_wp_additional_image_sizes;
    
        $default_image_sizes = get_intermediate_image_sizes();
        foreach ($response->data['images'] as $key => $image) {
            foreach ($default_image_sizes as $size) {
                $sizeW = "{$size}-width" ;
                $sizeH = "{$size}-height" ;
                $attament_src = wp_get_attachment_image_src($image['id'], $size);
                if(!empty($attament_src)) {
                    $response->data['images'][$key]['sizes'][$size] = $attament_src[0];
                } else {
                    $response->data['images'][$key]['sizes'][$size] = "";
                }
                if ( in_array( $size, array( 'thumbnail', 'medium', 'large' ) ) ) {
                    $response->data['images'][$key]['sizes'][$sizeW] = intval( get_option( $size . '_size_w' ));
                    $response->data['images'][$key]['sizes'][$sizeH] = intval( get_option( $size . '_size_h' ));
                } elseif ( isset( $_wp_additional_image_sizes[ $size ] ) ) {
                    $response->data['images'][$key]['sizes'][$sizeW] = $_wp_additional_image_sizes[ $size ]['width'];
                    $response->data['images'][$key]['sizes'][$sizeH] = $_wp_additional_image_sizes[ $size ]['height'];
                }
                // $response->data['images'][$key]['sizes'][$sizeW] = get_option( "{$size}_size_w" ) ;
                // $response->data['images'][$key]['sizes'][$sizeH] = get_option( "{$size}_size_h" ) ;
            }
        }
        
        //get array variations obj
        /*
        $product_s = wc_get_product( $response->data['id'] );
        if ($product_s->product_type == 'variable') {
            $variations = $product_s->get_available_variations();
            
            $variations_array = array();
            foreach($variations as $variation ){
        
                // Attributes
                $attributes = array();
                foreach( $variation['attributes'] as $key => $value ){
                    $taxonomy = str_replace('attribute_', '', $key );
                    $taxonomy_label = get_taxonomy( $taxonomy )->labels->singular_name;
                    $term_name = get_term_by( 'slug', $value, $taxonomy )->name;
                    $item['id'] = $response->data['attributes'];
                    $item['name'] = $taxonomy_label;
                    $item['option'] = $term_name;
                    foreach($response->data['attributes'] as $attr) {
                        if ($taxonomy_label == $attr['name']) {
                            $item['id'] = $attr['id'];
                            break;
                        }
                    }
                    array_push($attributes,$item);
                }
                $variation['attributes'] = $attributes;
                array_push($variations_array, $variation);
            }
            $response->data['variations'] = $variations_array;
        }
        */

        return $response;
    
    }

    public function display_order_data_in_admin( $order ){  
        $client_info = $order->get_user();
        ?>
        <div>
            <h4 class="form-field" style="margin-top: 1.33em;"><?php _e( 'Booking Extra Details' ); ?></h4>
            <?php 
                echo '<p class="form-field"><strong>' . __( 'Client Name' ) . ': </strong>' . $client_info->first_name . ' ' .$client_info->last_name . '</p>';
                echo '<p class="form-field"><strong>' . __( 'Client Phone' ) . ': </strong>' . get_user_meta( $order->get_user_id(), 'billing_phone', true ) . '</p>';
                echo '<p class="form-field"><strong>' . __( 'Booking Date' ) . ': </strong>' . get_post_meta( $order->get_id(), 'day', true ) . '</p>';
                echo '<p class="form-field"><strong>' . __( 'Booking Hour' ) . ': </strong>' . get_post_meta( $order->get_id(), 'hour', true ) . '</p>'; ?>
        </div>
    <?php }

    public function add_filter_woo_commerce() {
        /** Custom Woo Commerce REST API: get product image size url + array of variation object */
        add_filter("woocommerce_rest_prepare_product_object",[ $this, 'prepare_product_list' ], 10, 3);
        /** add metadata of order in admin page */
        add_action( 'woocommerce_admin_order_data_after_order_details', [ $this, 'display_order_data_in_admin'] );
    }
	/**
     * Return plugin version.
     *
	 * @return string
     * @since 2.0.2
	 * @access public
	 **/
	public function get_version() {
		return self::$version;
    }
    
    /**
     * Return plugin name.
     *
	 * @return string
     * @since 2.0.2
	 * @access public
	 **/
	public function get_plugin_name() {
		return self::$plugin_name;
    }
    
    /**
     * Return run hook apis.
     *
	 * @return string
     * @since 2.0.2
	 * @access public
	 **/
	public function run_api_hooks() {
		return $this->loader->run();
	}
    
    /**
     * Load JS and CSS for Backend Area.
     *
     * @since 1.0.0
     * @access public
     **/
    function enqueue_backend() {

        /** Add admin styles. */
        add_action( 'admin_enqueue_scripts', [ $this, 'admin_styles' ] );

        /** Add admin javascript. */
        add_action( 'admin_enqueue_scripts', [ $this, 'admin_scripts' ] );

    }

    /**
     * Load JS and CSS for Frontend Area.
     *
     * @return void
     * @since 1.0.0
     * @access public
     **/
    function enqueue_frontend() {

        /** Add plugin styles. */
        add_action( 'wp_enqueue_scripts', [ $this, 'enqueue_styles' ] );

        /** Add plugin scripts. */
        add_action( 'wp_enqueue_scripts', [ $this, 'enqueue_scripts' ] );

    }

    /**
     * Add plugin settings page.
     *
     * @since 1.0.0
     * @access public
     **/
    public function add_settings_page() {

        add_action( 'admin_menu', [ $this, 'add_admin_menu' ] );
        add_action( 'admin_init', [ $this, 'settings_init' ] );

    }

    /**
     * Add image size.
     *
     * @since 1.0.0
     * @access public
     **/
    public function add_image_size() {

        add_image_size( 'zs-intro-screen', 750, 1334, true );

    }

    /**
     * Initialize main variables.
     *
     * @since 1.0.0
     * @access public
     **/
    public function init() {

	    /** Plugin version. */
	    if ( ! function_exists('get_plugin_data') ) {
		    require_once( ABSPATH . 'wp-admin/includes/plugin.php' );
	    }

	    $plugin_data = get_plugin_data( __FILE__ );
        self::$version = $plugin_data['Version'];
        self::$plugin_name = ZINI_APP_BUILDER_PLUGIN_NAME;

        /** Gets the plugin URL (with trailing slash). */
        self::$url = plugin_dir_url( __FILE__ );

        /** Gets the plugin PATH. */
        self::$path = plugin_dir_path( __FILE__ );

        /** Use minified libraries if SCRIPT_DEBUG is turned off. */
        self::$suffix = ( defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG ) ? '' : '.min';

        /** Set plugin basename. */
        self::$basename = plugin_basename( __FILE__ );

        /** Load translation. */
        add_action( 'plugins_loaded', [ $this, 'load_textdomain' ] );
        register_activation_hook(__FILE__, array($this, 'on_activation'));

        /** Get plugin settings. */
        $this->get_options();

        /** Remove all "third-party" notices from plugin settings page. */
	    add_action( 'in_admin_header', [$this, 'remove_all_notices'], 1000 );

        /** Allow JSON files in the media library. */
        add_filter( 'upload_mimes', [ $this, 'allow_json_uploads' ], 1, 1 );

        /** Create /wp-content/uploads/ziniappbuilder/ folder. */
        wp_mkdir_p( trailingslashit( wp_upload_dir()['basedir'] ) . 'ziniappbuilder' );

	    /** Plugin update mechanism enable only if plugin have Envato ID. */
	    // $plugin_id = EnvatoItem::get_instance()->get_id();
	    // if ( (int)$plugin_id > 0 ) {
		//     PluginUpdater::get_instance();
        // }

        /** Initialize PluginHelper. */
        PluginHelper::get_instance();
        /** Adds all the necessary shortcodes. */
        Shortcodes::get_instance();
        $this->loader = Loader::get_instance();
    }

	/**
	 * Load stand-alone plugins.
	 *
	 * @since 2.0.0
	 * @access public
	 **/
    public function load_sub_plugins() {

	    /** If this copy is not activated, remove all modules. */
        if ( ! PluginActivation::get_instance()->is_activated() ) {

            /** Remove all stand-alone plugins. */
            Helper::get_instance()->remove_sub_plugins();

            return;
        } 

    }

	/**
     * Remove all other notices.
     *
     * @since 2.0.0
     * @access public
     **/
    public function remove_all_notices() {

	    /** Work only on plugin settings page. */
	    $screen = get_current_screen();
	    if ( $screen->base != "toplevel_page_zs_ziniappbuilder_settings" ) { return; }

	    /** Remove other notices. */
	    remove_all_actions( 'admin_notices' );
	    remove_all_actions( 'all_admin_notices' ); 
    }

    /**
     * Add Meta Box for Post/Page.
     *
     * @since 1.0.0
     * @access public
     **/
    public function meta_box() {

        $screens = [ 'post', 'page' ];

        foreach ( $screens as $screen ) {
            add_meta_box(
                'zs_ziniappbuilder_box_id',
                'ZiniAppBuilder',
                [ $this, 'meta_box_html' ],
                $screen,
                'side',
                'core'
            );
        }

    }

    /**
     * Render Meta Box.
     *
     * @since 1.0.0
     * @access public
     **/
    public function meta_box_html() {

    } 

    /**
     * Return post/page content by ID with executed shortcodes.
     *
     * @param $post_id - ID of the Post/Page content from which we will parse.
     *
     * @return array|mixed|object
     * @since 1.0.0
     * @access public
     */
    public function parse_post_content( $post_id ) {

        $curl = curl_init();

        /** Prepare URL. */
        $post_id  = curl_escape( $curl, $post_id );
        $abs_path = curl_escape( $curl, ABSPATH );
	    $url      = self::$url . "src/ZiniSoft/ZiniAppBuilder/PostContent.php?post_id={$post_id}&abs_path={$abs_path}&ziniappbuilder_ssml=1";

        curl_setopt( $curl, CURLOPT_URL, $url );
        curl_setopt( $curl, CURLOPT_RETURNTRANSFER, true );
        curl_setopt( $curl, CURLOPT_HEADER, false );
        $json = curl_exec( $curl );

        /**
         * Handle connection errors.
         * Show users an appropriate message asking to try again later.
         **/
        if ( curl_errno( $curl ) > 0 ) {

            $return = [
                'success' => false,
                'message' => 'Error connecting to: ' . $url . PHP_EOL . 'Please check your security plugins and add this url to white list.'
            ];
            wp_send_json( $return );
            wp_die();

        }

        /**
         * If we reach this point, we have a proper response.
         * Get the response code to check if the content was found.
         **/
        $responseCode = curl_getinfo( $curl, CURLINFO_HTTP_CODE );

        /**
         * Anything other than HTTP 200 indicates a request error.
         * In this case, we again ask the user to try again later.
         **/
        if ( $responseCode !== 200 ) {

            $return = [
                'success' => false,
                'message' => 'Failed to get content due to an error: HTTP ' . $responseCode . PHP_EOL . 'URL: ' . $url
            ];
            wp_send_json( $return );
            wp_die();

        }

        curl_close( $curl );

        return json_decode( $json, true );

    }  

    /**
     * Allow JSON files in the media library.
     *
     * @param $mime_types - Current array of mime types.
     *
     * @return array - Updated array of mime types.
     * @since 1.0.0
     * @access public
     */
    public function allow_json_uploads( $mime_types ) {

        /** Adding .json extension. */
        $mime_types['json'] = 'text/plain';

        return $mime_types;
    }

    /**
     * Show admin warning, if we need API Key.
     *
     * @since 1.0.0
     * @access public
     **/
    public function key_notice() {
    ?>

    <div class="settings-error notice notice-warning">
        <p><strong><?php esc_html_e( 'ZiniAppBuilder: Before you begin', 'ziniappbuilder' ); ?></strong></p>
        <p><?php esc_html_e( 'This plugin uses the Advance Custom Field Pro. You need to install before using ZiniAppBuilder.', 'ziniappbuilder' ); ?>
        </p>
    </div>

    <?php
    }

    /**
     * Show admin warning, if plugin wooCommerce is deactive.
     *
     * @since 1.0.0
     * @access public
     **/
    public function active_woo_commerce_notice() {
    ?>

    <div class="settings-error notice notice-warning">
        <p><strong><?php esc_html_e( 'WooCommerce :: Before you begin', 'ziniappbuilder' ); ?></strong></p>
        <p><?php esc_html_e( 'Please enable plugin WooCommerce to before configuring settings. The Products of ZiniStore Mobile App will not work if this plugin is disabled.', 'ziniappbuilder' ); ?>
        </p>
    </div>

    <?php
    }

    /**
     * Add admin menu for plugin settings.
     *
     * @since 1.0.0
     * @access public
     **/
    public function add_admin_menu() {

        add_menu_page(
            esc_html__( 'ZiniAppBuilder Settings', 'ziniappbuilder' ),
            esc_html__( 'Zini App Settings', 'ziniappbuilder' ),
            'manage_options',
            'zs_ziniappbuilder_settings',
            [ $this, 'options_page' ],
            self::$url . 'assets/images/zinistore-logo.svg',
            '80'// Always change digits after "." for different plugins.
        );
    }

    /**
     * Plugin Settings Page.
     *
     * @since 1.0.0
     * @access public
     **/
    public function options_page() {

        if ( ! current_user_can( 'manage_options' ) ) {
            return;
        } ?>
        <!--suppress HtmlUnknownTarget -->
        <form action='options.php' method='post'>
            <div class="wrap">

                <?php
                $tab = 'general';
                if ( isset ( $_GET['tab'] ) ) {
                    $tab = $_GET['tab'];
                }

                /** Render "ZiniAppBuilder settings saved!" message. */
                $this->render_nags();

                /** Render Tabs Headers. */
                ?><section class="zs-aside"><?php
                    $this->render_tabs( $tab );
                ?></section><?php

                /** Render Tabs Body. */
                ?><section class="zs-tab-content"><?php

                    /** General Tab. */
                    if ( $tab == 'general' ) {
                        echo '<h3>' . esc_html__( 'General Settings', 'ziniappbuilder' ) . '</h3>';
                        settings_fields( 'ZiniAppBuilderOptionsGroup' );
                        do_settings_sections( 'ZiniAppBuilderOptionsGroup' );

                    } /** Color Tab. */
                    elseif ( $tab == 'color' ) {
                        echo '<h3>' . esc_html__( 'Color Scheme', 'ziniappbuilder' ) . '</h3>';
                        settings_fields( 'ColorSchemeOptionsGroup' );
                        do_settings_sections( 'ColorSchemeOptionsGroup' );

                    } /** Typography Tab. */
                    elseif ( $tab == 'typography' ) {
                        echo '<h3>' . esc_html__( 'Typography', 'ziniappbuilder' ) . '</h3>';
                        settings_fields( 'TypographyOptionsGroup' );
                        do_settings_sections( 'TypographyOptionsGroup' );

                    } /** Blog Tab. */
                    elseif ( $tab == 'blog' ) {
                        echo '<h3>' . esc_html__( 'Blog Settings', 'ziniappbuilder' ) . '</h3>';
                        settings_fields( 'BlogOptionsGroup' );
                        do_settings_sections( 'BlogOptionsGroup' );

                    } /** Blog Tab. */
                    elseif ( $tab == 'single' ) {
                        echo '<h3>' . esc_html__( 'Single Post', 'ziniappbuilder' ) . '</h3>';
                        settings_fields( 'SingleOptionsGroup' );
                        do_settings_sections( 'SingleOptionsGroup' );

                    }
                     /** Ads Tab. */
                    // elseif ( $tab == 'ads' ) {
                    //     echo '<h3>' . esc_html__( 'Ads Settings', 'ziniappbuilder' ) . '</h3>';
                    //     settings_fields( 'AdsOptionsGroup' );
                    //     do_settings_sections( 'AdsOptionsGroup' );

                    // } /** Assignments Tab. */
                    elseif ( $tab == 'assignments' ) {
                        echo '<h3>' . esc_html__( 'Assignments Settings', 'ziniappbuilder' ) . '</h3>';
                        settings_fields( 'ZiniAppBuilderAssignmentsOptionsGroup' );
                        do_settings_sections( 'ZiniAppBuilderAssignmentsOptionsGroup' );
                        AssignmentsTab::get_instance()->render_assignments();

                    } /** Activation Tab. */
                    elseif ( $tab == 'activation' ) {
                        settings_fields( 'ZiniAppBuilderActivationOptionsGroup' );
                        do_settings_sections( 'ZiniAppBuilderActivationOptionsGroup' );
                        PluginActivation::get_instance()->render_pid();

                    } /** Status tab. */
                    elseif ( $tab == 'status' ) {
                        echo '<h3>' . esc_html__( 'System Requirements', 'ziniappbuilder' ) . '</h3>';
                        StatusTab::get_instance()->render_form();

                    }
                    elseif ( $tab == 'change-log' ) {
                        echo '<h3>' . esc_html__( 'Change Log', 'ziniappbuilder' ) . '</h3>';
                        ChangeLog::get_instance()->render_form();

                    }
                    /** Uninstall Tab. */
                    elseif ( $tab == 'uninstall' ) {
                        echo '<h3>' . esc_html__( 'Uninstall Settings', 'ziniappbuilder' ) . '</h3>';
                        UninstallTab::get_instance()->render_form();
                    }
                    /** Product Listings Tab. */
                    elseif ( $tab == 'woo_general' ) {
                        echo '<h3>' . esc_html__( 'General', 'ziniappbuilder' ) . '</h3>';
                        settings_fields( 'WooGeneralOptionsGroup' );
                        do_settings_sections( 'WooGeneralOptionsGroup' );
                    }
                    /** Product Listings Tab. */
                    // elseif ( $tab == 'woo_product_listings' ) {
                    //     echo '<h3>' . esc_html__( 'Product Listings', 'ziniappbuilder' ) . '</h3>';
                    //     settings_fields( 'WooProductListingsOptionsGroup' );
                    //     do_settings_sections( 'WooProductListingsOptionsGroup' );
                    // }
                    // /** Single Product Tab. */
                    elseif ( $tab == 'woo_single_product' ) {
                        echo '<h3>' . esc_html__( 'Single Product', 'ziniappbuilder' ) . '</h3>';
                        settings_fields( 'WooSingleProductOptionsGroup' );
                        do_settings_sections( 'WooSingleProductOptionsGroup' );
                    }

                    ?>
                </section>
            </div>
        </form>

        <?php
    }

    /**
     * Render Tabs Headers.
     *
     * @param string $current - Selected tab key.
     *
     * @since 1.0.0
     * @access public
     */
    public function render_tabs( $current = 'general' ) {

        /** Tabs Plugin Settings array. */
        $tabs          = [];
        $tabs['general'] = [
                'icon' => 'settings',
                'name' => esc_html__( 'General', 'ziniappbuilder' )
        ];

        /** Show this tabs only if we have key file. */ 
        $tabs['color'] = [
            'icon' => 'brush',
            'name' => esc_html__( 'Color Scheme', 'ziniappbuilder' )
        ];

        $tabs['typography'] = [
            'icon' => 'text_fields',
            'name' => esc_html__( 'Typography', 'ziniappbuilder' )
        ];

        $tabs['blog'] = [
            'icon' => 'settings',
            'name' => esc_html__( 'Blog Archives', 'ziniappbuilder' )
        ];

        $tabs['single'] = [
            'icon' => 'notes',
            'name' => esc_html__( 'Single post', 'ziniappbuilder' )
        ];

        // $tabs['ads'] = [
        //     'icon' => 'money',
        //     'name' => esc_html__( 'Ads', 'ziniappbuilder' )
        // ];

        // $tabs['assignments'] = [
        //     'icon' => 'flag',
        //     'name' => esc_html__( 'Assignments', 'ziniappbuilder' )
        // ];

        $tabs['status'] = [
            'icon' => 'info',
            'name' => esc_html__( 'Status', 'ziniappbuilder' )
        ];

        $tabs['uninstall'] = [
            'icon' => 'delete_sweep',
            'name' => esc_html__( 'Uninstall', 'ziniappbuilder' )
        ];

        /** Tabs WooCommerce Settings array. */
        $woo_tabs = [];
        $woo_tabs['woo_general'] = [
                'icon' => 'settings',
                'name' => esc_html__( 'General', 'ziniappbuilder' )
        ];
        // $woo_tabs['woo_product_listings'] = [
        //         'icon' => 'list',
        //         'name' => esc_html__( 'Product Listings', 'ziniappbuilder' )
        // ];
        $woo_tabs['woo_single_product'] = [
                'icon' => 'spa',
                'name' => esc_html__( 'Single Product', 'ziniappbuilder' )
        ];

        /** Render Tabs. */
        ?>
        <aside class="mdc-drawer">
            <div class="mdc-drawer__content">
                <nav class="mdc-list">

                    <div class="mdc-drawer__header mdc-plugin-fixed">
                        <!--suppress HtmlUnknownAnchorTarget -->
                        <a class="mdc-list-item zs-plugin-title" href="#wpwrap">
                            <i class="mdc-list-item__graphic" aria-hidden="true">
                                <img src="<?php echo esc_attr( self::$url . 'assets/images/zinistore.png' ); ?>" alt="<?php echo esc_html__( 'ZiniAppBuilder', 'ziniappbuilder' ) ?>">
                            </i>
                            <span class="mdc-list-item__text">
                                <?php echo esc_html__( 'ZiniAppBuilder', 'ziniappbuilder' ) ?>
                                <sup><?php echo esc_html__( 'ver.', 'ziniappbuilder' ) . esc_html( self::$version ); ?></sup>
                            </span>
                        </a>
                        <button type="submit" name="submit" id="submit"
                                class="mdc-button mdc-button--dense mdc-button--raised">
                            <span class="mdc-button__label"><?php echo esc_html__( 'Save changes', 'ziniappbuilder' ) ?></span>
                        </button>
                    </div>

                    <hr class="mdc-plugin-menu">
                    <hr class="mdc-list-divider">
                    <h6 class="mdc-list-group__subheader"><?php echo esc_html__( 'Plugin settings', 'ziniappbuilder' ) ?></h6>

                    <?php

                    // Plugin settings tabs
                    foreach ( $tabs as $tab => $value ) {
                        $class = ( $tab == $current ) ? ' mdc-list-item--activated' : '';
                        echo "<a class='mdc-list-item " . $class . "' href='?page=zs_ziniappbuilder_settings&tab=" . $tab . "'><i class='material-icons mdc-list-item__graphic' aria-hidden='true'>" . $value['icon'] . "</i><span class='mdc-list-item__text'>" . $value['name'] . "</span></a>";
                    }

                    if ( class_exists( 'WooCommerce' ) ) { ?>
                        <hr class="mdc-list-divider">
                        <h6 class="mdc-list-group__subheader"><?php echo esc_html__( 'WooCommerce Settings', 'ziniappbuilder' ) ?></h6>
                        <?php
                        /** Woocommerce settings. */
                        foreach ( $woo_tabs as $tab => $value ) {
                            $class = ( $tab == $current ) ? ' mdc-list-item--activated' : '';
                            echo "<a class='mdc-list-item " . $class . "' href='?page=zs_ziniappbuilder_settings&tab=" . $tab . "'><i class='material-icons mdc-list-item__graphic' aria-hidden='true'>" . $value['icon'] . "</i><span class='mdc-list-item__text'>" . $value['name'] . "</span></a>";
                        }
                    }

                    /** Helpful links. */
                    $this->support_link();
                    ?>

                </nav>
            </div>
        </aside>
        <?php
    }

    /**
     * Generate Settings Page.
     *
     * @since 1.0.0
     * @access public
     **/
    public function settings_init() {
        /** General Tab. */
        register_setting( 'ZiniAppBuilderOptionsGroup', 'zs_ziniappbuilder_settings' );
        add_settings_section( 'zs_ziniappbuilder_page_section', '', null, 'ZiniAppBuilderOptionsGroup' ); 
        
        /** Create Color Tab. */
        register_setting( 'ColorSchemeOptionsGroup', 'zs_ziniappbuilder_color_settings' );
        add_settings_section( 'zs_ziniappbuilder_settings_page_color_section', '', null, 'ColorSchemeOptionsGroup' );

        /** Create Typography Tab. */
        register_setting( 'TypographyOptionsGroup', 'zs_ziniappbuilder_typography_settings' );
        add_settings_section( 'zs_ziniappbuilder_settings_typography_section', '', null, 'TypographyOptionsGroup' );
        
        /** Create Blog Tab. */
        register_setting( 'BlogOptionsGroup', 'zs_ziniappbuilder_blog_settings' );
        add_settings_section( 'zs_ziniappbuilder_settings_blog_section', '', null, 'BlogOptionsGroup' );

        /** Create Single Tab. */
        register_setting( 'SingleOptionsGroup', 'zs_ziniappbuilder_single_settings' );
        add_settings_section( 'zs_ziniappbuilder_settings_single_section', '', null, 'SingleOptionsGroup' );
        
        /** Create Ads Tab. */
        // register_setting( 'AdsOptionsGroup', 'zs_ziniappbuilder_ads_settings' );
        // add_settings_section( 'zs_ziniappbuilder_settings_ads_section', '', null, 'AdsOptionsGroup' );

        if ( is_plugin_active( 'advanced-custom-fields-pro/acf.php' ) ) {
            /** Render App Logo. */
            add_settings_field( 'app_logo', esc_html__( 'App Logo:', 'ziniappbuilder' ), [$this, 'render_app_logo'], 'ZiniAppBuilderOptionsGroup', 'zs_ziniappbuilder_page_section' );
            
            /** Render App Name. */
            add_settings_field( 'app_name', esc_html__( 'App Name:', 'ziniappbuilder' ), [$this, 'render_app_name'], 'ZiniAppBuilderOptionsGroup', 'zs_ziniappbuilder_page_section' );

            /** Render App Version. */
            add_settings_field( 'app_version', esc_html__( 'App Version:', 'ziniappbuilder' ), [$this, 'render_app_version'], 'ZiniAppBuilderOptionsGroup', 'zs_ziniappbuilder_page_section' );
            
            /** Language. */
            add_settings_field( 'language', esc_html__( 'Language:', 'ziniappbuilder' ), [$this, 'render_language'], 'ZiniAppBuilderOptionsGroup', 'zs_ziniappbuilder_page_section' );
            
            /** Date format. */
            add_settings_field( 'date_format', esc_html__( 'Date Format:', 'ziniappbuilder' ), [$this, 'render_date_format'], 'ZiniAppBuilderOptionsGroup', 'zs_ziniappbuilder_page_section' );

            /** Time format. */
            add_settings_field( 'time_format', esc_html__( 'Time Format:', 'ziniappbuilder' ), [$this, 'render_time_format'], 'ZiniAppBuilderOptionsGroup', 'zs_ziniappbuilder_page_section' );

            /** Layout Width. */
            add_settings_field( 'layout_width', esc_html__( 'Layout Width:', 'ziniappbuilder' ), [$this, 'render_layout_width'], 'ZiniAppBuilderOptionsGroup', 'zs_ziniappbuilder_page_section' );
            
            /** Contact. */
            add_settings_field( 'contact', esc_html__( 'Contact:', 'ziniappbuilder' ), [$this, 'render_contact'], 'ZiniAppBuilderOptionsGroup', 'zs_ziniappbuilder_page_section' );
            
            /** Email. */
            add_settings_field( 'email', esc_html__( 'Email:', 'ziniappbuilder' ), [$this, 'render_email'], 'ZiniAppBuilderOptionsGroup', 'zs_ziniappbuilder_page_section' );
            
            /** Address. */
            add_settings_field( 'address', esc_html__( 'Address:', 'ziniappbuilder' ), [$this, 'render_address'], 'ZiniAppBuilderOptionsGroup', 'zs_ziniappbuilder_page_section' );
            
            /** Privacy page. */
            add_settings_field( 'privacy_page', esc_html__( 'Privacy page:', 'ziniappbuilder' ), [$this, 'render_privacy_page'], 'ZiniAppBuilderOptionsGroup', 'zs_ziniappbuilder_page_section' );
            
            /** Term & condition page. */
            add_settings_field( 'term_condition_page', esc_html__( 'Term & condition page:', 'ziniappbuilder' ), [$this, 'render_term_condition_page'], 'ZiniAppBuilderOptionsGroup', 'zs_ziniappbuilder_page_section' );
            
            /** Is show list demo app. */
            add_settings_field( 'is_show_demo_app', esc_html__( 'Demo App:', 'ziniappbuilder' ), [$this, 'render_is_show_demo_app'], 'ZiniAppBuilderOptionsGroup', 'zs_ziniappbuilder_page_section' );

            /** RTL. */
            add_settings_field( 'is_rtl', esc_html__( 'Right to Left:', 'ziniappbuilder' ), [$this, 'render_is_rtl'], 'ZiniAppBuilderOptionsGroup', 'zs_ziniappbuilder_page_section' );

            /** Facebook. */
            add_settings_field( 'facebook', esc_html__( 'Facebook:', 'ziniappbuilder' ), [$this, 'render_facebook'], 'ZiniAppBuilderOptionsGroup', 'zs_ziniappbuilder_page_section' );

            /** Twitter. */
            add_settings_field( 'twitter', esc_html__( 'Twitter:', 'ziniappbuilder' ), [$this, 'render_twitter'], 'ZiniAppBuilderOptionsGroup', 'zs_ziniappbuilder_page_section' );

            /** Google. */
            add_settings_field( 'google', esc_html__( 'Google:', 'ziniappbuilder' ), [$this, 'render_google'], 'ZiniAppBuilderOptionsGroup', 'zs_ziniappbuilder_page_section' );
            
            /** Instagram. */
            add_settings_field( 'instagram', esc_html__( 'Instagram:', 'ziniappbuilder' ), [$this, 'render_instagram'], 'ZiniAppBuilderOptionsGroup', 'zs_ziniappbuilder_page_section' );

            /** Menu Categories. */
            add_settings_field( 'menu_categories', esc_html__( 'Menu Categories:', 'ziniappbuilder' ), [$this, 'render_menu_categories'], 'ZiniAppBuilderOptionsGroup', 'zs_ziniappbuilder_page_section' );

            /** Is allow login with google. */
            add_settings_field( 'is_allow_google_login', esc_html__( 'Login With Google:', 'ziniappbuilder' ), [$this, 'render_is_allow_google_login'], 'ZiniAppBuilderOptionsGroup', 'zs_ziniappbuilder_page_section' );

            /** Is allow login with facebook. */
            add_settings_field( 'is_allow_facebook_login', esc_html__( 'Login With Facebook:', 'ziniappbuilder' ), [$this, 'render_is_allow_facebook_login'], 'ZiniAppBuilderOptionsGroup', 'zs_ziniappbuilder_page_section' );

            /** Is allow login with apple. */
            add_settings_field( 'is_allow_apple_login', esc_html__( 'Login With Apple:', 'ziniappbuilder' ), [$this, 'render_is_allow_apple_login'], 'ZiniAppBuilderOptionsGroup', 'zs_ziniappbuilder_page_section' );

            /** Background primary color. */
            add_settings_field( 'bg_primary_color', esc_html__( 'Background Primary Color:', 'ziniappbuilder' ), [$this, 'render_bg_primary_color'], 'ColorSchemeOptionsGroup', 'zs_ziniappbuilder_settings_page_color_section' );

            /** Background secondary color. */
            // add_settings_field( 'bg_secondary_color', esc_html__( 'Background Secondary Color:', 'ziniappbuilder' ), [$this, 'render_bg_secondary_color'], 'ColorSchemeOptionsGroup', 'zs_ziniappbuilder_settings_page_color_section' );

            /** Text primary color. */
            add_settings_field( 'text_header_color', esc_html__( 'Text Header Color:', 'ziniappbuilder' ), [$this, 'render_text_header_color'], 'ColorSchemeOptionsGroup', 'zs_ziniappbuilder_settings_page_color_section' );

            add_settings_field( 'text_headline_color', esc_html__( 'Text Headline Color:', 'ziniappbuilder' ), [$this, 'render_text_headline_color'], 'ColorSchemeOptionsGroup', 'zs_ziniappbuilder_settings_page_color_section' );

            /** Text body color. */
            add_settings_field( 'text_body_color', esc_html__( 'Text Body Color:', 'ziniappbuilder' ), [$this, 'render_text_body_color'], 'ColorSchemeOptionsGroup', 'zs_ziniappbuilder_settings_page_color_section' );

            /** Text body meta color. */
            add_settings_field( 'text_body_meta_color', esc_html__( 'Text Body Meta Color:', 'ziniappbuilder' ), [$this, 'render_text_body_meta_color'], 'ColorSchemeOptionsGroup', 'zs_ziniappbuilder_settings_page_color_section' );

            
            /** Font Headline Family. */
            add_settings_field( 'font_headline_family', esc_html__( 'Font Headline Family:', 'ziniappbuilder' ), [$this, 'render_font_headline_family'], 'TypographyOptionsGroup', 'zs_ziniappbuilder_settings_typography_section' );
            
            /** Font Headline Size. */
            add_settings_field( 'font_headline_size', esc_html__( 'Font Headline Size:', 'ziniappbuilder' ), [$this, 'render_font_headline_size'], 'TypographyOptionsGroup', 'zs_ziniappbuilder_settings_typography_section' );
            
            /** Font Headline Weight. */
            add_settings_field( 'font_headline_weight', esc_html__( 'Font Headline Weight:', 'ziniappbuilder' ), [$this, 'render_font_headline_weight'], 'TypographyOptionsGroup', 'zs_ziniappbuilder_settings_typography_section' );
            
            /** Font Body Family. */
            add_settings_field( 'font_body_family', esc_html__( 'Font Body Family:', 'ziniappbuilder' ), [$this, 'render_font_body_family'], 'TypographyOptionsGroup', 'zs_ziniappbuilder_settings_typography_section' );
            
            /** Font Body Size. */
            add_settings_field( 'font_body_size', esc_html__( 'Font Body Size:', 'ziniappbuilder' ), [$this, 'render_font_body_size'], 'TypographyOptionsGroup', 'zs_ziniappbuilder_settings_typography_section' );
            
            /** Font Body Weight. */
            add_settings_field( 'font_body_weight', esc_html__( 'Font Body Weight:', 'ziniappbuilder' ), [$this, 'render_font_body_weight'], 'TypographyOptionsGroup', 'zs_ziniappbuilder_settings_typography_section' );
            
            /** Font Small Family. */
            add_settings_field( 'font_small_family', esc_html__( 'Font Small Family:', 'ziniappbuilder' ), [$this, 'render_font_small_family'], 'TypographyOptionsGroup', 'zs_ziniappbuilder_settings_typography_section' );
            
            /** Font Small Size. */
            add_settings_field( 'font_small_size', esc_html__( 'Font Small Size:', 'ziniappbuilder' ), [$this, 'render_font_small_size'], 'TypographyOptionsGroup', 'zs_ziniappbuilder_settings_typography_section' );
            
            /** Font Small Weight. */
            add_settings_field( 'font_small_weight', esc_html__( 'Font Small Weight:', 'ziniappbuilder' ), [$this, 'render_font_small_weight'], 'TypographyOptionsGroup', 'zs_ziniappbuilder_settings_typography_section' );
            
            /** Blog Layout. */
            add_settings_field( 'blog_layout', esc_html__( 'Blog Layout:', 'ziniappbuilder' ), [$this, 'render_blog_layout'], 'BlogOptionsGroup', 'zs_ziniappbuilder_settings_blog_section' );
            
            /** Blog Meta Fields. */
            add_settings_field( 'blog_meta_fields', esc_html__( 'Blog Meta Fields:', 'ziniappbuilder' ), [$this, 'render_blog_meta_fields'], 'BlogOptionsGroup', 'zs_ziniappbuilder_settings_blog_section' );
            
            /** Blog Archives. */
            add_settings_field( 'blog_categories_content_type', esc_html__( 'Blog Archive Type:', 'ziniappbuilder' ), [$this, 'render_blog_categories_content_type'], 'BlogOptionsGroup', 'zs_ziniappbuilder_settings_blog_section' );
            
            /** Post Meta Fields. */
            add_settings_field( 'post_meta_fields', esc_html__( 'Archive Meta Fields:', 'ziniappbuilder' ), [$this, 'render_single_meta_fields'], 'PostOptionsGroup', 'zs_ziniappbuilder_settings_post_section' );

            /** Single Meta Fields. */
            add_settings_field( 'single_share_buttons', esc_html__( 'Share buttons:', 'ziniappbuilder' ), [$this, 'render_single_share_buttons'], 'SingleOptionsGroup', 'zs_ziniappbuilder_settings_single_section' );
            add_settings_field( 'single_show_bookmark', esc_html__( 'Bookmark:', 'ziniappbuilder' ), [$this, 'render_single_show_bookmark'], 'SingleOptionsGroup', 'zs_ziniappbuilder_settings_single_section' );
            add_settings_field( 'single_featured_image', esc_html__( 'Featured image:', 'ziniappbuilder' ), [$this, 'render_single_featured_image'], 'SingleOptionsGroup', 'zs_ziniappbuilder_settings_single_section' );
            add_settings_field( 'single_meta_fields', esc_html__( 'Meta Fields:', 'ziniappbuilder' ), [$this, 'render_single_meta_fields'], 'SingleOptionsGroup', 'zs_ziniappbuilder_settings_single_section' );
            add_settings_field( 'single_show_excerpt', esc_html__( 'Exceprt:', 'ziniappbuilder' ), [$this, 'render_single_show_excerpt'], 'SingleOptionsGroup', 'zs_ziniappbuilder_settings_single_section' );
            add_settings_field( 'single_show_description', esc_html__( 'Description:', 'ziniappbuilder' ), [$this, 'render_single_show_description'], 'SingleOptionsGroup', 'zs_ziniappbuilder_settings_single_section' );
            add_settings_field( 'single_author_details', esc_html__( 'Author link:', 'ziniappbuilder' ), [$this, 'render_single_author_details'], 'SingleOptionsGroup', 'zs_ziniappbuilder_settings_single_section' );
            add_settings_field( 'single_show_tags', esc_html__( 'Tags:', 'ziniappbuilder' ), [$this, 'render_single_show_tags'], 'SingleOptionsGroup', 'zs_ziniappbuilder_settings_single_section' );
            add_settings_field( 'single_related_posts', esc_html__( 'Related Posts:', 'ziniappbuilder' ), [$this, 'render_single_related_posts'], 'SingleOptionsGroup', 'zs_ziniappbuilder_settings_single_section' );
            add_settings_field( 'is_show_comments', esc_html__( 'Comments:', 'ziniappbuilder' ), [$this, 'render_is_show_comments'], 'SingleOptionsGroup', 'zs_ziniappbuilder_settings_single_section' );
            /** End Single Meta Fields. */
            /** Blog Ads Header. */
            // add_settings_field( 'is_show_blog_ads_header', esc_html__( 'Blog Ads Header:', 'ziniappbuilder' ), [$this, 'render_is_show_blog_ads_header'], 'AdsOptionsGroup', 'zs_ziniappbuilder_settings_ads_section' );
            // add_settings_field( 'blog_ads_header_id', esc_html__( 'Blog Ads Header Id:', 'ziniappbuilder' ), [$this, 'render_blog_ads_header_id'], 'AdsOptionsGroup', 'zs_ziniappbuilder_settings_ads_section' );
            // add_settings_field( 'is_show_blog_ads_footer', esc_html__( 'Blog Ads Footer:', 'ziniappbuilder' ), [$this, 'render_is_show_blog_ads_footer'], 'AdsOptionsGroup', 'zs_ziniappbuilder_settings_ads_section' );
            // add_settings_field( 'blog_ads_footer_id', esc_html__( 'Blog Ads Footer Id:', 'ziniappbuilder' ), [$this, 'render_blog_ads_footer_id'], 'AdsOptionsGroup', 'zs_ziniappbuilder_settings_ads_section' );
            // add_settings_field( 'is_show_blog_interstitial_ads', esc_html__( 'Blog Interstitial Ads:', 'ziniappbuilder' ), [$this, 'render_is_show_blog_interstitial_ads'], 'AdsOptionsGroup', 'zs_ziniappbuilder_settings_ads_section' );
            // add_settings_field( 'interstitial_blog_ads_id', esc_html__( 'Blog Interstitial Ads Id:', 'ziniappbuilder' ), [$this, 'render_blog_interstitial_ads_id'], 'AdsOptionsGroup', 'zs_ziniappbuilder_settings_ads_section' );

        } else {
            /** After Audio. */
            add_settings_field( 'plugins_required', esc_html__( 'Error:', 'ziniappbuilder' ), [$this, 'render_plugins_required'], 'ZiniAppBuilderOptionsGroup', 'zs_ziniappbuilder_page_section' );
            add_settings_field( 'plugins_required', esc_html__( 'Error:', 'ziniappbuilder' ), [$this, 'render_plugins_required'], 'ColorSchemeOptionsGroup', 'zs_ziniappbuilder_settings_page_color_section' );
            add_settings_field( 'plugins_required', esc_html__( 'Error:', 'ziniappbuilder' ), [$this, 'render_plugins_required'], 'TypographyOptionsGroup', 'zs_ziniappbuilder_settings_typography_section' );
            add_settings_field( 'plugins_required', esc_html__( 'Error:', 'ziniappbuilder' ), [$this, 'render_plugins_required'], 'BlogOptionsGroup', 'zs_ziniappbuilder_settings_blog_section' );
            add_settings_field( 'plugins_required', esc_html__( 'Error:', 'ziniappbuilder' ), [$this, 'render_plugins_required'], 'AdsOptionsGroup', 'zs_ziniappbuilder_settings_ads_section' );
        }

        /** Create Assignments Tab. */
        AssignmentsTab::get_instance()->add_settings(); 

	    /** Create Activation Tab. */
        PluginActivation::get_instance()->add_settings();

	    /** Create Status Tab. */
	    StatusTab::get_instance()->add_settings();

        /** Create Uninstall Tab. */
        UninstallTab::get_instance()->add_settings();

        
        /** Create General Tab. */
        register_setting( 'WooGeneralOptionsGroup', 'zs_ziniappbuilder_woo_general_settings' );
        add_settings_section( 'zs_ziniappbuilder_settings_woo_general_section', '', null, 'WooGeneralOptionsGroup' );
        
        /** Create Product Listings Tab. */
        // register_setting( 'WooProductListingsOptionsGroup', 'zs_ziniappbuilder_woo_product_listings_settings' );
        // add_settings_section( 'zs_ziniappbuilder_settings_woo_product_listings_section', '', null, 'WooProductListingsOptionsGroup' );

        /** Create Single Product Tab. */
        register_setting( 'WooSingleProductOptionsGroup', 'zs_ziniappbuilder_woo_single_product_settings' );
        add_settings_section( 'zs_ziniappbuilder_settings_woo_single_product_section', '', null, 'WooSingleProductOptionsGroup' );

        if ( class_exists( 'WooCommerce' ) ) {
            /** Woo Categories content type. */
            add_settings_field( 'woo_categories_content_type', esc_html__( 'Woo Categories Content Type:', 'ziniappbuilder' ), [$this, 'render_woo_categories_content_type'], 'WooGeneralOptionsGroup', 'zs_ziniappbuilder_settings_woo_general_section' );

            /** Woo Is Allow Booking. */
            add_settings_field( 'woo_is_allow_booking', esc_html__( 'Is Allow Booking:', 'ziniappbuilder' ), [$this, 'render_woo_is_allow_booking'], 'WooGeneralOptionsGroup', 'zs_ziniappbuilder_settings_woo_general_section' );

            /** Woo Product listing variation metaa. */
            add_settings_field( 'woo_show_variation', esc_html__( 'Show variations:', 'ziniappbuilder' ), [$this, 'render_woo_show_variations'], 'WooGeneralOptionsGroup', 'zs_ziniappbuilder_settings_woo_general_section' );

            /** Products Columns On Mobile. */
            add_settings_field( 'pl_num_of_column', esc_html__( 'Products Columns On Mobile:', 'ziniappbuilder' ), [$this, 'render_pl_num_of_column'], 'WooProductListingsOptionsGroup', 'zs_ziniappbuilder_settings_woo_product_listings_section' );
    
            /** Number Of Products Per Page. */
            add_settings_field( 'pl_num_product_per_page', esc_html__( 'Number Of Products Per Page:', 'ziniappbuilder' ), [$this, 'render_pl_num_product_per_page'], 'WooProductListingsOptionsGroup', 'zs_ziniappbuilder_settings_woo_product_listings_section' );
    
            /** Show Product Category. */
            add_settings_field( 'pl_is_show_category', esc_html__( 'Show Product Category:', 'ziniappbuilder' ), [$this, 'render_pl_is_show_category'], 'WooProductListingsOptionsGroup', 'zs_ziniappbuilder_settings_woo_product_listings_section' );
    
            /** Show Available Stock. */
            add_settings_field( 'pl_is_show_available_stock', esc_html__( 'Show Available Stock:', 'ziniappbuilder' ), [$this, 'render_pl_is_show_available_stock'], 'WooProductListingsOptionsGroup', 'zs_ziniappbuilder_settings_woo_product_listings_section' );
    
            /** Show Out Of Stock Category. */
            add_settings_field( 'pl_is_show_out_of_stock', esc_html__( 'Show Out Of Stock:', 'ziniappbuilder' ), [$this, 'render_pl_is_show_out_of_stock'], 'WooProductListingsOptionsGroup', 'zs_ziniappbuilder_settings_woo_product_listings_section' );
    
            /** Show Filter. */
            add_settings_field( 'pl_is_show_filter', esc_html__( 'Show Filter:', 'ziniappbuilder' ), [$this, 'render_pl_is_show_filter'], 'WooProductListingsOptionsGroup', 'zs_ziniappbuilder_settings_woo_product_listings_section' );
    
            /** Product Thumbnail Position. */
            add_settings_field( 'sp_thumb_position', esc_html__( 'Product Thumbnail Position:', 'ziniappbuilder' ), [$this, 'render_sp_thumb_position'], 'WooSingleProductOptionsGroup', 'zs_ziniappbuilder_settings_woo_single_product_section' );
    
            /** Fullscreen Product View. */
            add_settings_field( 'sp_is_fullscreen_view', esc_html__( 'Fullscreen Product View:', 'ziniappbuilder' ), [$this, 'render_sp_is_fullscreen_view'], 'WooSingleProductOptionsGroup', 'zs_ziniappbuilder_settings_woo_single_product_section' );
    
            /** Show Share Button. */
            add_settings_field( 'sp_is_show_share_button', esc_html__( 'Show Share Button:', 'ziniappbuilder' ), [$this, 'render_sp_is_show_share_button'], 'WooSingleProductOptionsGroup', 'zs_ziniappbuilder_settings_woo_single_product_section' );
    
            /** Show Short Description. */
            add_settings_field( 'sp_is_show_short_description', esc_html__( 'Show Short Description:', 'ziniappbuilder' ), [$this, 'render_sp_is_show_short_description'], 'WooSingleProductOptionsGroup', 'zs_ziniappbuilder_settings_woo_single_product_section' );
    
            /** Show Realted Product. */
            add_settings_field( 'sp_is_show_related_product', esc_html__( 'Show Realted Product:', 'ziniappbuilder' ), [$this, 'render_sp_is_show_related_product'], 'WooSingleProductOptionsGroup', 'zs_ziniappbuilder_settings_woo_single_product_section' );
    
            /** Number Of Related Prodcut Per Page. */
            add_settings_field( 'sp_related_product_per_page', esc_html__( 'Number Of Related Prodcut Per Page:', 'ziniappbuilder' ), [$this, 'render_sp_related_product_per_page'], 'WooSingleProductOptionsGroup', 'zs_ziniappbuilder_settings_woo_single_product_section' );
    
            /** Show Up Sells Products. */
            add_settings_field( 'sp_show_upsells_products', esc_html__( 'Show Up Sells Products:', 'ziniappbuilder' ), [$this, 'render_sp_show_upsells_products'], 'WooSingleProductOptionsGroup', 'zs_ziniappbuilder_settings_woo_single_product_section' );
    
            /** Number Of Up Sells Product Per Page. */
            add_settings_field( 'sp_upsells_product_per_page', esc_html__( 'Number Of Up Sells Product Per Page:', 'ziniappbuilder' ), [$this, 'render_sp_upsells_product_per_page'], 'WooSingleProductOptionsGroup', 'zs_ziniappbuilder_settings_woo_single_product_section' );
        } else {
            add_settings_field( 'plugin_woo_commerce_required', esc_html__( 'Error:', 'ziniappbuilder' ), [$this, 'render_plugin_woo_commerce_required'], 'WooGeneralOptionsGroup', 'zs_ziniappbuilder_settings_woo_general_section' );
            // add_settings_field( 'plugin_woo_commerce_required', esc_html__( 'Error:', 'ziniappbuilder' ), [$this, 'render_plugin_woo_commerce_required'], 'WooProductListingsOptionsGroup', 'zs_ziniappbuilder_settings_woo_product_listings_section' );
            add_settings_field( 'plugin_woo_commerce_required', esc_html__( 'Error:', 'ziniappbuilder' ), [$this, 'render_plugin_woo_commerce_required'], 'WooSingleProductOptionsGroup', 'zs_ziniappbuilder_settings_woo_single_product_section' );

        }
        

    }

    /**
     * Render "Settings Saved" nags.
     *
     * @since    2.0.0
     **/
    public function render_nags() {

        if ( ! isset( $_GET['settings-updated'] ) ) { return; }

	    if ( strcmp( $_GET['settings-updated'], "true" ) == 0 ) {

		    /** Render "Settings Saved" message. */
		    UI::get_instance()->render_snackbar( esc_html__( 'Settings saved!', 'ziniappbuilder' ) );

	    }

	    if ( ! isset( $_GET['tab'] ) ) { return; }

        if ( strcmp( $_GET['tab'], "activation" ) == 0 ) {

            if ( PluginActivation::get_instance()->is_activated() ) {

	            /** Render "Activation success" message. */
	            UI::get_instance()->render_snackbar( esc_html__( 'Plugin activated successfully.', 'ziniappbuilder' ), 'success', 5500 );

            } else {

	            /** Render "Activation failed" message. */
	            UI::get_instance()->render_snackbar( esc_html__( 'Invalid purchase code.', 'ziniappbuilder' ), 'error', 5500 );

            }

        }

    }

    /**
     * Render Download link field.
     *
     * @since 2.0.0
     * @access public
     **/
    public function render_link() {

        $options = [
            'none' => esc_html__( 'Do not show', 'ziniappbuilder' ),
            'backend' => esc_html__( 'Backend Only', 'ziniappbuilder' ),
            'frontend' => esc_html__( 'Frontend Only', 'ziniappbuilder' ),
            'backend-and-frontend' => esc_html__( 'Backend and Frontend', 'ziniappbuilder' )
        ];

        /** Render select. */
        UI::get_instance()->render_select(
            $options,
            $this->options['link'], // Selected option.
            esc_html__( 'Download link', 'ziniappbuilder' ),
            esc_html__( 'Position of the Download audio link', 'ziniappbuilder' ),
            ['name' => 'zs_ziniappbuilder_color_settings[link]']
        );
    }

    /**
     * Render App Logo field.
     *
     * @since 1.0.0
     * @access public
     **/
    public function render_app_logo() {

        if ( isset($this->options['app_logo'] )) {
            $key_path = get_attached_file( $this->options['app_logo'] );
            $url_app_logo = wp_get_attachment_url($this->options['app_logo']);
            $key_name = basename( $key_path );
        }

        ?>
        <div class="zs-upload">
            <div>
                <input type="hidden" name="zs_ziniappbuilder_settings[app_logo]"
                       id="zs_ziniappbuilder_settings[app_logo]"
                       value="<?php echo esc_attr( $this->options['app_logo'] ); ?>"/>
                
                <div class="zs-key-file-name">
                    <?php if ( isset( $key_name ) ) : ?>
                        <img alt="<?php echo esc_html( $key_name ); ?>" width="100" src="<?php echo esc_html( $url_app_logo ); ?>"/>
                        
                    <?php endif; ?>
                </div>
                &nbsp;<button class="zs-select-key-file-btn mdc-button mdc-button--outlined"><?php esc_html_e( 'Select Logo', 'ziniappbuilder' ); ?></button>
            </div>
        </div>

        <?php
    }

    /**
     * Render App Name field.
     *
     * @since 2.0.0
     * @access public
     **/
    public function render_app_name() {

        /** Render input. */
        UI::get_instance()->render_input(
            $this->options['app_name'],
            esc_html__( 'App name', 'ziniappbuilder'),
            esc_html__( 'App name on mobile.', 'ziniappbuilder' ),
            ['name' => 'zs_ziniappbuilder_settings[app_name]']
        );

    }

    /**
     * Render App Version field.
     *
     * @since 2.0.0
     * @access public
     **/
    public function render_app_version() {

        /** Render input. */
        UI::get_instance()->render_input(
            $this->options['app_version'],
            esc_html__( 'App version', 'ziniappbuilder'),
            esc_html__( 'App version on mobile.', 'ziniappbuilder' ),
            ['name' => 'zs_ziniappbuilder_settings[app_version]']
        );

    } 

    /**
     * Render Required plugin field.
     *
     * @since 2.0.0
     * @access public
     **/
    public function render_plugins_required() {

        $html = esc_html__( 'This plugin uses the Advance Custom Field Pro. You need to install before using ZiniAppBuilder.', 'ziniappbuilder' );
        /** Render input. */
        UI::get_instance()->render_html($html);

    }

    /**
     * Render Required plugin wooCommerce field.
     *
     * @since 2.0.0
     * @access public
     **/
    public function render_plugin_woo_commerce_required() {

        $html = esc_html__( 'Please enable plugin WooCommerce to before configuring settings. The ZiniStore Mobile App will not work if this plugin is disabled.', 'ziniappbuilder' );
        /** Render input. */
        UI::get_instance()->render_html($html);

    }

    /**
     * Render Background Primary Color field.
     *
     * @since 1.0.0
     * @access public
     **/
    public function render_bg_primary_color() {

        /** Render colorpicker. */
        UI::get_instance()->render_colorpicker(
            $this->options['bg_primary_color'],
            esc_html__( 'Background Primary Color', 'ziniappbuilder' ),
            esc_html__( 'Set main theme color and main background color.', 'ziniappbuilder' ),
            [
                'name' => 'zs_ziniappbuilder_color_settings[bg_primary_color]',
                'id' => 'zs-ziniappbuilder-bg-primary-color',
                'readonly' => 'readonly'
            ]
        );

    }

    /**
     * Render Background Secondary Color field.
     *
     * @since 1.0.0
     * @access public
     **/
    public function render_bg_secondary_color() {

        /** Render colorpicker. */
        UI::get_instance()->render_colorpicker(
            $this->options['bg_secondary_color'],
            esc_html__( 'Background Secondary Color', 'ziniappbuilder' ),
            esc_html__( '', 'ziniappbuilder' ),
            [
                'name' => 'zs_ziniappbuilder_color_settings[bg_secondary_color]',
                'id' => 'zs-ziniappbuilder-bg-secondary-color',
                'readonly' => 'readonly'
            ]
        );

    }

    /**
     * Render Text Header Color field.
     *
     * @since 1.0.0
     * @access public
     **/
    public function render_text_header_color() {
        /** Render colorpicker. */
        UI::get_instance()->render_colorpicker(
            $this->options['text_header_color'],
            esc_html__( 'Text Header Color', 'ziniappbuilder' ),
            esc_html__( 'Used for all header text.', 'ziniappbuilder' ),
            [
                'name' => 'zs_ziniappbuilder_color_settings[text_header_color]',
                'id' => 'zs-ziniappbuilder-text-header-color',
                'readonly' => 'readonly'
            ]
        );

    }

    /**
     * Render Text Headline Color field.
     *
     * @since 1.0.0
     * @access public
     **/
    public function render_text_headline_color() {
        /** Render colorpicker. */
        UI::get_instance()->render_colorpicker(
            $this->options['text_headline_color'],
            esc_html__( 'Text Headline Color', 'ziniappbuilder' ),
            esc_html__( 'Used for all headline text on white backgrounds.', 'ziniappbuilder' ),
            [
                'name' => 'zs_ziniappbuilder_color_settings[text_headline_color]',
                'id' => 'zs-ziniappbuilder-text-headline-color',
                'readonly' => 'readonly'
            ]
        );

    }

    /**
     * Render Text Body Color field.
     *
     * @since 1.0.0
     * @access public
     **/
    public function render_text_body_color() {
        /** Render colorpicker. */
        UI::get_instance()->render_colorpicker(
            $this->options['text_body_color'],
            esc_html__( 'Text Body Color', 'ziniappbuilder' ),
            esc_html__( 'Used for all body text on white backgrounds.', 'ziniappbuilder' ),
            [
                'name' => 'zs_ziniappbuilder_color_settings[text_body_color]',
                'id' => 'zs-ziniappbuilder-text-body-color',
                'readonly' => 'readonly'
            ]
        );

    }

    /**
     * Render Text Base Color field.
     *
     * @since 1.0.0
     * @access public
     **/
    public function render_text_body_meta_color() {

        /** Render colorpicker. */
        UI::get_instance()->render_colorpicker(
            $this->options['text_body_meta_color'],
            esc_html__( 'Text Body Meta Color', 'ziniappbuilder' ),
            esc_html__( 'Used for all meta texts.', 'ziniappbuilder' ),
            [
                'name' => 'zs_ziniappbuilder_color_settings[text_body_meta_color]',
                'id' => 'zs-ziniappbuilder-text-body-meta-color',
                'readonly' => 'readonly'
            ]
        );

    }

    /**
     * Render Layout Width field.
     *
     * @since 1.0.0
     * @access public
     **/
    public function render_layout_width() {

        /** Render slider. */
        UI::get_instance()->render_slider(
                $this->options['layout_width'],
                90,
                100,
                1,
                esc_html__( 'Layout width(%)', 'ziniappbuilder'),
                esc_html__( 'Current layout width(%):', 'ziniappbuilder') . ' <strong>' . esc_html( $this->options['layout_width'] ) . '</strong>',
                [
                    'name' => 'zs_ziniappbuilder_settings[layout_width]',
                    'class' => 'mdc-slider-width',
                    'id' => 'zs_ziniappbuilder_settings_layout_width'
                ],
                false
        );

    }

    /**
     * Render Speaking Rate/Speed field.
     *
     * @since 1.0.0
     * @access public
     **/
    public function render_speaking_rate() {

        /** Render slider. */
	    UI::get_instance()->render_slider(
		    $this->options['speaking-rate'],
		    0.25,
		    4.0,
		    0.25,
		    esc_html__( 'Speaking Rate/Speed', 'ziniappbuilder'),
		    esc_html__( 'Speaking rate:', 'ziniappbuilder') . ' <strong>' . esc_html( $this->options['speaking-rate'] ) . '</strong><br>',
		    [
			    'name' => 'zs_ziniappbuilder_settings[speaking-rate]',
			    'class' => 'mdc-slider-width',
                'id' => 'zs_ziniappbuilder_settings_rate'
		    ],
		    false
	    );

    }

    /**
     * Render Language field.
     *
     * @since 1.0.0
     * @access public
     **/
    public function render_language() {
        $options = [
            'en' => esc_html__( 'English', 'ziniappbuilder' ),
            'es' => esc_html__( 'Spanish', 'ziniappbuilder' ),
            // 'fr' => esc_html__( 'Français', 'ziniappbuilder' ),
            // 'pt' => esc_html__( 'Portuguese', 'ziniappbuilder' ),
            // 'ru' => esc_html__( 'Russian', 'ziniappbuilder' ),
            'vi' => esc_html__( 'Vietnamese', 'ziniappbuilder' )
        ];

        /** Render select. */
        UI::get_instance()->render_select(
            $options,
            $this->options['language'], // Selected option.
	        esc_html__( 'Language', 'ziniappbuilder' ),
	        esc_html__( '', 'ziniappbuilder' ),
            ['name' => 'zs_ziniappbuilder_settings[language]']
        );
    }

    /**
     * Render Date Format field.
     *
     * @since 1.0.0
     * @access public
     **/
    public function render_date_format() {
        $options = [
            'MMM, DD, YYYY' => esc_html__( 'MMM, DD, YYYY', 'ziniappbuilder' ),
            'MM-DD-YYYY' => esc_html__( 'MM-DD-YYYY', 'ziniappbuilder' ),
            'DD-MM-YYYY' => esc_html__( 'DD-MM-YYYY', 'ziniappbuilder' ),
            'YYYY-MM-DD' => esc_html__( 'YYYY-MM-DD', 'ziniappbuilder' ),
            'F j, Y' => esc_html__( 'MMM DD, YYYY', 'ziniappbuilder' )
        ];

        /** Render select. */
        UI::get_instance()->render_select(
            $options,
            $this->options['date_format'], // Selected option.
	        esc_html__( 'Date Format', 'ziniappbuilder' ),
	        esc_html__( '', 'ziniappbuilder' ),
            ['name' => 'zs_ziniappbuilder_settings[date_format]']
        );
    }

    /**
     * Render Time Format field.
     *
     * @since 1.0.0
     * @access public
     **/
    public function render_time_format() {
        $options = [
            'HH:mm' => esc_html__( 'HH:mm', 'ziniappbuilder' ),
            'HH:mm:ss' => esc_html__( 'HH:mm:ss', 'ziniappbuilder' ),
            'hh:mm A' => esc_html__( 'hh:mm A', 'ziniappbuilder' ),
            'hh:mm:ss A' => esc_html__( 'hh:mm:ss A', 'ziniappbuilder' )
        ];

        /** Render select. */
        UI::get_instance()->render_select(
            $options,
            $this->options['time_format'], // Selected option.
	        esc_html__( 'Time Format', 'ziniappbuilder' ),
	        esc_html__( '', 'ziniappbuilder' ),
            ['name' => 'zs_ziniappbuilder_settings[time_format]']
        );

    }   

    /**
     * Render Contact field.
     *
     * @since 2.0.0
     * @access public
     **/
    public function render_contact() {

        /** Render input. */
        UI::get_instance()->render_input(
            $this->options['contact'],
            esc_html__( 'Contact', 'ziniappbuilder'),
            esc_html__( '', 'ziniappbuilder' ),
            ['name' => 'zs_ziniappbuilder_settings[contact]']
        );

    } 
    
    /**
     * Render Email field.
     *
     * @since 2.0.0
     * @access public
     **/
    public function render_email() {

        /** Render input. */
        UI::get_instance()->render_input(
            $this->options['email'],
            esc_html__( 'Email', 'ziniappbuilder'),
            esc_html__( '', 'ziniappbuilder' ),
            ['name' => 'zs_ziniappbuilder_settings[email]']
        );

    } 
    
    /**
     * Render Address field.
     *
     * @since 2.0.0
     * @access public
     **/
    public function render_address() {

        /** Render input. */
        UI::get_instance()->render_input(
            $this->options['address'],
            esc_html__( 'Address', 'ziniappbuilder'),
            esc_html__( '', 'ziniappbuilder' ),
            ['name' => 'zs_ziniappbuilder_settings[address]']
        );

    } 


    /**
     * Render Privacy page field.
     *
     * @since 1.0.0
     * @access public
     **/
    public function render_privacy_page() {
        $pages = get_pages(array(
            'post_type'    => 'page',
            'post_status'  => 'publish'
        ));
        $options = array();
        foreach($pages as $page) {
            $options[$page->ID] = esc_html__( $page->post_title, 'ziniappbuilder' );
        }

        /** Render select. */
        UI::get_instance()->render_select(
            $options,
            $this->options['privacy_page'], // Selected option.
	        esc_html__( 'Privacy page', 'ziniappbuilder' ),
	        esc_html__( '', 'ziniappbuilder' ),
            ['name' => 'zs_ziniappbuilder_settings[privacy_page]']
        );
    }
    
    /**
     * Render Term & Condition Page field.
     *
     * @since 1.0.0
     * @access public
     **/
    public function render_term_condition_page() {
        $pages = get_pages(array(
            'post_type'    => 'page',
            'post_status'  => 'publish'
        ));
        $options = array();
        foreach($pages as $page) {
            $options[$page->ID] = esc_html__( $page->post_title, 'ziniappbuilder' );
        }

        /** Render select. */
        UI::get_instance()->render_select(
            $options,
            $this->options['term_condition_page'], // Selected option.
	        esc_html__( 'Term & condition page', 'ziniappbuilder' ),
	        esc_html__( '', 'ziniappbuilder' ),
            ['name' => 'zs_ziniappbuilder_settings[term_condition_page]']
        );
    }

    /**
     * Render Is Show List Demo App field.
     *
     * @since 1.0.0
     * @access public
     **/
    public function render_is_show_demo_app () {
        /** Render single checkbox. */
        UI::get_instance()->render_checkbox(
            $this->options['is_show_demo_app'], // checked or not.
            esc_html__( 'Show / Hide list demo app on left mobile menu', 'ziniappbuilder' ), // help text.
            ['name' => 'zs_ziniappbuilder_settings[is_show_demo_app]']
        );
    }

     /**
     * Render Address field.
     *
     * @since 2.0.0
     * @access public
     **/
    public function render_is_rtl() {
        /** Render single checkbox. */
        UI::get_instance()->render_checkbox(
            $this->options['is_rtl'], // checked or not.
            esc_html__( 'Write characters from right to left', 'ziniappbuilder' ), // help text.
            ['name' => 'zs_ziniappbuilder_settings[is_rtl]']
        );
    }

    /**
     * Render Facebook field.
     *
     * @since 2.0.0
     * @access public
     **/
    public function render_facebook() {

        /** Render input. */
        UI::get_instance()->render_input(
            $this->options['facebook'],
            esc_html__( 'Facebook', 'ziniappbuilder'),
            esc_html__( '', 'ziniappbuilder' ),
            ['name' => 'zs_ziniappbuilder_settings[facebook]']
        );

    }
    
    /**
     * Render Twitter field.
     *
     * @since 2.0.0
     * @access public
     **/
    public function render_twitter() {

        /** Render input. */
        UI::get_instance()->render_input(
            $this->options['twitter'],
            esc_html__( 'Twitter', 'ziniappbuilder'),
            esc_html__( '', 'ziniappbuilder' ),
            ['name' => 'zs_ziniappbuilder_settings[twitter]']
        );

    }

    /**
     * Render Google field.
     *
     * @since 2.0.0
     * @access public
     **/
    public function render_google() {

        /** Render input. */
        UI::get_instance()->render_input(
            $this->options['google'],
            esc_html__( 'Google', 'ziniappbuilder'),
            esc_html__( '', 'ziniappbuilder' ),
            ['name' => 'zs_ziniappbuilder_settings[google]']
        );

    }

    /**
     * Render Instagram field.
     *
     * @since 2.0.0
     * @access public
     **/
    public function render_instagram() {

        /** Render input. */
        UI::get_instance()->render_input(
            $this->options['instagram'],
            esc_html__( 'Instagram', 'ziniappbuilder'),
            esc_html__( '', 'ziniappbuilder' ),
            ['name' => 'zs_ziniappbuilder_settings[instagram]']
        );

    }

    /**
     * Render Menu Categories field.
     *
     * @since 1.0.0
     * @access public
     **/
    public function render_menu_categories() {
        $options = [
            'product' => esc_html__( 'Show product categories', 'ziniappbuilder' ),
            'post' => esc_html__( 'Show post categories', 'ziniappbuilder' )
        ];

        /** Render checkboxes. */
        UI::get_instance()->render_checkboxes(
            $options,
            $this->options['menu_categories'], // checked checkbox.
            ['name' => 'zs_ziniappbuilder_settings[menu_categories]']
        );
    }

    /**
     * Render Is Allow Login With Google field.
     *
     * @since 1.0.0
     * @access public
     **/
    public function render_is_allow_google_login () {
        /** Render single checkbox. */
        UI::get_instance()->render_checkbox(
            $this->options['is_allow_google_login'], // checked or not.
            esc_html__( 'Enable / Disable', 'ziniappbuilder' ), // help text.
            ['name' => 'zs_ziniappbuilder_settings[is_allow_google_login]']
        );
    }

    /**
     * Render Is Allow Login With Facebook field.
     *
     * @since 1.0.0
     * @access public
     **/
    public function render_is_allow_facebook_login () {
        /** Render single checkbox. */
        UI::get_instance()->render_checkbox(
            $this->options['is_allow_facebook_login'], // checked or not.
            esc_html__( 'Enable / Disable', 'ziniappbuilder' ), // help text.
            ['name' => 'zs_ziniappbuilder_settings[is_allow_facebook_login]']
        );
    }

    /**
     * Render Is Allow Login With Apple field.
     *
     * @since 1.0.0
     * @access public
     **/
    public function render_is_allow_apple_login () {
        /** Render single checkbox. */
        UI::get_instance()->render_checkbox(
            $this->options['is_allow_apple_login'], // checked or not.
            esc_html__( 'Enable / Disable', 'ziniappbuilder' ), // help text.
            ['name' => 'zs_ziniappbuilder_settings[is_allow_apple_login]']
        );
    }

    /**
     * Render Font Headline Family field.
     *
     * @since 1.0.0
     * @access public
     **/
    public function render_font_headline_family() {
        $options = [
            // 'zs_arial' => esc_html__( 'Arial', 'ziniappbuilder' ),
            // 'zs_courier_new' => esc_html__( 'Courier New', 'ziniappbuilder' ),
            'zs_helcetica' => esc_html__( 'Helcetica', 'ziniappbuilder' ),
            'zs_lato' => esc_html__( 'Lato', 'ziniappbuilder' ),
            'zs_montserrat' => esc_html__( 'Montserrat', 'ziniappbuilder' ),
            // 'zs_open_sans' => esc_html__( 'Open Sans', 'ziniappbuilder' ),
            'zs_poppins' => esc_html__( 'Poppins', 'ziniappbuilder' ),
            'zs_roboto' => esc_html__( 'Roboto', 'ziniappbuilder' ),
            'zs_san_francisco' => esc_html__( 'San Francisco', 'ziniappbuilder' ),
            'zs_source_sans' => esc_html__( 'Source Sans', 'ziniappbuilder' ),
            // 'zs_times_new_roman' => esc_html__( 'Times New Roman', 'ziniappbuilder' ),
            // 'zs_varela' => esc_html__( 'Varela', 'ziniappbuilder' )
        ];

        /** Render select. */
        UI::get_instance()->render_select(
            $options,
            $this->options['font_headline_family'], // Selected option.
	        esc_html__( 'Font Headline Family', 'ziniappbuilder' ),
	        esc_html__( '', 'ziniappbuilder' ),
            ['name' => 'zs_ziniappbuilder_typography_settings[font_headline_family]']
        );
    }

    /**
     * Render Font Headline Size field.
     *
     * @since 2.0.0
     * @access public
     **/
    public function render_font_headline_size() {

        /** Render input. */
        UI::get_instance()->render_input_number(
            $this->options['font_headline_size'],
            esc_html__( 'Font Headline Size (px)', 'ziniappbuilder'),
            esc_html__( '', 'ziniappbuilder' ),
            ['name' => 'zs_ziniappbuilder_typography_settings[font_headline_size]']
        );

    } 

    /**
     * Render Font Headline Weight field.
     *
     * @since 1.0.0
     * @access public
     **/
    public function render_font_headline_weight() {
        $options = [
            'zsLight' => esc_html__( 'Light', 'ziniappbuilder' ), 
            'zsRegular' => esc_html__( 'Regular', 'ziniappbuilder' ), 
            'zsMedium' => esc_html__( 'Medium', 'ziniappbuilder' ),
            'zsSemiBold' => esc_html__( 'Semi-Bold', 'ziniappbuilder' ),
            'zsBold' => esc_html__( 'Bold', 'ziniappbuilder' )
        ];

        /** Render select. */
        UI::get_instance()->render_select(
            $options,
            $this->options['font_headline_weight'], // Selected option.
	        esc_html__( 'Font Headline Weight', 'ziniappbuilder' ),
	        esc_html__( '', 'ziniappbuilder' ),
            ['name' => 'zs_ziniappbuilder_typography_settings[font_headline_weight]']
        );
    }

    /**
     * Render Font Body Family field.
     *
     * @since 1.0.0
     * @access public
     **/
    public function render_font_body_family() {
        $options = [
            // 'zs_arial' => esc_html__( 'Arial', 'ziniappbuilder' ),
            // 'zs_courier_new' => esc_html__( 'Courier New', 'ziniappbuilder' ),
            'zs_helcetica' => esc_html__( 'Helcetica', 'ziniappbuilder' ),
            'zs_lato' => esc_html__( 'Lato', 'ziniappbuilder' ),
            'zs_montserrat' => esc_html__( 'Montserrat', 'ziniappbuilder' ),
            // 'zs_open_sans' => esc_html__( 'Open Sans', 'ziniappbuilder' ),
            'zs_poppins' => esc_html__( 'Poppins', 'ziniappbuilder' ),
            'zs_roboto' => esc_html__( 'Roboto', 'ziniappbuilder' ),
            'zs_san_francisco' => esc_html__( 'San Francisco', 'ziniappbuilder' ),
            'zs_source_sans' => esc_html__( 'Source Sans', 'ziniappbuilder' ),
            // 'zs_times_new_roman' => esc_html__( 'Times New Roman', 'ziniappbuilder' ),
            // 'zs_varela' => esc_html__( 'Varela', 'ziniappbuilder' )
        ];

        /** Render select. */
        UI::get_instance()->render_select(
            $options,
            $this->options['font_body_family'], // Selected option.
	        esc_html__( 'Font Body Family', 'ziniappbuilder' ),
	        esc_html__( '', 'ziniappbuilder' ),
            ['name' => 'zs_ziniappbuilder_typography_settings[font_body_family]']
        );
    }

    /**
     * Render Font Body Size field.
     *
     * @since 2.0.0
     * @access public
     **/
    public function render_font_body_size() {

        /** Render input. */
        UI::get_instance()->render_input_number(
            $this->options['font_body_size'],
            esc_html__( 'Font Body Size (px)', 'ziniappbuilder'),
            esc_html__( '', 'ziniappbuilder' ),
            ['name' => 'zs_ziniappbuilder_typography_settings[font_body_size]']
        );

    } 

    /**
     * Render Font Body Weight field.
     *
     * @since 1.0.0
     * @access public
     **/
    public function render_font_body_weight() {
        $options = [
            'zsLight' => esc_html__( 'Light', 'ziniappbuilder' ), 
            'zsRegular' => esc_html__( 'Regular', 'ziniappbuilder' ), 
            'zsMedium' => esc_html__( 'Medium', 'ziniappbuilder' ),
            'zsSemiBold' => esc_html__( 'Semi-Bold', 'ziniappbuilder' ),
            'zsBold' => esc_html__( 'Bold', 'ziniappbuilder' )
        ];

        /** Render select. */
        UI::get_instance()->render_select(
            $options,
            $this->options['font_body_weight'], // Selected option.
	        esc_html__( 'Font Body Weight', 'ziniappbuilder' ),
	        esc_html__( '', 'ziniappbuilder' ),
            ['name' => 'zs_ziniappbuilder_typography_settings[font_body_weight]']
        );
    }

    /**
     * Render Font Small Family field.
     *
     * @since 1.0.0
     * @access public
     **/
    public function render_font_small_family() {
        $options = [
            // 'zs_arial' => esc_html__( 'Arial', 'ziniappbuilder' ),
            // 'zs_courier_new' => esc_html__( 'Courier New', 'ziniappbuilder' ),
            'zs_helcetica' => esc_html__( 'Helcetica', 'ziniappbuilder' ),
            'zs_lato' => esc_html__( 'Lato', 'ziniappbuilder' ),
            'zs_montserrat' => esc_html__( 'Montserrat', 'ziniappbuilder' ),
            // 'zs_open_sans' => esc_html__( 'Open Sans', 'ziniappbuilder' ),
            'zs_poppins' => esc_html__( 'Poppins', 'ziniappbuilder' ),
            'zs_roboto' => esc_html__( 'Roboto', 'ziniappbuilder' ),
            'zs_san_francisco' => esc_html__( 'San Francisco', 'ziniappbuilder' ),
            'zs_source_sans' => esc_html__( 'Source Sans', 'ziniappbuilder' ),
            // 'zs_times_new_roman' => esc_html__( 'Times New Roman', 'ziniappbuilder' ),
            // 'zs_varela' => esc_html__( 'Varela', 'ziniappbuilder' )
        ];

        /** Render select. */
        UI::get_instance()->render_select(
            $options,
            $this->options['font_small_family'], // Selected option.
	        esc_html__( 'Font Small Family', 'ziniappbuilder' ),
	        esc_html__( '', 'ziniappbuilder' ),
            ['name' => 'zs_ziniappbuilder_typography_settings[font_small_family]']
        );
    }

    /**
     * Render Font Small Size field.
     *
     * @since 2.0.0
     * @access public
     **/
    public function render_font_small_size() {

        /** Render input. */
        UI::get_instance()->render_input_number(
            $this->options['font_small_size'],
            esc_html__( 'Font Small Size (px)', 'ziniappbuilder'),
            esc_html__( '', 'ziniappbuilder' ),
            ['name' => 'zs_ziniappbuilder_typography_settings[font_small_size]']
        );

    } 

    /**
     * Render Font Small Weight field.
     *
     * @since 1.0.0
     * @access public
     **/
    public function render_font_small_weight() {
        $options = [
            'zsLight' => esc_html__( 'Light', 'ziniappbuilder' ), 
            'zsRegular' => esc_html__( 'Regular', 'ziniappbuilder' ), 
            'zsMedium' => esc_html__( 'Medium', 'ziniappbuilder' ),
            'zsSemiBold' => esc_html__( 'Semi-Bold', 'ziniappbuilder' ),
            'zsBold' => esc_html__( 'Bold', 'ziniappbuilder' )
        ];

        /** Render select. */
        UI::get_instance()->render_select(
            $options,
            $this->options['font_small_weight'], // Selected option.
	        esc_html__( 'Font Small Weight', 'ziniappbuilder' ),
	        esc_html__( '', 'ziniappbuilder' ),
            ['name' => 'zs_ziniappbuilder_typography_settings[font_small_weight]']
        );
    }

    /**
     * Render Blog Layout field.
     *
     * @since 1.0.0
     * @access public
     **/
    public function render_blog_layout() {
        $options = [
            'classic' => esc_html__( 'Classic', 'ziniappbuilder' ),
            'grid' => esc_html__( 'Grid', 'ziniappbuilder' ),
            'masonry' => esc_html__( 'Masonry', 'ziniappbuilder' ),
            'timeline' => esc_html__( 'Timeline', 'ziniappbuilder' )
        ];

        /** Render select. */
        UI::get_instance()->render_select(
            $options,
            $this->options['blog_layout'], // Selected option.
	        esc_html__( 'Blog Layout', 'ziniappbuilder' ),
	        esc_html__( '', 'ziniappbuilder' ),
            ['name' => 'zs_ziniappbuilder_blog_settings[blog_layout]']
        );
    }

    /**
     * Render Blog Meta Fields field.
     *
     * @since 1.0.0
     * @access public
     **/
    public function render_blog_meta_fields() {
        $options = [
            'author' => esc_html__( 'Author', 'ziniappbuilder' ),
            'categories' => esc_html__( 'Categories', 'ziniappbuilder' ),
            'datetime' => esc_html__( 'Datetime', 'ziniappbuilder' ),
            'comments' => esc_html__( 'Comments', 'ziniappbuilder' )
        ];

        /** Render checkboxes. */
        UI::get_instance()->render_checkboxes(
            $options,
            $this->options['blog_meta_fields'], // checked checkbox.
            ['name' => 'zs_ziniappbuilder_blog_settings[blog_meta_fields]']
        );
    }

    /**
     * Render Blog Category Content Type field.
     *
     * @since 1.0.0
     * @access public
     **/
    public function render_blog_categories_content_type() {
        $options = [
            'sub_categories' => esc_html__( 'Show Sub Categories', 'ziniappbuilder' ),
            'posts' => esc_html__( 'Show Posts', 'ziniappbuilder' )
        ];

        /** Render radio buttons. */
        UI::get_instance()->render_radio_buttons(
            $options,
            $this->options['blog_categories_content_type'], // checked radio button.
            ['name' => 'zs_ziniappbuilder_blog_settings[blog_categories_content_type]']
        );
    }

    /**
     * Render Post Meta Fields field.
     *
     * @since 1.0.0
     * @access public
     **/
    public function render_single_meta_fields() {
        $options = [
            'author' => esc_html__( 'Author', 'ziniappbuilder' ),
            'categories' => esc_html__( 'Categories', 'ziniappbuilder' ),
            'datetime' => esc_html__( 'Datetime', 'ziniappbuilder' )
        ];

        /** Render checkboxes. */
        UI::get_instance()->render_checkboxes(
            $options,
            $this->options['single_meta_fields'], // checked checkbox.
            ['name' => 'zs_ziniappbuilder_blog_settings[single_meta_fields]']
        );
    } 
    /**
     * Render Is  Show Share buttons.
     *
     * @since 1.0.0
     * @access public
     **/
    public function render_single_share_buttons() {
        /** Render single checkbox. */
        UI::get_instance()->render_checkbox(
            $this->options['single_share_buttons'], // checked or not.
            esc_html__( 'Show / Hide Share buttons', 'ziniappbuilder' ), // help text.
            ['name' => 'zs_ziniappbuilder_blog_settings[single_share_buttons]']
        );
    }

    /**
     * Render Is  Show Bookmark button.
     *
     * @since 1.0.0
     * @access public
     **/
    public function render_single_show_bookmark() {
        /** Render single checkbox. */
        UI::get_instance()->render_checkbox(
            $this->options['single_show_bookmark'], // checked or not.
            esc_html__( 'Show / Hide bookmark button', 'ziniappbuilder' ), // help text.
            ['name' => 'zs_ziniappbuilder_blog_settings[single_show_bookmark]']
        );
    }

    /**
     * Render Is  Show Share buttons.
     *
     * @since 1.0.0
     * @access public
     **/
    public function render_single_featured_image() {
        /** Render single checkbox. */
        UI::get_instance()->render_checkbox(
            $this->options['single_featured_image'], // checked or not.
            esc_html__( 'Show / Hide', 'ziniappbuilder' ), // help text.
            ['name' => 'zs_ziniappbuilder_blog_settings[single_featured_image]']
        );
    }

    /**
     * Render Is  Show Excerpt.
     *
     * @since 1.0.0
     * @access public
     **/
    public function render_single_show_excerpt() {
        /** Render single checkbox. */
        UI::get_instance()->render_checkbox(
            $this->options['single_show_excerpt'], // checked or not.
            esc_html__( 'Show / Hide', 'ziniappbuilder' ), // help text.
            ['name' => 'zs_ziniappbuilder_blog_settings[single_show_excerpt]']
        );
    }

    /**
     * Render Is  Show Description.
     *
     * @since 1.0.0
     * @access public
     **/
    public function render_single_show_description() {
        /** Render single checkbox. */
        UI::get_instance()->render_checkbox(
            $this->options['single_show_description'], // checked or not.
            esc_html__( 'Show / Hide', 'ziniappbuilder' ), // help text.
            ['name' => 'zs_ziniappbuilder_blog_settings[single_show_description]']
        );
    }

    /**
     * Render Is Show Tag fields.
     *
     * @since 1.0.0
     * @access public
     **/
    public function render_single_show_tags() {
        /** Render single checkbox. */
        UI::get_instance()->render_checkbox(
            $this->options['single_show_tags'], // checked or not.
            esc_html__( 'Show / Hide', 'ziniappbuilder' ), // help text.
            ['name' => 'zs_ziniappbuilder_blog_settings[single_show_tags]']
        );
    }

    /**
     * Render Is Show Related Posts field.
     *
     * @since 1.0.0
     * @access public
     **/
    public function render_single_related_posts() {
        /** Render single checkbox. */
        UI::get_instance()->render_checkbox(
            $this->options['single_related_posts'], // checked or not.
            esc_html__( 'Show / Hide', 'ziniappbuilder' ), // help text.
            ['name' => 'zs_ziniappbuilder_blog_settings[single_related_posts]']
        );
    }

     /**
     * Render Is Show comments field.
     *
     * @since 1.0.0
     * @access public
     **/
    public function render_is_show_comments() {
        /** Render single checkbox. */
        UI::get_instance()->render_checkbox(
            $this->options['is_show_comments'], // checked or not.
            esc_html__( 'Show / Hide', 'ziniappbuilder' ), // help text.
            ['name' => 'zs_ziniappbuilder_blog_settings[is_show_comments]']
        );
    }

    /**
     * Render Is Show Posts by author field.
     *
     * @since 1.0.0
     * @access public
     **/
    public function render_single_author_details() {
        /** Render single checkbox. */
        UI::get_instance()->render_checkbox(
            $this->options['single_author_details'], // checked or not.
            esc_html__( 'Show / Hide link posts by author', 'ziniappbuilder' ), // help text.
            ['name' => 'zs_ziniappbuilder_blog_settings[single_author_details]']
        );
    }

    /**
     * Render Is Show Blog Ads Header field.
     *
     * @since 1.0.0
     * @access public
     **/
    public function render_is_show_blog_ads_header () {
        /** Render single checkbox. */
        UI::get_instance()->render_checkbox(
            $this->options['is_show_blog_ads_header'], // checked or not.
            esc_html__( 'Is Show Blog Ads Header', 'ziniappbuilder' ), // help text.
            ['name' => 'zs_ziniappbuilder_ads_settings[is_show_blog_ads_header]']
        );
    }

    /**
     * Render Blog Ads Header Id field.
     *
     * @since 2.0.0
     * @access public
     **/
    public function render_blog_ads_header_id() {

        /** Render input. */
        UI::get_instance()->render_input(
            $this->options['blog_ads_header_id'],
            esc_html__( 'Blog Ads Header Id', 'ziniappbuilder'),
            esc_html__( '', 'ziniappbuilder' ),
            ['name' => 'zs_ziniappbuilder_ads_settings[blog_ads_header_id]']
        );

    } 

    /**
     * Render Is Show Blog Ads Footer field.
     *
     * @since 1.0.0
     * @access public
     **/
    public function render_is_show_blog_ads_footer () {
        /** Render single checkbox. */
        UI::get_instance()->render_checkbox(
            $this->options['is_show_blog_ads_footer'], // checked or not.
            esc_html__( 'Is Show Blog Ads Footer', 'ziniappbuilder' ), // help text.
            ['name' => 'zs_ziniappbuilder_ads_settings[is_show_blog_ads_footer]']
        );
    }
    
    /**
     * Render Blog Ads Footer Id field.
     *
     * @since 2.0.0
     * @access public
     **/
    public function render_blog_ads_footer_id() {

        /** Render input. */
        UI::get_instance()->render_input(
            $this->options['blog_ads_footer_id'],
            esc_html__( 'Blog Ads Footer Id', 'ziniappbuilder'),
            esc_html__( '', 'ziniappbuilder' ),
            ['name' => 'zs_ziniappbuilder_ads_settings[blog_ads_footer_id]']
        );

    } 

    /**
     * Render Is Show Intersititial Blog Ads field.
     *
     * @since 1.0.0
     * @access public
     **/
    public function render_is_show_blog_interstitial_ads () {
        /** Render single checkbox. */
        UI::get_instance()->render_checkbox(
            $this->options['is_show_blog_interstitial_ads'], // checked or not.
            esc_html__( 'Is Show Interstitial Blog Ads', 'ziniappbuilder' ), // help text.
            ['name' => 'zs_ziniappbuilder_ads_settings[is_show_blog_interstitial_ads]']
        );
    }
    
    /**
     * Render Blog Interstitial Ads Id field.
     *
     * @since 2.0.0
     * @access public
     **/
    public function render_blog_interstitial_ads_id() {

        /** Render input. */
        UI::get_instance()->render_input(
            $this->options['blog_interstitial_ads_id'],
            esc_html__( 'Blog Interstitial Ads Id', 'ziniappbuilder'),
            esc_html__( '', 'ziniappbuilder' ),
            ['name' => 'zs_ziniappbuilder_ads_settings[blog_interstitial_ads_id]']
        );

    }

    /**
     * Render Woo Category Content Type field.
     *
     * @since 1.0.0
     * @access public
     **/
    public function render_woo_categories_content_type() {
        $options = [
            'sub_categories' => esc_html__( 'Show Sub Categories', 'ziniappbuilder' ),
            'products' => esc_html__( 'Show Products', 'ziniappbuilder' )
        ];

        /** Render radio buttons. */
        UI::get_instance()->render_radio_buttons(
            $options,
            $this->options['woo_categories_content_type'], // checked radio button.
            ['name' => 'zs_ziniappbuilder_woo_general_settings[woo_categories_content_type]']
        );
    }

    /**
     * Render Woo Is Allow Booking field.
     *
     * @since 1.0.0
     * @access public
     **/
    public function render_woo_is_allow_booking() {
        /** Render single checkbox. */
        UI::get_instance()->render_checkbox(
            $this->options['woo_is_allow_booking'], // checked or not.
            esc_html__( 'Allow booking process', 'ziniappbuilder' ), // help text.
            ['name' => 'zs_ziniappbuilder_woo_general_settings[woo_is_allow_booking]']
        );
    }

    /**
     * Render Woo Show Variations field.
     *
     * @since 1.0.0
     * @access public
     **/
    public function render_woo_show_variations() {
        /** Render single checkbox. */
        UI::get_instance()->render_checkbox(
            $this->options['woo_show_variations'], // checked or not.
            esc_html__( 'Show/Hide', 'ziniappbuilder' ), // help text.
            ['name' => 'zs_ziniappbuilder_woo_general_settings[woo_show_variations]']
        );
    } 

    /**
     * Render Product Column On Mobile field.
     *
     * @since 1.0.0
     * @access public
     **/
    public function render_pl_num_of_column() {
        $options = [
            '1' => esc_html__( '1 Column', 'ziniappbuilder' ),
            '2' => esc_html__( '2 Column', 'ziniappbuilder' ),
            '3' => esc_html__( '3 Column', 'ziniappbuilder' ),
        ];

        /** Render select. */
        UI::get_instance()->render_select(
            $options,
            $this->options['pl_num_of_column'], // Selected option.
	        esc_html__( 'Number Column', 'ziniappbuilder' ),
	        esc_html__( '', 'ziniappbuilder' ),
            ['name' => 'zs_ziniappbuilder_woo_product_listings_settings[pl_num_of_column]']
        );
    }

    /**
     * Render Number Of Product Per page field.
     *
     * @since 1.0.0
     * @access public
     **/
    public function render_pl_num_product_per_page() {

        /** Render slider. */
        UI::get_instance()->render_slider(
            $this->options['pl_num_product_per_page'],
            10,
            50,
            1,
            esc_html__( 'Number Of Product Per Page', 'ziniappbuilder'),
            esc_html__( 'Current numebr of product per page:', 'ziniappbuilder') . ' <strong>' . esc_html( $this->options['pl_num_product_per_page'] ) . '</strong>',
            [
                'name' => 'zs_ziniappbuilder_woo_product_listings_settings[pl_num_product_per_page]',
                'class' => 'mdc-slider-width',
                'id' => 'zs_ziniappbuilder_woo_product_listings_settings_pl_num_product_per_page'
            ],
            false
        );

    }

    /**
     * Render Is Show Product Category field.
     *
     * @since 1.0.0
     * @access public
     **/
    public function render_pl_is_show_category() {
        /** Render single checkbox. */
        UI::get_instance()->render_checkbox(
            $this->options['pl_is_show_category'], // checked or not.
            esc_html__( 'Show/Hide product category on shop header', 'ziniappbuilder' ), // help text.
            ['name' => 'zs_ziniappbuilder_woo_product_listings_settings[pl_is_show_category]']
        );
    }

    /**
     * Render Is Show Available Stock field.
     *
     * @since 1.0.0
     * @access public
     **/
    public function render_pl_is_show_available_stock() {
        /** Render single checkbox. */
        UI::get_instance()->render_checkbox(
            $this->options['pl_is_show_available_stock'], // checked or not.
            esc_html__( 'Show/Hide available stock on count label', 'ziniappbuilder' ), // help text.
            ['name' => 'zs_ziniappbuilder_woo_product_listings_settings[pl_is_show_available_stock]']
        );
    }

    /**
     * Render Is Show Out Of Stock field.
     *
     * @since 1.0.0
     * @access public
     **/
    public function render_pl_is_show_out_of_stock() {
        /** Render single checkbox. */
        UI::get_instance()->render_checkbox(
            $this->options['pl_is_show_out_of_stock'], // checked or not.
            esc_html__( 'Show/Hide out of stock label', 'ziniappbuilder' ), // help text.
            ['name' => 'zs_ziniappbuilder_woo_product_listings_settings[pl_is_show_out_of_stock]']
        );
    }

    /**
     * Render Is Show Filter field.
     *
     * @since 1.0.0
     * @access public
     **/
    public function render_pl_is_show_filter() {
        /** Render single checkbox. */
        UI::get_instance()->render_checkbox(
            $this->options['pl_is_show_filter'], // checked or not.
            esc_html__( 'Show/Hide filter', 'ziniappbuilder' ), // help text.
            ['name' => 'zs_ziniappbuilder_woo_product_listings_settings[pl_is_show_filter]']
        );
    }

    /**
     * Render Thumbnail Position field.
     *
     * @since 1.0.0
     * @access public
     **/
    public function render_sp_thumb_position() {
        $options = [
            'bottom' => esc_html__( 'Bottom', 'ziniappbuilder' ),
            'top' => esc_html__( 'Top', 'ziniappbuilder' )
        ];

        /** Render select. */
        UI::get_instance()->render_select(
            $options,
            $this->options['sp_thumb_position'], // Selected option.
	        esc_html__( 'Position', 'ziniappbuilder' ),
	        esc_html__( '', 'ziniappbuilder' ),
            ['name' => 'zs_ziniappbuilder_woo_single_product_settings[sp_thumb_position]']
        );
    }

    /**
     * Render Is Fullscreen Product View field.
     *
     * @since 1.0.0
     * @access public
     **/
    public function render_sp_is_fullscreen_view() {
        /** Render single checkbox. */
        UI::get_instance()->render_checkbox(
            $this->options['sp_is_fullscreen_view'], // checked or not.
            esc_html__( 'Is Fullscreen View', 'ziniappbuilder' ), // help text.
            ['name' => 'zs_ziniappbuilder_woo_single_product_settings[sp_is_fullscreen_view]']
        );
    }

    /**
     * Render Is Show Share Button field.
     *
     * @since 1.0.0
     * @access public
     **/
    public function render_sp_is_show_share_button() {
        /** Render single checkbox. */
        UI::get_instance()->render_checkbox(
            $this->options['sp_is_show_share_button'], // checked or not.
            esc_html__( 'Is Show Share Button', 'ziniappbuilder' ), // help text.
            ['name' => 'zs_ziniappbuilder_woo_single_product_settings[sp_is_show_share_button]']
        );
    }

    /**
     * Render Is Show Short Description field.
     *
     * @since 1.0.0
     * @access public
     **/
    public function render_sp_is_show_short_description() {
        /** Render single checkbox. */
        UI::get_instance()->render_checkbox(
            $this->options['sp_is_show_short_description'], // checked or not.
            esc_html__( 'Is Show Short Description', 'ziniappbuilder' ), // help text.
            ['name' => 'zs_ziniappbuilder_woo_single_product_settings[sp_is_show_short_description]']
        );
    }

    /**
     * Render Is Show Related Products field.
     *
     * @since 1.0.0
     * @access public
     **/
    public function render_sp_is_show_related_product() {
        /** Render single checkbox. */
        UI::get_instance()->render_checkbox(
            $this->options['sp_is_show_related_product'], // checked or not.
            esc_html__( 'Is Show Related Products', 'ziniappbuilder' ), // help text.
            ['name' => 'zs_ziniappbuilder_woo_single_product_settings[sp_is_show_related_product]']
        );
    }

    /**
     * Render Number Of Related Products per Page field.
     *
     * @since 1.0.0
     * @access public
     **/
    public function render_sp_related_product_per_page() {
        $options = [
            4 => esc_html__( '4', 'ziniappbuilder' ),
            6 => esc_html__( '6', 'ziniappbuilder' ),
            8 => esc_html__( '8', 'ziniappbuilder' ),
            10 => esc_html__( '10', 'ziniappbuilder' )
        ];

        /** Render select. */
        UI::get_instance()->render_select(
            $options,
            $this->options['sp_related_product_per_page'], // Selected option.
	        esc_html__( 'Number Of Related Product Per Page', 'ziniappbuilder' ),
	        esc_html__( '', 'ziniappbuilder' ),
            ['name' => 'zs_ziniappbuilder_woo_single_product_settings[sp_related_product_per_page]']
        );

    }

    /**
     * Render Is Show Up Sells Products field.
     *
     * @since 1.0.0
     * @access public
     **/
    public function render_sp_show_upsells_products() {
        /** Render single checkbox. */
        UI::get_instance()->render_checkbox(
            $this->options['sp_show_upsells_products'], // checked or not.
            esc_html__( 'Is Show Related Products', 'ziniappbuilder' ), // help text.
            ['name' => 'zs_ziniappbuilder_woo_single_product_settings[sp_show_upsells_products]']
        );
    }

    /**
     * Render Number Of Up Sells Products per Page field.
     *
     * @since 1.0.0
     * @access public
     **/
    public function render_sp_upsells_product_per_page() {
        $options = [
            4 => esc_html__( '4', 'ziniappbuilder' ),
            6 => esc_html__( '6', 'ziniappbuilder' ),
            8 => esc_html__( '8', 'ziniappbuilder' ),
            10 => esc_html__( '10', 'ziniappbuilder' )
        ];

        /** Render select. */
        UI::get_instance()->render_select(
            $options,
            $this->options['sp_upsells_product_per_page'], // Selected option.
	        esc_html__( 'Number Of Up Sells Product Per Page', 'ziniappbuilder' ),
	        esc_html__( '', 'ziniappbuilder' ),
            ['name' => 'zs_ziniappbuilder_woo_single_product_settings[sp_upsells_product_per_page]']
        );

    }

    /**
     * Get plugin settings with default values.
     *
     * @access public
     * @since 1.0.0
     * @return void
     **/
    public function get_options() {

        /** Voice tab settings. */
        $options = get_option( 'zs_ziniappbuilder_settings' );

        /** Color tab settings. */
        $color_settings = get_option( 'zs_ziniappbuilder_color_settings' );

        /** Typography tab settings. */
        $typography_settings = get_option( 'zs_ziniappbuilder_typography_settings' );

        /** Blog tab settings. */
        $blog_settings = get_option( 'zs_ziniappbuilder_blog_settings' );

        /** Ads tab settings. */
        //$ads_settings = get_option( 'zs_ziniappbuilder_ads_settings' );

        /** Woo General settings. */
        $woo_general_settings = get_option( 'zs_ziniappbuilder_woo_general_settings' );

        /** Product Listings settings. */
        $woo_product_listings_settings = get_option( 'zs_ziniappbuilder_woo_product_listings_settings' );

        /** Single Product settings. */
        $woo_single_product_settings = get_option( 'zs_ziniappbuilder_woo_single_product_settings' );

        /** Default values. */
        $defaults = [
            /** Voice Tab. */
            'language'      => 'en-US-Standard-D', // Language.
            'language-code' => 'en-US', // Language Code.
            'date-format' => 'handset-class-device', // Audio profile.
            'speaking-rate' => '1', // Speaking rate/speed.
            
            'position'      => 'before-content', // Position.
            'style'         => 'ziniappbuilder-round', // Default style.
            
            /** General Tab. */
            'app_name'         => 'ZiniStore', // Default app name.
            'app_version'         => '1.0.1', // Default app version.
            'language'         => 'en', // Default language.
            'date_format'         => 'MMM, DD, YYYY', // Default date format.
            'time_format'         => 'HH:mm', // Default time format.
            'layout_width'         => '95', // Pitch
            'contact'         => '(+84) 905 82 77 07', // Default contact.
            'email'         => 'hi@zinisoft.net', // Default email.
            'address'         => '11/F, Centana Thu Thiem Tower, 36 Mai Chi Tho, District 2, HCMC, Vietnam', // Default address.
            'privacy_page'         => '0', // Default privacy page.
            'term_condition_page'      => '0', // Default condition page.
            'is_show_demo_app'         => false, // Default is show list demo app.
            'is_rtl'                   => false, // Default right to left
            'facebook'                 => 'https://www.facebook.com/', // Default facebook.
            'twitter'                  => 'https://twitter.com/',       // Default twitter.
            'google'                   => 'https://www.google.com/',    // Default google.
            'instagram'                => 'https://www.instagram.com/', // Default instagram.
            'menu_categories'       => [], // Default Menu Categories.
            'is_allow_google_login'         => false, // Default is allow login with google.
            'is_allow_facebook_login'         => false, // Default is allow login with facebook.
            'is_allow_apple_login'         => false, // Default is allow login with apple.
            
            /** Color Tab. */
            'bg_primary_color'       => 'rgba(2, 83, 238, 1)', // Default background primary color.
            'bg_secondary_color'       => 'rgba(2, 83, 238, 1)', // Default background secondary color.
            'text_header_color'       => 'rgba(2, 83, 238, 1)', // Default text header color.
            'text_headline_color'       => 'rgba(2, 83, 238, 1)', // Default text headline color.
            'text_body_color'       => 'rgba(2, 83, 238, 1)', // Default text body color.
            'text_body_meta_color'       => 'rgba(2, 83, 238, 1)', // Default text body meta color.

            /** Typography Tab. */
            'font_headline_family'       => 'zs_san_francisco', // Default font headline family.
            'font_headline_size'       => '16', // Default font headline size.
            'font_headline_weight'       => 'zsBold', // Default font headline weight.
            'font_body_family'       => 'zs_san_francisco', // Default font body family.
            'font_body_size'       => '12', // Default font body size.
            'font_body_weight'       => 'zsMedium', // Default font body weight.
            'font_small_family'       => 'zs_san_francisco', // Default font small family.
            'font_small_size'       => '10', // Default font small size.
            'font_small_weight'       => 'zsLight', // Default font small weight.

            /** Blog Tab. */
            'blog_layout'       => 'grid', // Default blog layout.
            'blog_meta_fields'       => [], // Default Blog Meta Fields.
            'blog_categories_content_type'       => 'posts', // Default Blog Categories Content Type.
            'single_share_buttons'       => true, // Default is  show share buttons.
            'single_show_bookmark'       => true, // Default is  show bookmark.
            'single_featured_image'       => true, // Default is  show featured image.
            'single_show_excerpt'       => true, // Default is  show excerpt.
            'single_show_description'       => true, // Default is  show decription.
            'single_meta_fields'       => [], // Default Post Meta Fields.
            'single_show_tags'       => false, // Default is show tags.
            'single_related_posts'       => false, // Default is show related posts.
            'single_author_details'       => false, // Default is show posts by author.
            'is_show_comments'       => false, // Default is show post navigation.

            /** Ads Tab. */
            // 'is_show_blog_ads_header'       => false, // Default is show blog ads header.
            // 'blog_ads_header_id'       => 'ca-app-pub-3940256099942544/6300978111', // Default blog ads header id.
            // 'is_show_blog_ads_footer'       => false, // Default is show blog ads footer.
            // 'blog_ads_footer_id'       => 'ca-app-pub-3940256099942544/6300978111', // Default blog ads footer id.
            // 'is_show_blog_interstitial_ads'       => false, // Default is show blog interstitial ads.
            // 'blog_interstitial_ads_id'       => 'ca-app-pub-3940256099942544/6300978111', // Default blog interstitial ads id.
            
            /** Woo General Tab */
            'woo_general_content_type'       => 'posts', // Default Woo General Content Type.
            'woo_is_allow_booking'       => false, // Default Woo Is Allow Booking.
            'woo_show_variations'       => false, // Default Woo Show Variations.

            /** Product Listings Tab. */
            'pl_num_of_column'       => '1', // Default number of column.
            'pl_num_product_per_page'       => '12', // Default number of product per page.
            'pl_is_show_category'       => false, // Default show category.
            'pl_is_show_available_stock'       => false, // Default show available stock.
            'pl_is_show_out_of_stock'       => false, // Default show out of stock.
            'pl_is_show_filter'       => false, // Default show filter.

            /**Single Product Tab */
            'sp_thumb_position'       => 'bottom', // Default Thumbnail Position.
            'sp_is_fullscreen_view'       => false, // Default Fullscreen Product View.
            'sp_is_show_share_button'       => false, // Default Show Share Button.
            'sp_is_show_short_description'       => false, // Default Show Short Description.
            'sp_is_show_related_product'       => false, // Default Show Related Post.
            'sp_related_product_per_page'       => '12', // Default Number Of Related Post Per Page.
            'sp_show_upsells_products'       => false, // Default Show Up Sells Products.
            'sp_upsells_product_per_page'       => '12', // Default Number Of Up Sells Products Per Page.

            'link'          => 'none', // Download Link.
        ]; 

        /** Color Tab. */
        /** position. */
        if ( isset( $color_settings['position'] ) ) {
            $options['position'] = $color_settings['position'];
        }

        /** Style. */
        if ( isset( $color_settings['style'] ) ) {
            $options['style'] = $color_settings['style'];
        }

        /** Background Primary Color. */
        if ( isset( $color_settings['bg_primary_color'] ) ) {
            if ( $color_settings['bg_primary_color'] == '' ) {
                $options['bg_primary_color'] = 'rgba(2, 83, 238, 1)';
            } else {
                $options['bg_primary_color'] = $color_settings['bg_primary_color'];
            }
        }

        /** Background Secondary Color. */
        if ( isset( $color_settings['bg_secondary_color'] ) ) {
            if ( $color_settings['bg_secondary_color'] == '' ) {
                $options['bg_secondary_color'] = 'rgba(2, 83, 238, 1)';
            } else {
                $options['bg_secondary_color'] = $color_settings['bg_secondary_color'];
            }
        }

        /** Text HeaderColor. */
        if ( isset( $color_settings['text_header_color'] ) ) {
            if ( $color_settings['text_header_color'] == '' ) {
                $options['text_header_color'] = 'rgba(2, 83, 238, 1)';
            } else {
                $options['text_header_color'] = $color_settings['text_header_color'];
            }
        }

        /** Text Headline Color. */
        if ( isset( $color_settings['text_headline_color'] ) ) {
            if ( $color_settings['text_headline_color'] == '' ) {
                $options['text_headline_color'] = 'rgba(2, 83, 238, 1)';
            } else {
                $options['text_headline_color'] = $color_settings['text_headline_color'];
            }
        }

        /** Text Body Color. */
        if ( isset( $color_settings['text_body_color'] ) ) {
            if ( $color_settings['text_body_color'] == '' ) {
                $options['text_body_color'] = 'rgba(2, 83, 238, 1)';
            } else {
                $options['text_body_color'] = $color_settings['text_body_color'];
            }
        }

        /** Text Body Meta Color. */
        if ( isset( $color_settings['text_body_meta_color'] ) ) {
            if ( $color_settings['text_body_meta_color'] == '' ) {
                $options['text_body_meta_color'] = 'rgba(2, 83, 238, 1)';
            } else {
                $options['text_body_meta_color'] = $color_settings['text_body_meta_color'];
            }
        }
        
        /** Typography tab */
        /** Font Headline Family. */
        if ( isset( $typography_settings['font_headline_family'] ) ) {
            if ( $typography_settings['font_headline_family'] == '' ) {
                $options['font_headline_family'] = 'zs_san_francisco';
            } else {
                $options['font_headline_family'] = $typography_settings['font_headline_family'];
            }
        }
        
        /** Font Headline Size. */
        if ( isset( $typography_settings['font_headline_size'] ) ) {
            if ( $typography_settings['font_headline_size'] == '' ) {
                $options['font_headline_size'] = '16';
            } else {
                $options['font_headline_size'] = $typography_settings['font_headline_size'];
            }
        }
        
        /** Font Headline Weight. */
        if ( isset( $typography_settings['font_headline_weight'] ) ) {
            if ( $typography_settings['font_headline_weight'] == '' ) {
                $options['font_headline_weight'] = '700';
            } else {
                $options['font_headline_weight'] = $typography_settings['font_headline_weight'];
            }
        }
        
        /** Font Body Family. */
        if ( isset( $typography_settings['font_body_family'] ) ) {
            if ( $typography_settings['font_body_family'] == '' ) {
                $options['font_body_family'] = 'zs_san_francisco';
            } else {
                $options['font_body_family'] = $typography_settings['font_body_family'];
            }
        }
        
        /** Font Body Size. */
        if ( isset( $typography_settings['font_body_size'] ) ) {
            if ( $typography_settings['font_body_size'] == '' ) {
                $options['font_body_size'] = '16';
            } else {
                $options['font_body_size'] = $typography_settings['font_body_size'];
            }
        }
        
        /** Font Body Weight. */
        if ( isset( $typography_settings['font_body_weight'] ) ) {
            if ( $typography_settings['font_body_weight'] == '' ) {
                $options['font_body_weight'] = '700';
            } else {
                $options['font_body_weight'] = $typography_settings['font_body_weight'];
            }
        }
        
        /** Font Small Family. */
        if ( isset( $typography_settings['font_small_family'] ) ) {
            if ( $typography_settings['font_small_family'] == '' ) {
                $options['font_small_family'] = 'zs_san_francisco';
            } else {
                $options['font_small_family'] = $typography_settings['font_small_family'];
            }
        }
        
        /** Font Small Size. */
        if ( isset( $typography_settings['font_small_size'] ) ) {
            if ( $typography_settings['font_small_size'] == '' ) {
                $options['font_small_size'] = '16';
            } else {
                $options['font_small_size'] = $typography_settings['font_small_size'];
            }
        }
        
        /** Font Small Weight. */
        if ( isset( $typography_settings['font_small_weight'] ) ) {
            if ( $typography_settings['font_small_weight'] == '' ) {
                $options['font_small_weight'] = 'zsLight';
            } else {
                $options['font_small_weight'] = $typography_settings['font_small_weight'];
            }
        }

        /** Blog tab */
        /** Blog Layout. */
        if ( isset( $blog_settings['blog_layout'] ) ) {
            if ( $blog_settings['blog_layout'] == '' ) {
                $options['blog_layout'] = 'grid';
            } else {
                $options['blog_layout'] = $blog_settings['blog_layout'];
            }
        }

        /** Blog Meta Fields. */
        if ( isset( $blog_settings['blog_meta_fields'] ) ) {
            $options['blog_meta_fields'] = $blog_settings['blog_meta_fields'];
        }

        /** Blog Meta Fields. */
        if ( isset( $blog_settings['blog_categories_content_type'] ) ) {
            $options['blog_categories_content_type'] = $blog_settings['blog_categories_content_type'];
        }

        /** Post Meta Fields. */
        if ( isset( $blog_settings['single_meta_fields'] ) ) {
            $options['single_meta_fields'] = $blog_settings['single_meta_fields'];
        }

        /** Related Posts. */
        if ( isset( $blog_settings['single_related_posts'] ) ) {
            $options['single_related_posts'] = $blog_settings['single_related_posts'];
        }

        /** Posts by author. */
        if ( isset( $blog_settings['single_author_details'] ) ) {
            $options['single_author_details'] = $blog_settings['single_author_details'];
        } 
        /** Ads Tab */
        /** Show Blog Ads Header */
        // if ( isset( $ads_settings['is_show_blog_ads_header'] ) ) {
        //     $options['is_show_blog_ads_header'] = $ads_settings['is_show_blog_ads_header'];
        // }

        /** Blog Ads Header Id*/
        // if ( isset( $ads_settings['blog_ads_header_id'] ) ) {
        //     if($ads_settings['blog_ads_header_id'] == '') {
        //         $options['blog_ads_header_id'] = 'zinistore';
        //     } else {
        //         $options['blog_ads_header_id'] = $ads_settings['blog_ads_header_id'];
        //     }
        // }

        /** Show Blog Ads Footer */
        // if ( isset( $ads_settings['is_show_blog_ads_footer'] ) ) {
        //     $options['is_show_blog_ads_footer'] = $ads_settings['is_show_blog_ads_footer'];
        // }

        /** Blog Ads Footer Id*/
        // if ( isset( $ads_settings['blog_ads_footer_id'] ) ) {
        //     if($ads_settings['blog_ads_footer_id'] == '') {
        //         $options['blog_ads_footer_id'] = 'zinistore';
        //     } else {
        //         $options['blog_ads_footer_id'] = $ads_settings['blog_ads_footer_id'];
        //     }
        // }

        /** Show Blog Interstitial Ads */
        // if ( isset( $ads_settings['is_show_blog_interstitial_ads'] ) ) {
        //     $options['is_show_blog_interstitial_ads'] = $ads_settings['is_show_blog_interstitial_ads'];
        // }

        /** Blog Interstitial Ads Id*/
        // if ( isset( $ads_settings['blog_interstitial_ads_id'] ) ) {
        //     if($ads_settings['blog_interstitial_ads_id'] == '') {
        //         $options['blog_interstitial_ads_id'] = 'zinistore';
        //     } else {
        //         $options['blog_interstitial_ads_id'] = $ads_settings['blog_interstitial_ads_id'];
        //     }
        // }

        /** Woo General Tab */
        /** Woo Categories Content Type. */
        if ( isset( $woo_general_settings['woo_categories_content_type'] ) ) {
            $options['woo_categories_content_type'] = $woo_general_settings['woo_categories_content_type'];
        } else {
            $options['woo_categories_content_type'] = 'sub_categories';
        }
        /** Woo Is Allow Booking. */
        if ( isset( $woo_general_settings['woo_is_allow_booking'] ) ) {
            $options['woo_is_allow_booking'] = $woo_general_settings['woo_is_allow_booking'];
        }
        /** Woo Show variations. */
        if ( isset( $woo_general_settings['woo_show_variations'] ) ) {
            $options['woo_show_variations'] = $woo_general_settings['woo_show_variations'];
        }

        /** Product Listings Tab */
        /** Product Columns On Mobile */
        if ( isset( $woo_product_listings_settings['pl_num_of_column'] ) ) {
            $options['pl_num_of_column'] = $woo_product_listings_settings['pl_num_of_column'];
        }

        /** Number Of Product Per Page */
        if ( isset( $woo_product_listings_settings['pl_num_product_per_page'] ) ) {
            $options['pl_num_product_per_page'] = $woo_product_listings_settings['pl_num_product_per_page'];
        }

        /** Show Product Category */
        if ( isset( $woo_product_listings_settings['pl_is_show_category'] ) ) {
            $options['pl_is_show_category'] = $woo_product_listings_settings['pl_is_show_category'];
        }

        /** DisPlay Available Stock */
        if ( isset( $woo_product_listings_settings['pl_is_show_available_stock'] ) ) {
            $options['pl_is_show_available_stock'] = $woo_product_listings_settings['pl_is_show_available_stock'];
        }

        /** Display Out Of Stock */
        if ( isset( $woo_product_listings_settings['pl_is_show_out_of_stock'] ) ) {
            $options['pl_is_show_out_of_stock'] = $woo_product_listings_settings['pl_is_show_out_of_stock'];
        }

        /** Show Filter */
        if ( isset( $woo_product_listings_settings['pl_is_show_filter'] ) ) {
            $options['pl_is_show_filter'] = $woo_product_listings_settings['pl_is_show_filter'];
        }


        /** Single Product Tab */

        /** Thumbnail Position */
        if ( isset( $woo_single_product_settings['sp_thumb_position'] ) ) {
            $options['sp_thumb_position'] = $woo_single_product_settings['sp_thumb_position'];
        }

        /** Fullscreen Product View */
        if ( isset( $woo_single_product_settings['sp_is_fullscreen_view'] ) ) {
            $options['sp_is_fullscreen_view'] = $woo_single_product_settings['sp_is_fullscreen_view'];
        }

        /** Show Share Button */
        if ( isset( $woo_single_product_settings['sp_is_show_share_button'] ) ) {
            $options['sp_is_show_share_button'] = $woo_single_product_settings['sp_is_show_share_button'];
        }

        /** Show Short Description */
        if ( isset( $woo_single_product_settings['sp_is_show_short_description'] ) ) {
            $options['sp_is_show_short_description'] = $woo_single_product_settings['sp_is_show_short_description'];
        }

        /** Show Related Products */
        if ( isset( $woo_single_product_settings['sp_is_show_related_product'] ) ) {
            $options['sp_is_show_related_product'] = $woo_single_product_settings['sp_is_show_related_product'];
        }

        /** Number of Related Product Per Page */
        if ( isset( $woo_single_product_settings['sp_related_product_per_page'] ) ) {
            $options['sp_related_product_per_page'] = $woo_single_product_settings['sp_related_product_per_page'];
        }

        /** Show Up Sells Product */
        if ( isset( $woo_single_product_settings['sp_show_upsells_products'] ) ) {
            $options['sp_show_upsells_products'] = $woo_single_product_settings['sp_show_upsells_products'];
        }

        /** Number Of Up Sells Product Per Page */
        if ( isset( $woo_single_product_settings['sp_upsells_product_per_page'] ) ) {
            $options['sp_upsells_product_per_page'] = $woo_single_product_settings['sp_upsells_product_per_page'];
        }



        /**  Download Link. */
        if ( isset( $color_settings['link'] ) ) {
            $options['link'] = $color_settings['link'];
        }

        $results = wp_parse_args( $options, $defaults );

        $this->options = $results;
    }

    /**
     * Loads the ZiniAppBuilder translated strings.
     *
     * @access public
     * @since 1.0.0
     * @return void
     **/
    public function load_textdomain() {
        load_plugin_textdomain( 'ziniappbuilder', false, dirname( plugin_basename( __FILE__ ) ) . '/languages/' );
    }

    /**
     * Add plugin styles.
     *
     * @since   1.0.0
     * @return void
     */
    public function enqueue_styles() {
        //wp_enqueue_style( 'zs-ziniappbuilder', self::$url . 'assets/css/ziniappbuilder' . self::$suffix . '.css', [], self::$version );
    }

    /**
     * Add plugin scripts.
     *
     * @return void
     * @since   1.0.0
     **/
    public function enqueue_scripts() {
        wp_enqueue_script( 'jquery' );
    }

    /**
     * Remove media element styles and scripts.
     *
     * @return string
     * @since   1.0.0
     */
    public function remove_media_element() {
        return '';
    }

    /**
     * Add CSS for admin area.
     *
     * @return void
     * @since   1.0.0
     **/
    public function admin_styles() {

        /** Add styles only on setting page */
        $screen = get_current_screen();

        /** ZiniAppBuilder Settings Page. */
        if ( $screen->base === "toplevel_page_zs_ziniappbuilder_settings" ) {
            wp_enqueue_style( 'main-ui', self::$url . 'assets/css/main-ui.min.css', array(), self::$version );
            wp_enqueue_style( 'dataTables', self::$url . 'assets/css/jquery.dataTables' . self::$suffix . '.css', [], self::$version );
            wp_enqueue_style( 'zs-ziniappbuilder-admin', self::$url . 'assets/css/admin' . self::$suffix . '.css', [], self::$version );

        /** Edit Post/Page. */
        } elseif ( in_array( $screen->post_type, [ 'post', 'page' ] ) && $screen->base != 'edit' ) {

            wp_enqueue_style( 'zs-ziniappbuilder-admin-post', self::$url . 'assets/css/admin-post' . self::$suffix . '.css', [], self::$version );

        /** Plugin install page, for style "View version details" popup. */
        } elseif ( 'plugin-install' === $screen->base ) {

            /** Styles only for our plugin. */
	        if ( isset( $_GET['plugin'] )  AND $_GET['plugin'] === 'ziniappbuilder' ) {
		        wp_enqueue_style( 'zs-ziniappbuilder-plugin-install', self::$url . 'assets/css/plugin-install' . self::$suffix . '.css', [], self::$version );
	        }
        }

    }

    /**
     * Add JS for admin area.
     *
     * @return void
     * @since   1.0.0
     **/
    public function admin_scripts() {

        /** Add styles only on setting page */
        $screen = get_current_screen();

        /** ZiniAppBuilder Settings Page. */
        if ( $screen->base == "toplevel_page_zs_ziniappbuilder_settings" ) {
            wp_enqueue_script( 'main-ui', self::$url . 'assets/js/main-ui' . self::$suffix . '.js', array(), self::$version, true );
            wp_enqueue_media(); // WordPress Image library.
            wp_enqueue_script( 'dataTables', self::$url . 'assets/js/jquery.dataTables' . self::$suffix . '.js', [ 'jquery' ], self::$version, true );
            wp_enqueue_script( 'zs-ziniappbuilder-admin', self::$url . 'assets/js/admin' . self::$suffix . '.js', ['jquery', 'dataTables'], self::$version, true );

            /** Remove "Thank you for creating with WordPress" and WP version from plugin settings page. */
            add_filter( 'admin_footer_text', '__return_empty_string', 11 );
            add_filter( 'update_footer', '__return_empty_string', 11 );

            /** Edit Post/Page. */
        } elseif ( in_array( $screen->post_type, [ 'post', 'page' ] ) && $screen->base != 'edit' ) {
            wp_enqueue_script( 'zs-admin-post', self::$url . 'assets/js/admin-post' . self::$suffix . '.js', [ 'jquery' ], self::$version, true );
        }

    }

    /**
     * Displays useful links for an activated and non-activated plugin.
     *
     * @since 1.0.3
     **/
    public function support_link() { ?>

        <hr class="mdc-list-divider">
        <h6 class="mdc-list-group__subheader"><?php echo esc_html__( 'Helpful links', 'ziniappbuilder' ) ?></h6>

        <a class="mdc-list-item" href="https://zinisoft-net.gitbook.io/zinistore-docs/" target="_blank">
            <i class="material-icons mdc-list-item__graphic" aria-hidden="true"><?php echo esc_html__( 'collections_bookmark' ) ?></i>
            <span class="mdc-list-item__text"><?php echo esc_html__( 'Documentation', 'ziniappbuilder' ) ?></span>
        </a>

        <a class="mdc-list-item" href="/wp-admin/admin.php/?page=zs_ziniappbuilder_settings&tab=change-log">
            <i class="material-icons mdc-list-item__graphic" aria-hidden="true"><?php echo esc_html__( 'collections_bookmark' ) ?></i>
            <span class="mdc-list-item__text"><?php echo esc_html__( 'Change log', 'ziniappbuilder' ) ?></span>
        </a> 
            <a class="mdc-list-item" href="https://codecanyon.net/user/zinisoft" target="_blank">
                <i class="material-icons mdc-list-item__graphic" aria-hidden="true"><?php echo esc_html__( 'mail' ) ?></i>
                <span class="mdc-list-item__text"><?php echo esc_html__( 'Get help', 'ziniappbuilder' ) ?></span>
            </a>
            <a class="mdc-list-item" href="https://1.envato.market/cc-downloads" target="_blank">
                <i class="material-icons mdc-list-item__graphic" aria-hidden="true"><?php echo esc_html__( 'thumb_up' ) ?></i>
                <span class="mdc-list-item__text"><?php echo esc_html__( 'Rate this plugin', 'ziniappbuilder' ) ?></span>
            </a> 

        <a class="mdc-list-item" href="https://codecanyon.net/user/zinisoft/portfolio" target="_blank">
            <i class="material-icons mdc-list-item__graphic" aria-hidden="true"><?php echo esc_html__( 'store' ) ?></i>
            <span class="mdc-list-item__text"><?php echo esc_html__( 'More plugins', 'ziniappbuilder' ) ?></span>
        </a>
        <?php

    }

    /**
     * Run when the plugin is activated.
     *
     * @static
     * @since 2.0.0
     **/
    public static function on_activation() {

        /** Security checks. */
        if ( ! current_user_can( 'activate_plugins' ) ) {
            return;
        } 
	    Activator::activate();
    }

    /**
     * Main ZiniAppBuilder Instance.
     *
     * Insures that only one instance of ZiniAppBuilder exists in memory at any one time.
     *
     * @static
     * @return ZiniAppBuilder
     * @since 1.0.0
     **/
    public static function get_instance() {
        if ( ! isset( self::$instance ) && ! ( self::$instance instanceof ZiniAppBuilder ) ) {
            self::$instance = new ZiniAppBuilder;
        }

        return self::$instance;
    }

    /**
     * Throw error on object clone.
     *
     * The whole idea of the singleton design pattern is that there is a single
     * object therefore, we don't want the object to be cloned.
     *
     * @return void
     * @since 1.0.0
     * @access protected
     **/
    public function __clone() {
        /** Cloning instances of the class is forbidden. */
        _doing_it_wrong( __FUNCTION__, esc_html__( 'The whole idea of the singleton design pattern is that there is a single object therefore, we don\'t want the object to be cloned.', 'ziniappbuilder' ), self::$version );
    }

    /**
     * Disable unserializing of the class.
     *
     * The whole idea of the singleton design pattern is that there is a single
     * object therefore, we don't want the object to be unserialized.
     *
     * @return void
     * @since 1.0.0
     * @access protected
     **/
    public function __wakeup() {
        /** Unserializing instances of the class is forbidden. */
        _doing_it_wrong( __FUNCTION__, esc_html__( 'The whole idea of the singleton design pattern is that there is a single object therefore, we don\'t want the object to be unserialized.', 'ziniappbuilder' ), self::$version );
    }

    private function define_admin_hooks() {

		$plugin_admin = new Admin( $this->get_plugin_name(), $this->get_version() );

		$this->loader->add_action( 'rest_api_init', $plugin_admin, 'add_api_routes' );

		// Add the options page and menu item.
		add_action( 'admin_menu', array( $plugin_admin, 'add_plugin_admin_menu' ) );

		// Add plugin action link point to settings page
		add_filter( 'plugin_action_links_' . $this->plugin_name . '/' . $this->plugin_name . '.php', array(
			$plugin_admin,
			'add_plugin_action_links'
		) );

	}


	private function define_api_hooks() {
		// Auth
        $plugin_auth = new Auth( $this->get_plugin_name(), $this->get_version() );
        $this->loader->add_action( 'rest_api_init', $plugin_auth, 'add_api_routes', 10 );

        $setting_api = Setting::get_instance($this->get_plugin_name(), $this->get_version());
        $this->loader->add_action( 'rest_api_init', $setting_api, 'add_api_routes', 10 );
        
        $home_api = Home::get_instance($this->get_plugin_name(), $this->get_version());
        $this->loader->add_action( 'rest_api_init', $home_api, 'add_api_routes', 10 );
		// Cart
		$plugin_cart = new Cart( $this->get_plugin_name(), $this->get_version() );
		$this->loader->add_action( 'rest_api_init', $plugin_cart, 'add_api_routes', 10 );
		$this->loader->add_action( 'wp_loaded', $plugin_cart, 'zini_app_builder_pre_car_rest_api', 5 );
		$this->loader->add_filter( 'woocommerce_persistent_cart_enabled', $plugin_cart, 'zini_app_builder_woocommerce_persistent_cart_enabled' );
		$this->loader->add_action( 'woocommerce_load_cart_from_session', $plugin_cart, 'load_cart_action', 10 );
		$this->loader->add_action( 'woocommerce_thankyou', $plugin_cart, 'handle_checkout_success', 10 );

		// Vendor
		$plugin_api = new Vendor( $this->get_plugin_name(), $this->get_version() );
		$this->loader->add_action( 'rest_api_init', $plugin_api, 'add_api_routes', 10 );
		if ( defined( 'ZINI_APP_BUILDER_QUERY_PRODUCT_RADIUS' ) && ZINI_APP_BUILDER_QUERY_PRODUCT_RADIUS ) {
			$this->loader->add_filter( 'posts_clauses', $plugin_api, 'mbd_product_list_geo_location_filter_post_clauses', 500, 2 );
		}
		$this->loader->add_filter( 'posts_clauses', $plugin_api, 'mbd_product_list_by_vendor', 501, 2 );
		$this->loader->add_filter( 'posts_clauses', $plugin_api, 'mbd_product_distance', 501, 2 );
		$this->loader->add_action( 'wcfmd_after_delivery_boy_assigned', $plugin_api, 'delivery_boy_assigned_notification', 10, 6 );
		$this->loader->add_action( 'woocommerce_order_status_changed', $plugin_api, 'notification_order_status_changed', 10, 3 );
		$this->loader->add_action( 'after_wcfm_notification', $plugin_api, 'custom_after_wcfm_notification', 600, 6 );

		// WCFM
		$wcfm_api = new WCFM( $this->get_plugin_name(), $this->get_version() );
		$this->loader->add_action( 'rest_api_init', $wcfm_api, 'add_api_routes', 10 );

		// Products
		$products_api = new Products( $this->get_plugin_name(), $this->get_version() );
		$this->loader->add_action( 'rest_api_init', $products_api, 'add_api_routes', 10 );
		$this->loader->add_filter( 'woocommerce_rest_product_object_query', $products_api, 'woocommerce_rest_product_object_query', 10, 2 );
		$this->loader->add_filter( 'woocommerce_rest_prepare_product_object', $products_api,
			'prepare_product_images', 30, 3 );

		// Product variation
		$this->loader->add_filter( 'woocommerce_rest_prepare_product_variation_object', $products_api,
			'custom_woocommerce_rest_prepare_product_variation_object' );

		$this->loader->add_filter( 'woocommerce_rest_prepare_product_variation_object', $products_api,
			'prepare_product_variation_images', 10, 3 );

		// Product Attributes
		$this->loader->add_filter( 'woocommerce_rest_prepare_product_attribute', $products_api,
			'custom_woocommerce_rest_prepare_product_attribute', 10, 3 );
		$this->loader->add_filter( 'woocommerce_rest_prepare_pa_color', $products_api, 'add_value_pa_color' );
		$this->loader->add_filter( 'woocommerce_rest_prepare_pa_image', $products_api, 'add_value_pa_image' );

	}

	/**
	 * Register all of the hooks related to the public-facing functionality
	 * of the plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 */
	private function define_public_hooks() {

		$plugin_public = new \AppleKey( $this->get_plugin_name(), $this->get_version() );
		$zinisoft_gateways = array();

		// Payment Gateway via PayPal Standard
		$gateway_paypal = new \Gateway_PayPal();
		array_push( $zinisoft_gateways, $gateway_paypal );

		// Payment Gateway via Razorpay Standard
		$gateway_razorpay = new \Gateway_Razorpay();
		array_push( $zinisoft_gateways, $gateway_razorpay );

		// Register Payment Endpoint for all Gateways
		foreach ( $zinisoft_gateways as &$zinisoft_gateway ) {
			$this->loader->add_filter( 'zinisoft_pre_process_' . $zinisoft_gateway->gateway_id . '_payment', $zinisoft_gateway, 'zinisoft_pre_process_payment' );
		}

		$this->loader->add_action( 'rest_api_init', $plugin_public, 'add_api_routes' );
		$this->loader->add_filter( 'determine_current_user', $plugin_public, 'determine_current_user' );

		/**
		 * Filter locate template
		 * @since 1.2.0
		 */
//		$this->loader->add_filter( 'woocommerce_locate_template', $plugin_public, 'woocommerce_locate_template', 100, 3 );

		/**
		 * Add style for checkout page
		 * @since 1.2.0
		 */
		$this->loader->add_action( 'wp_enqueue_scripts', $plugin_public, 'enqueue_styles' );

		/**
		 * Filter token digits
		 * @since 1.3.3
		 */
		$this->loader->add_filter( 'digits_rest_token_data', $plugin_public, 'custom_digits_rest_token_data', 100, 2 );

	}

	/**
	 * Register all of the hooks related to the public-facing functionality
	 * of the plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 */
	private function define_product_hooks() {

		$plugin_product = new Product( $this->get_plugin_name(), $this->get_version() );

		$this->loader->add_action( 'rest_api_init', $plugin_product, 'add_api_routes' );

		// Product
		$this->loader->add_filter( 'woocommerce_rest_prepare_product_object', $plugin_product,
			'custom_change_product_response', 20, 3 );

		// Category
		$this->loader->add_filter( 'woocommerce_rest_prepare_product_cat', $plugin_product,
			'custom_change_product_cat', 20, 3 );

		// Blog
		$this->loader->add_filter( 'the_title', $plugin_product,
			'custom_the_title', 20, 3 );

		$this->loader->add_filter( 'wcml_client_currency', $plugin_product, 'mbd_wcml_client_currency' );

	}

} // End Class ZiniAppBuilder. 

/** Run ZiniAppBuilder class. */
ZiniAppBuilder::get_instance();
