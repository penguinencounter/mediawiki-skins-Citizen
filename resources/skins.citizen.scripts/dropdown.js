/**
 * Enhance dropdown menus
 * Based on Vector
 */
const
	DROPDOWN_DETAILS_SELECTOR = '.citizen-menu__dropdown',
	DROPDOWN_SUMMARY_SELECTOR = '.citizen-menu__dropdownButton',
	DROPDOWN_TARGET_SELECTOR = '.citizen-menu__card';

class Dropdown {
	constructor( details, summary, target ) {
		this.details = details;
		this.summary = summary;
		this.target = target;
		this.dismissOnClickOutside = this.dismissOnClickOutside.bind( this );
		this.dismissOnEscape = this.dismissOnEscape.bind( this );
		this.dismissOnFocusLoss = this.dismissOnFocusLoss.bind( this );
		this.dismissOnLinkClick = this.dismissOnLinkClick.bind( this );
		this.onDetailsToggle = this.onDetailsToggle.bind( this );
	}

	dismiss() {
		if ( this.details && this.details.open ) {
			this.details.open = false;
		}
	}

	/**
	 * Dismiss the target when clicking elsewhere.
	 *
	 * @param {Event} event
	 */
	dismissOnClickOutside( event ) {
		if ( !this.target.contains( event.target ) ) {
			event.stopPropagation();
			this.dismiss();
		}
	}

	/**
	 * Dismiss the target when ESCAPE is pressed.
	 *
	 * @param {Event} event
	 */
	dismissOnEscape( event ) {
		if ( event.key !== 'Escape' ) {
			return;
		}
		this.dismiss();
	}

	/**
	 * If focus is given to any element outside the target, dismiss the target.
	 *
	 * @param {Event} event
	 */
	dismissOnFocusLoss( event ) {
		if ( !this.details.contains( event.target ) ) {
			this.dismiss();
		}
	}

	/**
	 * Dismiss the target on clicks to links and link children elements
	 *
	 * @param {Event} event
	 */
	dismissOnLinkClick( event ) {
		const eventTarget = event.target;
		if ( eventTarget && eventTarget.closest( 'a' ) ) {
			this.dismiss();
		}
	}

	unbind() {
		this.target.removeEventListener( 'click', this.dismissOnLinkClick );
		window.removeEventListener( 'click', this.dismissOnClickOutside );
		window.removeEventListener( 'focusin', this.dismissOnFocusLoss );
		window.removeEventListener( 'keyup', this.dismissOnEscape );
	}

	bind() {
		this.target.addEventListener( 'click', this.dismissOnLinkClick );
		window.addEventListener( 'click', this.dismissOnClickOutside );
		window.addEventListener( 'focusin', this.dismissOnFocusLoss );
		window.addEventListener( 'keyup', this.dismissOnEscape );
	}

	onDetailsToggle() {
		if ( this.details.open ) {
			this.bind();
		} else {
			this.unbind();
		}
	}

	init() {
		this.details.addEventListener( 'toggle', this.onDetailsToggle );
		// T295085: Close all dropdown menus when page is unloaded to prevent them
		// from being open when navigating back to a page.
		window.addEventListener( 'beforeunload', this.dismiss.bind( this ) );
	}
}

function init() {
	const dropdowns = document.querySelectorAll( DROPDOWN_DETAILS_SELECTOR );

	dropdowns.forEach( ( details ) => {
		const
			summary = details.querySelector( DROPDOWN_SUMMARY_SELECTOR ),
			target = details.querySelector( DROPDOWN_TARGET_SELECTOR );

		if ( !( details && summary && target ) ) {
			return;
		}

		new Dropdown( details, summary, target ).init();
	} );
}

module.exports = {
	init: init
};
