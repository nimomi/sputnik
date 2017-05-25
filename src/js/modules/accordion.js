//==========================================================================
//Copyright: &copy;MyCompany 2016. All rights reserved.
//==========================================================================

define("accordion", [ 'logger', 'jquery' ],
/**
 * @exports modules/accordion
 * @requires logger
 * @requires jquery
 */
function(theLogger, $) {
  'use strict';
  /**
   * The exports.
   */
  /** @alias module:accordion */
  var exports = {
    /**
     * Call initializeDom when we need to bind or re-bind with DOM.
     * @method
     */
    initializeDom : function() {
      /*
       * Accordion ============
       */
      if ($('.classnamejs-accordion li').length > 0) {
        /**
         * The $next item.
         * @type {Object}
         */
        var $nextItem = null;
        /**
         * The $grand parent.
         * @type {Object}
         */
        var $grandParent = null;
        /**
         * The $prev item.
         * @type {Object}
         */
        var $prevItem = null;
        /**
         * Accordion toggle.
         * @param (jQueryElement)
         */
        var accordionToggle = function($this) {
          $nextItem = $this.next();
          if ($nextItem.css("display") !== "none") {
            theLogger.report('closing');
            // 1) slide up
            // 2) shoould be hidden when done
            $nextItem.slideUp(350, function() {
              $nextItem.hide();
            });
          } else {
            theLogger.report('opening');
            /**
             * The my peers.
             */
            var myPeers = $this.parent().siblings();
            /**
             * The $last item.
             */
            var $lastItem = myPeers.find("a.accordion-expanded");
            $lastItem.removeClass("accordion-expanded");
            $lastItem.next().slideUp(350, function() {
              $lastItem.next().hide();
            });
            // TODO: close any other open items
            $nextItem.slideDown(350, function() {
              $nextItem.show();
            });
            $this.addClass("accordion-expanded");
          }
        };
        /**
         * Accordion click. 
         *  Click handler for accordion <a> tags.
         * @param {Event}
         */
        var accordionClick = function(e) {
          e.preventDefault();
          e.stopPropagation();
          accordionToggle($(this));
        };
        $('.classnamejs-accordion li .classnamejs-toggle').click(accordionClick);
      }
    }
  };
  return exports;
});