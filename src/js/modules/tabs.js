//==========================================================================
//Copyright: &copy;MyCompany 2016. All rights reserved.
//==========================================================================

define("tabs", ['logger', 'jquery'],
  /**
   * @exports modules/tabs
   * @requires logger
   * @requires jquery
   */
  function (logger, $) {
    'use strict';
    /**
     * The exports.
     */
    /** @alias module:tabs */
    var exports = {
        /**
         * Call initializeDom when we need to bind or re-bind with DOM.
         * @method
         */
        initializeDom: function () {
        /*
         * Tabs =========
         */
        if ($('ul.classnamejs-tabs li').length > 0) {
          var clickOnTab = function () {
            /**
             * The tab id.
             */
            var tab_id = $(this).attr('data-tab');
            $('ul.classnamejs-tabs li').removeClass('classnameui-tab-current');
            $('.classnamejs-tab-content').removeClass('classnameui-tab-current');
            $(this).addClass('classnameui-tab-current');
            $("#" + tab_id).addClass('classnameui-tab-current');
          }
          $('ul.classnamejs-tabs li').off("click", clickOnTab);
          $('ul.classnamejs-tabs li').on("click", clickOnTab);
        };
      }
    };
    return exports;
  });