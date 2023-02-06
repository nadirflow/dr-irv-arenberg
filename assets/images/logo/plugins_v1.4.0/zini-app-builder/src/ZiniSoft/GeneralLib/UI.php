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
 * SINGLETON
 *
 * @since 2.0.0
 * @author Brian Vo (info@zinisoft.net)
 */
final class UI {

	/**
	 * The one true UI.
	 *
	 * @var UI
	 * @since 2.0.0
	 **/
	private static $instance;

	/**
	 * Sets up a new UI instance.
	 *
	 * @since 2.0.0
	 * @access public
	 **/
	private function __construct() {
	}

	/**
	 * Render select field.
	 *
	 * @param $options - Options for select. Required.
	 * @param string $selected - Selected value. Optional.
	 * @param string $label - Label for select. Optional.
	 * @param string $helper_text - Text after select. Optional.
	 * @param array $attributes - Additional attributes for select: id, name, class. Optional.
	 *
	 * @since 2.0.0
	 * @access public
	 */
	public function render_select( $options, $selected = '', $label = '', $helper_text = '', $attributes = [] ) {

		/** Prepare html attributes. */
		$id   = isset( $attributes['id'] ) ? $attributes['id'] : '';
		$name = isset( $attributes['name'] ) ? $attributes['name'] : '';

		$class = isset( $attributes['class'] ) ? $attributes['class'] : '';
		$class = 'mdc-select__native-control ' . $class;
		$class = trim( $class );
		?>

        <div class="mdc-select mdc-select-width mdc-select--outlined">
            <i class="mdc-select__dropdown-icon"></i>
            <!--suppress HtmlFormInputWithoutLabel -->
            <select
	            <?php echo ( $id ) ? 'id="' . esc_attr( $id ) . '"' : ''; ?>
	            <?php echo ( $name ) ? 'name="' . esc_attr( $name ) . '"' : ''; ?>
	            <?php echo ( $class ) ? 'class="' . esc_attr( $class ) . '"' : ''; ?>>

				<?php
				foreach ( $options as $key => $value ) {
					$isSelected = ( $key == $selected ) ? 'selected' : '';
					echo "<option " . $isSelected . " value='" . $key . "'>" . $value . "</option>";
				}
				?>
            </select>

            <div class="mdc-notched-outline">
                <div class="mdc-notched-outline__leading"></div>

				<?php if ( $label ) : ?>
                    <div class="mdc-notched-outline__notch">
                        <label class="mdc-floating-label mdc-floating-label--float-above"><?php echo esc_html( $label ); ?></label>
                    </div>
				<?php endif; ?>

                <div class="mdc-notched-outline__trailing"></div>
            </div>
        </div>
		<?php if ( $helper_text ) : ?>
            <div class="mdc-select-helper-text mdc-select-helper-text--persistent"
                 aria-hidden="true"><?php echo wp_kses_post( $helper_text ); ?></div>
		<?php endif;
	}

	/**
	 * Render checkboxes field.
	 *
	 * @param $options - Options for checkboxes. Required.
	 * @param string $selected - Selected value. Optional.
	 * @param array $attributes - Additional attributes for checkboxes: id, name, class. Optional.
	 *
	 * @since 2.0.0
	 * @access public
	 */
	public function render_checkboxes( $options, $selected = [], $attributes = [] ) {

		/** Prepare html attributes. */
		$id   = isset( $attributes['id'] ) ? $attributes['id'] : '';
		$name = isset( $attributes['name'] ) ? $attributes['name'] : '';

		$class = isset( $attributes['class'] ) ? $attributes['class'] : '';
		$class = trim( $class );
		?>
		
		<fieldset
			<?php echo ( $id ) ? 'id="' . esc_attr( $id ) . '"' : ''; ?>
			<?php echo ( $name ) ? 'name="' . esc_attr( $name ) .'"' : ''; ?>
			<?php echo ( $class ) ? 'class="' . esc_attr( $class ) . '"' : ''; ?>>
			<?php
			foreach ( $options as $key => $value ) {
				$nameCB = ( $name ) ? 'name="' . esc_attr( $name ) . '['.$key.']" ' : '';
				$isChecked = ( isset($selected[$key]) && $selected[$key] == 'true' ) ? 'checked' : '';
				echo "<input type='checkbox' " .$nameCB . $isChecked . " value='true'>" . $value . "</br>";
			}
			?>
    	</fieldset>  
	<?php
	}

	/**
	 * Render radio buttons field.
	 *
	 * @param $options - Options for radio buttons. Required.
	 * @param string $selected - Selected value. Optional.
	 * @param array $attributes - Additional attributes for checkboxes: id, name, class. Optional.
	 *
	 * @since 2.0.0
	 * @access public
	 */
	public function render_radio_buttons( $options, $selected = '', $attributes = [] ) {

		/** Prepare html attributes. */
		$id   = isset( $attributes['id'] ) ? $attributes['id'] : '';
		$name = isset( $attributes['name'] ) ? $attributes['name'] : '';

		$class = isset( $attributes['class'] ) ? $attributes['class'] : '';
		$class = trim( $class );
		?>
		
		<fieldset
			<?php echo ( $id ) ? 'id="' . esc_attr( $id ) . '"' : ''; ?>
			<?php echo ( $name ) ? 'name="' . esc_attr( $name ) .'"' : ''; ?>
			<?php echo ( $class ) ? 'class="' . esc_attr( $class ) . '"' : ''; ?>>
			<?php
			foreach ( $options as $key => $value ) {
				$isChecked = $selected == $key ? ' checked ' : ' ';
				echo "<input type='radio' name='" .$name ."'" . $isChecked . " value=".$key.">" . $value . "</br>";
			}
			?>
    	</fieldset>  
	<?php
	}

	/**
	 * Render single checkbox field.
	 *
	 * @param string $value - Value of single checkbox. Optional.
	 * @param array $attributes - Additional attributes for single checkbox: id, name, class. Optional.
	 *
	 * @since 2.0.0
	 * @access public
	 */
	public function render_checkbox( $value = '', $helper_text = '', $attributes = [] ) {

		/** Prepare html attributes. */
		$id   = isset( $attributes['id'] ) ? $attributes['id'] : '';
		$name = isset( $attributes['name'] ) ? $attributes['name'] : '';

		$class = isset( $attributes['class'] ) ? $attributes['class'] : '';
		$class = trim( $class );

		$id = ($id ) ? 'id="' . esc_attr( $id ) . '" ' : '';
		$name = ( $name ) ? 'name="' . esc_attr( $name ) .'" ' : '';
		$class = ( $class ) ? 'class="' . esc_attr( $class ) . '" ' : '';
		$isChecked = ( isset($value) && $value === 'true' ) ? 'checked' : '';
		echo "<input type='checkbox' " .$id .$name .$class . $isChecked . " value='true'>".$helper_text."</br>";
	}

	/**
	 * Render slider field.
	 *
	 * @param $value - Current value. Required.
	 * @param int $value_min - The min value the slider can have. Optional.
	 * @param int $value_max - The max value the slider can have. Optional.
	 * @param int $step - The step value of the slider. Optional.
	 * @param string $label - Label for slider. Optional.
	 * @param string $helper_text - Text after slider. Optional.
	 * @param array $attributes - Additional attributes for select: id, name, class. Optional.
	 * @param bool $discrete - Continuous or Discrete Slider. Optional.
	 *
	 * @since 2.0.0
	 * @access public
	 */
	public function render_slider( $value, $value_min = 0, $value_max = 10, $step = 1, $label = '', $helper_text = '', $attributes = [], $discrete = true ) {

		/** The step value can be any positive floating-point number, or 0.
		 * When the step value is 0, the slider is considered to not have any step.
		 * A error will be thrown if you are trying to set step value to be a negative number.
		 **/
		if ( $step < 0 ) {
			$step = 0;
		}

		/** Prepare html attributes. */
		$id   = isset( $attributes['id'] ) ? $attributes['id'] : '';
		$name = isset( $attributes['name'] ) ? $attributes['name'] : '';

		$class = 'mdc-slider ';
		if ( $discrete ) { // Continuous or Discrete Slider
			$class .= ' mdc-slider--discrete ';
		}
		if ( isset( $attributes['class'] ) ) {
			$class = $class . ' ' . $attributes['class'];
		}
		$class = trim( $class );

        $type   = isset( $attributes['type'] ) ? $attributes['type'] : '';

		?>
        <div
	        <?php echo ( $id ) ? 'id="' . esc_attr( $id ) . '"' : ''; ?>
            <?php echo ( $class ) ? 'class="' . esc_attr( $class ) . '"' : ''; ?>
	        <?php echo ( $step ) ? 'data-step="' . esc_attr( $step ) . '"' : ''; ?>
            role="slider"
            aria-valuemin="<?php esc_attr_e( $value_min ); ?>"
            aria-valuemax="<?php esc_attr_e( $value_max ); ?>"
            aria-valuenow="<?php esc_attr_e( $value ); ?>"
            aria-label="<?php esc_attr_e( $label ); ?>">

            <input
	            <?php echo ( $id . '-input' ) ? 'id="' . esc_attr( $id ) . '"' : ''; ?>
	            <?php echo ( $name ) ? 'name="' . esc_attr( $name ) . '"' : ''; ?>
	            <?php echo ( $type ) ? 'type="' . esc_attr( $type ) . '"' : 'type="hidden"'; ?>
                value="<?php esc_attr_e( $value ); ?>">
            <div class="mdc-slider__track-container">
                <div class="mdc-slider__track"></div>
            </div>
            <div class="mdc-slider__thumb-container">
                <div class="mdc-slider__pin">
                    <span class="mdc-slider__pin-value-marker"></span>
                </div>
                <svg class="mdc-slider__thumb">
                    <!--suppress RequiredAttributes -->
                    <circle></circle>
                </svg>
                <div class="mdc-slider__focus-ring"></div>
            </div>
        </div>
		<?php if ( $helper_text ) : ?>
            <div class="mdc-text-field-helper-line">
                <div class="mdc-text-field-helper-text mdc-text-field-helper-text--persistent"><?php echo wp_kses_post( $helper_text ); ?></div>
            </div>
		<?php endif;
	}

	/**
	 * Render input text field.
	 *
	 * @param $value - Value for input. Required.
	 * @param string $label - Label for input. Optional.
	 * @param string $helper_text - Text after input. Optional.
	 * @param array $attributes - Additional attributes for select: id, name, class. Optional.
	 *
	 * @since 2.0.0
	 * @access public
	 */
	public function render_input( $value, $label = '', $helper_text = '', $attributes = [] ) {

		/** Prepare html attributes. */
		$id   = isset( $attributes['id'] ) ? $attributes['id'] : '';
		$name = isset( $attributes['name'] ) ? $attributes['name'] : '';
		$class = isset( $attributes['class'] ) ? $attributes['class'] : '';
		?>

        <div class="mdc-text-field mdc-input-width mdc-text-field--outlined <?php echo ( $class ) ? esc_attr( $class ) : ''; ?>">
            <!--suppress HtmlFormInputWithoutLabel -->
            <input
                <?php echo ( $id ) ? 'id="' . esc_attr( $id ) . '"' : ' '; ?>
	            <?php echo ( $name ) ? 'name="' . esc_attr( $name ) . '"' : ' '; ?>
	            <?php echo ( $value != '' ) ? 'value="' . esc_attr( $value ) . '"' : 'value="" '; ?>
                class="mdc-text-field__input" type="text">

            <div class="mdc-notched-outline">
                <div class="mdc-notched-outline__leading"></div>

				<?php if ( $label ) : ?>
                    <div class="mdc-notched-outline__notch">
                        <label <?php if ( $id ) {
							echo 'for="' . esc_attr( $id ) . '"';
						} ?> class="mdc-floating-label"><?php echo wp_kses_post( $label ); ?></label>
                    </div>
				<?php endif; ?>

                <div class="mdc-notched-outline__trailing"></div>
            </div>

        </div>
		<?php if ( $helper_text ) : ?>
            <div class="mdc-text-field-helper-line">
                <div class="mdc-text-field-helper-text mdc-text-field-helper-text--persistent"><?php echo wp_kses_post( $helper_text ); ?></div>
            </div>
		<?php endif;
	}

	/**
	 * Render input number field.
	 *
	 * @param $value - Value for input. Required.
	 * @param string $label - Label for input. Optional.
	 * @param string $helper_text - Text after input. Optional.
	 * @param array $attributes - Additional attributes for select: id, name, class. Optional.
	 *
	 * @since 2.0.0
	 * @access public
	 */
	public function render_input_number( $value, $label = '', $helper_text = '', $attributes = [] ) {

		/** Prepare html attributes. */
		$id   = isset( $attributes['id'] ) ? $attributes['id'] : '';
		$name = isset( $attributes['name'] ) ? $attributes['name'] : '';
		$class = isset( $attributes['class'] ) ? $attributes['class'] : '';
		?>

        <div class="mdc-text-field mdc-input-width mdc-text-field--outlined <?php echo ( $class ) ? esc_attr( $class ) : ''; ?>">
            <!--suppress HtmlFormInputWithoutLabel -->
            <input
                <?php echo ( $id ) ? 'id="' . esc_attr( $id ) . '"' : ' '; ?>
	            <?php echo ( $name ) ? 'name="' . esc_attr( $name ) . '"' : ' '; ?>
	            <?php echo ( $value != '' ) ? 'value="' . esc_attr( $value ) . '"' : 'value="" '; ?>
                class="mdc-text-field__input" type="number">

            <div class="mdc-notched-outline">
                <div class="mdc-notched-outline__leading"></div>

				<?php if ( $label ) : ?>
                    <div class="mdc-notched-outline__notch">
                        <label <?php if ( $id ) {
							echo 'for="' . esc_attr( $id ) . '"';
						} ?> class="mdc-floating-label"><?php echo wp_kses_post( $label ); ?></label>
                    </div>
				<?php endif; ?>

                <div class="mdc-notched-outline__trailing"></div>
            </div>

        </div>
		<?php if ( $helper_text ) : ?>
            <div class="mdc-text-field-helper-line">
                <div class="mdc-text-field-helper-text mdc-text-field-helper-text--persistent"><?php echo wp_kses_post( $helper_text ); ?></div>
            </div>
		<?php endif;
	}

	/**
	 * Render html.
	 *
	 * @param $value - Value for input. Required.
	 * @param string $label - Label for input. Optional.
	 * @param string $helper_text - Text after input. Optional.
	 * @param array $attributes - Additional attributes for select: id, name, class. Optional.
	 *
	 * @since 2.0.0
	 * @access public
	 */
	public function render_html( $html, $type='warning' ) {
	?>
		<div class="settings-error notice notice-warning">
			<p><?php echo $html?></p>
    	</div>
		<?php
	}

	/**
	 * Render colorpicker field.
	 *
	 * @param $value - Value for input. Required.
	 * @param string $label
	 * @param string $helper_text
	 * @param array $attributes - Additional attributes for select: id, name, class, readonly. Required.
     * Important note: id attribute is required.
	 *
	 * @since 2.0.0
	 * @access public
	 */
	public function render_colorpicker( $value, $label = '', $helper_text = '', $attributes = [] ) {

		/** Prepare html attributes. */
		$id   = isset( $attributes['id'] ) ? $attributes['id'] : '';
		$name = isset( $attributes['name'] ) ? $attributes['name'] : '';
		$readonly = isset( $attributes['readonly'] ) ? $attributes['readonly'] : '';

		$class = isset( $attributes['class'] ) ? $attributes['class'] : '';
		$class = 'mdc-text-field__input ' . $class;
		$class = trim( $class );


		?>
        <div class="mdc-text-field mdc-input-width mdc-colorpicker mdc-text-field--outlined">
            <!--suppress HtmlFormInputWithoutLabel -->
            <input
                <?php echo ( $id ) ? 'id="' . esc_attr( $id ) . '"' : ''; ?>
                <?php echo ( $name ) ? 'name="' . esc_attr( $name ) . '"' : ''; ?>
                <?php echo ( $class ) ? 'class="' . esc_attr( $class ) . '"' : ''; ?>
                <?php echo ( $readonly ) ? 'readonly="' . esc_attr( $readonly ) . '"' : ''; ?>
                value="<?php esc_attr_e( $value ); ?>"
                type="text">
            <div class="mdc-notched-outline">
                <div class="mdc-notched-outline__leading"
                     style="background-color: <?php esc_attr_e( $value ); ?>"></div>

				<?php if ( $label ) : ?>
                    <div class="mdc-notched-outline__notch">
                        <label <?php echo ( $id ) ? 'for="' . esc_attr( $id ) . '"' : ''; ?> class="mdc-floating-label mdc-floating-label--float-above"><?php echo wp_kses_post( $label ); ?></label>
                    </div>
				<?php endif; ?>

                <div class="mdc-notched-outline__trailing">
                    <i class="material-icons mdc-text-field__icon">colorize</i>
                </div>
            </div>
        </div>

		<?php if ( $helper_text ) : ?>
            <div class="mdc-text-field-helper-line">
                <div class="mdc-text-field-helper-text mdc-text-field-helper-text--persistent"><?php echo wp_kses_post( $helper_text ); ?></div>
            </div>
		<?php endif;
	}

	/**
	 * Render snackbar.
	 *
	 * @see https://material-components.github.io/material-components-web-catalog/#/component/snackbar
	 * @since 2.0.0
	 * @access public
	 *
	 * @param $message - HTML message to show.
	 * @param string $design - Snackbar message design (info, error, warning)
     * @param int $timeout - Auto-close timeout (-1 or 4000-10000)
	 * @param bool $closeable - Can a user close?
	 * @param array $buttons - Additional buttons array( [ 'caption', 'link' ] )
     * @param string $class_name - CSS class name
	 */
	public function render_snackbar( $message, $design = '', $timeout = 5000, $closeable = true, $buttons = array(), $class_name = '' ) {

		?>
        <div class="mdc-snackbar <?php echo $design === '' ? 'mdc-info' : 'mdc-' . $design; ?> <?php echo $class_name; ?>" data-timeout="<?php echo $timeout; ?>">
            <div class="mdc-snackbar__surface">
                <div class="mdc-snackbar__label" role="status"
                     aria-live="polite"><?php echo wp_kses_post( $message ); ?></div>
                    <div class="mdc-snackbar__actions">
                        <?php foreach ( $buttons as $btn) { ?>
                        <button class="mdc-button mdc-snackbar__action" type="button" onclick="window.open( '<?php echo $btn[ 'link' ]; ?>', '_blank' )" title="<?php echo $btn[ 'caption' ]; ?>"><?php echo $btn[ 'caption' ]; ?></button>
                        <?php } ?>
                        <button class="mdc-icon-button mdc-snackbar__dismiss material-icons" <?php echo !$closeable ? 'style="display: none"' : '' ?> title="<?php esc_html_e( 'Dismiss' ); ?>" type="button">close</button>
                    </div>
            </div>
        </div>
		<?php
	}

	/**
	 * Main UI Instance.
	 *
	 * Insures that only one instance of UI exists in memory at any one time.
	 *
	 * @static
	 * @return UI
	 * @since 2.0.0
	 **/
	public static function get_instance() {

		if ( ! isset( self::$instance ) && ! ( self::$instance instanceof UI ) ) {
			self::$instance = new UI();
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
	 */
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
	 */
	public function __wakeup() {

		/** Unserializing instances of the class is forbidden. */
		_doing_it_wrong( __FUNCTION__, esc_html__( 'The whole idea of the singleton design pattern is that there is a single object therefore, we don\'t want the object to be unserialized.', 'ziniappbuilder' ), ZiniAppBuilder::$version );

	}

} // End Class UI.
