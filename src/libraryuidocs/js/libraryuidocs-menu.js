//==========================================================================
//Copyright: &copy;MyCompany 2016. All rights reserved.
//==========================================================================

define("libraryuidocs-menu", ['jquery', 'logger'],
  /**
   * @exports libraryuidocs-menu
   * @requires jquery
   * @requires logger
   */
  function ($, logger) {
    /**
     * The report.
     */
    var report = logger.report;
    /**
     * The warn.
     */
    var warn = logger.warn;
    /**
     * The error.
     */
    var error = logger.error;
    if (typeof jQuery === 'undefined') {
      throw new Error('library\'s Pattern Library JavaScript requires jQuery')
    } + function ($) {
      'use strict';
      /**
       * The version.
       */
      var version = $.fn.jquery.split(' ')[0].split('.')
      if ((version[0] < 2 && version[1] < 9) || (version[0] == 1 && version[1] == 9 && version[2] < 1) || (version[0] > 2)) {
        throw new Error('library\'s Pattern Library JavaScript requires jQuery version 1.9.1 or higher, but lower than version 3')
      }
    }(jQuery);
    /*
     * ======================================================================== Pattern Library: affix.js v1.2
     * ========================================================================
     */
    + function ($) {
      'use strict';
      /*
       * AFFIX CLASS DEFINITION ======================
       */
      /**
       * @constructor
       * @param element
       * @param options
       */
      var Affix = function (element, options) {
        this.options = $.extend({}, Affix.DEFAULTS, options)
        this.$target = $(this.options.target).on('scroll.bs.affix.data-api', $.proxy(this.checkPosition, this)).on('click.bs.affix.data-api',
          $.proxy(this.checkPositionWithEventLoop, this))
        this.$element = $(element)
        this.affixed = null
        this.unpin = null
        this.pinnedOffset = null
        this.checkPosition()
      }
      Affix.VERSION = '3.3.6'
      Affix.RESET = 'affix affix-top affix-bottom'
      Affix.DEFAULTS = {
          offset: 0,
          target: window
        }
        /**
         * @param scrollHeight
         * @param height
         * @param offsetTop
         * @param offsetBottom
         * @return {Object} ConditionalExpression
         */
      Affix.prototype.getState = function (scrollHeight, height, offsetTop, offsetBottom) {
        /**
         * The scroll top.
         */
        var scrollTop = this.$target.scrollTop()
          /**
           * The position.
           */
        var position = this.$element.offset()
          /**
           * The target height.
           */
        var targetHeight = this.$target.height()
        if (offsetTop != null && this.affixed == 'top')
          return scrollTop < offsetTop ? 'top' : false
        if (this.affixed == 'bottom') {
          if (offsetTop != null)
            return (scrollTop + this.unpin <= position.top) ? false : 'bottom'
          return (scrollTop + targetHeight <= scrollHeight - offsetBottom) ? false : 'bottom'
        }
        /**
         * The initializing.
         */
        var initializing = this.affixed == null
          /**
           * The collider top.
           */
        var colliderTop = initializing ? scrollTop : position.top
          /**
           * The collider height.
           */
        var colliderHeight = initializing ? targetHeight : height
        if (offsetTop != null && scrollTop <= offsetTop)
          return 'top'
        if (offsetBottom != null && (colliderTop + colliderHeight >= scrollHeight - offsetBottom))
          return 'bottom'
        return false
      }
      Affix.prototype.getPinnedOffset = function () {
        if (this.pinnedOffset)
          return this.pinnedOffset
        this.$element.removeClass(Affix.RESET).addClass('affix')
          /**
           * The scroll top.
           */
        var scrollTop = this.$target.scrollTop()
          /**
           * The position.
           */
        var position = this.$element.offset()
        return (this.pinnedOffset = position.top - scrollTop)
      }
      Affix.prototype.checkPositionWithEventLoop = function () {
        setTimeout($.proxy(this.checkPosition, this), 1)
      }
      Affix.prototype.checkPosition = function () {
          if (!this.$element.is(':visible'))
            return
            /**
             * The height.
             */
          var height = this.$element.height()
            /**
             * The offset.
             */
          var offset = this.options.offset
            /**
             * The offset top.
             */
          var offsetTop = offset.top
            /**
             * The offset bottom.
             */
          var offsetBottom = offset.bottom
            /**
             * The scroll height.
             */
          var scrollHeight = Math.max($(document).height(), $(document.body).height())
          if (typeof offset != 'object')
            offsetBottom = offsetTop = offset
          if (typeof offsetTop == 'function')
            offsetTop = offset.top(this.$element)
          if (typeof offsetBottom == 'function')
            offsetBottom = offset.bottom(this.$element)
            /**
             * The affix.
             */
          var affix = this.getState(scrollHeight, height, offsetTop, offsetBottom)
          if (this.affixed != affix) {
            if (this.unpin != null)
              this.$element.css('top', '')
              /**
               * The affix type.
               */
            var affixType = 'affix' + (affix ? '-' + affix : '')
              /**
               * The e.
               */
            var e = $.Event(affixType + '.bs.affix')
            this.$element.trigger(e)
            if (e.isDefaultPrevented())
              return
            this.affixed = affix
            this.unpin = affix == 'bottom' ? this.getPinnedOffset() : null
            this.$element.removeClass(Affix.RESET).addClass(affixType).trigger(affixType.replace('affix', 'affixed') + '.bs.affix')
          }
          if (affix == 'bottom') {
            this.$element.offset({
              top: scrollHeight - height - offsetBottom
            })
          }
        }
        /*
         * AFFIX PLUGIN DEFINITION =======================
         */
      function Plugin(option) {
        return this.each(function () {
          /**
           * The $this.
           */
          var $this = $(this)
            /**
             * The data.
             */
          var data = $this.data('bs.affix')
            /**
             * The options.
             */
          var options = typeof option == 'object' && option
          if (!data)
            $this.data('bs.affix', (data = new Affix(this, options)))
          if (typeof option == 'string')
            data[option]()
        })
      }
      /**
       * The old.
       */
      var old = $.fn.affix
      $.fn.affix = Plugin
      $.fn.affix.Constructor = Affix
        /*
         * AFFIX NO CONFLICT =================
         */
      $.fn.affix.noConflict = function () {
          $.fn.affix = old
          return this
        }
        /*
         * AFFIX DATA-API ==============
         */
      $(window).on('load', function () {
        $('[data-spy="affix"]').each(function () {
          /**
           * The $spy.
           */
          var $spy = $(this)
            /**
             * The data.
             */
          var data = $spy.data()
          data.offset = data.offset || {}
          if (data.offsetBottom != null)
            data.offset.bottom = data.offsetBottom
          if (data.offsetTop != null)
            data.offset.top = data.offsetTop
          Plugin.call($spy, data)
        })
      })
    }(jQuery);
    /*
     * ======================================================================== Pattern Library: scrollspy.js v1.2
     * ========================================================================
     */
    + function ($) {
      'use strict';
      /*
       * SCROLLSPY CLASS DEFINITION ==========================
       */
      /**
       * @constructor
       * @param element
       * @param options
       */
      function ScrollSpy(element, options) {
        this.$body = $(document.body)
        this.$scrollElement = $(element).is(document.body) ? $(window) : $(element)
        this.options = $.extend({}, ScrollSpy.DEFAULTS, options)
        this.selector = (this.options.target || '') + ' .nav li > a'
        this.offsets = []
        this.targets = []
        this.activeTarget = null
        this.scrollHeight = 0
        this.$scrollElement.on('scroll.bs.scrollspy', $.proxy(this.process, this))
        this.refresh()
        this.process()
      }
      ScrollSpy.VERSION = '3.3.6'
      ScrollSpy.DEFAULTS = {
          offset: 10
        }
        /**
         * @return {Boolean}
         */
      ScrollSpy.prototype.getScrollHeight = function () {
          return this.$scrollElement[0].scrollHeight || Math.max(this.$body[0].scrollHeight, document.documentElement.scrollHeight)
        }
        /**
         * @return {Boolean}
         */
      ScrollSpy.prototype.refresh = function () {
          /**
           * The that.
           */
          var that = this
            /**
             * The offset method.
             * @type {String}
             */
          var offsetMethod = 'offset'
            /**
             * The offset base.
             * @type {Number}
             */
          var offsetBase = 0
          this.offsets = []
          this.targets = []
          this.scrollHeight = this.getScrollHeight()
          if (!$.isWindow(this.$scrollElement[0])) {
            offsetMethod = 'position'
            offsetBase = this.$scrollElement.scrollTop()
          }
          this.$body.find(this.selector).map(function () {
            /**
             * The $el.
             */
            var $el = $(this)
              /**
               * The href.
               */
            var href = $el.data('target') || $el.attr('href')
              /**
               * The $href.
               */
            var $href = /^#./.test(href) && $(href)
            return ($href && $href.length && $href.is(':visible') && [
              [$href[offsetMethod]().top + offsetBase, href]
            ]) || null
          }).sort(function (a, b) {
            return a[0] - b[0]
          }).each(function () {
            that.offsets.push(this[0])
            that.targets.push(this[1])
          })
        }
        /**
         * @return {Boolean}
         */
      ScrollSpy.prototype.process = function () {
          /**
           * The scroll top.
           */
          var scrollTop = this.$scrollElement.scrollTop() + this.options.offset
            /**
             * The scroll height.
             */
          var scrollHeight = this.getScrollHeight()
            /**
             * The max scroll.
             */
          var maxScroll = this.options.offset + scrollHeight - this.$scrollElement.height()
            /**
             * The offsets.
             */
          var offsets = this.offsets
            /**
             * The targets.
             */
          var targets = this.targets
            /**
             * The active target.
             */
          var activeTarget = this.activeTarget
            /**
             * The i.
             */
          var i
          if (this.scrollHeight != scrollHeight) {
            this.refresh()
          }
          if (scrollTop >= maxScroll) {
            return activeTarget != (i = targets[targets.length - 1]) && this.activate(i)
          }
          if (activeTarget && scrollTop < offsets[0]) {
            this.activeTarget = null
            return this.clear()
          }
          for (i = offsets.length; i--;) {
            activeTarget != targets[i] && scrollTop >= offsets[i] && (offsets[i + 1] === undefined || scrollTop < offsets[i + 1]) && this.activate(targets[i])
          }
        }
        /**
         * @param target
         */
      ScrollSpy.prototype.activate = function (target) {
        this.activeTarget = target
        this.clear()
          /**
           * The selector.
           */
        var selector = this.selector + '[data-target="' + target + '"],' + this.selector + '[href="' + target + '"]'
          /**
           * The active.
           */
        var active = $(selector).parents('li').addClass('active')
        if (active.parent('.dropdown-menu').length) {
          active = active.closest('li.dropdown').addClass('active')
        }
        active.trigger('activate.bs.scrollspy')
      }
      ScrollSpy.prototype.clear = function () {
          $(this.selector).parentsUntil(this.options.target, '.active').removeClass('active')
        }
        /*
         * SCROLLSPY PLUGIN DEFINITION ===========================
         */
        /**
         * @constructor
         * @param option
         */
      function Plugin(option) {
        return this.each(function () {
          /**
           * The $this.
           */
          var $this = $(this)
            /**
             * The data.
             */
          var data = $this.data('bs.scrollspy')
            /**
             * The options.
             */
          var options = typeof option == 'object' && option
          if (!data)
            $this.data('bs.scrollspy', (data = new ScrollSpy(this, options)))
          if (typeof option == 'string')
            data[option]()
        })
      }
      /**
       * The old.
       */
      var old = $.fn.scrollspy
      $.fn.scrollspy = Plugin
      $.fn.scrollspy.Constructor = ScrollSpy
        /*
         * SCROLLSPY NO CONFLICT =====================
         */
        /**
         * @return {Object} ThisExpression
         */
      $.fn.scrollspy.noConflict = function () {
          $.fn.scrollspy = old
          return this
        }
        /*
         * SCROLLSPY DATA-API ==================
         */
      $(window).on('load.bs.scrollspy.data-api', function () {
        $('[data-spy="scroll"]').each(function () {
          /**
           * The $spy.
           */
          var $spy = $(this)
          Plugin.call($spy, $spy.data())
        })
      })
    }(jQuery);
    /*
     * ======================================================================== Transition.js
     * ========================================================================
     */
    + function ($) {
      'use strict';
      /*
       * CSS TRANSITION SUPPORT Cross Browsers ============================================================
       */
      function transitionEnd() {
        /**
         * The el.
         */
        var el = document.createElement('bootstrap')
          /**
           * The trans end event names.
           */
        var transEndEventNames = {
          WebkitTransition: 'webkitTransitionEnd',
          MozTransition: 'transitionend',
          OTransition: 'oTransitionEnd otransitionend',
          transition: 'transitionend'
        }
        for (var name in transEndEventNames) {
          if (el.style[name] !== undefined) {
            return {
              end: transEndEventNames[name]
            }
          }
        }
        return false // explicit for ie8 ( ._.)
      }
      /**
       * @param duration
       * @return {Object} ThisExpression
       */
      $.fn.emulateTransitionEnd = function (duration) {
        /**
         * The called.
         * @type {Boolean}
         */
        var called = false
          /**
           * The $el.
           */
        var $el = this
        $(this).one('bsTransitionEnd', function () {
          called = true
        })
        var callback = function () {
          if (!called)
            $($el).trigger($.support.transition.end)
        }
        setTimeout(callback, duration)
        return this
      }
      $(function () {
        $.support.transition = transitionEnd()
        if (!$.support.transition)
          return
        $.event.special.bsTransitionEnd = {
          bindType: $.support.transition.end,
          delegateType: $.support.transition.end,
          /**
           * @param e
           */
          handle: function (e) {
            if ($(e.target).is(this))
              return e.handleObj.handler.apply(this, arguments)
          }
        }
      })
    }(jQuery);
    /*
     * Sticky Nav at scroll. Create a clone of the menu, right next to original.
     * =========================================================================
     */
    // TODO: try to eliminate as many constants as possible
    // REMOVED: stickIt and timer
    /*
     * Offset scrollspy target from top for trigger =================================================
     */
    $(document).ready(function () {
      $('body').scrollspy({
        target: '.scrollspy',
        offset: 100
      });
    });
    /*
     * Add active class to <a> when clicked =================================================
     */
    /**
     * The correct height.
     * @type {Number}
     */
    var correctHeight = 0;

    function getCorrectHeight() {
      // cache correctHeight here so we don't do the math every time...
      /**
       * The header height.
       */
      var headerHeight = $(".libraryuidocs-partials-banner").height();
      /**
       * The menu top.
       */
      var menuTop = $(".libraryuidocs-header-container").height();
      correctHeight = headerHeight - menuTop;
      // if (correctHeight < 1){
      // alert("headerHeight: " + headerHeight + ", menuTop: " + menuTop);
      // }
      return correctHeight;
    }
    $(document).ready(function () {
      window.setTimeout(getCorrectHeight, 1);
      $('ul li a').click(function () {
        $('li a').removeClass("active");
        $(this).addClass("active");
      });
    });
    /*
     * Control whether the side bar is attached to parent, or affixed. =================================================
     */
    //use scroll event 
    //TODO: throttle if necessary using something like underscore
    $(document).scroll(function () {
      if (correctHeight < 1) {
        getCorrectHeight();
      }
      /**
       * The y.
       */
      var y = $(window).scrollTop();
      //logger.enable(true);
      report('body scroll: ' + y + ', correctHeight: ' + correctHeight);
      if (y > correctHeight) {
        $("#nav").addClass("affix");
        report('affix');
      } else {
        $("#nav").removeClass("affix");
        report('no affix');
      }
    });
    /**
     * The exports.
     */
    var exports = {
      getCorrectHeight: getCorrectHeight
    };
    return exports;
  });