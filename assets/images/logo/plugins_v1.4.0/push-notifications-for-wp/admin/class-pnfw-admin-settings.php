<?php
	
if (!defined('ABSPATH')) {
	exit; // Exit if accessed directly
}

class PNFW_Admin_Settings {
	public static function output() { ?>
		<style type="text/css">
			input.textfield {
				width: 100%;
			}
			input.upload {
				width: 100px;
				text-align:center;
				vertical-align:"middle";
				padding: 0px;
				-webkit-touch-callout: none;
				-webkit-user-select: none;
				-khtml-user-select: none;
				-moz-user-select: none;
				-ms-user-select: none;
				user-select: none;
			}
			.form-table {
				clear:none !important;
			}
			.inside .submit {
				padding:5px 0 0 0 !important;
			}
			.inside p {
				margin-left: 10px;
				margin-bottom:0;
			}
			.postbox h3 {
				cursor:default !important;
			}
			.postbox h3:hover {
				color:#464646 !important;
			}
		</style>
		
		<div class="wrap">
		
		<div id="icon-options-general" class="icon32"></div>
		<h2><?php _e('Settings', 'push-notifications-for-wp'); ?></h2>
	
		<?php if (isset($_POST['issubmitted_general_tab']) && $_POST['issubmitted_general_tab'] == 'yes') {
			PNFW_Admin_Settings::save_basic_options();
		}
		else if (isset($_POST['issubmitted_ios_tab']) && $_POST['issubmitted_ios_tab'] == 'yes') {
			PNFW_Admin_Settings::save_ios_options();
		}
		else if (isset($_POST['issubmitted_android_tab']) && $_POST['issubmitted_android_tab'] == 'yes') {
			PNFW_Admin_Settings::save_android_options();
		}
		else if (isset($_POST['issubmitted_misc_tab']) && $_POST['issubmitted_misc_tab'] == 'yes') {
			PNFW_Admin_Settings::save_misc_options();
		}
		
		// General
		$pnfw_enable_push_notifications = (bool)get_option('pnfw_enable_push_notifications');
		$enabled_post_types = get_option('pnfw_enabled_post_types', array());
		$enabled_object_taxonomies = get_option('pnfw_enabled_object_taxonomies', array());
		
		// iOS
		$pnfw_ios_push_notifications = (bool)get_option('pnfw_ios_push_notifications');
		$pnfw_ios_use_sandbox = (bool)get_option("pnfw_ios_use_sandbox");
		$pnfw_sandbox_ssl_certificate_media_id = get_option('pnfw_sandbox_ssl_certificate_media_id');
		$pnfw_sandbox_ssl_certificate_password = get_option('pnfw_sandbox_ssl_certificate_password');
		$pnfw_production_ssl_certificate_media_id = get_option('pnfw_production_ssl_certificate_media_id');
		$pnfw_production_ssl_certificate_password = get_option('pnfw_production_ssl_certificate_password');
		$pnfw_ios_payload_sound = get_option('pnfw_ios_payload_sound', 'default');
		
		// Android
		$pnfw_android_push_notifications = (bool)get_option('pnfw_android_push_notifications');
		$pnfw_google_api_key = get_option('pnfw_google_api_key');
		$pnfw_use_notification_message = (bool)get_option('pnfw_use_notification_message');
		$pnfw_add_message_field_in_payload = (bool)get_option('pnfw_add_message_field_in_payload');
		
		
		// Misc
		$pnfw_use_wpautop = (bool)get_option('pnfw_use_wpautop');
		$pnfw_disable_email_verification = (bool)get_option('pnfw_disable_email_verification');
		$pnfw_uninstall_data = get_option('pnfw_uninstall_data');
		$pnfw_url_scheme = get_option("pnfw_url_scheme");
		$pnfw_force_badge_count = (bool)get_option('pnfw_force_badge_count');
		
		PNFW_Admin_Settings::print_ios_notices($pnfw_enable_push_notifications,
			$pnfw_ios_push_notifications,
			$pnfw_ios_use_sandbox,
			$pnfw_sandbox_ssl_certificate_media_id,
			$pnfw_sandbox_ssl_certificate_password,
			$pnfw_production_ssl_certificate_media_id,
			$pnfw_production_ssl_certificate_password);

		PNFW_Admin_Settings::print_android_notices($pnfw_enable_push_notifications,
			$pnfw_android_push_notifications,
			$pnfw_google_api_key);
			
		?>
		<div id="poststuff" class="metabox-holder has-right-sidebar">	
			<div class="has-sidebar sm-padded">
				<div class="meta-box-sortabless">
					<?php $active_tab = isset($_GET['tab']) ? $_GET['tab'] : 'general_tab'; ?>

					<h2 class="nav-tab-wrapper">
						<a href="?page=pnfw-settings-identifier&tab=general_tab" class="nav-tab <?php echo $active_tab == 'general_tab' ? 'nav-tab-active' : ''; ?>"><?php _e('General', 'push-notifications-for-wp'); ?></a>
						<a href="?page=pnfw-settings-identifier&tab=ios_tab" class="nav-tab <?php echo $active_tab == 'ios_tab' ? 'nav-tab-active' : ''; ?>"><?php _e('iOS', 'push-notifications-for-wp'); ?></a>
						<a href="?page=pnfw-settings-identifier&tab=android_tab" class="nav-tab <?php echo $active_tab == 'android_tab' ? 'nav-tab-active' : ''; ?>"><?php _e('Android', 'push-notifications-for-wp'); ?></a>
						<a href="?page=pnfw-settings-identifier&tab=safari_tab" class="nav-tab <?php echo $active_tab == 'safari_tab' ? 'nav-tab-active' : ''; ?>"><?php _e('Safari', 'push-notifications-for-wp'); ?></a>
						<a href="?page=pnfw-settings-identifier&tab=web_tab" class="nav-tab <?php echo $active_tab == 'web_tab' ? 'nav-tab-active' : ''; ?>"><?php _e('Web', 'push-notifications-for-wp'); ?></a>
						<a href="?page=pnfw-settings-identifier&tab=telegram_tab" class="nav-tab <?php echo $active_tab == 'telegram_tab' ? 'nav-tab-active' : ''; ?>"><?php _e('Telegram', 'push-notifications-for-wp'); ?></a>
						<a href="?page=pnfw-settings-identifier&tab=misc_tab" class="nav-tab <?php echo $active_tab == 'misc_tab' ? 'nav-tab-active' : ''; ?>"><?php _e('Misc', 'push-notifications-for-wp'); ?></a>
						<a href="?page=pnfw-settings-identifier&tab=documentation_tab" class="nav-tab <?php echo $active_tab == 'documentation_tab' ? 'nav-tab-active' : ''; ?>"><?php _e('Documentation', 'push-notifications-for-wp'); ?></a>
					</h2>

					<form action="" method="post">
						<?php if ($active_tab == 'general_tab') {
							PNFW_Admin_Settings::print_basic_options_box($pnfw_enable_push_notifications);
							$custom_post_types = array('post');
							if (count($custom_post_types) > 0) {
								PNFW_Admin_Settings::print_custom_post_types_box($custom_post_types,
									$enabled_post_types);
							}
							
							$object_taxonomies = get_object_taxonomies($custom_post_types, 'objects');
	
							if (count($object_taxonomies) > 0) {
								PNFW_Admin_Settings::print_categories_box($object_taxonomies, $enabled_object_taxonomies);
							}
							
							PNFW_Admin_Settings::print_save_button('issubmitted_general_tab');
						}
						else if ($active_tab == 'ios_tab') {
							PNFW_Admin_Settings::print_ios_box($pnfw_ios_push_notifications,
								$pnfw_ios_use_sandbox,
								$pnfw_sandbox_ssl_certificate_media_id,
								$pnfw_sandbox_ssl_certificate_password,
								$pnfw_production_ssl_certificate_media_id,
								$pnfw_production_ssl_certificate_password,
								$pnfw_ios_payload_sound);
							
							PNFW_Admin_Settings::print_save_button('issubmitted_ios_tab');
						}
						else if ($active_tab == 'android_tab') {	
							PNFW_Admin_Settings::print_android_box($pnfw_android_push_notifications, $pnfw_google_api_key);

							PNFW_Admin_Settings::print_android_advanced_box($pnfw_use_notification_message);

							PNFW_Admin_Settings::print_android_cordova_box($pnfw_add_message_field_in_payload);

							PNFW_Admin_Settings::print_save_button('issubmitted_android_tab');
						}
						else if ($active_tab == 'safari_tab') {	
							PNFW_Admin_Settings::print_upgrade_to_premium(__('Do you want to support Safari notifications?', 'push-notifications-for-wp'));
						}
						else if ($active_tab == 'web_tab') {	
							PNFW_Admin_Settings::print_upgrade_to_premium(__('Do you want to support Web Push (Chrome, Firefox, Edge, Opera and others) notifications?', 'push-notifications-for-wp'));
						}
						else if ($active_tab == 'telegram_tab') {
							PNFW_Admin_Settings::print_upgrade_to_premium(__('Do you want to support Telegram bot Push notifications?', 'push-notifications-for-wp'));
						}
						else if ($active_tab == 'misc_tab') {
							PNFW_Admin_Settings::print_misc_box($pnfw_use_wpautop,
								$pnfw_disable_email_verification,
								$pnfw_uninstall_data,
								$pnfw_force_badge_count);
							
							PNFW_Admin_Settings::print_schema_box($pnfw_url_scheme);
							
							PNFW_Admin_Settings::print_save_button('issubmitted_misc_tab');
						}
						else if ($active_tab == 'documentation_tab') {
							PNFW_Admin_Settings::print_resources_box();

							PNFW_Admin_Settings::print_about_box();
							PNFW_Admin_Settings::print_pnfw_box();
						} ?>
					</form>
				</div>
			</div>
		</div> <!-- poststuff -->
	</div> <!-- wrap -->
	<?php }
	
	private static function save_basic_options() {
		$pnfw_enable_push_notifications = (bool)pnfw_get_post('pnfw_enable_push_notifications');
		update_option('pnfw_enable_push_notifications', $pnfw_enable_push_notifications);
		
		$enabled_post_types = pnfw_get_post('pnfw_enabled_post_types', array());
		update_option('pnfw_enabled_post_types', $enabled_post_types);
		
		$enabled_object_taxonomies = pnfw_get_post('pnfw_enabled_object_taxonomies', array());
		update_option('pnfw_enabled_object_taxonomies', $enabled_object_taxonomies);
	}
	
	private static function save_ios_options() {
		$pnfw_ios_push_notifications = (bool)pnfw_get_post('pnfw_ios_push_notifications');
		update_option('pnfw_ios_push_notifications', $pnfw_ios_push_notifications);
		global $feedback_provider;
		if ($pnfw_ios_push_notifications
		) {
			$feedback_provider->run();
		}
		else {
			$feedback_provider->stop();
		}

		$pnfw_ios_use_sandbox = (bool)pnfw_get_post('pnfw_ios_use_sandbox');
		update_option('pnfw_ios_use_sandbox', $pnfw_ios_use_sandbox);

		$pnfw_sandbox_ssl_certificate_media_id = pnfw_get_post('pnfw_sandbox_ssl_certificate_media_id');
		update_option('pnfw_sandbox_ssl_certificate_media_id', $pnfw_sandbox_ssl_certificate_media_id);
		
		$pnfw_sandbox_ssl_certificate_password = pnfw_get_post('pnfw_sandbox_ssl_certificate_password');
		update_option('pnfw_sandbox_ssl_certificate_password', $pnfw_sandbox_ssl_certificate_password);

		$pnfw_production_ssl_certificate_media_id = pnfw_get_post('pnfw_production_ssl_certificate_media_id');
		update_option('pnfw_production_ssl_certificate_media_id', $pnfw_production_ssl_certificate_media_id);
		
		$pnfw_production_ssl_certificate_password = pnfw_get_post('pnfw_production_ssl_certificate_password');
		update_option('pnfw_production_ssl_certificate_password', $pnfw_production_ssl_certificate_password);

		$pnfw_ios_payload_sound = pnfw_get_post('pnfw_ios_payload_sound');
		
		if (!empty($pnfw_ios_payload_sound)) {
			update_option('pnfw_ios_payload_sound', $pnfw_ios_payload_sound);
		}
		else {
			update_option('pnfw_ios_payload_sound', 'default');
		}
	}

	private static function save_android_options() {
		$pnfw_android_push_notifications = (bool)pnfw_get_post('pnfw_android_push_notifications');
		update_option('pnfw_android_push_notifications', $pnfw_android_push_notifications);

		$pnfw_google_api_key = pnfw_get_post('pnfw_google_api_key');
		update_option('pnfw_google_api_key', $pnfw_google_api_key);

		$pnfw_use_notification_message = (bool)pnfw_get_post('pnfw_use_notification_message');
		update_option('pnfw_use_notification_message', $pnfw_use_notification_message);

		$pnfw_add_message_field_in_payload = (bool)pnfw_get_post('pnfw_add_message_field_in_payload');
		update_option('pnfw_add_message_field_in_payload', $pnfw_add_message_field_in_payload);
	}
	
	
	private static function save_misc_options() {
		$pnfw_use_wpautop = (bool)pnfw_get_post('pnfw_use_wpautop');
		update_option('pnfw_use_wpautop', $pnfw_use_wpautop);

		$pnfw_disable_email_verification = (bool)pnfw_get_post('pnfw_disable_email_verification');
		update_option('pnfw_disable_email_verification', $pnfw_disable_email_verification);

		$pnfw_uninstall_data = (bool)pnfw_get_post('pnfw_uninstall_data');
		update_option('pnfw_uninstall_data', $pnfw_uninstall_data);

		$pnfw_force_badge_count = (bool)pnfw_get_post('pnfw_force_badge_count');
		update_option('pnfw_force_badge_count', $pnfw_force_badge_count);

		$pnfw_url_scheme = pnfw_get_post('pnfw_url_scheme');
		update_option('pnfw_url_scheme', $pnfw_url_scheme);
	}
	
	private static function print_upgrade_to_premium($text) { ?>
		<div style="color:#999;">
			<?php echo $text; ?>
			<a href="https://products.delitestudio.com/wordpress/push-notifications-for-wordpress/">
				<?php _e('Upgrade now to Push Notifications for WordPress', 'push-notifications-for-wp'); ?> &rarr;	
			</a>
		</div>
	<?php }
		
	private static function print_basic_options_box($pnfw_enable_push_notifications) { ?>
		<!-- postbox -->
		<div class="postbox">
			<div class="inside">
				<p>
					<input type="checkbox" name="pnfw_enable_push_notifications" id="pnfw_enable_push_notifications" <?php checked((bool)$pnfw_enable_push_notifications) ?> />
					<label for="pnfw_enable_push_notifications"><?php _e('Send push notifications', 'push-notifications-for-wp'); ?></label>
				</p>
			</div>
		</div>
		<!-- //-postbox -->
	<?php }
	
	private static function print_custom_post_types_box($custom_post_types, $enabled_post_types) { ?>
		<!-- postbox -->
		<div class="postbox">
			<h3 class="hndle">
				<span><?php _e('Send Push Notifications for', 'push-notifications-for-wp'); ?></span>
			</h3>
			<div class="inside">
				<table class="form-table">
					<tr valign="top">
						<td><?php
							foreach ($custom_post_types as $post_type) {
								$post_type_object = get_post_type_object($post_type);
								$checked = is_array($enabled_post_types) ? in_array($post_type_object->name, $enabled_post_types) : false;
							?>
						
								<input type="checkbox" name="pnfw_enabled_post_types[]" id="pnfw_enabled_post_types[]" value="<?php echo $post_type_object->name; ?>" <?php checked($checked) ?> /> <label for="pnfw_enabled_post_types[]"><?php echo $post_type_object->label; ?></label><br />
							
							<?php } ?>
						</td>
					</tr>
				</table>
				<?php PNFW_Admin_Settings::print_upgrade_to_premium(__('Do you want to support custom post types?', 'push-notifications-for-wp')); ?>

			</div>
		</div>
		<!-- //-postbox -->
	<?php }
		
	private static function	print_categories_box($object_taxonomies, $enabled_object_taxonomies) { ?>
		<!-- postbox -->
		<div class="postbox">
			<h3 class="hndle">
				<span><?php _e('Categories Filterable by App Subscribers', 'push-notifications-for-wp'); ?></span>
			</h3>
			<div class="inside">
				<table class="form-table">
					<tr valign="top">
						<td><?php
							foreach ($object_taxonomies as $object_taxonomy) {
								$checked = is_array($enabled_object_taxonomies) ? in_array($object_taxonomy->name, $enabled_object_taxonomies) : false;
							?>
								
								<input type="checkbox" name="pnfw_enabled_object_taxonomies[]" id="pnfw_enabled_object_taxonomies[]" value="<?php echo $object_taxonomy->name; ?>" <?php checked($checked) ?> /> <label for="pnfw_enabled_object_taxonomies[]"><?php echo sprintf('%s (%s)', $object_taxonomy->label, $object_taxonomy->name); ?></label><br />
							
							<?php } ?>
						</td>
					</tr>
				</table>
			</div>
		</div>
		<!-- //-postbox -->
	<?php }
			
	private static function print_ios_box($pnfw_ios_push_notifications,
		$pnfw_ios_use_sandbox,
		$pnfw_sandbox_ssl_certificate_media_id,
		$pnfw_sandbox_ssl_certificate_password,
		$pnfw_production_ssl_certificate_media_id,
		$pnfw_production_ssl_certificate_password,
		$pnfw_ios_payload_sound) { ?>
		<!-- postbox -->
		<div class="postbox">
			<div class="inside">
				<p>
					<input type="checkbox" name="pnfw_ios_push_notifications" id="pnfw_ios_push_notifications" <?php checked((bool)$pnfw_ios_push_notifications) ?> /> <label for="pnfw_ios_push_notifications"><?php _e('Send push notifications to iOS devices', 'push-notifications-for-wp'); ?></label>
				</p>
				
				<p>
					<?php PNFW_Admin_Settings::print_upgrade_to_premium(__('Do you want to support HTTP/2-based Apple Push Notification service (APNs)?', 'push-notifications-for-wp')); ?>
				</p>
				
				<p>
					<input type="checkbox" name="pnfw_ios_use_sandbox" id="pnfw_ios_use_sandbox" <?php checked((bool)$pnfw_ios_use_sandbox) ?> /> <label for="pnfw_ios_use_sandbox"><?php _e('Use sandbox environment', 'push-notifications-for-wp'); ?></label>
				</p>
				
				<table class="form-table">
					<tr valign="top">
						<th scope="row">
							<labe><?php _e('Sandbox SSL certificate (.pem)', 'push-notifications-for-wp'); ?></label>
						</th>
						<td>
							<label for='upload_image_button' class='uploader' id='pnfw_sandbox_ssl_certificate_media_id'>
								<input name="pnfw_sandbox_ssl_certificate_media_id" type="hidden" value="<?php echo $pnfw_sandbox_ssl_certificate_media_id; ?>"/>
								<input class="button upload" type="button" name="upload_image_button" id="upload_image_button" value="<?php if (!$pnfw_sandbox_ssl_certificate_media_id) { _e('Upload', 'push-notifications-for-wp'); } else { _e('Change', 'push-notifications-for-wp'); } ?>" />
							</label>
						</td>
					</tr>
					
					<?php $sandbox_certificate_expiration = PNFW_Admin_Settings::expiration_date($pnfw_sandbox_ssl_certificate_media_id);
					
					if (!empty($sandbox_certificate_expiration)) { ?>
						<tr valign="top">
							<th scope="row">
								<labe><?php _e('Expires', 'push-notifications-for-wp'); ?></label>
							</th>
							<td><?php echo $sandbox_certificate_expiration; ?></td>
						</tr>
					<?php } ?>
					
					<tr valign="top">
						<th scope="row">
							<label for="pnfw_sandbox_ssl_certificate_password"><?php _e('Certificate Password', 'push-notifications-for-wp'); ?></label>
						</th>
						<td>
							<input type="password" class="regular-text" name="pnfw_sandbox_ssl_certificate_password" id="pnfw_sandbox_ssl_certificate_password" value="<?php echo $pnfw_sandbox_ssl_certificate_password; ?>" maxlength="255" />
						</td>
					</tr>
					
					<tr valign="top">
						<th scope="row">
							<label><?php _e('Production SSL certificate (.pem)', 'push-notifications-for-wp'); ?></label>
						</th>
						<td>
							<label for='upload_image_button' class='uploader' id='pnfw_production_ssl_certificate_media_id'>
								<input name="pnfw_production_ssl_certificate_media_id" type="hidden" value="<?php echo $pnfw_production_ssl_certificate_media_id; ?>"/>
								<input class="button upload" type="button" name="upload_image_button" id="upload_image_button" value="<?php if (!$pnfw_production_ssl_certificate_media_id) { _e('Upload', 'push-notifications-for-wp'); } else { _e('Change', 'push-notifications-for-wp'); } ?>" />
							</label>
						</td>
					</tr>
					
					<?php $production_certificate_expiration = PNFW_Admin_Settings::expiration_date($pnfw_production_ssl_certificate_media_id);
					
					if (!empty($production_certificate_expiration)) { ?>
						<tr valign="top">
							<th scope="row">
								<labe><?php _e('Expires', 'push-notifications-for-wp'); ?></label>
							</th>
							<td><?php echo $production_certificate_expiration; ?></td>
						</tr>
					<?php } ?>
					
					<tr valign="top">
						<th scope="row">
							<label for="pnfw_production_ssl_certificate_password"><?php _e('Certificate Password', 'push-notifications-for-wp'); ?></label>
						</th>
						<td>
							<input type="password" class="regular-text" name="pnfw_production_ssl_certificate_password" id="pnfw_production_ssl_certificate_password" value="<?php echo $pnfw_production_ssl_certificate_password; ?>" maxlength="255" />
						
							<p><a href="https://products.delitestudio.com/wordpress/push-notifications-for-wordpress/configuring-ios-push-notifications/" target="_blank"><?php _e('Obtaining the SSL Certificates', 'push-notifications-for-wp'); ?></a></p>
						</td>
					</tr>
					<tr valign="top">
						<th scope="row">
							<label for="pnfw_ios_payload_sound"><?php _e('Notification sound file', 'push-notifications-for-wp'); ?></label>
						</th>
						<td>
							<input type="text" class="regular-text" name="pnfw_ios_payload_sound" id="pnfw_ios_payload_sound" value="<?php echo $pnfw_ios_payload_sound; ?>" maxlength="255" placeholder="bingbong.aiff" />
							<br/><span class="description"><?php echo sprintf(__('The name of a sound file in the app bundle or in the <code>Library/Sounds</code> folder of the app’s data container. If the sound file doesn’t exist or <code>default</code> is specified as the value, the default alert sound is played. The audio must be in one of the audio data formats that are compatible with system sounds (<code>aiff</code>, <code>wav</code>, or <code>caf</code>). See <a href="%s">Preparing Custom Alert Sounds</a> for details.', 'push-notifications-for-wp'), 'https://developer.apple.com/library/ios/documentation/NetworkingInternet/Conceptual/RemoteNotificationsPG/Chapters/IPhoneOSClientImp.html#//apple_ref/doc/uid/TP40008194-CH103-SW6'); ?></span>
						</td>
					</tr>
				</table>
			</div>
		</div>
		<!-- //-postbox -->
	<?php }
		
	private static function print_schema_box($pnfw_url_scheme) { ?>
		<!-- postbox -->
		<div class="postbox">
			<h3 class="hndle">
				<span><?php _e('URL Scheme', 'push-notifications-for-wp'); ?></span>
			</h3>
			<div class="inside">
				<input name="pnfw_url_scheme" id="pnfw_url_scheme" type="text" style="" value="<?php echo $pnfw_url_scheme; ?>" class="regular-text" placeholder="my-app-scheme://">
				
				<br/><span class="description"><?php _e('When a user registers on this site, he will receive a confirmation email with a verification link. If you have filled in the URL Scheme, after a successful verification from a mobile device the user will be redirected to the URL indicated.', 'push-notifications-for-wp'); ?></span>
			</div>
		</div>
		<!-- //-postbox -->
	<?php }

	private static function print_android_box($pnfw_android_push_notifications, $pnfw_google_api_key) { ?>
		<!-- postbox -->
		<div class="postbox">
			<div class="inside">
				<p>
					<input type="checkbox" name="pnfw_android_push_notifications" id="pnfw_android_push_notifications" <?php checked((bool)$pnfw_android_push_notifications) ?> /> <label for="pnfw_android_push_notifications"><?php _e('Send push notifications to Android devices', 'push-notifications-for-wp'); ?></label>
				</p>
				
				<table class="form-table">
					<tr valign="top">
						<th scope="row">
							<label for="pnfw_google_api_key"><?php _e('Server Key', 'push-notifications-for-wp'); ?></label>
						</th>
						<td>
							<input type="text" class="textfield" name="pnfw_google_api_key" id="pnfw_google_api_key" value="<?php echo $pnfw_google_api_key; ?>" maxlength="255" />
						</td>
					</tr>
				</table>

				<p><a href="https://products.delitestudio.com/wordpress/push-notifications-for-wordpress/configuring-android-push-notifications/" target="_blank"><?php _e('Obtaining the Server Key', 'push-notifications-for-wp'); ?></a></p>
			</div>
		</div>
		<!-- //-postbox -->
	<?php }

	private static function print_android_cordova_box($pnfw_add_message_field_in_payload) { ?>
		<!-- postbox -->
		<div class="postbox">
			<div class="inside">
				<h3 class="hndle">
					<span><?php _e('Apache Cordova', 'push-notifications-for-wp'); ?></span>
				</h3>
				
				<p>
					<input type="checkbox" name="pnfw_add_message_field_in_payload" id="pnfw_add_message_field_in_payload" <?php checked((bool)$pnfw_add_message_field_in_payload) ?> />
					<label for="pnfw_add_message_field_in_payload"><?php _e('In the Android notification payload add the <code>message</code> field', 'push-notifications-for-wp'); ?></label>
				</p>
				
				<br/><span class="description"><?php _e('Check this box if you are using Apache Cordova with PushPlugin. If you enable this option, it will always be sent Data message regardless of what you selected above.', 'push-notifications-for-wp'); ?></span>
			</div>
		</div>
		<!-- //-postbox -->
	<?php }
		
	private static function print_android_advanced_box($pnfw_use_notification_message) { ?>
		<!-- postbox -->
		<div class="postbox">
			<div class="inside">
				<h3 class="hndle">
					<span><?php _e('Firebase', 'push-notifications-for-wp'); ?></span>
				</h3>
				
				<p>
					<input type="checkbox" name="pnfw_use_notification_message" id="pnfw_use_notification_message" <?php checked((bool)$pnfw_use_notification_message) ?> />
					<label for="pnfw_use_notification_message"><?php _e('Use the <em>Notification message</em> instead of the <em>Data message</em>', 'push-notifications-for-wp'); ?></label>
				</p>
				
				<br/><span class="description"><?php _e('With the Notification message FCM automatically displays the message to end-user devices on behalf of the client app. With the Data message client app is responsible for processing data messages. More info in the <a href="https://firebase.google.com/docs/cloud-messaging/concept-options">official FCM documentation</a>.', 'push-notifications-for-wp'); ?></span>
			</div>
		</div>
		<!-- //-postbox -->
	<?php }

	
	private static function print_misc_box($pnfw_use_wpautop, $pnfw_disable_email_verification, $pnfw_uninstall_data, $pnfw_force_badge_count) { ?>
		<!-- postbox -->
		<div class="postbox">
			<div class="inside">
				<p>
					<input type="checkbox" name="pnfw_use_wpautop" id="pnfw_use_wpautop" <?php checked((bool)$pnfw_use_wpautop) ?> />
					<label for="pnfw_use_wpautop"><?php _e('Enable wpautop filter to convert double line-breaks in the content into HTML paragraphs', 'push-notifications-for-wp'); ?></label>
				</p>
				
				<p>
					<input type="checkbox" name="pnfw_force_badge_count" id="pnfw_force_badge_count" <?php checked((bool)$pnfw_force_badge_count) ?> />
					<label for="pnfw_force_badge_count"><?php _e('Force badge count to 1', 'push-notifications-for-wp'); ?></label>
				</p>
				
				<p>
					<input type="checkbox" name="pnfw_disable_email_verification" id="pnfw_disable_email_verification" <?php checked((bool)$pnfw_disable_email_verification) ?> />
					<label for="pnfw_disable_email_verification"><?php _e('Don\'t require email verification', 'push-notifications-for-wp'); ?></label>
				</p>
				
				<br/><span class="description"><?php _e('Check this box if you do not require devices to be activated only after confirmation of the email address (use with caution).', 'push-notifications-for-wp'); ?></span>
				
				<p>
					<input type="checkbox" name="pnfw_uninstall_data" id="pnfw_uninstall_data" <?php checked((bool)$pnfw_uninstall_data) ?> />
					<label for="pnfw_uninstall_data"><?php _e('Remove data on uninstall', 'push-notifications-for-wp'); ?></label>
				</p>
				
				<br/><span class="description"><?php _e('Check this box if you would like to completely remove all of its data when the plugin is deleted.', 'push-notifications-for-wp'); ?></span>
			</div>
		</div>
		<!-- //-postbox -->
	<?php }
		

				
	private static function print_resources_box() { ?>
		<!-- postbox -->
		<div class="postbox">
			<div class="inside">
				<a href="https://products.delitestudio.com/wordpress/push-notifications-for-wordpress/documentation/"><?php _e('See the online documentation', 'push-notifications-for-wp'); ?></a>
			</div>
			<div class="inside">
				
			</div>
		</div>
		<!-- //-postbox -->
	<?php }
		
	private static function print_about_box() { ?>
		<!-- postbox -->
		<div class="postbox">
			<h3 class="hndle"><span><?php _e('About this Plugin', 'push-notifications-for-wp'); ?></span></h3>
						
			<div class="inside">
				<a href="https://www.delitestudio.com/?utm_source=push-notifications-for-wordpress&utm_medium=link&utm_campaign=cross-marketing"><?php _e('Developed by', 'push-notifications-for-wp'); ?> Delite Studio S.r.l.</a>
			</div>
		</div>
		<!-- //-postbox -->

	<?php }
		
	private static function print_pnfw_box() { ?>
		<!-- postbox -->
		<div class="postbox">
			<h3 class="hndle"><span><?php _e('Push Notifications for WordPress', 'push-notifications-for-wp'); ?></span></h3>
			
			<div class="inside">
				<?php _e('This is our basic solution for small personal blogs. We also offer a full-featured plugin, Push Notifications for WordPress, designed for all the other websites.', 'push-notifications-for-wp'); ?>
				<ul>
					<li><a href="https://products.delitestudio.com/wordpress/push-notifications-for-wordpress/?utm_source=push-notifications-for-posts&utm_medium=link&utm_campaign=cross-marketing"><?php _e('More info', 'push-notifications-for-wp'); ?></a></li>
					<li><a href="https://products.delitestudio.com/wordpress/push-notifications-for-wordpress/what-are-the-differences-between-push-notifications-for-wordpress-and-push-notifications-for-posts/?utm_source=push-notifications-for-posts&utm_medium=link&utm_campaign=cross-marketing"><?php _e('Differences', 'push-notifications-for-wp'); ?></a></li>
				</ul>
			</div>
		</div>
		<!-- //-postbox -->
	<?php }

	private static function print_save_button($name) { ?>
		<p class="submit">
			<input name="<?php echo $name; ?>" type="hidden" value="yes" />
			<input class="button button-primary" type="submit" name="pnfw_save_settings_button" value="<?php _e('Save settings', 'push-notifications-for-wp'); ?>"> 
		</p>
	<?php }
		
	private static function print_ios_notices($pnfw_enable_push_notifications,
		$pnfw_ios_push_notifications,
		$pnfw_ios_use_sandbox,
		$pnfw_sandbox_ssl_certificate_media_id,
		$pnfw_sandbox_ssl_certificate_password,
		$pnfw_production_ssl_certificate_media_id,
		$pnfw_production_ssl_certificate_password) {

		if ($pnfw_enable_push_notifications && $pnfw_ios_push_notifications) {
				if ($pnfw_ios_use_sandbox) {
					if (!$pnfw_sandbox_ssl_certificate_media_id) { ?>
						<div id="message" class="error"><p><?php _e('Missing sandbox SSL certificate', 'push-notifications-for-wp'); ?></p></div>
					<?php }
					else if ('application/x-pem-file' != get_post_mime_type($pnfw_sandbox_ssl_certificate_media_id)) { ?>
						<div id="message" class="error"><p><?php _e('Sandbox SSL certificate should be a PEM file', 'push-notifications-for-wp'); ?></p></div>
					<?php }
					
					if (!$pnfw_sandbox_ssl_certificate_password) { ?>
						<div id="message" class="error"><p><?php _e('Missing sandbox certificate password', 'push-notifications-for-wp'); ?></p></div>
					<?php }
				}
				else {
					if (!$pnfw_production_ssl_certificate_media_id) { ?>
						<div id="message" class="error"><p><?php _e('Missing production SSL certificate', 'push-notifications-for-wp'); ?></p></div>
					<?php }
					else if ('application/x-pem-file' != get_post_mime_type($pnfw_production_ssl_certificate_media_id)) { ?>
						<div id="message" class="error"><p><?php _e('Production SSL certificate should be a PEM file', 'push-notifications-for-wp'); ?></p></div>
					<?php }
						
					if (!$pnfw_production_ssl_certificate_password) { ?>
						<div id="message" class="error"><p><?php _e('Missing production certificate password', 'push-notifications-for-wp'); ?></p></div>
					<?php }
				}
		}
	}
	
	private static function print_android_notices($pnfw_enable_push_notifications,
		$pnfw_android_push_notifications,
		$pnfw_google_api_key) {
		
		if ($pnfw_enable_push_notifications && $pnfw_android_push_notifications) {
			if (!$pnfw_google_api_key) { ?>
				<div id="message" class="error"><p><?php _e('Missing Server Key', 'push-notifications-for-wp'); ?></p></div>
			<?php }
		}
	}

	
	
	private static function check_image_mime_and_size($image_media_id, $expected_mime, $expected_width, $expected_height) {
		$mime = get_post_mime_type($image_media_id);

		if ('image/png' != $mime) {
			return false;
		}
		
		$metadata = wp_get_attachment_metadata($image_media_id);
			
		return ($metadata['width'] == $expected_width && $metadata['height'] == $expected_height);
	}
	
	private static function expiration_date($media_id) {
		if (!function_exists('openssl_x509_parse'))
			return '';
			
		$file_path = get_attached_file($media_id);
		
		if (!file_exists($file_path))
			return '';
			
		$certificate = file_get_contents($file_path);
		$parsed = openssl_x509_parse($certificate);
		$expires = $parsed['validTo_time_t'];
		
		if (!isset($expires))
			return '';

		$gmt_offset = get_option('gmt_offset');
		$date_format = get_option('date_format');
		$time_format = get_option('time_format');
		$tz_format = sprintf('%s %s', $date_format, $time_format);
    
		$human_readable_date = date_i18n($tz_format, $expires);
		
		return $human_readable_date;
	}
}