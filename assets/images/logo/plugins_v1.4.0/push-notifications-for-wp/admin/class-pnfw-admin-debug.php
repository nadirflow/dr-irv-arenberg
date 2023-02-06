<?php
	
if (!defined('ABSPATH')) {
	exit; // Exit if accessed directly
}

class PNFW_Admin_Debug {
	public static function output() {
		
		if (isset($_POST['issubmitted']) && $_POST['issubmitted'] == 'yes') {
			if (!wp_verify_nonce($_POST['_wpnonce'], 'empty_log')) {
				_e('Are you sure you want to do this?', 'push-notifications-for-wp');
				die;
			}
			else {
				$pnfw_empty_log = isset($_POST['pnfw_empty_log']) ? $_POST['pnfw_empty_log'] : 1;
			
				if (isset($pnfw_empty_log) && $pnfw_empty_log == 0) {
					self::empty_log();
				}
			}
		} ?>
		
		<div class="wrap">
			<div id="icon-options-general" class="icon32"></div>
			<h2><?php _e('Debug', 'push-notifications-for-wp'); ?>
			</h2>
			
			<?php if (!function_exists('fsockopen')) { ?>
				<div id="message" class="error">
					<p><?php echo sprintf(__('Error: %s is disabled (please fix).', 'push-notifications-for-wp'), '<code>fsockopen()</code>'); ?></p>
				</div>
			<?php } ?>
			
			<?php if (!function_exists('curl_init')) { ?>
				<div id="message" class="error">
					<p><?php echo sprintf(__('Error: %s is disabled (please fix).', 'push-notifications-for-wp'), '<code>curl_init()</code>'); ?></p>
				</div>
			<?php } ?>
			<?php global $sitepress_settings;
			
			if (isset($sitepress_settings) && WP_DEBUG && WP_DEBUG_DISPLAY && function_exists('icl_object_id') && $sitepress_settings['sync_post_taxonomies'] && count(get_terms('user_cat', array('hide_empty' => false))) > 0) { ?>
				<div id="message" class="error">
					<p><?php _e('Warning: WPML does not support users categories. Some spurious warnings may be generated. They can all be turned off disabling <code>WP_DEBUG</code> mode or disabling the option <em>Copy taxonomy to translations</em> in WPML &rarr; Translation options. However is <strong>not</strong> guaranteed to work.', 'push-notifications-for-wp'); ?></p>
				</div>
			<?php } ?>
			
			<h3><?php _e('Logs', 'push-notifications-for-wp'); ?></h3>
			
			<?php			
			$logs = new PNfW_Logs_Table();
			$logs->prepare_items(); 
			$logs->display(); ?>
			
			<form action="" method="post">
				<input name="pnfw_empty_log" type="hidden" id="pnfw_empty_log" value="0" />
				
				<p class="submit">
					<?php wp_nonce_field('empty_log'); ?>
					
					<input name="issubmitted" type="hidden" value="yes" />
					<input class="button button-primary" type="submit" name="pnfw_empty_log_button" value="<?php _e('Empty Log', 'push-notifications-for-wp'); ?>" /> 
				</p>
			</form>
			
			<h3><?php _e('Feedback Provider', 'push-notifications-for-wp'); ?></h3>
			
			<?php _e('Feedback Provider is', 'push-notifications-for-wp'); ?>
			
			<strong><?php
			global $feedback_provider;
			$feedback_provider->is_active() ? _e('active', 'push-notifications-for-wp') : _e('disabled', 'push-notifications-for-wp'); ?></strong>
			
			<?php
			if ($feedback_provider->is_active()) {
				$gmt_offset = get_option('gmt_offset');
				$date_format = get_option('date_format');
				$time_format = get_option('time_format');
				$tz_format = sprintf('%s %s', $date_format, $time_format);
            
				$human_readable_date = date_i18n($tz_format, $feedback_provider->next_scheduled() + $gmt_offset * 60 * 60);

				printf(__('(next scheduled event: %s)', 'push-notifications-for-wp'), $human_readable_date);
			} ?>
		</div>
	<?php }
		
	public static function empty_log() {
		global $wpdb;
		
		$table_name = $wpdb->get_blog_prefix() . 'push_logs';
		$wpdb->query("DELETE FROM $table_name;");
	}
}

class PNfW_Logs_Table extends WP_List_Table {
	public function __construct() {
		parent::__construct(array(
			'singular' => __('Log', 'push-notifications-for-wp'),
			'plural' => __('Logs', 'push-notifications-for-wp'),
			'ajax' => false
		));
	}
	
	function get_columns() {
		$columns = array(
			'text' => __('Text', 'push-notifications-for-wp'),
			'type' => __('Type', 'push-notifications-for-wp'),
			'timestamp' => __('Timestamp', 'push-notifications-for-wp'),
		);

		return $columns;
	}

	function prepare_items() {
		global $wpdb;
		$table_name = $wpdb->get_blog_prefix() . 'push_logs';

		$per_page = 120;

		$columns = $this->get_columns();
		$hidden = array();
		$sortable = $this->get_sortable_columns();
		
		$this->_column_headers = array($columns, $hidden, $sortable);
		
		$total_items = $wpdb->get_var("SELECT COUNT(id) FROM $table_name");
		
		$paged = isset($_REQUEST['paged']) ? max(0, intval($_REQUEST['paged']) - 1) : 0;
		
		$orderby = (isset($_REQUEST['orderby']) && in_array($_REQUEST['orderby'], array_keys($this->get_sortable_columns()))) ? $_REQUEST['orderby'] : 'id';
		$order = (isset($_REQUEST['order']) && in_array($_REQUEST['order'], array('asc', 'desc'))) ? $_REQUEST['order'] : 'desc';

		$this->items = $wpdb->get_results($wpdb->prepare("SELECT * FROM $table_name ORDER BY $orderby $order LIMIT %d OFFSET %d", $per_page, $paged * $per_page), ARRAY_A);

		$this->set_pagination_args(array(
    		'total_items' => $total_items,
    		'per_page' => $per_page,
    		'total_pages' => ceil($total_items / $per_page)
		));
	}

	function column_default($item, $column_name) {
		switch ($column_name) {			
			case 'type':
				$res = '<div class="log-type-' . $item[$column_name] . '" title="';
				
				if ($item[$column_name] == PNFW_SYSTEM_LOG) {
					$res .= __('System', 'push-notifications-for-wp');
				}
				else if ($item[$column_name] == PNFW_IOS_LOG) {
					$res .= __('iOS', 'push-notifications-for-wp');
				}
				else if ($item[$column_name] == PNFW_ANDROID_LOG) {
					$res .= __('Android', 'push-notifications-for-wp');
				}
				else if ($item[$column_name] == PNFW_FEEDBACK_PROVIDER_LOG) {
					$res .= __('iOS Feedback Provider', 'push-notifications-for-wp');
				}
				else if ($item[$column_name] == PNFW_ALERT_LOG) {
					$res .= __('Alert', 'push-notifications-for-wp');
				}
				else if ($item[$column_name] == PNFW_SAFARI_LOG) {
					$res .= __('Safari', 'push-notifications-for-wp');
				}
				else if ($item[$column_name] == PNFW_WEB_LOG) {
					$res .= __('Web', 'push-notifications-for-wp');
				}
				else if ($item[$column_name] == PNFW_TELEGRAM_LOG) {
					$res .= __('Telegram', 'push-notifications-for-wp');
				}
				else {
					$res .= __('Other', 'push-notifications-for-wp');
				}
				
				$res .= '"></div>';
				
				return $res;

			case 'timestamp':
				$date_format = get_option('date_format');
				$time_format = get_option('time_format');
				$tz_format = sprintf('%s %s', $date_format, $time_format);
            
				return date_i18n($tz_format, strtotime($item[$column_name]));

			case 'text':
				return $item[$column_name];

			default:
				return '';
		}
	}

	public function get_sortable_columns() {
		$sortable_columns = array(
			'type' => array('type', false),
		);

		return $sortable_columns;
	}

	public function no_items() {
		_e('No logs were found.', 'push-notifications-for-wp');
	}
}