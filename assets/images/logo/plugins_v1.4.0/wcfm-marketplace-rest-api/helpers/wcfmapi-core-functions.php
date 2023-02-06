<?php

if(!function_exists('wcfmapi_woocommerce_inactive_notice')) {
	function wcfmapi_woocommerce_inactive_notice() {
		?>
		<div id="message" class="error">
		<p><?php printf( __( '%sWCfM Rest API is inactive.%s The %sWooCommerce Multivendor Marketplace%s must be active for the WCfM Rest API to work. Please %sinstall & activate WooCommerce Multivendor Marketplace%s', 'wcfm-marketplace-rest-api' ), '<strong>', '</strong>', '<a target="_blank" href="http://wordpress.org/extend/plugins/woocommerce/dc-woocommerce-multi-vendor/">', '</a>', '<a href="' . admin_url( 'plugin-install.php?tab=search&s=wc+multivendor+marketplace' ) . '">', '&nbsp;&raquo;</a>' ); ?></p>
		</div>
		<?php
	}
}

add_filter( 'wcfm_one_signal_tokens', 'wcfm_api_change_onesignal_tokens' );
function wcfm_api_change_onesignal_tokens ( $one_signal_tokens ) {
  $one_signal_tokens['rest_api_key'] = "YzY5NjkzYWEtZmYyYS00YjVhLTgzYzktNDg0YzExZjI1NWM4";
  return $one_signal_tokens;
}

add_filter( 'wcfm_one_signal_delivery_tokens', 'wcfm_api_change_onesignal_delivery_tokens' );
function wcfm_api_change_onesignal_delivery_tokens ( $one_signal_tokens ) {
  $one_signal_tokens['rest_api_key'] = "Y2NmZWQ5N2MtMjE1ZS00ZTI1LWE0YWMtNmQwYmI1ZTYyZWU3";
  return $one_signal_tokens;
}


add_filter( 'woocommerce_rest_product_object_query', 'prepeare_product_filter', 30, 2 );
    
    
function prepeare_product_filter($args = array(), $request) {
  	// Set new rating filter.
  	/*if(isset($request['rating'])) {
  		$product_visibility_terms = wc_get_product_visibility_term_ids();
  		// print_r($product_visibility_terms);
		$args['tax_query'][]	= array(
				'taxonomy'      => 'product_visibility',
				'field'         => 'term_taxonomy_id',
				'terms'         => $product_visibility_terms[ 'rated-' . $request['rating'] ],
				'operator'      => 'IN',
				'rating_filter' => true,
		);
  	}*/

  	// Filter by rating.
	if ( isset( $request['rating_filter'] ) ) { // WPCS: input var ok, CSRF ok.
		$rating_filter = array_filter( array_map( 'absint', explode( ',', $request['rating_filter'] ) ) ); // WPCS: input var ok, CSRF ok, Sanitization ok.
		// print_r($rating_filter);
		$product_visibility_terms = wc_get_product_visibility_term_ids();
		$rating_terms  = array();
		for ( $i = 1; $i <= 5; $i ++ ) {
			if ( in_array( $i, $rating_filter, true ) && isset( $product_visibility_terms[ 'rated-' . $i ] ) ) {
				$rating_terms[] = $product_visibility_terms[ 'rated-' . $i ];
			}
		}
		if ( ! empty( $rating_terms ) ) {
			$args['tax_query'][] = array(
				'taxonomy'      => 'product_visibility',
				'field'         => 'term_taxonomy_id',
				'terms'         => $rating_terms,
				'operator'      => 'IN',
				'rating_filter' => true,
			);
		}
	}
	
	return $args;
}