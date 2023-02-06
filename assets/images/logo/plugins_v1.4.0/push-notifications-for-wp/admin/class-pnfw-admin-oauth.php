<?php
	
if (!defined('ABSPATH')) {
	exit; // Exit if accessed directly
}
	
class PNFW_Admin_OAuth {
	public static function output() {
		if (isset($_POST['issubmitted']) && $_POST['issubmitted'] == 'yes') {
			$pnfw_generate_api_key = isset($_POST['pnfw_generate_api_key']) ? $_POST['pnfw_generate_api_key'] : 1;
			
			if (isset($pnfw_generate_api_key) && $pnfw_generate_api_key == 0) {
				PNFW_Admin_OAuth::generate_api_key();
			}
			
			$pnfw_revoke_api_key = isset($_POST['pnfw_revoke_api_key']) ? $_POST['pnfw_revoke_api_key'] : 1;
			
			if (isset($pnfw_revoke_api_key) && $pnfw_revoke_api_key == 0) {
				PNFW_Admin_OAuth::revoke_api_key();
			}
			
			$pnfw_api_oauth_relax = (bool)pnfw_get_post('pnfw_api_oauth_relax');
			update_option('pnfw_api_oauth_relax', $pnfw_api_oauth_relax);
		}
		
		$pnfw_api_consumer_key = get_option('pnfw_api_consumer_key');
		$pnfw_api_consumer_secret = get_option('pnfw_api_consumer_secret');
		$pnfw_api_oauth_relax = get_option('pnfw_api_oauth_relax');
	
		?>
		<div class="wrap">
			<div id="icon-options-general" class="icon32"></div>
			<h2><?php _e('OAuth', 'push-notifications-for-wp'); ?></h2>
			
			<div id="poststuff" class="metabox-holder">
				<div class="sm-padded">
					<div id="post-body-content">
						<div class="meta-box-sortabless">
							<form action="" method="post">
								<div class="postbox">
									<h3 class="hndle">
										<span><?php _e('API Keys', 'push-notifications-for-wp'); ?></span>
									</h3>
						
									<div class="inside">
										<?php if (empty($pnfw_api_consumer_key)) : ?>
										<div id="message" class="error"><p><?php _e('OAuth is disabled. Anyone can connect to the APIs without authorization. For better security we recommend to enable OAuth (requires changes to client).', 'push-notifications-for-wp'); ?></p></div>
											<input name="pnfw_generate_api_key" type="hidden" id="pnfw_generate_api_key" value="0" />
											<p class="submit">
												<input name="issubmitted" type="hidden" value="yes" />
												<input class="button button-primary" type="submit" name="pnfw_save_settings_button" value="<?php _e('Enable OAuth & Generate API Keys', 'push-notifications-for-wp'); ?>" /> 
											</p>
										<?php else : ?>
											<strong><?php _e('Consumer Key:', 'push-notifications-for-wp'); ?>&nbsp;</strong><code id="pnfw_api_consumer_key"><?php echo $pnfw_api_consumer_key ?></code><br/>
											<strong><?php _e('Consumer Secret:', 'push-notifications-for-wp'); ?>&nbsp;</strong><code id="pnfw_api_consumer_secret"><?php echo $pnfw_api_consumer_secret; ?></code><br/>
											
											<input name="pnfw_revoke_api_key" type="hidden" id="pnfw_revoke_api_key" value="0" />
											
											<p class="submit">
												<input name="issubmitted" type="hidden" value="yes" />
												<input class="button button-secondary" type="submit" name="pnfw_save_settings_button" value="<?php _e('Disable OAuth & Revoke Keys', 'push-notifications-for-wp'); ?>" /> 
											</p>
											
											<span><?php _e('IMPORTANT: After revoking the API Keys clients who used them will no longer be able to connect.', 'push-notifications-for-wp'); ?></span>
										<?php endif; ?>
									</div> <!-- inside -->
								</div> <!-- postbox -->
							</form>
						</div>
					</div>
				</div>
			</div>
			
			<?php if (!empty($pnfw_api_consumer_key)) : ?>
				<div id="poststuff" class="metabox-holder">
					<div class="sm-padded">
						<div id="post-body-content">
							<div class="meta-box-sortabless">
								<form action="" method="post">
									<div class="postbox">
										<h3 class="hndle">
											<span><?php _e('HTTP/HTTPS', 'push-notifications-for-wp'); ?></span>
										</h3>
							
										<div class="inside">
											<p>
												<input type="checkbox" name="pnfw_api_oauth_relax" id="pnfw_api_oauth_relax" <?php checked((bool)$pnfw_api_oauth_relax) ?> />
												<label for="pnfw_api_oauth_relax"><?php _e('Accept both HTTP and HTTPS requests', 'push-notifications-for-wp'); ?></label>
											</p>
											
											<p class="submit">
												<input name="issubmitted" type="hidden" value="yes" />
												<input class="button button-primary" type="submit" name="pnfw_save_settings_button" value="<?php _e('Save settings', 'push-notifications-for-wp'); ?>" /> 
											</p>
										</div> <!-- inside -->
									</div> <!-- postbox -->
								</form>
							</div>
						</div>
					</div>
				</div>
			<?php endif; ?>
		</div>
	<?php }
	
	private static function generate_api_key() {
		$pnfw_api_consumer_key = 'ck_' . hash('md5', date('U') . mt_rand());
	
		update_option("pnfw_api_consumer_key", $pnfw_api_consumer_key);
		$pnfw_api_consumer_secret = 'cs_' . hash('md5', date('U') . mt_rand());
	
		update_option("pnfw_api_consumer_secret", $pnfw_api_consumer_secret);
	}
	
	private static function revoke_api_key() {
		delete_option("pnfw_api_consumer_key");
		delete_option("pnfw_api_consumer_secret");
	}
}