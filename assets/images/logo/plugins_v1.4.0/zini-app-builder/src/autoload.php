<?php
/**
 * ZiniAppBuilder Wordpress Plugin for Mobile App.
 * Exclusively on Envato Market: https://codecanyon.net/user/zinisoft/portfolio
 *
 * @encoding        UTF-8
 * @version         1.0.0
 * @copyright       Copyright (C) 2018 - 2019 ZiniSoft ( https://zinisoft.net/ ). All rights reserved.
 * @license         Envato License https://1.envato.market/KYbje
 * @contributors    Brian Vo (info@zinisoft.net), ZiniSoft Team (support@zinisoft.net)
 * @support         support@zinisoft.net
 **/

/** Register plugin custom autoloader. */
/** @noinspection PhpUnhandledExceptionInspection */
spl_autoload_register( function ( $class ) {

	$namespace = 'ZiniSoft\\';

	/** Bail if the class is not in our namespace. */
	if ( 0 !== strpos( $class, $namespace ) ) {
		return;
	}

	/** Build the filename. */
	$file = realpath( __DIR__ );
	$file = $file . DIRECTORY_SEPARATOR . str_replace( '\\', DIRECTORY_SEPARATOR, $class ) . '.php';

	/** If the file exists for the class name, load it. */
	if ( file_exists( $file ) ) {
		/** @noinspection PhpIncludeInspection */
		include( $file );
	}

} );