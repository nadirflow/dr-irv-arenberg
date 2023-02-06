<?php

/**
 * WCFM Api plugin
 *
 * WCFM Api Core
 *
 * @author 		WC Lovers
 * @package 	wcfmapi/core
 * @version   1.0.0
 */

class WCFMapi {
  public $plugin_base_name;
	public $plugin_url;
	public $plugin_path;
	public $version;
	public $token;
	public $text_domain;
  public $library;
	public $template;
	public $shortcode;
	public $admin;
	public $frontend;
	public $ajax;
	private $file;
  
  public function __construct($file) {
		$this->file = $file;
		$this->plugin_base_name = plugin_basename( $file );
		$this->plugin_url = trailingslashit(plugins_url('', $plugin = $file));
		$this->plugin_path = trailingslashit(dirname($file));
		$this->token = WCFMapi_TOKEN;
		$this->text_domain = WCFMapi_TEXT_DOMAIN;
		$this->version = WCFMapi_VERSION;

		add_action( 'jwt_auth_token_before_dispatch', array( &$this,'modify_jwt_auth_plugin_response' ),  20, 2 );
    
    add_action( 'wcfmmp_loaded', array( &$this, 'init_wcfm_api' ) );
    
  }
  
  function init_wcfm_api() {
  	
  	// Init Text Domain
		$this->load_plugin_textdomain();
  	
    $this->load_class( 'rest-controller' );
    $this->load_class( 'api-manager' );
    new WCFMapi_API_Manager();
  }

  function modify_jwt_auth_plugin_response($data, $user) {
  	global $WCFM;
  	//print_r($user);

  	$vendor_store_name = $WCFM->wcfm_vendor_support->wcfm_get_vendor_store_name_by_vendor( $user->ID );
  	//print_r($vendor_data);
  	$data['roles'] = $user->roles;
  	$data['store_name'] = $vendor_store_name;
  	$data['store_id'] = $user->ID;
  	return $data;
  }
  
  /**
	 * Load Localisation files.
	 *
	 * Note: the first-loaded translation file overrides any following ones if the same translation is present
	 *
	 * @access public
	 * @return void
	 */
	public function load_plugin_textdomain() {
		$locale = function_exists( 'get_user_locale' ) ? get_user_locale() : get_locale();
		$locale = apply_filters( 'plugin_locale', $locale, 'wcfm-marketplace-rest-api' );

		//load_textdomain( 'wcfm-marketplace-rest-api', WP_LANG_DIR . "/wc-multivendor-marketplace/wcfm-marketplace-rest-api-$locale.mo");
		load_textdomain( 'wcfm-marketplace-rest-api', $this->plugin_path . "lang/wcfm-marketplace-rest-api-$locale.mo");
		load_textdomain( 'wcfm-marketplace-rest-api', WP_LANG_DIR . "/plugins/wcfm-marketplace-rest-api-$locale.mo");
	}

  
  public function load_class($class_name = '') {
		if ('' != $class_name && '' != $this->token) {
			require_once ('class-' . esc_attr($this->token) . '-' . esc_attr($class_name) . '.php');
		} // End If Statement
	}
  
}
