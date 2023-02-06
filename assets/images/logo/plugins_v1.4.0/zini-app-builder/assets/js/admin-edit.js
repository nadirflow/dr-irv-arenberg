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

( function ( $ ) {
    
    "use strict";
    
    jQuery( document ).ready( function () {
        
        /** Bulk Create Audio. */
        var to_process = [];
        var f_bulk = false;
        jQuery( '#doaction' ).on( 'click', function( e ) {
            /** Process only 'Create Audio' action. */
            if (jQuery('#bulk-action-selector-top').val() !== 'ziniappbuilder') { return; }
            e.preventDefault();
            
            to_process = [];
            f_bulk = true;
            
            /** Generate Audio foreach post/page.  */
            jQuery( '#the-list .check-column input:checked' ).each( function() {                
                to_process.push( this.value );
            } );
            
            if ( ! to_process.length ) { return; }
            to_process = to_process.reverse();
            var p_id = to_process.pop();
            jQuery( '#post-' + p_id + ' .zs-ziniappbuilder-gen' ).click();
            jQuery( '#cb-select-' + p_id ).click();
            
        } ); 
        
    } ); // END Document Ready.

} ( jQuery ) );