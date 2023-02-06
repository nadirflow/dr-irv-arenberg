<?php
	
if (!defined('ABSPATH')) {
	exit; // Exit if accessed directly
}

class PNFW_Admin_Stats {
	public static function output() { ?>
		<div class="wrap">
			<div id="icon-options-general" class="icon32"></div>
			<h2><?php _e('Stats', 'push-notifications-for-wp'); ?></h2>
			<div class="updated" style="margin-top:20px;padding:5px;position:relative;">
				<h3><?php _e('Do you want to see the stats?', 'push-notifications-for-wp'); ?></h3>
				<a href="https://products.delitestudio.com/wordpress/push-notifications-for-wordpress/">
					<p><?php _e('Upgrade now to Push Notifications for WordPress', 'push-notifications-for-wp'); ?> &rarr;</p>
				</a>
			</div>
		</div>
	<?php }
}