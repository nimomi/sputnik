//==========================================================================
//Copyright: &copy;MyCompany 2016. All rights reserved.
//==========================================================================

define("modal", ['logger', 'jquery'],
  /**
   * @exports modules/modal
   * @requires logger
   * @requires jquery
   */
  function (logger, $) {
    'use strict';
    /**
     * The exports.
     */
    /** @alias module:modal */
    var exports = {
        /**
         * Call initializeDom when we need to bind or re-bind with DOM.
         * @method
         */
        initializeDom: function () {
        /*
         * Modal ==========
         */
        if ($('.classnameui-modal').length > 0) {
          var showModal = function () {
            $(this).next(".classnameui-modal").show();
          };
          var hideModal = function () {
            $(this).parents(".classnameui-modal").hide();
          };
          $(".open-modal").off("click", showModal);
          $(".classnameui-close").off("click", hideModal);
          $(".classnameui-modal").hide();
          $(".open-modal").on("click", showModal);
          $(".classnameui-close").on("click", hideModal);
        }
      }
    };
    return exports;
  });