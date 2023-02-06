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
    
    $( document ).ready( function () {
        /** Show warning if we try to generate audio with unsaved changes. */
        let unsaved = false;
        
        /** For Gutenberg. */
        if (
            document.body.classList.contains( 'block-editor-page' )  &&
            !document.body.classList.contains( 'vc_editor' )
        ) {

            wp.data.subscribe( function () {
                if ( ! wp.data.select( 'core/editor' ) ) { return; }

                var isSavingPost = wp.data.select( 'core/editor' ).isSavingPost();
                var isAutosavingPost = wp.data.select( 'core/editor' ).isAutosavingPost();

                if ( isSavingPost && ! isAutosavingPost ) {

                    /** Post Saved First Time. */
                    if ( $( '.zs-warning' ).length ) {
                        $( '.zs-warning' ).replaceWith( '<div class="components-panel__row"><button id="zs_ziniappbuilder_generate" type="button" class="button-large components-button is-button is-primary is-large">Create audio</button></div>' );
                    }

                    unsaved = false;
                }

            } );
            
        }
        
        /** Triggers change in all input fields including text type. */
        $( ':input' ).on( 'change', function() { unsaved = true; } ); 

        /** Remove Audio Button. */
        $( document ).on( 'click', '#zs_ziniappbuilder_remove', function() {
            
            if ( $( this ).hasClass( 'is-busy' ) ) { return; }
            
            /** Confirm deteting. */
            if ( ! confirm( 'Are you sure you want to delete the audio version of this post?' ) ) { return; }
            
            /** Disable Button. */
            $( this ).addClass( 'is-busy' ).attr( 'disabled', true );
            
            var data = {
                action: 'remove_audio',
                security: zs_ziniappbuilder.ajax_nonce,
                post_id: zs_ziniappbuilder.post_id
            };
            
            $.post( ajaxurl, data, function ( response ) {
                
                /** Add audio player if audio file is ready. */
                if( response == 'ok' ) {
                    location.reload();
                }
                
            } )
            .fail( function() {
                alert( "error" );
            } )
            .always( function() {
                
                /** Enable Button. */
                $( '#zs_ziniappbuilder_generate' ).removeClass( 'is-busy' ).attr( 'disabled', false );
            } );
            
        } );
        
        
    } );

} ( jQuery ) );
