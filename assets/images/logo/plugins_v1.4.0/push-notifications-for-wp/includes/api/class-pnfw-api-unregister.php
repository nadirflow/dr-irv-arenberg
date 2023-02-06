<?php

require_once dirname(__FILE__ ) . '/class-pnfw-api-registered.php';

class PNFW_API_Unregister extends PNFW_API_Registered {

	public function __construct() {
		parent::__construct(home_url('pnfw/unregister/'), 'POST');
		
		$user_id = PNFW_DB()->get_user_id($this->token, $this->os);
	
		$res = PNFW_DB()->delete_token($this->token, $this->os);
		
		if ($res === false) {
			$this->json_error('500', __('Unable to delete token', 'push-notifications-for-wp'));
		}
		
		$user = new WP_User($user_id);
		
		if (in_array(PNFW_Push_Notifications_for_WordPress_Lite::USER_ROLE, $user->roles) && empty($user->user_email)) {
			pnfw_log(PNFW_SYSTEM_LOG, sprintf(__("Automatically deleted the anonymous user %s (%s) since left without tokens.", 'push-notifications-for-wp'), $user->user_login, $user_id));
			if (is_multisite()) {
				if (is_user_member_of_blog($user_id)) {
					require_once(ABSPATH . 'wp-admin/includes/ms.php');
					wpmu_delete_user($user_id);
				}
			}
			else {
				require_once(ABSPATH . 'wp-admin/includes/user.php');
				wp_delete_user($user_id);
			}
		}
		
		exit;
	}
}