define("charactercounter", [ 'logger', 'jquery' ],
/**
 * @exports modules/textarea
 * @requires logger
 * @requires jquery
 */
function(logger, $) {
  'use strict';
  var el = null;
  /** @alias module:textarea */
  var exports = {
      /**
       * Call initializeDom when we need to bind or re-bind with DOM.
       * @method
       */
      initializeDom : function() {
      // no-op for now
      $("#textareaCounter").keyup(function() {
        el = $(this);
        if (el.val().length >= 500) {
          el.val(el.val().substr(0, 500));
        } else {
          $("#charNum").text(500 - el.val().length).append("&nbsp;character(s) remaining");
        }
      });
    }
  };
  return exports;
});