<?php
	
if (!defined('ABSPATH')) {
	exit; // Exit if accessed directly
}

class PNFW_Admin_Tokens {
	public static function output() { ?>
		<div class="wrap">
			<div id="icon-options-general" class="icon32"></div> 
			<h2><?php _e('Tokens', 'push-notifications-for-wp'); ?>
			</h2>
			<?php
			if (isset($_REQUEST['action']) && 'delete' === $_REQUEST['action']) {
				if (!isset($_REQUEST['_wpnonce']) || !wp_verify_nonce($_REQUEST['_wpnonce'], 'delete' . $_REQUEST['id'])) {
					_e('Are you sure you want to do this?', 'push-notifications-for-wp');
					die;
				}
				
				global $wpdb;
				$push_tokens = $wpdb->get_blog_prefix() . 'push_tokens';
				$push_encryption_keys = $wpdb->get_blog_prefix() . 'push_encryption_keys';
				
				$user_id = $wpdb->get_var($wpdb->prepare("SELECT user_id FROM $push_tokens WHERE id = %d", $_REQUEST['id']));
			
				$wpdb->delete($push_tokens, array('id' => $_REQUEST['id']));
				$wpdb->delete($push_encryption_keys, array('token_id' => $_REQUEST['id']));

				pnfw_log(PNFW_ALERT_LOG, sprintf(__("Removed from the Tokens page the token with ID %s.", 'push-notifications-for-wp'), $_REQUEST['id']));
				
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
						wp_delete_user($user_id);
					}
				}
				
				?>
				
				<div class="updated below-h2" id="message"><p><?php _e('Item deleted', 'push-notifications-for-wp'); ?></p></div>
				<?php $_SERVER['REQUEST_URI'] = remove_query_arg(array('action', 'id', '_wpnonce')); // "consumes" the used parameters
			}
			else if (isset($_REQUEST['action']) && 'send_test_notification' === $_REQUEST['action']) {
				if (!isset($_REQUEST['_wpnonce']) || !wp_verify_nonce($_REQUEST['_wpnonce'], 'send_test_notification' . $_REQUEST['id'])) {
					_e('Are you sure you want to do this?', 'push-notifications-for-wp');
					die;
				}
				
				global $wpdb;
				$push_tokens = $wpdb->get_blog_prefix() . 'push_tokens';
			
				$rows = $wpdb->get_results($wpdb->prepare("SELECT os, token FROM $push_tokens WHERE id = %d", $_REQUEST['id']));
				
				if (count($rows) > 0) {
					$os = $rows[0]->os;
					$token = $rows[0]->token;
					
					$title = __('This is a test notification', 'push-notifications-for-wp');
					$count = 0;
				
					if ('iOS' == $os) {
							require_once dirname(__FILE__ ) . '/../includes/notifications/class-pnfw-notifications-ios.php';
						
						$sender = new PNFW_Notifications_iOS();
						$count = $sender->send_title_to_tokens($title, array($token));
					}
					else if ('Android' == $os) {
						require_once dirname(__FILE__ ) . '/../includes/notifications/class-pnfw-notifications-android.php';
						
						$sender = new PNFW_Notifications_Android();
						$count = $sender->send_title_to_tokens($title, array($token));
					}

					if ($count > 0) {
						?> <div class="updated below-h2" id="message"><p><?php echo sprintf(__('Notification sent to %s device', 'push-notifications-for-wp'), $os); ?></p></div> <?php
					}
					else {
						$url = admin_url('admin.php?page=pnfw-debug-identifier');

						?> <div class="error below-h2" id="message"><p><?php echo sprintf(__("There was an error sending the notification. For more information, see the <a href='%s'>Debug</a> page", 'push-notifications-for-wp'), $url); ?></p></div> <?php
					}
				}
				else {
					?> <div class="error below-h2" id="message"><p><?php echo _e('Error'); ?></p></div> <?php
				}
				
				$_SERVER['REQUEST_URI'] = remove_query_arg(array('action', 'id', '_wpnonce')); // "consumes" the used parameters
			}
			
			$tokensTable = new Tokens_Table();
			$tokensTable->prepare_items(); 
			$tokensTable->display(); ?>
		</div>
	<?php }
}

if (!class_exists( 'WP_List_Table')) {
	require_once(ABSPATH . 'wp-admin/includes/class-wp-list-table.php');
}

class Tokens_Table extends WP_List_Table {
	public function __construct() {
		parent::__construct(array(
			'singular' => __('Token', 'push-notifications-for-wp'),
			'plural' => __('Tokens', 'push-notifications-for-wp'),
			'ajax' => false
		));
	}
	
	function get_columns() {
			$columns = array(
				'token' => __('Token', 'push-notifications-for-wp'),
				'user_id' => __('User', 'push-notifications-for-wp'),
				'timestamp' => __('Registration timestamp', 'push-notifications-for-wp'),
				'os' => __('Operating System', 'push-notifications-for-wp'),
				'lang' => __('Language', 'push-notifications-for-wp'),
				'status' => __('Status', 'push-notifications-for-wp')
			);
		
			return $columns;
	}

	function prepare_items() {
		global $wpdb;
		$push_tokens = $wpdb->get_blog_prefix() . 'push_tokens';

		$per_page = 40;

		$columns = $this->get_columns();
		$hidden = array();
		$sortable = $this->get_sortable_columns();
		
		$this->_column_headers = array($columns, $hidden, $sortable);
		
		$total_items = $wpdb->get_var("SELECT COUNT(id) FROM $push_tokens");
		
		$paged = isset($_REQUEST['paged']) ? max(0, intval($_REQUEST['paged']) - 1) : 0;
		
		$orderby = (isset($_REQUEST['orderby']) && in_array($_REQUEST['orderby'], array_keys($this->get_sortable_columns()))) ? $_REQUEST['orderby'] : 'id';
		$order = (isset($_REQUEST['order']) && in_array($_REQUEST['order'], array('asc', 'desc'))) ? $_REQUEST['order'] : 'desc';

		$this->items = $wpdb->get_results($wpdb->prepare("SELECT * FROM $push_tokens ORDER BY $orderby $order LIMIT %d OFFSET %d", $per_page, $paged * $per_page), ARRAY_A);

		$this->set_pagination_args(array(
    		'total_items' => $total_items,
    		'per_page' => $per_page,
    		'total_pages' => ceil($total_items / $per_page)
		));
	}

	function column_default($item, $column_name) {
		switch ($column_name) {
			case 'token':
			case 'timestamp':
			case 'os':
			case 'lang':
				return $item[$column_name];
			case 'status': {
				if ($item['active'] == true) {
					return __('Active', 'push-notifications-for-wp');
				}
				else {
					return __('To be confirmed', 'push-notifications-for-wp');
				}
			}
			case 'user_id':
				$user_info = get_userdata($item[$column_name]);
				
				if ($user_info) {
					return $user_info->display_name;
				}
				
				return NULL;
			default:
				return print_r($item, true); // Show the whole array for troubleshooting purposes
		}
	}
	
	public function get_sortable_columns() {
		$sortable_columns = array(
			'token' => array('token', false),
			'timestamp' => array('timestamp', false),
			'os' => array('os', false),
			'lang' => array('lang', false)
		);
		
		return $sortable_columns;
	}
	
	function column_token($item) {
		$paged = isset($_REQUEST['paged']) ? (int)$_REQUEST['paged'] : 1;
		
		$actions = array(
    		'delete' => sprintf('<a href="?page=%s&paged=%d&action=%s&id=%s&_wpnonce=%s">%s</a>', $_REQUEST['page'], $paged, 'delete', $item['id'], wp_create_nonce('delete' . $item['id']), __('Delete', 'push-notifications-for-wp'))
    	);
    		
    	if (!pnfw_starts_with($item['token'], 'tokenless_')) {
    		$actions['send_test_notification'] = sprintf('<a href="?page=%s&paged=%d&action=%s&id=%s&_wpnonce=%s">%s</a>', $_REQUEST['page'], $paged, 'send_test_notification', $item['id'],  wp_create_nonce('send_test_notification' . $item['id']), __('Send test notification', 'push-notifications-for-wp'));
		}

		return sprintf('%1$s %2$s', $item['token'], $this->row_actions($actions) );
	}
	
	public function no_items() {
		_e('No tokens were found.', 'push-notifications-for-wp');
	}
}