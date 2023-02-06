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

        /** Make table great again! */
        $( '#zs-ziniappbuilder-settings-language-tbl' ).removeClass('hidden');
        var lang_table = $( '#zs-ziniappbuilder-settings-language-tbl' ).DataTable( {

            /** Show entries. */
            lengthMenu: [ [-1], ["All"] ],
            
            /** Add filters to table footer. */
            initComplete: function () {
                this.api().columns().every(function () {
                    var column = this;
                    var uiSelect = $( '<div class="mdc-select mdc-select-width mdc-select--outlined zs-language-select"><i class="mdc-select__dropdown-icon"></i></div>' );
                    var select = $( '<select class="mdc-select__native-control"><option value="" selected>Select Language</option></select>' );
                    var uiNotched = $( '<div class="mdc-notched-outline"><div class="mdc-notched-outline__leading"></div><div class="mdc-notched-outline__notch"><label class="mdc-floating-label mdc-floating-label--float-above">Select language</label></div><div class="mdc-notched-outline__trailing"></div></div>' );

                    /** Create filter only for first column. */
                    if ( column[0][0] != 0 ) { return; }

                    uiSelect.prependTo( '#zs-ziniappbuilder-settings-language-select' );
                    select.appendTo( '.zs-language-select' );
                    uiNotched.appendTo( '.zs-language-select' );

                    select.on( 'change', function () {

                        $( '#zs-ziniappbuilder-settings-language-tbl tbody' ).show();
                        $( '#zs-ziniappbuilder-settings-language-tbl_info' ).show();
                        $( '#zs-ziniappbuilder-settings-language-tbl_paginate' ).hide();
                        $( '#zs-ziniappbuilder-settings-language-tbl_length' ).hide();
                        $( '#zs-ziniappbuilder-settings-language-tbl thead' ).show();

                        var val = $.fn.dataTable.util.escapeRegex( $(this).val() );
                        column.search( val ? '^' + val + '$' : '', true, false ).draw();
                    } );

                    column.data().unique().sort().each( function ( d, j ) {
                        select.append( '<option value="' + d + '">' + d + '</option>' );
                    } );
                } );

                // Hide all lines on first load.
                $( '#zs-ziniappbuilder-settings-language-tbl tbody' ).hide();
                $( '#zs-ziniappbuilder-settings-language-tbl_info' ).hide();
                $( '#zs-ziniappbuilder-settings-language-tbl_paginate' ).hide();
                $( '#zs-ziniappbuilder-settings-language-tbl_length' ).hide();
                $( '#zs-ziniappbuilder-settings-language-tbl thead' ).hide();
            }
        } );
        
        /** Select language. */
        $( '#zs-ziniappbuilder-settings-language-tbl tbody' ).on( 'click', 'tr', function ( e ) {
            $( '#zs-ziniappbuilder-settings-language-tbl tr.selected' ).removeClass( 'selected' );
            $( this ).addClass( 'selected' );

            var voice_name = $( '#zs-ziniappbuilder-settings-language-tbl tr.selected .zs-voice-name' ).attr("title");
            var lang_code = $( '#zs-ziniappbuilder-settings-language-tbl tr.selected .zs-lang-code' ).text();
            $( '.zs-now-used strong' ).html( voice_name );
            $( '#zs-ziniappbuilder-settings-language' ).val( voice_name );
            $( '#zs-ziniappbuilder-settings-language-code' ).val( lang_code );

            // Update Audio Sample.
            var audio = $( '.zs-now-used audio' );
            $( '.zs-now-used audio source' ).attr( 'src', 'https://cloud.google.com/text-to-speech/docs/audio/' + voice_name + '.mp3' );
            audio[0].pause();
            audio[0].load();
        } );
        
        /** The "Select Key File" button. */
        $( '.zs-select-key-file-btn' ).on( 'click', function( e ) {
            e.preventDefault();
            var button = $( this );
            var key_uploader = wp.media({
                title: 'Select or Upload Logo File',
                button: {
                    text: 'Use this Logo'
                },
                library: {
                    type: [ 'png', 'gif','jpg', 'jpeg' ]
                },
                multiple: false  // Select only one file.
            })
            .on('select', function() {
                var attachment = key_uploader.state().get('selection').first().toJSON();
                $( button ).prev().prev().val( attachment.id );
                $( button ).prev().val( attachment.id );
                $( button ).next().text( attachment.filename );
            })
            .open();
        });
        
    } );

} ( jQuery ) );
