<?php
class WCFM_REST_Product_Categories_Controller extends WCFM_REST_Controller {
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
  protected $base = 'products/categories';

  /**
   * Taxonomy.
   *
   * @var string
   */
  protected $taxonomy = 'product_cat';

  /**
    * Load autometically when class initiate
    *
    * @since 1.0.0
    */
    public function __construct() {

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
                'callback'            => array( $this, 'get_categories' ),
                'args'                => $this->get_collection_params(),
                'permission_callback' => array( $this, 'get_product_category_permissions_check' ),
            ),
            'schema' => array( $this, 'get_public_item_schema' ),
        ) );
    }

    /**
     * get_product_category_permissions_check
     *
     * @since 1.0.0
     *
     * @return void
     */
    public function get_product_category_permissions_check() {
      if( !is_user_logged_in() )  return false;
      if( apply_filters( 'wcfm_is_allow_manage_products', true ) )
        return true; 
      return false;
    }

    /**
     * Get terms associated with a taxonomy.
     *
     * @param WP_REST_Request $request Full details about the request.
     * @return WP_REST_Response|WP_Error
     */
    public function get_categories( $request ) {

      $taxonomy      = $this->get_taxonomy( $request );
      $prepared_args = array(
        'exclude'    => $request['exclude'],
        'include'    => $request['include'],
        'order'      => $request['order'],
        'orderby'    => $request['orderby'],
        'product'    => $request['product'],
        'hide_empty' => $request['hide_empty'],
        // 'number'     => $request['per_page'],
        'search'     => $request['search'],
        'slug'       => $request['slug'],
      );

      $taxonomy_obj = get_taxonomy( $taxonomy );

      if ( $taxonomy_obj->hierarchical && isset( $request['parent'] ) ) {
        if ( 0 === $request['parent'] ) {
          // Only query top-level terms.
          $prepared_args['parent'] = 0;
        } else {
          if ( $request['parent'] ) {
            $prepared_args['parent'] = $request['parent'];
          }
        }
      }
      //$prepared_args['parent'] = $allowed_categories;

      /**
       * Filter the query arguments, before passing them to `get_terms()`.
       *
       * Enables adding extra arguments or setting defaults for a terms
       * collection request.
       *
       * @see https://developer.wordpress.org/reference/functions/get_terms/
       *
       * @param array           $prepared_args Array of arguments to be
       *                                       passed to get_terms.
       * @param WP_REST_Request $request       The current request.
       */
      $prepared_args = apply_filters( "woocommerce_rest_{$taxonomy}_query", $prepared_args, $request );

      if ( ! empty( $prepared_args['product'] ) ) {
        $query_result = $this->get_terms_for_product( $prepared_args, $request );
      } else {
        $query_result = get_terms( $taxonomy, $prepared_args );
      }
      $response = array();
      foreach ( $query_result as $term ) {
        $data       = $this->prepare_data_for_response( $term, $request );
        $response[] = $this->prepare_response_for_collection( $data );
      }

      $response = rest_ensure_response( $response );

      return $response;
    }

    /**
     * Get taxonomy.
     *
     * @param WP_REST_Request $request Full details about the request.
     * @return int|WP_Error
     */
    protected function get_taxonomy( $request ) {
      // Check if taxonomy is defined.
      // Prevents check for attribute taxonomy more than one time for each query.
      if ( '' !== $this->taxonomy ) {
        return $this->taxonomy;
      }

      if ( ! empty( $request['attribute_id'] ) ) {
        $taxonomy = wc_attribute_taxonomy_name_by_id( (int) $request['attribute_id'] );

        $this->taxonomy = $taxonomy;
      }

      return $this->taxonomy;
    }
           
    /**
     * Get product data.
     *
     * @param WC_Product $product Product instance.
     * @param string     $context Request context.
     *                            Options: 'view' and 'edit'.
     * @return array
     */
    public function prepare_data_for_response( $item, $request ) {      
        // Get category display type.
        $display_type = get_term_meta( $item->term_id, 'display_type', true );

        // Get category order.
        $menu_order = get_term_meta( $item->term_id, 'order', true );

        $data = array(
          'id'          => (int) $item->term_id,
          'name'        => $item->name,
          'slug'        => $item->slug,
          'parent'      => (int) $item->parent,
          'description' => $item->description,
          'display'     => $display_type ? $display_type : 'default',
          'image'       => null,
          'menu_order'  => (int) $menu_order,
          'count'       => (int) $item->count,
        );

        // Get category image.
        $image_id = get_term_meta( $item->term_id, 'thumbnail_id', true );
        if ( $image_id ) {
          $attachment = get_post( $image_id );

          $data['image'] = array(
            'id'            => (int) $image_id,
            'date_created'  => wc_rest_prepare_date_response( $attachment->post_date_gmt ),
            'date_modified' => wc_rest_prepare_date_response( $attachment->post_modified_gmt ),
            'src'           => wp_get_attachment_url( $image_id ),
            'title'         => get_the_title( $attachment ),
            'alt'           => get_post_meta( $image_id, '_wp_attachment_image_alt', true ),
          );
        }

        $context = ! empty( $request['context'] ) ? $request['context'] : 'view';
        $data    = $this->add_additional_fields_to_object( $data, $request );
        $data    = $this->filter_response_by_context( $data, $context );

        $response = rest_ensure_response( $data );

        $response->add_links( $this->prepare_links( $item, $request ) );

        //return $response;die;
        
        return apply_filters( "woocommerce_rest_prepare_{$this->taxonomy}", $response, $item, $request );
    }
        
    /**
     * Prepare links for the request.
     *
     * @param WCFM_Data         $term   Term object.
     * @param WCFM_REST_Request $request Request object.
     *
     * @return array                   Links for the given post.
     */
    protected function prepare_links( $term, $request ) {
        $base = '/' . $this->namespace . '/' . $this->rest_base;

        if ( ! empty( $request['attribute_id'] ) ) {
          $base = str_replace( '(?P<attribute_id>[\d]+)', (int) $request['attribute_id'], $base );
        }

        $links = array(
          'self'       => array(
            'href' => rest_url( trailingslashit( $base ) . $term->term_id ),
          ),
          'collection' => array(
            'href' => rest_url( $base ),
          ),
        );

        if ( $term->parent ) {
          $parent_term = get_term( (int) $term->parent, $term->taxonomy );
          if ( $parent_term ) {
            $links['up'] = array(
              'href' => rest_url( trailingslashit( $base ) . $parent_term->term_id ),
            );
          }
        }

        return $links;
    }
    
    

    


    
    
    
}