<?php
class WCFM_REST_Product_Controller extends WCFM_REST_Controller {
/**
   * Endpoint namespace
   *
   * @var string
   */
  protected $namespace = 'wcfmmp/v1';

  /**
   * Route name
   *
   * @var string
   */
  protected $base = 'products';

  /**
   * Post type
   *
   * @var string
   */
  protected $post_type = 'product';

  /**
   * Post status
   */
  protected $post_status = array( 'publish', 'pending', 'draft' );

  /**
    * Load autometically when class initiate
    *
    * @since 1.0.0
    */
    public function __construct() {
      //print_r('AAAAAAA');      die();
    }
    
    /**
     * Register all routes releated with stores
     *
     * @return void
     */
    public function register_routes() {
        register_rest_route( $this->namespace, '/' . $this->base, array(
            'args' => array(
                'id' => array(
                    'description' => __( 'Unique identifier for the object.', 'wcfm-marketplace-rest-api' ),
                    'type'        => 'integer',
                ),
            ),
            array(
                'methods'             => WP_REST_Server::READABLE,
                'callback'            => array( $this, 'get_items' ),
                'args'                => $this->get_collection_params(),
                'permission_callback' => array( $this, 'get_product_permissions_check' ),
            ),
            array(
                'methods'             => WP_REST_Server::CREATABLE,
                'callback'            => array( $this, 'create_item' ),
                'args'                => $this->get_endpoint_args_for_item_schema( WP_REST_Server::CREATABLE ),
                'permission_callback' => array( $this, 'create_product_permissions_check' ),
            ),
            'schema' => array( $this, 'get_public_item_schema' ),
        ) );
        
        register_rest_route( $this->namespace, '/' . $this->base . '/quick-edit/(?P<id>[\d]+)/', array(
            'args' => array(
                'id' => array(
                    'description' => __( 'Unique identifier for the object.', 'wcfm-marketplace-rest-api' ),
                    'type'        => 'integer',
                ),
            ),
            array(
                'methods'             => WP_REST_Server::EDITABLE,
                'callback'            => array( $this, 'quick_edit' ),
                'args'                => $this->get_endpoint_args_for_item_schema( WP_REST_Server::EDITABLE ),
                'permission_callback' => array( $this, 'update_product_permissions_check' ),
            )
          )
        );

        register_rest_route( $this->namespace, '/' . $this->base . '/(?P<id>[\d]+)/', array(
            'args' => array(
                'id' => array(
                    'description' => __( 'Unique identifier for the object.', 'wcfm-marketplace-rest-api' ),
                    'type'        => 'integer',
                ),
            ),
            array(
                'methods'             => WP_REST_Server::READABLE,
                'callback'            => array( $this, 'get_item' ),
                'args'                => $this->get_collection_params(),
                'permission_callback' => array( $this, 'get_product_permissions_check' ),
            ),
            array(
                'methods'             => WP_REST_Server::EDITABLE,
                'callback'            => array( $this, 'update_item' ),
                'args'                => $this->get_endpoint_args_for_item_schema( WP_REST_Server::EDITABLE ),
                'permission_callback' => array( $this, 'update_product_permissions_check' ),
            ),
            array(
                'methods'             => WP_REST_Server::DELETABLE,
                'callback'            => array( $this, 'delete_item' ),
                'permission_callback' => array( $this, 'delete_product_permissions_check' ),
                'args'                => array(
                    'force' => array(
                        'type'        => 'boolean',
                        'default'     => false,
                        'description' => __( 'Whether to bypass trash and force deletion.', 'wcfm-marketplace-rest-api' ),
                    ),
                ),
            )
          )
        );
        register_rest_route( $this->namespace, '/' . $this->base . '/filter', array(
            /*'args' => array(
                'search' => array(
                    'description' => __( 'Product search param.', 'wcfm-marketplace-rest-api' ),
                    'type'        => 'string',
                ),
            ),*/
            array(
                'methods'             => WP_REST_Server::READABLE,
                'callback'            => array( $this, 'filter_params' ),
                'args'                => $this->get_collection_params(),
                'permission_callback' => array( $this, 'get_filter_permissions_check' ),
            )
          )
        );
        
    }

    /**
     * Get product object
     *
     * @since 1.0.0
     *
     * @return void
     */
    public function get_object( $id ) {
      if(!wc_get_product($id))
        return new WP_Error( "wcfmapi_rest_invalid_{$this->post_type}_id", sprintf( __( "Invalid ID", 'wcfm-marketplace-rest-api' ), __METHOD__ ), array( 'status' => 404 ) );
      return wc_get_product( $id );
    }
        
    /**
     * get_product_permissions_check
     *
     * @since 1.0.0
     *
     * @return void
     */
    public function get_product_permissions_check( $request ) {      
      if( !is_user_logged_in() )  return false;
      if( apply_filters( 'wcfm_is_allow_manage_products', true ) ) {
        if(isset( $request['id'] )) {
          //return current_user_can( 'edit_post', (int) $request['id'] );
          if( apply_filters( 'wcfm_is_allow_edit_products', true ) ) {
            return true;
          }
          return false;
        }
        return true;
      }
      return false;
    }

    /**
     * create_product_permissions_check
     *
     * @since 1.0.0
     *
     * @return void
     */
    public function create_product_permissions_check() {
      if( !is_user_logged_in() )  return false;
      if( apply_filters( 'wcfm_is_allow_add_products', true ) )
        return true;
      
      return false;
    }
    /**
     * update_product_permissions_check
     *
     * @since 1.0.0
     *
     * @return void
     */
    public function update_product_permissions_check( $request ) {
      if( !is_user_logged_in() )  return false;
      if( apply_filters( 'wcfm_is_allow_edit_products', true ) ) {
        // if(isset( $request['id'] )) {
        //   return current_user_can( 'edit_post', (int) $request['id'] );
        // }
        return true;
      }

      return false;
    }
    
    /**
     * delete_product_permissions_check
     *
     * @since 1.0.0
     *
     * @return void
     */
    public function delete_product_permissions_check( $request ) {
      if( !is_user_logged_in() )  return false;
      if( apply_filters( 'wcfm_is_allow_delete_products', true ) ) {
        if(isset( $request['id'] )) {
          return current_user_can( 'delete_post', (int) $request['id'] );
        }
        return true;
      }
      
      return false;
    }

    /**
     * get_filter_permissions_check
     *
     * @since 1.0.0
     *
     * @return void
     */
    public function get_filter_permissions_check( $request ) {
      return true;
    }

    protected function set_product_images( $product, $images ) {
      $images = is_array( $images ) ? array_filter( $images ) : array();

      if ( ! empty( $images ) ) {
        $gallery = array();

        foreach ( $images as $index => $image ) {
          $attachment_id = isset( $image['id'] ) ? absint( $image['id'] ) : 0;

          if ( 0 === $attachment_id && isset( $image['src'] ) ) {
            $upload = wc_rest_upload_image_from_url( esc_url_raw( $image['src'] ) );

            if ( is_wp_error( $upload ) ) {
              if ( ! apply_filters( 'woocommerce_rest_suppress_image_upload_error', false, $upload, $product->get_id(), $images ) ) {
                throw new WC_REST_Exception( 'woocommerce_product_image_upload_error', $upload->get_error_message(), 400 );
              } else {
                continue;
              }
            }

            $attachment_id = wc_rest_set_uploaded_image_as_attachment( $upload, $product->get_id() );
          }

          if ( ! wp_attachment_is_image( $attachment_id ) ) {
            /* translators: %s: image ID */
            throw new WC_REST_Exception( 'woocommerce_product_invalid_image_id', sprintf( __( '#%s is an invalid image ID.', 'woocommerce' ), $attachment_id ), 400 );
          }

          $featured_image = $product->get_image_id();

          if ( 0 === $index ) {
            $product->set_image_id( $attachment_id );
          } else {
            $gallery[] = $attachment_id;
          }

          // Set the image alt if present.
          if ( ! empty( $image['alt'] ) ) {
            update_post_meta( $attachment_id, '_wp_attachment_image_alt', wc_clean( $image['alt'] ) );
          }

          // Set the image name if present.
          if ( ! empty( $image['name'] ) ) {
            wp_update_post(
              array(
                'ID'         => $attachment_id,
                'post_title' => $image['name'],
              )
            );
          }
        }

        $product->set_gallery_image_ids( $gallery );
      } else {
        $product->set_image_id( '' );
        $product->set_gallery_image_ids( array() );
      }

      return $product;
    }
    
    
    public function quick_edit($request) {

      $id = isset( $request['id'] ) ? absint( $request['id'] ) : 0;
      if ( isset( $request['id'] ) ) {
        $product = $this->get_object( $id );
      }

      if(isset($product) && !is_wp_error($product)) {
        if ( isset( $request['name'] ) ) {
         $product->set_name( wp_filter_post_kses( $request['name'] ) );
        }
        // Featured Product.
        if ( isset( $request['featured'] ) ) {
          $product->set_featured( $request['featured'] );
        }
        // SKU.
        if ( isset( $request['sku'] ) ) {
            $product->set_sku( wc_clean( $request['sku'] ) );
        }

        // Catalog Visibility.
        if ( isset( $request['catalog_visibility'] ) ) {
          $product->set_catalog_visibility( $request['catalog_visibility'] );
        }

        // Check for featured/gallery images, upload it and set it.
        if ( isset( $request['images'] ) ) {
          $product = $this->set_product_images( $product, $request['images'] );
        }
        
        // Sales and prices.
        if ( in_array( $product->get_type(), array( 'variable', 'grouped' ), true ) ) {
          $product->set_regular_price( '' );
          $product->set_sale_price( '' );
          $product->set_date_on_sale_to( '' );
          $product->set_date_on_sale_from( '' );
          $product->set_price( '' );
        } else {
          // Regular Price.
          if ( isset( $request['regular_price'] ) ) {
            $product->set_regular_price( $request['regular_price'] );
          }
          // Sale Price.
          if ( isset( $request['sale_price'] ) ) {
            $product->set_sale_price( $request['sale_price'] );
          }
          if ( isset( $request['date_on_sale_from'] ) ) {
            $product->set_date_on_sale_from( $request['date_on_sale_from'] );
          }
          if ( isset( $request['date_on_sale_from_gmt'] ) ) {
            $product->set_date_on_sale_from( $request['date_on_sale_from_gmt'] ? strtotime( $request['date_on_sale_from_gmt'] ) : null );
          }

          if ( isset( $request['date_on_sale_to'] ) ) {
            $product->set_date_on_sale_to( $request['date_on_sale_to'] );
          }

          if ( isset( $request['date_on_sale_to_gmt'] ) ) {
              $product->set_date_on_sale_to( $request['date_on_sale_to_gmt'] ? strtotime( $request['date_on_sale_to_gmt'] ) : null );
          }
        }
        
        // Stock status.
        if ( isset( $request['in_stock'] ) ) {
          $stock_status = true === $request['in_stock'] ? 'instock' : 'outofstock';
        } else {
          $stock_status = $product->get_stock_status();
        }

        // Stock data.
        if ( 'yes' === get_option( 'woocommerce_manage_stock' ) ) {
          // Manage stock.
          if ( isset( $request['manage_stock'] ) ) {
            $product->set_manage_stock( $request['manage_stock'] );
          }

          // Backorders.
          if ( isset( $request['backorders'] ) ) {
            $product->set_backorders( $request['backorders'] );
          }

          if ( $product->is_type( 'grouped' ) ) {
            $product->set_manage_stock( 'no' );
            $product->set_backorders( 'no' );
            $product->set_stock_quantity( '' );
            $product->set_stock_status( $stock_status );
          } elseif ( $product->is_type( 'external' ) ) {
            $product->set_manage_stock( 'no' );
            $product->set_backorders( 'no' );
            $product->set_stock_quantity( '' );
            $product->set_stock_status( 'instock' );
          } elseif ( $product->get_manage_stock() ) {
            // Stock status is always determined by children so sync later.
            if ( ! $product->is_type( 'variable' ) ) {
              $product->set_stock_status( $stock_status );
            }

            // Stock quantity.
            if ( isset( $request['stock_quantity'] ) ) {
              $product->set_stock_quantity( wc_stock_amount( $request['stock_quantity'] ) );
            } elseif ( isset( $request['inventory_delta'] ) ) {
              $stock_quantity  = wc_stock_amount( $product->get_stock_quantity() );
              $stock_quantity += wc_stock_amount( $request['inventory_delta'] );
              $product->set_stock_quantity( wc_stock_amount( $stock_quantity ) );
            }
          } else {
              // Don't manage stock.
            $product->set_manage_stock( 'no' );
            $product->set_stock_quantity( '' );
            $product->set_stock_status( $stock_status );
          }
        } elseif ( ! $product->is_type( 'variable' ) ) {
          $product->set_stock_status( $stock_status );
        }

        //Assign categories
        $categories = isset($request['categories']) && is_array($request['categories']) ? array_filter($request['categories']) : array();
        if ( !empty($categories) ) {          
          $categoryArray = array();
          foreach($categories as $index=>$category) {
            $categoryArray[] = absint($category['id']);
          }
          $product->set_category_ids($categoryArray);
        }

        //Description
        //$product->set_short_description( $request['short_description'] );
        //$product->set_description( $request['description'] );
        
        if ( is_wp_error( $product ) ) {
          return $product;
        }
        
        $product->save();
        wp_update_post( array( 'ID' => $product->get_id(), 'post_author' => get_current_user_id() ) );
        //print_r($product);
        
        return $this->prepare_data_for_response( $this->get_object( $product->get_id() ), $request );
      }
      
    }
    
    

    
    /**
     * Get product data.
     *
     * @param WC_Product $product Product instance.
     * @param string     $context Request context.
     *                            Options: 'view' and 'edit'.
     * @return array
     */
    public function prepare_data_for_response( $product, $request ) {
        $context = ! empty( $request['context'] ) ? $request['context'] : 'view';
        $data = array(
            'id'                    => $product->get_id(),
            'name'                  => $product->get_name( $context ),
            'slug'                  => $product->get_slug( $context ),
            'post_author'           => get_post_field( 'post_author', $product->get_id() ),
            'permalink'             => $product->get_permalink(),
            'date_created'          => wc_rest_prepare_date_response( $product->get_date_created( $context ), false ),
            'date_created_gmt'      => wc_rest_prepare_date_response( $product->get_date_created( $context ) ),
            'date_modified'         => wc_rest_prepare_date_response( $product->get_date_modified( $context ), false ),
            'date_modified_gmt'     => wc_rest_prepare_date_response( $product->get_date_modified( $context ) ),
            'type'                  => $product->get_type(),
            'status'                => $product->get_status( $context ),
            'featured'              => $product->is_featured(),
            'catalog_visibility'    => $product->get_catalog_visibility( $context ),
            'description'           => 'view' === $context ? wpautop( do_shortcode( $product->get_description() ) ) : $product->get_description( $context ),
            'short_description'     => 'view' === $context ? apply_filters( 'woocommerce_short_description', $product->get_short_description() ) : $product->get_short_description( $context ),
            'sku'                   => $product->get_sku( $context ),
            'price'                 => $product->get_price( $context ),
            'regular_price'         => $product->get_regular_price( $context ),
            'sale_price'            => $product->get_sale_price( $context ) ? $product->get_sale_price( $context ) : '',
            'date_on_sale_from'     => wc_rest_prepare_date_response( $product->get_date_on_sale_from( $context ), false ),
            'date_on_sale_from_gmt' => wc_rest_prepare_date_response( $product->get_date_on_sale_from( $context ) ),
            'date_on_sale_to'       => wc_rest_prepare_date_response( $product->get_date_on_sale_to( $context ), false ),
            'date_on_sale_to_gmt'   => wc_rest_prepare_date_response( $product->get_date_on_sale_to( $context ) ),
            'price_html'            => $product->get_price_html(),
            'on_sale'               => $product->is_on_sale( $context ),
            'purchasable'           => $product->is_purchasable(),
            'total_sales'           => $product->get_total_sales( $context ),
            'virtual'               => $product->is_virtual(),
            'downloadable'          => $product->is_downloadable(),
            'downloads'             => $this->get_downloads( $product ),
            'download_limit'        => $product->get_download_limit( $context ),
            'download_expiry'       => $product->get_download_expiry( $context ),
            'external_url'          => $product->is_type( 'external' ) ? $product->get_product_url( $context ) : '',
            'button_text'           => $product->is_type( 'external' ) ? $product->get_button_text( $context ) : '',
            'tax_status'            => $product->get_tax_status( $context ),
            'tax_class'             => $product->get_tax_class( $context ),
            'manage_stock'          => $product->managing_stock(),
            'stock_quantity'        => $product->get_stock_quantity( $context ),
            'low_stock_amount'      => version_compare( WC_VERSION, '3.4.7', '>' ) ? $product->get_low_stock_amount( $context ) : '',
            'in_stock'              => $product->is_in_stock(),
            'backorders'            => $product->get_backorders( $context ),
            'backorders_allowed'    => $product->backorders_allowed(),
            'backordered'           => $product->is_on_backorder(),
            'sold_individually'     => $product->is_sold_individually(),
            'weight'                => $product->get_weight( $context ),
            'dimensions'            => array(
                'length' => $product->get_length( $context ),
                'width'  => $product->get_width( $context ),
                'height' => $product->get_height( $context ),
            ),
            'shipping_required'     => $product->needs_shipping(),
            'shipping_taxable'      => $product->is_shipping_taxable(),
            'shipping_class'        => $product->get_shipping_class(),
            'shipping_class_id'     => $product->get_shipping_class_id( $context ),
            'reviews_allowed'       => $product->get_reviews_allowed( $context ),
            'average_rating'        => 'view' === $context ? wc_format_decimal( $product->get_average_rating(), 2 ) : $product->get_average_rating( $context ),
            'rating_count'          => $product->get_rating_count(),
            'related_ids'           => array_map( 'absint', array_values( wc_get_related_products( $product->get_id() ) ) ),
            'upsell_ids'            => array_map( 'absint', $product->get_upsell_ids( $context ) ),
            'cross_sell_ids'        => array_map( 'absint', $product->get_cross_sell_ids( $context ) ),
            'parent_id'             => $product->get_parent_id( $context ),
            'purchase_note'         => 'view' === $context ? wpautop( do_shortcode( wp_kses_post( $product->get_purchase_note() ) ) ) : $product->get_purchase_note( $context ),
            'categories'            => $this->get_taxonomy_terms( $product ),
            'tags'                  => $this->get_taxonomy_terms( $product, 'tag' ),
            'images'                => $this->get_images( $product ),
            'attributes'            => $this->get_attributes( $product ),
            'default_attributes'    => $this->get_default_attributes( $product ),
            'variations'            => array(),
            'grouped_products'      => array(),
            'menu_order'            => $product->get_menu_order( $context ),
            'meta_data'             => $product->get_meta_data(),
        );

        $response = rest_ensure_response( $data );
        $response->add_links( $this->prepare_links( $product, $request ) );
        return apply_filters( "wcfmapi_rest_prepare_{$this->post_type}_object", $response, $product, $request );
    }
    
    /**
     * Prepare object for database mapping
     *
     * @param objec  $request
     * @param boolean $creating
     *
     * @return object
     */
    
    protected function prepare_object_for_database( $request, $creating = false ) {
      global $WCFM;
      $product_form_data = array();
      $_POST["controller"] = 'wcfm-products-manage';
      $_POST["excerpt"] = $request['short_description'];
      $_POST["description"]  = $request['description'];
      
      $map_product_form_data_with_request = array(
          'pro_title'                 =>  $request['name'],               // Product Name
          'sku'                   =>  $request['sku'],                // Product SKU
          'product_type'          =>  $request['type'],       // Product Type
          'is_downloadable'       =>  $request['downloadable'],       // Product Downloadable
          'downloadable_files'    =>  $request['downloadable_files'], // Downloadable Files
          'product_cats'          =>  $request['categories'],         // Product Categories
          'product_tags'          =>  $request['tags'],
          'product_custom_taxonomies' => $request['product_custom_taxonomies'],
          'product_tags'              => $request['product_tags'],
          'product_custom_taxonomies_flat' => $request['product_custom_taxonomies_flat'],
          'featured_img'          =>  $request['featured_image'],
          'gallery_img'           =>  $request['gallery_images'],
          'attributes'            =>  $request['attributes'],
          'default_attributes'    =>  $request['default_attributes'],
          'grouped_products'      =>  $request['grouped_products'],
          'virtual'            => $request['is_virtual'],
          'tax_status'         => $request['tax_status'],
          'tax_class'          => $request['tax_class'],
          'weight'             => $request['weight'],
          'length'             => $request['length'],
          'width'              => $request['width'],
          'height'             => $request['height'],
          'shipping_class_id'  => $request['shipping_class'],
          'sold_individually'  => $request['sold_individually'],
          'upsell_ids'         => $request['upsell_ids'],
          'cross_sell_ids'     => $request['crosssell_ids'],
          'regular_price'      => $request['regular_price'],
          'sale_price'         => $request['sale_price'],
          'date_on_sale_from'  => $request['sale_date_from'],
          'date_on_sale_to'    => $request['sale_date_upto'],
          'manage_stock'       => ( empty($request['manage_stock']) || $request['product_type'] === 'external' || $request['manage_stock'] === '' ) ? false : $request['manage_stock'],
          'backorders'         => ( empty($request['backorders']) || $request['product_type'] === 'external' || $request['backorders'] === '' ) ? 'no' : $request['backorders'],
          'stock_status'       => ( empty($request['stock_status']) || $request['product_type'] === 'external' || $request['stock_status'] === '' ) ? 'instock' : $request['stock_status'],
          'stock_qty'     => $request['stock_quantity'],
          'product_url'        => $request['product_url'],
          'button_text'        => $request['button_text'],
          'download_limit'     => empty( $request['download_limit'] ) ? '' : $request['download_limit'],
          'download_expiry'    => empty( $request['download_expiry'] ) ? '' : $request['download_expiry'],
          'reviews_allowed'    => true
      );
      $map_product_form_data_with_request = apply_filters( "wcfmapi_rest_pre_insert_{$this->post_type}_object", $map_product_form_data_with_request, $request, $creating );
      $_POST['wcfm_products_manage_form'] = $map_product_form_data_with_request;
      $_POST['wcfm_products_manage_form']['pro_id']  = isset( $request['id'] ) ? absint( $request['id'] ) : 0;
      //print_r($map_product_form_data_with_request);
   
      define('WCFM_REST_API_CALL', TRUE);
      $WCFM->init();
      $response = $WCFM->ajax->wcfm_ajax_controller();
      
      return json_decode( $response );
    }
    
    /**
     * Get taxonomy terms.
     *
     * @param WC_Product $product  Product instance.
     * @param string     $taxonomy Taxonomy slug.
     * @return array
     */
    protected function get_taxonomy_terms( $product, $taxonomy = 'cat' ) {
        $terms = array();

        foreach ( wc_get_object_terms( $product->get_id(), 'product_' . $taxonomy ) as $term ) {
            $terms[] = array(
                'id'   => $term->term_id,
                'name' => $term->name,
                'slug' => $term->slug,
            );
        }

        return $terms;
    }

    /**
     * Get the images for a product or product variation.
     *
     * @param WC_Product|WC_Product_Variation $product Product instance.
     * @return array
     */
    protected function get_images( $product ) {
        $images = array();
        $attachment_ids = array();

        // Add featured image.
        if ( has_post_thumbnail( $product->get_id() ) ) {
            $attachment_ids[] = $product->get_image_id();
        }

        // Add gallery images.
        $attachment_ids = array_merge( $attachment_ids, $product->get_gallery_image_ids() );

        // Build image data.
        foreach ( $attachment_ids as $position => $attachment_id ) {
            $attachment_post = get_post( $attachment_id );
            if ( is_null( $attachment_post ) ) {
                continue;
            }

            $attachment = wp_get_attachment_image_src( $attachment_id, 'full' );
            if ( ! is_array( $attachment ) ) {
                continue;
            }

            $images[] = array(
                'id'                => (int) $attachment_id,
                'date_created'      => wc_rest_prepare_date_response( $attachment_post->post_date, false ),
                'date_created_gmt'  => wc_rest_prepare_date_response( strtotime( $attachment_post->post_date_gmt ) ),
                'date_modified'     => wc_rest_prepare_date_response( $attachment_post->post_modified, false ),
                'date_modified_gmt' => wc_rest_prepare_date_response( strtotime( $attachment_post->post_modified_gmt ) ),
                'src'               => current( $attachment ),
                'name'              => get_the_title( $attachment_id ),
                'alt'               => get_post_meta( $attachment_id, '_wp_attachment_image_alt', true ),
                'position'          => (int) $position,
            );
        }

        // Set a placeholder image if the product has no images set.
        if ( empty( $images ) ) {
            $images[] = array(
                'id'                => 0,
                'date_created'      => wc_rest_prepare_date_response( current_time( 'mysql' ), false ), // Default to now.
                'date_created_gmt'  => wc_rest_prepare_date_response( current_time( 'timestamp', true ) ), // Default to now.
                'date_modified'     => wc_rest_prepare_date_response( current_time( 'mysql' ), false ),
                'date_modified_gmt' => wc_rest_prepare_date_response( current_time( 'timestamp', true ) ),
                'src'               => wc_placeholder_img_src(),
                'name'              => __( 'Placeholder', 'wcfm-marketplace-rest-api' ),
                'alt'               => __( 'Placeholder', 'wcfm-marketplace-rest-api' ),
                'position'          => 0,
            );
        }

        return $images;
    }

    /**
     * Get product attribute taxonomy name.
     *
     * @since  1.0.0
     * @param  string     $slug    Taxonomy name.
     * @param  WC_Product $product Product data.
     * @return string
     */
    protected function get_attribute_taxonomy_name( $slug, $product ) {
        $attributes = $product->get_attributes();

        if ( ! isset( $attributes[ $slug ] ) ) {
            return str_replace( 'pa_', '', $slug );
        }

        $attribute = $attributes[ $slug ];

        // Taxonomy attribute name.
        if ( $attribute->is_taxonomy() ) {
            $taxonomy = $attribute->get_taxonomy_object();
            return $taxonomy->attribute_label;
        }

        // Custom product attribute name.
        return $attribute->get_name();
    }

    /**
     * Get default attributes.
     *
     * @param WC_Product $product Product instance.
     * @return array
     */
    protected function get_default_attributes( $product ) {
        $default = array();

        if ( $product->is_type( 'variable' ) ) {
            foreach ( array_filter( (array) $product->get_default_attributes(), 'strlen' ) as $key => $value ) {
                if ( 0 === strpos( $key, 'pa_' ) ) {
                    $default[] = array(
                        'id'     => wc_attribute_taxonomy_id_by_name( $key ),
                        'name'   => $this->get_attribute_taxonomy_name( $key, $product ),
                        'option' => $value,
                    );
                } else {
                    $default[] = array(
                        'id'     => 0,
                        'name'   => $this->get_attribute_taxonomy_name( $key, $product ),
                        'option' => $value,
                    );
                }
            }
        }

        return $default;
    }

    /**
     * Get attribute options.
     *
     * @param int   $product_id Product ID.
     * @param array $attribute  Attribute data.
     * @return array
     */
    protected function get_attribute_options( $product_id, $attribute ) {
        if ( isset( $attribute['is_taxonomy'] ) && $attribute['is_taxonomy'] ) {
            return wc_get_product_terms( $product_id, $attribute['name'], array(
                'fields' => 'names',
            ) );
        } elseif ( isset( $attribute['value'] ) ) {
            return array_map( 'trim', explode( '|', $attribute['value'] ) );
        }

        return array();
    }

    /**
     * Get the attributes for a product or product variation.
     *
     * @param WC_Product|WC_Product_Variation $product Product instance.
     * @return array
     */
    protected function get_attributes( $product ) {
        $attributes = array();

        if ( $product->is_type( 'variation' ) ) {
            $_product = wc_get_product( $product->get_parent_id() );
            foreach ( $product->get_variation_attributes() as $attribute_name => $attribute ) {
                $name = str_replace( 'attribute_', '', $attribute_name );

                if ( ! $attribute ) {
                    continue;
                }

                // Taxonomy-based attributes are prefixed with `pa_`, otherwise simply `attribute_`.
                if ( 0 === strpos( $attribute_name, 'attribute_pa_' ) ) {
                    $option_term = get_term_by( 'slug', $attribute, $name );
                    $attributes[] = array(
                        'id'     => wc_attribute_taxonomy_id_by_name( $name ),
                        'name'   => $this->get_attribute_taxonomy_name( $name, $_product ),
                        'option' => $option_term && ! is_wp_error( $option_term ) ? $option_term->name : $attribute,
                    );
                } else {
                    $attributes[] = array(
                        'id'     => 0,
                        'name'   => $this->get_attribute_taxonomy_name( $name, $_product ),
                        'option' => $attribute,
                    );
                }
            }
        } else {
            foreach ( $product->get_attributes() as $attribute ) {
                $attributes[] = array(
                    'id'        => $attribute['is_taxonomy'] ? wc_attribute_taxonomy_id_by_name( $attribute['name'] ) : 0,
                    'name'      => $this->get_attribute_taxonomy_name( $attribute['name'], $product ),
                    'position'  => (int) $attribute['position'],
                    'visible'   => (bool) $attribute['is_visible'],
                    'variation' => (bool) $attribute['is_variation'],
                    'options'   => $this->get_attribute_options( $product->get_id(), $attribute ),
                );
            }
        }

        return $attributes;
    }

    /**
     * Get the downloads for a product or product variation.
     *
     * @param WC_Product|WC_Product_Variation $product Product instance.
     * @return array
     */
    protected function get_downloads( $product ) {
        $downloads = array();

        if ( $product->is_downloadable() ) {
            foreach ( $product->get_downloads() as $file_id => $file ) {
                $downloads[] = array(
                    'id'   => $file_id, // MD5 hash.
                    'name' => $file['name'],
                    'file' => $file['file'],
                );
            }
        }

        return $downloads;
    }
    
    /**
     * Prepare links for the request.
     *
     * @param WC_Data         $object  Object data.
     * @param WP_REST_Request $request Request object.
     *
     * @return array                   Links for the given post.
     */
    protected function prepare_links( $object, $request ) {
        $links = array(
            'self'       => array(
                'href' => rest_url( sprintf( '/%s/%s/%d', $this->namespace, $this->base, $object->get_id() ) ),
            ),
            'collection' => array(
                'href' => rest_url( sprintf( '/%s/%s', $this->namespace, $this->base ) ),
            ),
        );

        if ( $object->get_parent_id() ) {
            $links['up'] = array(
                'href' => rest_url( sprintf( '/%s/products/%d', $this->namespace, $object->get_parent_id() ) ),
            );
        }

        return $links;
    }
    
    protected function prepare_objects_query( $request ) {
        $args = parent::prepare_objects_query( $request );

        // Set post_status.
        $args['post_status'] = isset( $request['status'] ) ? $request['status'] : $request['post_status'];

        // Taxonomy query to filter products by type, category,
        // tag, shipping class, and attribute.
        $tax_query = array();

        // Map between taxonomy name and arg's key.
        $taxonomies = array(
            'product_cat'            => 'category',
            'product_tag'            => 'tag',
            'product_shipping_class' => 'shipping_class',
        );

        // Set tax_query for each passed arg.
        foreach ( $taxonomies as $taxonomy => $key ) {
            if ( ! empty( $request[ $key ] ) ) {
                $tax_query[] = array(
                    'taxonomy' => $taxonomy,
                    'field'    => 'term_id',
                    'terms'    => $request[ $key ],
                );
            }
        }

        // Filter product type by slug.
        if ( ! empty( $request['type'] ) ) {
            $tax_query[] = array(
                'taxonomy' => 'product_type',
                'field'    => 'slug',
                'terms'    => $request['type'],
            );
        }

        // Filter by attribute and term.
        if ( ! empty( $request['attribute'] ) && ! empty( $request['attribute_term'] ) ) {
            if ( in_array( $request['attribute'], wc_get_attribute_taxonomy_names(), true ) ) {
                $tax_query[] = array(
                    'taxonomy' => $request['attribute'],
                    'field'    => 'term_id',
                    'terms'    => $request['attribute_term'],
                );
            }
        }

        if ( ! empty( $tax_query ) ) {
            $args['tax_query'] = $tax_query; // WPCS: slow query ok.
        }

        // Filter featured.
        if ( is_bool( $request['featured'] ) ) {
            $args['tax_query'][] = array(
                'taxonomy' => 'product_visibility',
                'field'    => 'name',
                'terms'    => 'featured',
            );
        }

        // Filter by sku.
        if ( ! empty( $request['sku'] ) ) {
            $skus = explode( ',', $request['sku'] );
            // Include the current string as a SKU too.
            if ( 1 < count( $skus ) ) {
                $skus[] = $request['sku'];
            }

            $args['meta_query'] = $this->add_meta_query( // WPCS: slow query ok.
                $args, array(
                    'key'     => '_sku',
                    'value'   => $skus,
                    'compare' => 'IN',
                )
            );
        }

        // Filter by tax class.
        if ( ! empty( $request['tax_class'] ) ) {
            $args['meta_query'] = $this->add_meta_query( // WPCS: slow query ok.
                $args, array(
                    'key'   => '_tax_class',
                    'value' => 'standard' !== $request['tax_class'] ? $request['tax_class'] : '',
                )
            );
        }

        // Price filter.
        if ( ! empty( $request['min_price'] ) || ! empty( $request['max_price'] ) ) {
            $args['meta_query'] = $this->add_meta_query( $args, wc_get_min_max_price_meta_query( $request ) );  // WPCS: slow query ok.
        }

        // Filter product in stock or out of stock.
        if ( is_bool( $request['in_stock'] ) ) {
            $args['meta_query'] = $this->add_meta_query( // WPCS: slow query ok.
                $args, array(
                    'key'   => '_stock_status',
                    'value' => true === $request['in_stock'] ? 'instock' : 'outofstock',
                )
            );
        }

        // Filter by on sale products.
        if ( is_bool( $request['on_sale'] ) ) {
            $on_sale_key = $request['on_sale'] ? 'post__in' : 'post__not_in';
            $on_sale_ids = wc_get_product_ids_on_sale();

            // Use 0 when there's no on sale products to avoid return all products.
            $on_sale_ids = empty( $on_sale_ids ) ? array( 0 ) : $on_sale_ids;

            $args[ $on_sale_key ] += $on_sale_ids;
        }

        // Force the post_type argument, since it's not a user input variable.
        if ( ! empty( $request['sku'] ) ) {
            $args['post_type'] = array( 'product', 'product_variation' );
        } else {
            $args['post_type'] = $this->post_type;
        }

        return $args;
    }
    
    /**
     * Save product shipping data.
     *
     * @param WC_Product $product Product instance.
     * @param array      $data    Shipping data.
     * @return WC_Product
     */
    protected function save_product_shipping_data( $product, $data ) {
        // Virtual.
        if ( isset( $data['virtual'] ) && true === $data['virtual'] ) {
            $product->set_weight( '' );
            $product->set_height( '' );
            $product->set_length( '' );
            $product->set_width( '' );
        } else {
            if ( isset( $data['weight'] ) ) {
                $product->set_weight( $data['weight'] );
            }

            // Height.
            if ( isset( $data['dimensions']['height'] ) ) {
                $product->set_height( $data['dimensions']['height'] );
            }

            // Width.
            if ( isset( $data['dimensions']['width'] ) ) {
                $product->set_width( $data['dimensions']['width'] );
            }

            // Length.
            if ( isset( $data['dimensions']['length'] ) ) {
                $product->set_length( $data['dimensions']['length'] );
            }
        }

        // Shipping class.
        if ( isset( $data['shipping_class'] ) ) {
            $data_store        = $product->get_data_store();
            $shipping_class_id = $data_store->get_shipping_class_id_by_slug( wc_clean( $data['shipping_class'] ) );
            $product->set_shipping_class_id( $shipping_class_id );
        }

        return $product;
    }


    /**
     * Get product search filter data.
     *
     * @param WC_Product $product Product instance.
     * @param array      $data    Shipping data.
     * @return WC_Product
     */
    public function filter_params( $request ) {
      global $wpdb;

      $query_args = $this->prepare_objects_query( $request );
      $query_args['posts_per_page'] = -1;
      $query_args['author'] = "";
      $query_args['fields'] = 'ids';

      $query  = new WP_Query();
      $products = $query->query( $query_args );
      $product_ids = array();
      foreach($products as $product) {
        $product_ids[] = $product;
      }

      $product_id_in = implode(',', $product_ids);
      if(!empty($product_id_in)) {
        $sql = "
          SELECT min( min_price ) as min_price, MAX( max_price ) as max_price
          FROM {$wpdb->wc_product_meta_lookup}
          WHERE product_id IN (" . $product_id_in . ")";
        } else {
          $sql = "
            SELECT min( min_price ) as min_price, MAX( max_price ) as max_price
            FROM {$wpdb->wc_product_meta_lookup}";
        }
      

      $price_result = $wpdb->get_row( $sql ); // WPCS: unprepared SQL ok.

      $prepared_args = array(
        // 'search'     => $request['search']
      );
      $category_result = get_terms( 'product_cat', $prepared_args );

      $categories = array_values($category_result);
      $attributes = array();
      $tags = array();
      $rating = array( '1', '2', '3', '4', '5' );
      $price = $price_result;

      $filter_list = array(
        'categories' => $categories,
        'attributes' => $attributes,
        'tags' => $tags,
        'rating' => $rating,
        'price' => $price
      );

      $response = rest_ensure_response ( $filter_list );

      return $response;
    }
    
    
}