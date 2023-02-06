<?php

/**
 *
 * Handle network request
 *
 * @param $method
 * @param $url
 * @param bool $data
 *
 * @return bool|string
 * @since    1.0.0
 */
function zini_app_builder_request( $method, $url, $data = false ) {
	$curl = curl_init();

	switch ( $method ) {
		case "POST":
			curl_setopt( $curl, CURLOPT_POST, 1 );

			if ( $data ) {
				curl_setopt( $curl, CURLOPT_POSTFIELDS, $data );
			}
			break;
		case "PUT":
			curl_setopt( $curl, CURLOPT_PUT, 1 );
			break;
		default:
			if ( $data ) {
				$url = sprintf( "%s?%s", $url, http_build_query( $data ) );
			}
	}

	// Optional Authentication:
	curl_setopt( $curl, CURLOPT_HTTPAUTH, CURLAUTH_BASIC );
	curl_setopt( $curl, CURLOPT_USERPWD, "username:password" );

	curl_setopt( $curl, CURLOPT_URL, $url );
	curl_setopt( $curl, CURLOPT_RETURNTRANSFER, 1 );

	$result = curl_exec( $curl );

	curl_close( $curl );

	return $result;
}

/**
 *
 * Distance matrix
 *
 * @param $origin_string
 * @param $destinations_string
 * @param $key
 * @param string $units
 *
 * @return mixed
 */
function zini_app_builder_distance_matrix( $origin_string, $destinations_string, $key, $units = 'metric' ) {
	$google_map_api = 'https://maps.googleapis.com/maps/api';
	$url            = "$google_map_api/distancematrix/json?units=$units&origins=$origin_string&destinations=$destinations_string&key=$key";

	return json_decode( zini_app_builder_request( 'GET', $url ) )->rows;
}

/**
 *
 * Send Notification
 *
 * @param $fields
 * @param $api_key
 *
 * @return bool|string
 */
function zini_app_builder_send_notification( $fields, $api_key ) {
	$fields = json_encode( $fields );

	$ch = curl_init();
	curl_setopt( $ch, CURLOPT_URL, "https://onesignal.com/api/v1/notifications" );
	curl_setopt( $ch, CURLOPT_HTTPHEADER, array(
		'Content-Type: application/json; charset=utf-8',
		'Authorization: Basic ' . $api_key,
	) );

	curl_setopt( $ch, CURLOPT_RETURNTRANSFER, true );
	curl_setopt( $ch, CURLOPT_HEADER, false );
	curl_setopt( $ch, CURLOPT_POST, true );
	curl_setopt( $ch, CURLOPT_POSTFIELDS, $fields );
	curl_setopt( $ch, CURLOPT_SSL_VERIFYPEER, false );

	$result = curl_exec( $ch );
	curl_close( $ch );

	return $result;
}

/**
 * Get request headers
 * @return array|false
 */
function zini_app_builder_headers() {
	if ( function_exists( 'apache_request_headers' ) ) {
		return apache_request_headers();
	} else {

		$out = array();

		foreach ( $_SERVER as $key => $value ) {
			if ( substr( $key, 0, 5 ) == "HTTP_" ) {
				$key         = str_replace( " ", "-",
					ucwords( strtolower( str_replace( "_", " ", substr( $key, 5 ) ) ) ) );
				$out[ $key ] = $value;
			} else {
				$out[ $key ] = $value;
			}
		}

		return $out;
	}
}

/**
 * Get request headers
 * @return array|false
 */

function zini_app_builder_token() {
	if ( ! empty( $_SERVER['HTTP_AUTHORIZATION'] ) ) {
		return wp_unslash( $_SERVER['HTTP_AUTHORIZATION'] ); // WPCS: sanitization ok.
	}

	if ( function_exists( 'getallheaders' ) ) {
		$headers = getallheaders();
		// Check for the authoization header case-insensitively.
		foreach ( $headers as $key => $value ) {
			if ( 'authorization' === strtolower( $key ) ) {
				return $value;
			}
		}
	}

	return '';
}

/**
 * Returns true if we are making a REST API request for Mobile builder.
 *
 * @return  bool
 */
function zini_app_builder_is_rest_api_request() {
	if ( empty( $_SERVER['REQUEST_URI'] ) ) {
		return false;
	}

	$rest_prefix = trailingslashit( rest_get_url_prefix() );
	$uri         = $_SERVER['REQUEST_URI'];
	$allows      = array( 'zini-app-builder/', 'wcfmmp/', 'dokan/', 'wp/', 'wc/' );

	foreach ( $allows as $allow ) {
		$check = strpos( $uri, $rest_prefix . $allow ) !== false;
		if ( $check ) {
			return true;
		}
	}

	return false;
}
