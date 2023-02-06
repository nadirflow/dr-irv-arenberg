<?php
/**
 * GeneralLib Wordpress Plugin for Mobile App.
 * Exclusively on Envato Market: https://codecanyon.net/user/zinisoft/portfolio
 *
 * @encoding        UTF-8
 * @version         1.0.0
 * @copyright       Copyright (C) 2018 - 2019 ZiniSoft ( https://zinisoft.net/ ). All rights reserved.
 * @license         Envato License https://1.envato.market/KYbje
 * @contributors    Brian Vo (info@zinisoft.net), ZiniSoft Team (support@zinisoft.net)
 * @support         support@zinisoft.net
 **/

namespace ZiniSoft\GeneralLib;

/** Exit if accessed directly. */
if ( ! defined( 'ABSPATH' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit;
}

use ZiniSoft\ZiniAppBuilder as ZiniAppBuilder;
use DOMElement;
use DOMDocument;

/**
 * SINGLETON: Class used to implement work with HTML and XML files.
 *
 * @since 2.0.0
 * @author Brian Vo (info@zinisoft.net)
 **/
final class XMLHelper {

	/**
	 * The one true XMLHelper.
	 *
	 * @var XMLHelper
	 * @since 2.0.0
	 **/
	private static $instance;

	/**
	 * Sets up a new XMLHelper instance.
	 *
	 * @since 2.0.0
	 * @access public
	 **/
	private function __construct() {

	}

	/**
	 * The easiest way to get inner HTML of the node.
	 *
	 * @param DOMElement $node - Return inner html.
	 *
	 * @return string
	 * @since 2.0.0
	 * @access public
	 */
	public function get_inner_html( $node ) {
		$innerHTML= '';
		$children = $node->childNodes;
		foreach ($children as $child) {
			$innerHTML .= $child->ownerDocument->saveXML( $child );
		}

		return $innerHTML;
	}

	/**
	 * Prepare HTML for Google TTS. Remove unnecessary html tags.
	 *
	 * @param $post_content - Post/Page content.
	 *
	 * @return string|string[]|null
	 * @since 2.0.0
	 * @access public
	 **/
	public function clean_html( $post_content ) {

		/** Strip Tags except contents tags and SSML. */
		$post_content = strip_tags( $post_content, '<div><p><pre><ul><ol><li><table><span><i><b><strong><em><code><break><say-as><sub><emphasis><voice>' );

		/** Remove inline styles. */
		$post_content = preg_replace( '/(<[^>]+) style=".*?"/i', '$1', $post_content );

		/** Decoding HTML entities. */
		$post_content = html_entity_decode( $post_content );

		/** Remove empty tags. */
		$pattern      = "/<[^\/>]*>([\s]?)*<\/[^>]*>/"; // Pattern to remove any empty tag.
		$post_content = preg_replace( $pattern, '', $post_content );

		/** Remove spaces, tabs, newlines. */
		$post_content = preg_replace( '~>\s+<~', '> <', $post_content );

		return $post_content;

	}

	/**
	 * Repair HTML with DOMDocument.
	 *
	 * @param $html - HTML content to be repaired.
	 *
	 * @return string
	 * @since 2.0.0
	 * @access public
	 **/
	public function repair_html( $html ) {

		/** Hide DOM parsing errors. */
		libxml_use_internal_errors( true );
		libxml_clear_errors();

		/** Load the possibly malformed HTML into a DOMDocument. */
		$dom          = new DOMDocument();
		$dom->recover = true;
		//$dom->loadHTML( '<?xml encoding="UTF-8"><body id="repair">' . $html . '</body>' ); // input UTF-8.
		$dom->loadHTML( '<?xml encoding="UTF-8"><!DOCTYPE html><html lang=""><head><title>R</title></head><body id="repair">' . $html . '</body></html>' );

		/** Copy the document content into a new document. */
		$doc = new DOMDocument();
		foreach ( $dom->getElementById( 'repair' )->childNodes as $child ) {
			$doc->appendChild( $doc->importNode( $child, true ) );
		}

		/** Output the new document as HTML. */
		$doc->encoding     = 'UTF-8'; // output UTF-8.
		$doc->formatOutput = false;

		return trim( $doc->saveHTML() );
	}

	/**
	 * Remove ziniappbuilder player ".zs-ziniappbuilder-wrapper" if we  have one.
	 *
	 * @param string $html_content - Page HTML content with ziniappbuilder player.
	 *
	 * @return string HTML without ziniappbuilder player.
	 * @since 2.0.0
	 **/
	public function remove_ziniappbuilder_player( $html_content ) {

		/** Create a DOM object. */
		$html = new simple_html_dom();

		/** Load HTML from a string. */
		$html->load( $html_content );

		/** Remove ziniappbuilder player. */
		foreach ( $html->find( '.zs-ziniappbuilder-wrapper' ) as $el ) {
			$el->outertext = '';
		}

		return $html->save();
	}

	/**
	 * Get language code and name from <voice> tag, or use default.
	 *
	 * @param string $html HTML content to be voiced.
	 *
	 * @return array First element - Language Code, Second element - Language Name.
	 * @since 2.0.0
	 **/
	public function get_lang_params_from_tag( $html ) {

		/** Get name attribute, from tag voice, if we have one. */
		$array = [];
		preg_match( '/voice name="([^"]*)"/i', $html, $array ) ;

		/** Return default values, if nothing was found. */
		if ( ! isset( $array[1] ) ) {
			return [
				ZiniAppBuilderget_instance()->options['language-code'],
				ZiniAppBuilderget_instance()->options['language']
			];
		}

		/** Voice name ex. "en-GB-Wavenet-C", from tag <voice>. */
		$voice_name = $array[1];

		/** Get Lang code. */
		$pieces = explode('-', $voice_name );
		$lang_code = $pieces[0] . '-' . $pieces[1];

		return [$lang_code, $voice_name];
	}

	/**
	 * Main XMLHelper Instance.
	 *
	 * Insures that only one instance of XMLHelper exists in memory at any one time.
	 *
	 * @static
	 * @return XMLHelper
	 * @since 2.0.0
	 **/
	public static function get_instance() {
		if ( ! isset( self::$instance ) && ! ( self::$instance instanceof XMLHelper ) ) {
			self::$instance = new XMLHelper;
		}

		return self::$instance;
	}

	/**
	 * Throw error on object clone.
	 *
	 * The whole idea of the singleton design pattern is that there is a single
	 * object therefore, we don't want the object to be cloned.
	 *
	 * @return void
	 * @since 2.0.0
	 * @access protected
	 **/
	public function __clone() {
		/** Cloning instances of the class is forbidden. */
		_doing_it_wrong( __FUNCTION__, esc_html__( 'The whole idea of the singleton design pattern is that there is a single object therefore, we don\'t want the object to be cloned.', 'ziniappbuilder' ), ZiniAppBuilder::$version );
	}

	/**
	 * Disable unserializing of the class.
	 *
	 * The whole idea of the singleton design pattern is that there is a single
	 * object therefore, we don't want the object to be unserialized.
	 *
	 * @return void
	 * @since 2.0.0
	 * @access protected
	 **/
	public function __wakeup() {
		/** Unserializing instances of the class is forbidden. */
		_doing_it_wrong( __FUNCTION__, esc_html__( 'The whole idea of the singleton design pattern is that there is a single object therefore, we don\'t want the object to be unserialized.', 'ziniappbuilder' ), ZiniAppBuilder::$version );
	}

} // End Class XMLHelper.
