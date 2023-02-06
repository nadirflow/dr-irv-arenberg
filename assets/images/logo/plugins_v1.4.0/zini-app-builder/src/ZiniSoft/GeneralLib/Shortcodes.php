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

/**
 * SINGLETON: Class used to implement shortcodes.
 *
 * @since 2.0.0
 * @author Brian Vo (info@zinisoft.net)
 **/
final class Shortcodes {

	/**
	 * The one true Shortcodes.
	 *
	 * @var Shortcodes
	 * @since 1.0.0
	 **/
	private static $instance;

	/**
	 * Sets up a new Shortcodes instance.
	 *
	 * @since 1.0.0
	 * @access public
	 **/
	private function __construct() {

		/** Initializes shortcodes. */
		add_action( 'init', [$this, 'shortcodes_init'] );

	}

	/**
	 * Initializes shortcodes.
	 *
	 * @since 2.0.0
	 * @access public
	 * @return void
	 **/
	public function shortcodes_init() {

		/** Add player by shortcode [ziniappbuilder] or [ziniappbuilder id=POST_ID] */
		add_shortcode( 'ziniappbuilder', [ $this, 'ziniappbuilder_shortcode' ] );

		/** GeneralLib Mute Shortcode. [ziniappbuilder-mute]...[/ziniappbuilder-mute] */
		add_shortcode( 'ziniappbuilder-mute', [ $this, 'ziniappbuilder_mute_shortcode' ] );

		/** GeneralLib Break Shortcode. [ziniappbuilder-break time="2s"] */
		add_shortcode( 'ziniappbuilder-break', [ $this, 'ziniappbuilder_break_shortcode' ] );

		/** GeneralLib say‑as Shortcode. [ziniappbuilder-say‑as interpret-as="cardinal"][/ziniappbuilder-say‑as] */
		add_shortcode( 'ziniappbuilder-say‑as', [ $this, 'ziniappbuilder_say_as_shortcode' ] );

		/** GeneralLib sub Shortcode. [ziniappbuilder-sub alias="World Wide Web Consortium"]W3C[/ziniappbuilder-sub] */
		add_shortcode( 'ziniappbuilder-sub', [ $this, 'ziniappbuilder_sub_shortcode' ] );

		/** GeneralLib emphasis Shortcode. [ziniappbuilder-emphasis level="moderate"]This is an important announcement.[/ziniappbuilder-emphasis] */
		add_shortcode( 'ziniappbuilder-emphasis', [ $this, 'ziniappbuilder_emphasis_shortcode' ] );

		/** GeneralLib voice Shortcode. [ziniappbuilder-voice name="en-GB-Wavenet-C"]I am not a real human.[/ziniappbuilder-voice] */
		add_shortcode( 'ziniappbuilder-voice', [ $this, 'ziniappbuilder_voice_shortcode' ] );

	}

	/**
	 * Add GeneralLib voice by shortcode [ziniappbuilder-voice name="en-GB-Wavenet-B"]My new voice.[/ziniappbuilder-voice].
	 *
	 * @param $atts - An associative array of attributes specified in the shortcode.
	 *
	 * @param $content
	 *
	 * @return string
	 * @since 2.0.0
	 * @access public
	 */
	public function ziniappbuilder_voice_shortcode( $atts, $content ) {

		/** White list of options with default values. */
		$atts = shortcode_atts( [
			'name' => ''
		], $atts );

		/** If we don't have name, exit. */
		if ( ! $atts['name'] ) {
			return do_shortcode( $content );
		}

		/** Extra protection from the fools */
		$atts['name'] = trim( strip_tags( $atts['name'] ) );

		/** Show shortcodes only for our parser. Hide on frontend. */
		if ( isset( $_GET['ziniappbuilder_ssml'] )  AND $_GET['ziniappbuilder_ssml'] ) {
			return '<voice name="' . esc_attr( $atts['name'] ) . '">' . do_shortcode( $content ) . '</voice>';
		} else {
			return do_shortcode( $content );
		}

	}

	/**
	 * Add GeneralLib emphasis by shortcode [ziniappbuilder-emphasis level="reduced"]Some information[/ziniappbuilder-emphasis].
	 *
	 * @param $atts - An associative array of attributes specified in the shortcode.
	 *
	 * @param $content - Shortcode content when using the closing shortcode construct: [foo] shortcode text [/ foo].
	 *
	 * @return string
	 * @since 2.0.0
	 * @access public
	 */
	public function ziniappbuilder_emphasis_shortcode( $atts, $content ) {

		/** White list of options with default values. */
		$atts = shortcode_atts( [
			'level' => 'none'
		], $atts );

		/** Extra protection from the fools */
		$atts['level'] = trim( strip_tags( $atts['level'] ) );

		/** Show shortcodes only for our parser. Hide on frontend. */
		if ( isset( $_GET['ziniappbuilder_ssml'] )  AND $_GET['ziniappbuilder_ssml'] ) {
			return '<emphasis level="' . esc_attr( $atts['level'] ) . '">' . do_shortcode( $content ) . '</emphasis>';
		} else {
			return do_shortcode( $content );
		}

	}

	/**
	 * Add GeneralLib sub by shortcode [ziniappbuilder-sub alias="Second World War"]WW2[/ziniappbuilder-sub].
	 *
	 * @param $atts - An associative array of attributes specified in the shortcode.
	 *
	 * @param $content - Shortcode content when using the closing shortcode construct: [foo] shortcode text [/ foo].
	 *
	 * @return string
	 * @since 2.0.0
	 * @access public
	 */
	public function ziniappbuilder_sub_shortcode( $atts, $content ) {

		/** White list of options with default values. */
		$atts = shortcode_atts( [
			'alias' => ''
		], $atts );

		/** If we don't have alias, exit. */
		if ( ! $atts['alias'] ) {
			return do_shortcode( $content );
		}

		/** Extra protection from the fools */
		$atts['alias'] = trim( strip_tags( $atts['alias'] ) );

		/** Show shortcodes only for our parser. Hide on frontend. */
		if ( isset( $_GET['ziniappbuilder_ssml'] )  AND $_GET['ziniappbuilder_ssml'] ) {
			return '<sub alias="' . esc_attr( $atts['alias'] ) . '">' . do_shortcode( $content ) . '</sub>';
		} else {
			return do_shortcode( $content );
		}

	}

	/**
	 * Add GeneralLib say‑as by shortcode [ziniappbuilder-say‑as interpret-as="ordinal"][/ziniappbuilder-say‑as].
	 *
	 * @param $atts - An associative array of attributes specified in the shortcode.
	 *
	 * @param $content
	 *
	 * @return string
	 * @since 2.0.0
	 * @access public
	 */
	public function ziniappbuilder_say_as_shortcode( $atts, $content ) {

		/** White list of options with default values. */
		$atts = shortcode_atts( [
			'interpret-as' => '',
			'format' => '',
			'detail' => ''
		], $atts );

		/** If we don't have interpret-as, exit. */
		if ( ! $atts['interpret-as'] ) {
			return do_shortcode( $content );
		}

		/** Extra protection from the fools */
		$atts['interpret-as'] = trim( strip_tags( $atts['interpret-as'] ) );
		$atts['format'] = trim( strip_tags( $atts['format'] ) );
		$atts['detail'] = trim( strip_tags( $atts['detail'] ) );

		$res = '<say-as interpret-as="' . $atts['interpret-as'] . '" ';

		if ( $atts['format'] ) {
			$res .= 'format="' . $atts['format'] . '" ';
		}

		if ( $atts['detail'] ) {
			$res .= 'detail="' . $atts['detail'] . '" ';
		}

		$res .= '>' . do_shortcode( $content ) . '</say-as>';

		/** Show shortcodes only for our parser. Hide on frontend. */
		if ( isset( $_GET['ziniappbuilder_ssml'] )  AND $_GET['ziniappbuilder_ssml'] ) {
			return $res;
		} else {
			return do_shortcode( $content );
		}

	}

	/**
	 * Add GeneralLib break by shortcode [ziniappbuilder-break time="300ms"].
	 *
	 * @param $atts - An associative array of attributes specified in the shortcode.
	 *
	 * @return string
	 * @since 2.0.0
	 * @access public
	 **/
	public function ziniappbuilder_break_shortcode( $atts ) {

		/** White list of options with default values. */
		$atts = shortcode_atts( [
			'time' => '500ms',
			'strength' => 'medium'
		], $atts );

		/** Extra protection from the fools */
		$atts['time'] = trim( strip_tags( $atts['time'] ) );
		$atts['strength'] = trim( strip_tags( $atts['strength'] ) );

		/** Show shortcodes only for our parser. Hide on frontend. */
		if ( isset( $_GET['ziniappbuilder_ssml'] )  AND $_GET['ziniappbuilder_ssml'] ) {
			return '<break time="' . esc_attr( $atts['time'] ) . '" strength="' . esc_attr( $atts['strength'] ) . '" />';
		} else {
			return '';
		}

	}

	/**
	 * Add GeneralLib mute by shortcode [ziniappbuilder-mute]...[/ziniappbuilder-mute].
	 *
	 * @param $atts - An associative array of attributes specified in the shortcode.
	 * @param $content - Shortcode content when using the closing shortcode construct: [foo] shortcode text [/ foo].
	 *
	 * @return string
	 * @since 1.0.0
	 * @access public
	 **/
	public function ziniappbuilder_mute_shortcode( $atts, $content ) {

		/** Show shortcodes only for our parser. Hide on frontend. */
		if ( isset( $_GET['ziniappbuilder_ssml'] )  AND $_GET['ziniappbuilder_ssml'] ) {
			return '<span ziniappbuilder-mute="">' . do_shortcode( $content ) . '</span>';
		} else {
			return do_shortcode( $content );
		}

	}

	/**
	 * Add player by shortcode [ziniappbuilder].
	 *
	 * @param $atts - An associative array of attributes specified in the shortcode.
	 *
	 * @return bool|false|string
	 * @since 2.0.0
	 * @access public
	 */
	public function ziniappbuilder_shortcode( $atts ) {

		/**
		 * If selected other settings, but we found shortcode.
		 * Show short code, but don't read it.
		 **/
		if ( ZiniAppBuilderget_instance()->options['position'] != 'shortcode' ) {
			return '<span class="ziniappbuilder-mute">[ziniappbuilder]</span>';
		}

		$params = shortcode_atts( [ 'id' => '0' ], $atts );

		$id = (int) $params['id'];

		return ZiniAppBuilderget_instance()->get_player( $id );
	}

	/**
	 * Main Shortcodes Instance.
	 *
	 * Insures that only one instance of Shortcodes exists in memory at any one time.
	 *
	 * @static
	 * @return Shortcodes
	 * @since 2.0.0
	 **/
	public static function get_instance() {
		if ( ! isset( self::$instance ) && ! ( self::$instance instanceof Shortcodes ) ) {
			self::$instance = new Shortcodes;
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

} // End Class Shortcodes.
