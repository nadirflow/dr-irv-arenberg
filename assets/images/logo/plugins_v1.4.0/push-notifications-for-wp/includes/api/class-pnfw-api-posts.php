<?php

require_once dirname(__FILE__ ) . '/class-pnfw-api-activated.php';

class PNFW_API_Posts extends PNFW_API_Activated {

	private $post_id;
	private $post;

	public function __construct() {
		parent::__construct(home_url('pnfw/posts/'));
		
		switch($this->get_method()) {
			case 'GET': {
				// Optional
				$this->post_id = $this->opt_parameter('id', FILTER_SANITIZE_NUMBER_INT);
				
				$timestamp = $this->opt_parameter('timestamp', FILTER_SANITIZE_NUMBER_INT);
				if ($timestamp == $this->get_last_modification_timestamp())
					$this->header_error('304');
				
				if (isset($this->post_id)) {
					global $wp_embed;

					$this->check_current_post_id();
					
					$post_date = new DateTime($this->post->post_date);
					
					$content = $wp_embed->run_shortcode($this->post->post_content); // process the [embed] shortcode (which needs to be run earlier than other shortcodes)
					$content = (bool)get_option('pnfw_use_wpautop') ? wpautop(do_shortcode($content)) : do_shortcode($content);
					
					$response = array(
						'id' => $this->post->ID,
						'title' => $this->post->post_title,
						'content' => $content,
						'categories' => $this->get_categories(),
						'date' => $post_date->getTimestamp(),
						'author' => $this->get_author(),
					);
					
					// Optional fields
					$image = $this->get_image();
					if (!is_null($image))
						$response['image'] = $image;
					
					if (!$this->is_viewed())
						$this->set_viewed();
					header('Content-Type: application/json');
					
					echo json_encode($response);
				}
				else {
					$raw_posts = array();
					if (get_option('pnfw_enabled_post_types')) {
						$raw_posts = get_posts(
							array(
								'posts_per_page' => get_option('pnfw_posts_per_page'),
								'post_type' => get_option('pnfw_enabled_post_types'),
								'suppress_filters' => pnfw_suppress_filters()
							)
						);
					}
					$posts = array();
					
					foreach ($raw_posts as $raw_post) {
						if ($this->current_user_can_view_post($raw_post->ID)) {
							$post_date = new DateTime($raw_post->post_date);
							
							// Mandatory fields
							$post = array(
								'id' => $raw_post->ID,
								'title' => $raw_post->post_title,
								'date' => $post_date->getTimestamp(),
							);
							
							// Optional fields
							$thumbnail = $this->get_thumbnail($raw_post->ID);
							if (!is_null($thumbnail))
								$post['thumbnail'] = $thumbnail;
							
							if (!$this->is_read($raw_post->ID))
								$post['read'] = false;
							$posts[] = $post;
						}
					}
					
					header('Content-Type: application/json');
					
					echo json_encode(array(
						'posts' => $posts,
						'timestamp' => $this->get_last_modification_timestamp()
					));
				}
				break;
			}
			case 'POST': {
				// Mandatory
				$this->post_id = $this->get_parameter('id', FILTER_SANITIZE_NUMBER_INT);
				$viewed = $this->get_parameter('viewed', FILTER_VALIDATE_BOOLEAN);
				
				$this->check_current_post_id();
				$this->set_viewed($viewed);
				break;
			}
			default:
				$this->json_error('401', __('Invalid HTTP method', 'push-notifications-for-wp'));
		}
		exit;
	}
	
	private function check_current_post_id() {
		$this->post = get_post($this->post_id);
		
		if ($this->post == null || $this->post->post_status != 'publish') {
			$this->json_error('404', __('Post not found.', 'push-notifications-for-wp'));
		}
		
		if (!$this->current_user_can_view_post($this->post_id)) {
			$this->json_error('401', __('You do not have permission to access this post.', 'push-notifications-for-wp'));
		}
	}
	
	private function get_categories($post = null) {
		if (is_null($post)) {
			$post = $this->post;
		}
		
		$taxonomies = array_intersect(get_object_taxonomies($post), get_option('pnfw_enabled_object_taxonomies', array()));
		$terms = empty($taxonomies) ? false : get_the_terms($post->ID, reset($taxonomies));
		
		$categories = array();
		
		if ($terms) {
			foreach ($terms as $term) {
				// Mandatory fields
				$category = array(
					'id' => $term->term_id,
					'name' => $term->name
				);
				
				$categories[] = $category;
			}
		}
		
		return $categories;
	}
	
	private function get_author($post = null) {
		if (is_null($post)) {
			$post = $this->post;
		}
		
		$user = get_userdata($post->post_author);
		return $user ? $user->display_name : __('Anonymous', 'push-notifications-for-wp');
	}
	
	private function get_image($post_id = null) {
		if (is_null($post_id)) {
			$post_id = $this->post_id;
		}
		
		if (has_post_thumbnail($post_id)) {
			$thumbnail_id = get_post_thumbnail_id($post_id);
		
			$array = wp_get_attachment_image_src($thumbnail_id, 'single-post-thumbnail');
			$url_thumbnail = $array[0];
			
			return $url_thumbnail;
		}
		else {
			return null;
		}
	}
	
	private function get_thumbnail($post_id = null) {
		if (is_null($post_id)) {
			$post_id = $this->post_id;
		}
		
		if (has_post_thumbnail($post_id)) {
			$thumbnail_id = get_post_thumbnail_id($post_id);
		
			$array = wp_get_attachment_image_src($thumbnail_id);
			$url_thumbnail = $array[0];
			
			return $url_thumbnail;
		}
		else {
			return null;
		}		
	}
	
	public function is_viewed($post_id = null) {
		if (is_null($post_id))
			$post_id = $this->post_id;
		
		return PNFW_DB()->is_viewed($post_id, $this->current_user_id());
	}
	
	public function set_viewed($viewed = true) {
		PNFW_DB()->set_viewed($this->post_id, $this->current_user_id(), $viewed);
	}
	
	public function is_read($post_id = null) {
		if (is_null($post_id))
			$post_id = $this->post_id;
		
		if (PNFW_DB()->is_sent($post_id, $this->current_user_id())) {
			return $this->is_viewed($post_id);
		}
		else {
			return true;
		}
	}
}
