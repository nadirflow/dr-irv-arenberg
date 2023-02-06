<?php

if (!defined('ABSPATH')) {
	exit; // Exit if accessed directly
}

class PNFW_Sender_Process extends WP_Background_Process {

	protected $action = 'pnfw_background_process';

	protected function task( $item ) {
		$log_type = pnfw_log_type($item['os']);
		
		$send = true;
		$post = get_post($item['post']);

		if (is_null($post)) {
			pnfw_log($log_type, sprintf(__('Post %d has been deleted, abort sending process.', 'push-notifications-for-wp'), $item['post']));
			return false;
		}
		
		if ($item['is_first']) {
			pnfw_log($log_type, sprintf(__('Starting %s notifications', 'push-notifications-for-wp'), $item['os']));
		}
		
		if ($send) {
			$sender = NULL;
			$total = 0;
			
			switch ($item['os']) {
				case 'iOS':
					if (get_option('pnfw_ios_push_notifications')) {
						require_once dirname(__FILE__) . '/notifications/class-pnfw-post-notifications-ios.php';
			
						$sender = new PNFW_Post_Notifications_iOS();
						$result = $sender->send_chunk($post, $item['offset']);
						$total = $result['total'];
					}
					else {
						pnfw_log($log_type, sprintf(__('Do not send %s notifications', 'push-notifications-for-wp'), $item['os']));
					}
					break;
				case 'Android':
					if (get_option('pnfw_android_push_notifications')) {
						require_once dirname(__FILE__) . '/notifications/class-pnfw-post-notifications-android.php';
			
						$sender = new PNFW_Post_Notifications_Android();
						$result = $sender->send_chunk($post, $item['offset']);
						$total = $result['total'];
					}
					else {
						pnfw_log($log_type, sprintf(__('Do not send %s notifications', 'push-notifications-for-wp'), $item['os']));
					}
					break;
				default:
					break;
			}
			if ($total > 0) {
				$item['offset'] = $sender->get_offset();
				$item['is_first'] = false;
				return $item;
			}
		}
		else {
			pnfw_log($log_type, sprintf(__('Do not send %s notifications', 'push-notifications-for-wp'), $item['os']));
		}
		
		pnfw_log($log_type, sprintf(__('Finished %s notifications', 'push-notifications-for-wp'), $item['os']));
		
		$next_os = $this->get_next_os($item['os']);
		
		if (is_null($next_os)) {
			return false;
		}
		
		$item['os'] = $next_os;
		$item['offset'] = 0;
		$item['is_first'] = true;
		return $item;
	}


	function get_next_os($os) {
		switch ($os) {
			case 'iOS': return 'Android';
			case 'Android': return NULL;
		}
	}
}