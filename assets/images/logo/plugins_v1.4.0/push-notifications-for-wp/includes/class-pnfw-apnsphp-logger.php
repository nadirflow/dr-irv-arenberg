<?php
	
if (!defined('ABSPATH')) {
	exit; // Exit if accessed directly
}

class PNFW_ApnsPHP_Logger implements ApnsPHP_Log_Interface {

	protected $type;

	public function __construct($type) {
		$this->type = $type;
	}

	public function log($sMessage) {
		pnfw_log($this->type, $sMessage);
	}

}
