<?php
	
if (!defined('ABSPATH')) {
	exit; // Exit if accessed directly
}
	
$admin_dashboard = new PNFW_Admin();

final class PNFW_Admin {
	public function __construct() {
		add_action('admin_init', array($this, 'admin_init'));
		add_action('admin_menu', array($this, 'menus'));

		add_action('admin_enqueue_scripts', array($this, 'load_admin_meta_box_script'));

		$plugin_filename = plugin_basename(__FILE__);
		add_filter("plugin_action_links_$plugin_filename", array($this, 'settings_link'));

		add_action('admin_head', array($this, 'admin_header'));
		add_filter('upload_mimes', array($this, 'allow_pem_and_p12'));
		add_action('add_meta_boxes', array($this, 'adding_meta_box'), 10, 2);
		add_action('save_post', array($this, 'save_postdata'), 1);
		add_action('admin_notices', array($this, 'ios_certificate_admin_notices'));
	}
	
	function admin_header() {
		echo '<style type="text/css">';

		// Common
		echo '.textfield { width: 100%; }';

		// App Subscribers page
		echo '.wp-list-table .column-username { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }';
		echo '.wp-list-table .column-email { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }';
		echo '.wp-list-table .column-user_categories { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }';
		echo '.wp-list-table .column-devices { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }';
		echo '.wp-list-table .column-excluded_categories { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }';

		// Tokens page
		echo '.wp-list-table .column-id { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }';
		echo '.wp-list-table .column-token  { max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }';
		echo '.wp-list-table .column-user_id { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }';
		echo '.wp-list-table .column-timestamp { overflow: hidden; text-overflow: ellipsis; }';
		echo '.wp-list-table .column-os { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }';
		echo '.wp-list-table .column-lang { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }';
		echo '.wp-list-table .column-status { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }';

		// Debug page
		echo '.wp-list-table .column-type { width: 9%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }';
		echo '.wp-list-table .column-timestamp { width: 16%; overflow: hidden; text-overflow: ellipsis; }';
		echo '.wp-list-table .column-text { overflow: hidden; text-overflow: ellipsis; }';
			
		echo '.log-type-' . PNFW_SYSTEM_LOG . ' { width: 20px; height: 20px; border-radius: 50%; background-color: #cccccc; }';
		echo '.log-type-' . PNFW_IOS_LOG . ' { width: 20px; height: 20px; border-radius: 50%; background-color: #3980d5; }';
		echo '.log-type-' . PNFW_ANDROID_LOG . ' { width: 20px; height: 20px; border-radius: 50%; background-color: #99cc00; }';
		echo '.log-type-' . PNFW_FEEDBACK_PROVIDER_LOG . ' { width: 20px; height: 20px; border-radius: 50%; background-color: #3980d5; }';
		echo '.log-type-' . PNFW_ALERT_LOG . ' { width: 20px; height: 20px; border-radius: 50%; background-color: #f27d7d; }';
		echo '.log-type-' . PNFW_SAFARI_LOG . ' { width: 20px; height: 20px; border-radius: 50%; background-color: #1fbbd7; }';
		echo '.log-type-' . PNFW_WEB_LOG . ' { width: 20px; height: 20px; border-radius: 50%; background-color: #ffcd41; }';
		echo '.log-type-' . PNFW_TELEGRAM_LOG . ' { width: 20px; height: 20px; border-radius: 50%; background-color: #fd9924; }';
		echo '.log-type-' . PNFW_OTHER_LOG . ' { width: 20px; height: 20px; border-radius: 50%; background-color: #be2ad5; }';
		echo '</style>';
	}

	function admin_init() {
		$custom_post_types = get_post_types(array('public' => 1));
		$custom_post_types = array_diff($custom_post_types, array('page', 'attachment'));
		$taxonomies = get_object_taxonomies($custom_post_types);
		foreach ($taxonomies as $taxonomy) {
			add_action("delete_{$taxonomy}", array($this, 'delete_term'));
		}
	}

	function menus() {
		$admin_capability = 'activate_plugins';
		$editor_capability = 'publish_pages';
	
		$menu_slug = 'push-notifications-for-wordpress';
	
		$page_hook_suffix = add_menu_page(
			__('Push Notifications', 'push-notifications-for-wp'),
			__('Push Notifications', 'push-notifications-for-wp'),
			$editor_capability,
			$menu_slug,
			array($this, 'stats_page'),
			plugin_dir_url(__FILE__) . '../assets/imgs/icon-menu.png',
			200);

			
		$page_hook_suffix = add_submenu_page(
			$menu_slug,
			__('Settings', 'push-notifications-for-wp'),
			__('Settings', 'push-notifications-for-wp'),
			$admin_capability,
			'pnfw-settings-identifier',
			array($this, 'settings_page'));

		add_action('admin_print_scripts-' . $page_hook_suffix, array($this, 'plugin_admin_scripts'));

		
		$page_hook_suffix = add_submenu_page(
			$menu_slug,
			__('OAuth', 'push-notifications-for-wp'),
			__('OAuth', 'push-notifications-for-wp'),
			$admin_capability,
			'pnfw-oauth-identifier',
			array($this, 'oauth_page'));

		
		$page_hook_suffix = add_submenu_page(
			$menu_slug,
			__('App Subscribers', 'push-notifications-for-wp'),
			__('App Subscribers', 'push-notifications-for-wp'),
			$editor_capability,
			'pnfw-app-subscribers-identifier',
			array($this, 'app_subscribers_page'));

			
		$page_hook_suffix = add_submenu_page(
			$menu_slug,
			__('Tokens', 'push-notifications-for-wp'),
			__('Tokens', 'push-notifications-for-wp'),
			$editor_capability,
			'pnfw-tokens-identifier',
			array($this, 'tokens_page'));

			
		$page_hook_suffix = add_submenu_page(
			$menu_slug,
			__('Debug', 'push-notifications-for-wp'),
			__('Debug', 'push-notifications-for-wp'),
			$admin_capability,
			'pnfw-debug-identifier',
			array($this, 'debug_page'));

	}
	
	function stats_page() {
		require_once dirname(__FILE__ ) . '/class-pnfw-admin-stats.php';

		PNFW_Admin_Stats::output();
	}
	
	function settings_page() {
		require_once dirname(__FILE__ ) . '/class-pnfw-admin-settings.php';

		PNFW_Admin_Settings::output();
	}
	
	function oauth_page() {
		require_once dirname(__FILE__ ) . '/class-pnfw-admin-oauth.php';

		PNFW_Admin_OAuth::output();
	}
	
	function app_subscribers_page() {
		require_once dirname(__FILE__ ) . '/class-pnfw-admin-subscribers.php';

		PNFW_Admin_Subscribers::output();
	}
	
	function tokens_page() {
		require_once dirname(__FILE__ ) . '/class-pnfw-admin-tokens.php';

		PNFW_Admin_Tokens::output();
	}
	
	function debug_page() {
		require_once dirname(__FILE__ ) . '/class-pnfw-admin-debug.php';

		PNFW_Admin_Debug::output();
	}
	

	function plugin_admin_scripts() {
		wp_enqueue_media();
		wp_register_script('admin_settings', plugin_dir_url(__FILE__) . '../assets/js/admin_settings.js', array('jquery'), PNFW_VERSION);
		wp_enqueue_script('admin_settings');
		wp_localize_script('admin_settings', 'data', array(
			'uploader_title' => __('Upload', 'push-notifications-for-wp'),
			'uploader_button_text' => __('Select', 'push-notifications-for-wp'),
			'admin_url' => admin_url('admin-ajax.php'),
			'nonce' => wp_create_nonce('pnfw_admin')
		));
	}
	
	function load_admin_meta_box_script() {
		global $pagenow;
		
		if (is_admin() && ($pagenow == 'post-new.php' || $pagenow == 'post.php')) {
			wp_register_script(
				'admin_meta_box',
				plugin_dir_url(__FILE__) . '../assets/js/admin_meta_box.js',
				array('jquery'),
				PNFW_VERSION
			);
				
			wp_enqueue_script('admin_meta_box');

			wp_localize_script('admin_meta_box',
				'strings',
				array(
					'str1' => __('Send and make visible only to', 'push-notifications-for-wp') . ':',
					'str2' => __('Make visible only to', 'push-notifications-for-wp') . ':'
				)
			);
		}
	}
	
	/**
	  * Add file extensions 'PEM' and 'P12' to the list of acceptable file extensions WordPress
	  * checks during media uploads
	  */
	function allow_pem_and_p12($mimes) {
		$mimes['pem'] = 'application/x-pem-file';
		$mimes['p12'] = 'application/x-pkcs12';
		return $mimes;
	}

	/**
	  * Add a meta box to the new post/new custom post type edit screens
	  */
	function adding_meta_box($post_type, $post) {
		$enabled_post_types = get_option('pnfw_enabled_post_types', array());
		
		if (empty($enabled_post_types) || !in_array($post_type, $enabled_post_types)) {
			return false;
		}

		add_meta_box( 
			'pnfw-meta-box',
			__('Push Notifications', 'push-notifications-for-wp'),
			array($this, 'render_meta_box'),
			$post_type,
			'side',
			'high'
		);
	}

	/**
	  * Print the meta box content
	  */
	function render_meta_box($post) {
		wp_nonce_field('pnfw_meta_box', 'pnfw_meta_box_nonce');
		
		$value = get_post_meta($post->ID, 'pnfw_do_not_send_push_notifications_for_this_post', true);

		?>
		<label><input type="checkbox"<?php echo (!empty($value) ? ' checked="checked"' : null) ?> value="1" name="pnfw_do_not_send_push_notifications_for_this_post" id="pnfw-do-not-send-push-notifications-for-this-post" /> <?php echo sprintf(__('Do not send for this %s', 'push-notifications-for-wp'), strtolower(get_post_type_object($post->post_type)->labels->singular_name)); ?></label>

		<?php
		$user_cat = get_post_meta($post->ID, 'pnfw_user_cat', true); ?>

		<div id='user-categories'>
			<ul>
				<li><strong id='send-and-make-visible-only-to-box'><?php _e('Send and make visible only to', 'push-notifications-for-wp'); ?>:</strong></li>
				
				<li>
					<input type="radio" name="user_cat" id="user_cat-all" value="all" <?php checked($user_cat, ''); ?> />
					<label for="user_cat-all"><?php _e('All', 'push-notifications-for-wp'); ?></label>
				</li>
				
				<li>
					<input type="radio" name="user_cat" id="user_cat-anonymous-users" value="anonymous-users" <?php checked($user_cat, 'anonymous-users'); ?> />
					<label for="user_cat-anonymous-users"><?php _e('Anonymous users', 'push-notifications-for-wp'); ?></label>
				</li>
				
				<li>
					<input type="radio" name="user_cat" id="user_cat-registered-users" value="registered-users" <?php checked($user_cat, 'registered-users'); ?> />
					<label for="user_cat-registered-users"><?php _e('Registered users', 'push-notifications-for-wp'); ?></label>
				</li>
			</ul>
		</div>  <!-- user-categories -->
		
		<div style="color:#999;">
			<?php _e('Do you want to create user groups?', 'push-notifications-for-wp'); ?>
			<a href="https://products.delitestudio.com/wordpress/push-notifications-for-wordpress/">
				<?php _e('Upgrade now to Push Notifications for WordPress', 'push-notifications-for-wp'); ?> &rarr;
			</a>
		</div>
	<?php }

	/**
	  * When the post/custom post type is saved, saves our custom data
	  */
	function save_postdata($postid) {
		// Check if our nonce is set.
		if (!isset( $_POST['pnfw_meta_box_nonce']))
			return $postid;

		$nonce = $_POST['pnfw_meta_box_nonce'];

		if (!wp_verify_nonce($nonce, 'pnfw_meta_box'))
			return $postid;
			
		if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) // stop it from being called during auto drafts
			return false;
	
		if (!current_user_can('edit_post', $postid))
			return false;

		$enabled_post_types = get_option('pnfw_enabled_post_types', array());
				
		if (empty($postid) || isset($_POST['post_type']) && !in_array($_POST['post_type'], $enabled_post_types))
			return false;
	
		update_option('pnfw_last_save_timestamp', time());

		if (isset($_POST['pnfw_do_not_send_push_notifications_for_this_post'])) {
			add_post_meta($postid, 'pnfw_do_not_send_push_notifications_for_this_post', true, true);
		}
		else {
			delete_post_meta($postid, 'pnfw_do_not_send_push_notifications_for_this_post');
		}
			
		if (isset($_POST['user_cat'])) {
			$cat = $_POST['user_cat'];

			delete_post_meta($postid, 'pnfw_user_cat');
			
			if ($cat != 'all') {
				add_post_meta($postid, 'pnfw_user_cat', $cat, true);
			}
		}
	}
	
	function ios_certificate_admin_notices() {
		if (!current_user_can('activate_plugins'))
			return;
		
		$pnfw_ios_push_notifications = (bool)get_option('pnfw_ios_push_notifications');
		
		if (!$pnfw_ios_push_notifications)
			return;
		
		$pnfw_ios_use_sandbox = (bool)get_option('pnfw_ios_use_sandbox');
		
		$media_id = get_option($pnfw_ios_use_sandbox ? 'pnfw_sandbox_ssl_certificate_media_id' : 'pnfw_production_ssl_certificate_media_id');
		
		$expires = pnfw_certificate_expiration($media_id);

		if (is_null($expires))
			return;
		
		$gmt_offset = get_option('gmt_offset');
		$date_format = get_option('date_format');
		$time_format = get_option('time_format');
		$tz_format = sprintf('%s %s', $date_format, $time_format);

		$human_readable_date = date_i18n($tz_format, $expires);
		
		if ($expires < time()) {
			$class = "error";
			$message = sprintf(__('The iOS push notifications certificate is expired on %s. Renew it now and upload it <a href="%s">here</a>.', 'push-notifications-for-wp'), $human_readable_date, admin_url('admin.php?page=pnfw-settings-identifier&tab=ios_tab'));
			echo"<div class=\"$class\"> <p>$message</p></div>";
		}
		else if ($expires - WEEK_IN_SECONDS < time()) {
			$class = "update-nag";
			$message = sprintf(__('The iOS push notifications certificate is about to expire on %s. Renew it soon and upload it <a href="%s">here</a>.', 'push-notifications-for-wp'), $human_readable_date, admin_url('admin.php?page=pnfw-settings-identifier&tab=ios_tab'));
			echo"<div class=\"$class\"> <p>$message</p></div>";
		}
	}
	
	/**
	  * Place a link to the Settings page right from the WordPress Installed Plugins page
	  */
	function settings_link($links) { 
		$url = admin_url('admin.php?page=pnfw-settings-identifier');
		$settings_link = "<a href='$url'>" . __('Settings', 'push-notifications-for-wp') . '</a>'; 
		array_unshift($links, $settings_link); 
		
		return $links;
	}

	function delete_term($term_id) {
		pnfw_log(PNFW_SYSTEM_LOG, sprintf(__('Automatically deleted excluded category %d.', 'push-notifications-for-wp'), $term_id));
		
		global $wpdb;
		$wpdb->delete($wpdb->get_blog_prefix().'push_excluded_categories', array('category_id' => $term_id));
	}

}