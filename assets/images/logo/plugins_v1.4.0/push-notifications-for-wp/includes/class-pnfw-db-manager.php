<?php

// Exit if accessed directly
if ( ! defined( 'ABSPATH' ) ) exit;

class PNFW_DB_Manager {

	protected static $_instance = null;
	
	protected $wpdb;
	protected $push_sent;
	protected $push_viewed;
	protected $push_tokens;

	public static function instance() {
		if ( is_null( self::$_instance ) ) {
			self::$_instance = new self();
		}
		return self::$_instance;
	}

	public function __construct() {
		global $wpdb;
		$this->wpdb = &$wpdb;
		$this->push_sent = $this->wpdb->get_blog_prefix() . 'push_sent';
		$this->push_viewed = $this->wpdb->get_blog_prefix() . 'push_viewed';
		$this->push_tokens = $this->wpdb->get_blog_prefix() . 'push_tokens';
	}
	
	public function set_sent($post_id, $user_id) {
		$this->wpdb->query($this->wpdb->prepare("INSERT INTO {$this->push_sent} (`post_id`, `user_id`, `timestamp`) VALUES (%d, %d, %s) ON DUPLICATE KEY UPDATE timestamp = timestamp", $post_id, $user_id, current_time('mysql')));
	}
	
	public function set_viewed($post_id, $user_id, $viewed = true) {
		if ($viewed) {
			$this->wpdb->insert($this->push_viewed, array('post_id' => $post_id, 'user_id' => $user_id, 'timestamp' => current_time('mysql')));
		}
		else {
			$this->wpdb->delete($this->push_viewed, array('post_id' => $post_id, 'user_id' => $user_id));
		}
	}
	
	public function is_viewed($post_id, $user_id) {
		return (boolean)$this->wpdb->get_var($this->wpdb->prepare("SELECT COUNT(*) FROM {$this->push_viewed} WHERE post_id=%d AND user_id=%d", $post_id, $user_id));
	}
	
	public function is_sent($post_id, $user_id) {
		return (boolean)$this->wpdb->get_var($this->wpdb->prepare("SELECT COUNT(*) FROM {$this->push_sent} WHERE post_id=%d AND user_id=%d", $post_id, $user_id));
	}
	
	public function delete_sent($post_id) {
		$this->wpdb->delete($this->push_sent, array('post_id' => $post_id));
	}
	
	public function delete_viewed($post_id) {
		$this->wpdb->delete($this->push_viewed, array('post_id' => $post_id));
	}
	
	public function get_user_id($token, $os) {
		return $this->wpdb->get_var($this->wpdb->prepare("SELECT user_id FROM {$this->push_tokens} WHERE token=%s AND os=%s", $token, $os));
	}
	
	public function delete_token($token, $os) {
		return $this->wpdb->delete($this->push_tokens, array("token" => $token, "os" => $os));
	}
	
	public function is_token_activated($token, $os) {
		return (boolean)$this->wpdb->get_var($this->wpdb->prepare("SELECT active FROM {$this->push_tokens} WHERE token=%s AND os=%s", $token, $os));
	}

}

function pnfw_db() {
	return PNFW_DB_Manager::instance();
}

// Global for backwards compatibility.
$GLOBALS['pnfw_db'] = pnfw_db();
