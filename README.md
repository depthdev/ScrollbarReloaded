# ScrollbarReloaded
JavaScript scrollbar plugin to unify scrollbar styling. Supports IE10+, and all major browsers. Built-in master/slave hook. Supports 3 rendering types. Touch enabled.

### [Demo](http://depthdev.com/modules) (Available shortly)

### Markup & Inline Options
* Apply the attribute `scrollbar-reloaded` to applicable elements.
    * Providing a value of `master-{namespace}` will designate that element as the "master" scrollbar.
        * No inner element/content is necessary.
    * Providing a value of `slave-{namespace}` will designate that as a slave to the namespaced "master" scrollbar.
    * Providing an additional attribute of `scrollbar-reloaded-x` or `scrollbar-reloaded-y` with a value of `false` will ignore scrolling in the defined direction both visually and functionally.
    * Providing an additional attribute of `scrollbar-reloaded-type` with a value of:
        * `default`, no value, any value but "margin" or "scroll", or no attribute altogether will default to using position relative top/left.
            * RECOMMENDED (DEFAULT)
            * Best performance
        * `margin` will scroll using margin properties.
            * OK performance
        * `scroll` will use scrollTop/scrollLeft JavaScript properties, useful if integrating with another scroll-based plugin.
            * The parent element will receive a position of "relative" and should be styled to be immediately around the ScrollbarReloaded element.
            * IMPORTANT!: This slows down the UI do to reflow caused by scrollTop/scrollLeft, especially on IE.
        * FYI: Master scrollbars will work with a mix of the aforementioned scroll types.  

### Styles
* Styles can be adjusted in the SCSS or CSS file.  

### Methods
* `bootstrap` (global only) bootstraps elements with the `scrollbar-reloaded` attribute that haven't already been bootstrapped on the document.
* `bootstrapped` (global only) returns an object with all ScrollbarReloaded instances and access to their methods `destroy`, `reset` and `update`.
* `destroy` (global/instance) destroys document/window listeners.
* `reset`  (global/instance) resets heights/widths such as for use after the content size changes. (Window resizing reset is handled automatically).
* `update` (global/instance) moves the element's scroll position to the x/y parameters provided as percentage floats. (Using a master scrollbar's instance `update` will cause it and the slaves to be scrolled to the same percentage).  

### Global Options & Usage
* Apply `scrollbar-reloaded` attributes to applicable elements.
* Create a global instance. Example: `const mts = new ScrollbarReloaded();`
    * Optionally, pass in an object with available properties of:
        * `minHandleLength` (int) default is 10 pixels
        * `resizeDelay` (int) default is 17 milliseconds
* Call the `bootstrap` method to bootstrap applicable elements. Example: `mts.bootstrap();`.
* NOTE: See "Markup & Inline Options" and "Methods" for more options.
