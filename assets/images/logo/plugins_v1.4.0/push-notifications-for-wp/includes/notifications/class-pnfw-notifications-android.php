<?php
	
if (!defined('ABSPATH')) {
	exit; // Exit if accessed directly
}

require_once dirname(__FILE__ ) . '/class-pnfw-notifications.php';

class PNFW_Notifications_Android extends PNFW_Notifications {

	public function __construct() {
		parent::__construct('Android');
	}
	
	protected function raw_send($tokens, $title, $user_info) {
		// No devices, do nothing
		if (empty($tokens)) {
			return 0;
		}
		
		require_once(dirname(__FILE__) . '/../../libs/PHP_GCM/Message.php');
		require_once(dirname(__FILE__) . '/../../libs/PHP_GCM/Sender.php');
		require_once(dirname(__FILE__) . '/../../libs/PHP_GCM/Result.php');
		require_once(dirname(__FILE__) . '/../../libs/PHP_GCM/MulticastResult.php');
		require_once(dirname(__FILE__) . '/../../libs/PHP_GCM/Constants.php');
		require_once(dirname(__FILE__) . '/../../libs/PHP_GCM/InvalidRequestException.php');
	
		$api_key = get_option('pnfw_google_api_key');
		if (empty($api_key)) {
			pnfw_log(PNFW_ANDROID_LOG, __('Google API Key is not correctly set.', 'push-notifications-for-wp'));
			return 0;
		}
		
		$pnfw_add_message_field_in_payload = (bool)get_option('pnfw_add_message_field_in_payload');
		
		if ($pnfw_add_message_field_in_payload) {
			$payload_notification = array();
			$payload_data = array_merge(array('title' => pnfw_get_blogname(), 'message' => $title), $user_info);
		}
		else {
			$pnfw_use_notification_message = (bool)get_option('pnfw_use_notification_message');
			
			if ($pnfw_use_notification_message) {
				$payload_notification = array('title' => $title, 'icon' => 'ic_notification', 'sound' => 'default');
				$payload_data = $user_info;
			}
			else {
				$payload_notification = array();
				$payload_data = array_merge(array('title' => $title), $user_info);
			}
		}
		
		$sender = new PHP_GCM\Sender($api_key);
		$message = new PHP_GCM\Message('push', $payload_data);
		$message->notification($payload_notification);
		
		$max_bulk_size = 999;
		$chunks = array_chunk($tokens, $max_bulk_size);
	
		$sent = 0;
		foreach ($chunks as $chunk) {
			try {
				$multicastResult = $sender->sendNoRetryMulti($message, $chunk);
				$results = $multicastResult->getResults();
			
				for ($i = 0; $i < count($results); $i++) {
					$result = $results[$i];
					// This means error
					if (is_null($result->getMessageId())) {
						switch ($result->getErrorCode()) {
							// If device is not registered or invalid remove it from table
							case 'NotRegistered':
							case 'InvalidRegistration':
								$this->delete_token($chunk[$i]);
								break;
								
							// else not recoverable errors, ignore
							case 'Unavailable':
							case 'InternalServerError':
								$this->log_fcm_error($result->getErrorCode(), __('You could retry to send it late in another request.', 'push-notifications-for-wp'));
								break;
								
							case 'MissingRegistration':
								$this->log_fcm_error($result->getErrorCode(), __('Check that the request contains a registration ID.', 'push-notifications-for-wp'));
								break;
								
							case 'InvalidPackageName':
								$this->log_fcm_error($result->getErrorCode(), __('Make sure the message was addressed to a registration ID whose package name matches the value passed in the request.', 'push-notifications-for-wp'));
								break;
								
							case 'MismatchSenderId':
								$this->log_fcm_error($result->getErrorCode(), __('Make sure the Sender Id (Project Number) in your App is correct.', 'push-notifications-for-wp'));
								break;
								
							case 'MessageTooBig':
								$this->log_fcm_error($result->getErrorCode(), __('Check that the total size of the payload data included in a message does not exceed 4096 bytes.', 'push-notifications-for-wp'));
								break;
								
							case 'InvalidDataKey':
								$this->log_fcm_error($result->getErrorCode(), __('Check that the payload data does not contain a key that is used internally by FCM.', 'push-notifications-for-wp'));
								break;
								
							case 'InvalidTtl':
								$this->log_fcm_error($result->getErrorCode(), __('Check that the value used in time_to_live is an integer representing a duration in seconds between 0 and 2,419,200.', 'push-notifications-for-wp'));
								break;
								
							case 'DeviceMessageRateExceed':
								$this->log_fcm_error($result->getErrorCode(), __('Reduce the number of messages sent to this device.', 'push-notifications-for-wp'));
								break;
						}
					}
					else {
						$this->notification_sent($chunk[$i]);
						
						// If there is a canonical registration id we must update
						$token = $result->getCanonicalRegistrationId();
						if (!is_null($token)) {
							$this->update_token($chunk[$i], $token);
						}
					}
				}
				
				unset($result);
				
				$sent += $multicastResult->getSuccess();
			}
			catch (\InvalidArgumentException $e) {
				pnfw_log(PNFW_ANDROID_LOG, sprintf(__('Invalid argument (%s): %s', 'push-notifications-for-wp'), (string)$e->getCode(), strip_tags($e->getMessage())));
			} catch (PHP_GCM\InvalidRequestException $e) {
				pnfw_log(PNFW_ANDROID_LOG, sprintf(__('FCM didn\'t return a 200 or 503 status (%s): %s', 'push-notifications-for-wp'), (string)$e->getCode(), strip_tags($e->getMessage())));
			} catch (\Exception $e) {
				pnfw_log(PNFW_ANDROID_LOG, sprintf(__('Could not send message (%s): %s', 'push-notifications-for-wp'), (string)$e->getCode(), strip_tags($e->getMessage())));
			}
		}
		
		return $sent;
	}
	
	private function log_fcm_error($error_code, $error_message) {
		pnfw_log(PNFW_ANDROID_LOG, sprintf(__('Could not send message (%s): %s', 'push-notifications-for-wp'), $error_code, $error_message));
	}

}
