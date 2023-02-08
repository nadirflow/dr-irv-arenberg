<?php
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the
 * installation. You don't have to use the web site, you can
 * copy this file to "wp-config.php" and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * MySQL settings
 * * Secret keys
 * * Database table prefix
 * * ABSPATH
 *
 * @link https://wordpress.org/support/article/editing-wp-config-php/
 *
 * @package WordPress
 */

// ** MySQL settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define( 'DB_NAME', 'thelast10days_wp_uejso' );

/** MySQL database username */
define( 'DB_USER', 'thelast10days_wp_qsyxt' );

/** MySQL database password */
define( 'DB_PASSWORD', 'whLn^n_4yl@A7H3I' );

/** MySQL hostname */
define( 'DB_HOST', 'localhost:3306' );

/** Database Charset to use in creating database tables. */
define( 'DB_CHARSET', 'utf8' );

/** The Database Collate type. Don't change this if in doubt. */
define( 'DB_COLLATE', '' );

/**
 * Authentication Unique Keys and Salts.
 *
 * Change these to different unique phrases!
 * You can generate these using the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}
 * You can change these at any point in time to invalidate all existing cookies. This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define('AUTH_KEY', ':uaK-329th1[%n3E|7g#l#26O4Va5)_|a&4[|&Zl8]5;086IiSXIdB52!5Vz!jhL');
define('SECURE_AUTH_KEY', '#SZ2+d%G5pkYL0YT#Em4-~[!C+;+N306]StFf2F:@+pUMJ8s)CCHDm]2BU9@9*Q/');
define('LOGGED_IN_KEY', '#9I!zX++_TZ2SGg9Bp6QpnQd958Vka7#1Heoi@)[tNZi5*Nx679l5/bQ#9A*%Ath');
define('NONCE_KEY', '6@&65c2W19LhE&4:GvY4!|5s9IV3;Q50957#%W);49W|3/~3E*680[&3(x1~F06W');
define('AUTH_SALT', 'hM79;]ueALwv6H*;5h#jG!931*%7ww9s7g@P81z3x-AzLk37Hh0q:;-BfD1r[0il');
define('SECURE_AUTH_SALT', 'c6SQ1f!#:wujG|cO+KGxd#N;131I9L&td)8vD7R;A&-#/)3%DFlmgG]Aa9-6#bp%');
define('LOGGED_IN_SALT', 'v0CG4+|9(69w#s28jcUZ_7B/7eWkY]7tL:2kcjMETL:#b6t7lgVr+uP@B#8Yf739');
define('NONCE_SALT', 'MzQc83P%7-X3B)ph1!&V82+@N8xunknz35+0xP8FfWj!12tW3s[U_Eay;@8+E:GN');

/**
 * WordPress Database Table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix = 'WojUJfVj_';


define('WP_ALLOW_MULTISITE', true);
/* That's all, stop editing! Happy publishing. */

/** Absolute path to the WordPress directory. */
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', dirname( __FILE__ ) . '/' );
}

/** Sets up WordPress vars and included files. */
require_once ABSPATH . 'wp-settings.php';
