//==========================================================================
//Copyright: &copy;MyCompany 2016. All rights reserved.
//==========================================================================

define('logger', [],
  /**
   * @exports logger
   */
  function () {
    'use strict';
    /**
     * The v e r b o s e.
     * @type {Boolean}
     */
    var VERBOSE = false;
    return /**@alias module:logger */ {
      /**
       * Report. 
       *  Wrapper for console.log
       * .
       */
      report: function () {
        if (window.console && VERBOSE) {
          /**
           * The log.
           */
          var log = console.log;
          log.apply(console, arguments);
        }
      },
      /**
       * Warn. 
       *  Wrapper for console.warn
       * .
       */
      warn: function () {
        if (window.console && VERBOSE) {
          /**
           * The log.
           */
          var log = console.warn;
          log.apply(console, arguments);
        }
      },
      /**
       * Error. 
       *  Wrapper for console.error
       * .
       */
      error: function () {
        if (window.console) {
          /**
           * The log.
           */
          var log = console.error;
          log.apply(console, arguments);
        }
      },
      /**
       * @param bEnable
       */
      enable: function (bEnable) {
        VERBOSE = bEnable;
      }
    };
  });