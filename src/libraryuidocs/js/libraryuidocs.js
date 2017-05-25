//==========================================================================
//Copyright: &copy;MyCompany 2016. All rights reserved.
//==========================================================================

define("libraryuidocs", [ 'jquery', 'logger', 'load-partials', 'libraryuidocs-menu' ],
/**
 * @exports libraryuidocs
 * @requires jquery
 * @requires logger
 * @requires load-partials
 * @requires libraryuidocs-menu
 */
function($, logger, partialLoader, menu) {
  var partialsToLoad = {};
  // NOTE absence of use strict here
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
  /**
   * The setting anchor.
   * 
   * @type {Boolean}
   */
  var settingAnchor = false;
  /**
   * The mouse down.
   * 
   * @type {Boolean}
   */
  var mouseDown = false;
  /**
   * The new anchor.
   * 
   * @type {String}
   */
  var newAnchor = '';
  /**
   * The previous template.
   * 
   * @type {String}
   */
  var previousTemplate = '';

  var templateInit = null;
  var oneTimeInit = null;
  /**
   * Serialize history.
   * 
   * @param {String}template
   * @param {String}anchor
   * @return {String}
   */
  function serializeHistory(template, anchor) {
    // console.log('serializeHistory: ', template, anchor);
    /**
     * The hash.
     * 
     * @type {String}
     */
    var hash = '';
    /**
     * The current template.
     * 
     * @type {String}
     */
    var currentTemplate = '';
    /**
     * The current anchor.
     * 
     * @type {String}
     */
    var currentAnchor = '';
    /**
     * The current history.
     */
    var currentHistory = window.location.hash;
    if (currentHistory.length) {
      /**
       * The splitter.
       */
      var splitter = currentHistory.split('@');
      currentTemplate = splitter[0];
      if (currentTemplate !== '#') {
        previousTemplate = currentTemplate;
      }
      if (splitter.length > 1) {
        currentAnchor = splitter[1];
      }
    }
    // if we pass in a new template, erase the old anchor
    if (template) {
      currentTemplate = template;
      if (currentTemplate !== '#') {
        previousTemplate = currentTemplate;
      }
      if (anchor === '-') {
        anchor = '';
        currentAnchor = '';
      }
    } else if (anchor) {
      currentAnchor = anchor;
    }
    if (!template && previousTemplate) {
      currentTemplate = previousTemplate;
    }
    if (!currentTemplate) {
      warn('NO TEMPLATE in serializeHistory()' + " previousTemplate: '" + previousTemplate + "'");
      // debugger;
    }
    currentAnchor = currentAnchor.split('#').join('');
    hash = currentTemplate + '@' + currentAnchor;
    // console.log('serializeHistory: >>> ', hash);
    // alert(('serializeHistory: >>> ', hash));
    return hash;
  }
  /**
   * Deserialize history.
   * 
   * @param {String}
   * @return {Object}
   */
  function deserializeHistory(hash) {
    // console.log('deserializeHistory: ' + hash);
    /**
     * The history.
     */
    var history = {
      template : '',
      anchor : ''
    };
    /**
     * The current template.
     * 
     * @type {String}
     */
    var currentTemplate = '';
    /**
     * The current anchor.
     * 
     * @type {String}
     */
    var currentAnchor = '';
    if (hash.length) {
      /**
       * The splitter.
       */
      var splitter = hash.split('@');
      currentTemplate = splitter[0];
      if (splitter.length > 1) {
        currentAnchor = splitter[1];
      }
    }
    if (currentTemplate) {
      history.template = currentTemplate;
    }
    if (currentAnchor) {
      history.anchor = currentAnchor;
    }
    // console.log('deserializeHistory: >>> ', history);
    return history;
  }
  /**
   * Trim. Polyfill for String.trim().
   * 
   * @param {String}
   * @return {String}
   */
  function trim(input) {
    if (input == null) {
      return "";
    }
    return input.replace(/^\s*(\S*(\s+\S+)*)\s*$/, "$1");
  }
  /**
   * The lock history.
   * 
   * @type {Boolean}
   */
  var LOCK_HISTORY = false;
  $(document).ready(function() {
    if (oneTimeInit) {
      oneTimeInit();
    }
    // render elements
    /**
     * The $dom container.
     */
    var $dom_container = $(".libraryjsdocs-partials");
    /**
     * The $fragment collection.
     */
    var $fragment_collection = $("<div/>");
    /**
     * Setup links. Modify the href of each link for similar effect to ng hrefs.
     */
    var setupLinks = function() {
      // for each a, copy the href and then swap it
      /**
       * The all links.
       */
      var allLinks = $("#side-nav a");
      /**
       * The index.
       * 
       * @type {Number}
       */
      var index = 0;
      for (index = 0; index < allLinks.length; index++) {
        /**
         * The link.
         */
        var link = $(allLinks[index]);
        /**
         * The href.
         */
        var href = link.attr('href');
        if (href && href.indexOf('.zip') !== -1) {
          // leave a zip file link alone
          continue;
        }
        if (href !== "javascript:void(0);") {
          // the href must be bound via jquery data closure
          link.data('href', href);
          link.data('target', href);
          // link.attr('id', href);
          // link.attr('href', "javascript:void(0);");
        }
        link.off("click", delayHandleAllLinkClicks);
        link.on("click", delayHandleAllLinkClicks);
      }
      allLinks = $(".libraryuidocs-menu .libraryuidocs-header-list a");
      index = 0;
      for (index = 0; index < allLinks.length; index++) {
        /**
         * The link.
         */
        var link = $(allLinks[index]);
        /**
         * The href.
         */
        var href = link.attr('href');
        if (href && href.indexOf('.zip') !== -1) {
          // leave a zip file link alone
          continue;
        }
        if (href !== "javascript:void(0);") {
          // the href must be bound via jquery data closure
          link.data('href', href);
          link.data('target', href);
          link.attr('id', href);
          link.attr('href', "javascript:void(0);");
        }
        link.off("click", delayHandleAllLinkClicks);
        link.on("click", delayHandleAllLinkClicks);
      }
      allLinks = $(".libraryuidocs-partials .libraryuidocs-header-list a");
      index = 0;
      for (index = 0; index < allLinks.length; index++) {
        /**
         * The link.
         */
        var link = $(allLinks[index]);
        /**
         * The href.
         */
        var href = link.attr('href');
        link.attr('href', "javascript:void(0);");
      }
    };
    /**
     * @param evt
     */
    var delayHandleAllLinkClicks = function(evt) {
      evt.preventDefault();
      evt.stopPropagation();
      // LOCK_HISTORY = true;
      /**
       * The args.
       */
      var args = arguments;
      /**
       * The self.
       */
      var self = this;
      window.setTimeout(function() {
        // debugger;
        handleAllLinkClicks.apply(self, args);
      }, 1);
    };
    /**
     * The elements.
     */
    var elements = [
    // basics
    "templates/layout/foundation.html", "templates/layout/grid.html", "templates/elements/typography.html", "templates/layout/swatch.html",
    // elements
    "templates/elements/buttons.html", "templates/elements/toggle-switch.html",
    // modules
    "templates/modules/accordion.html", "templates/modules/modal.html", "templates/modules/tabs.html", "templates/modules/tooltip.html",
    // Demo Layouts and Mockups
    "templates/layout/header.html", "templates/layout/footer.html" ];
    /**
     * The elements length.
     */
    var elements_length = elements.length;
    // loop through all the elements to aggregate templates
    /**
     * @type {Number}
     */
    for (var i = 0; i < elements_length; i++) {
      /**
       * The $fragment.
       */
      var $fragment = $("<div/>", {
        "class" : "libraryuidocs-section" // you need to quote "class" since it's a reserved keyword
      }), element = elements[i];
      partialLoader.loadTemplate($fragment, element);
      $fragment_collection.append($fragment);
    }
    // put the elements into the dom
    $dom_container.append($fragment_collection);
    // render the menu
    /**
     * The $libraryuidocs fragment.
     */
    var $libraryuidocs_fragment = $menu = $(".libraryjsdocs-navigation"), menu = "libraryuidocs/partials/libraryuidocs-menu.html";
    partialLoader.loadTemplate($libraryuidocs_fragment, menu);
    $menu.append($libraryuidocs_fragment);
    $menu.delegate("a", "click", function() {
      /**
       * The $header.
       */
      var $header = $(this);
      // getting the next element
      /**
       * The $content.
       */
      var $content = $header.parent().parent().parent().parent().parent();
      // open up the content needed - toggle the slide- if visible, slide up, if not slidedown.
      $content.slideToggle(500, function() {
        // execute this after slideToggle is done
      });
    });
    // show the menu
    /**
     * The $menu link.
     */
    var $menu_link = $(".libraryjsdocs-menu-link");
    $menu_link.click(function() {
      /**
       * The $header.
       */
      var $header = $(this);
      // getting the next element
      /**
       * The $content.
       */
      var $content = $header.parent().next();
      // open up the content needed - toggle the slide- if visible, slide up, if not slidedown.
      $content.slideToggle(500, function() {
        // execute this after slideToggle is done
      });
    });
    // render the submenu
    /**
     * The $libraryuidocs submenu fragment.
     */
    var $libraryuidocs_subMenu_fragment = $("<section/>", {
      "class" : "libraryuidocs-subnavigation-wrapper" // you need to quote "class" since it's a reserved keyword
    }), $submenu = $(".libraryjsdocs-subnavigation"), submenu = "libraryuidocs/partials/libraryuidocs-submenu.html";
    partialLoader.loadTemplate($libraryuidocs_subMenu_fragment, submenu);
    $submenu.append($libraryuidocs_subMenu_fragment);
    // this is for the gototop functionality
    // $(window).scroll(function() {
    // if ($(this).scrollTop() > 100) {
    // $('.libraryuidocs-scrollup').fadeIn();
    // } else {
    // $('.libraryuidocs-scrollup').fadeOut();
    // }
    // });
    // $('.libraryuidocs-scrollup').click(function() {
    // $("html, body").animate({
    // scrollTop: 0
    // }, 600);
    // return false;
    // });
    // Only want this behavior for clicks on the TOP MENU.
    // Sidebar should simply scroll to the anchor.

    /**
     * The menu top.
     */
    var menuTop = $(".libraryuidocs-header-container").height();

    /**
     * Recalculate menuTop if necessary.
     */
    var getMenuTop = function() {
      if (menuTop < 1) {
        menuTop = $(".libraryuidocs-header-container").height();
      }
      return menuTop;
    };
    // Handle which SECTION we're on, plus optionally which ANCHOR
    /**
     * @param evt
     * @param useThisHref
     * @param noAnimation
     */
    var handleAllLinkClicks = function(evt, useThisHref, noAnimation) {
      /**
       * The which tempate.
       * 
       * @type {String}
       */
      var whichTempate = '';
      /**
       * The which anchor.
       * 
       * @type {String}
       */
      var whichAnchor = '';
      // add in serializeHistory(whichTempate, whichAnchor)
      // var href = useThisHref ? useThisHref : $(this).attr('href');
      /**
       * The href.
       */
      var href = useThisHref ? useThisHref : $(this).data('href');
      if (evt) {
        report("clicked on link: " + href);
      }
      if (!href) {
        return;
      }
      if (href.indexOf("javascript") === 0 || this.id === 'download') {
        report("do not override this click");
        return;
      }
      if (href.indexOf("#") === 0) {
        // THIS IS AN ANCHOR, so SCROLL into VIEW
        report('THIS IS AN ANCHOR, so SCROLL into VIEW');
        // use preventDefault/stopPropagation instead of return true/false
        if (evt) {
          evt.preventDefault();
          evt.stopPropagation();
        }
        if ($(href).length) {
          mouseDown = true;
          /**
           * The ticks.
           * 
           * @type {Number}
           */
          var ticks = 500;
          if (noAnimation) {
            ticks = 1;
          }
          /**
           * The v offset.
           */
          var vOffset = ($(href).offset().top - getMenuTop());
          // report('check scrolltop vs anchor ' + $('body').scrollTop() + ', ' + vOffset);
          if ($(window).scrollTop() !== vOffset) {
            report('scroll anchor to ' + vOffset);
            if (true) {
              $('body, html').animate({
                scrollTop : vOffset
              }, ticks, function() {
                mouseDown = false;
                if (evt) {
                  /**
                   * The history hash.
                   */
                  var historyHash = serializeHistory(whichTempate, href);
                  LOCK_HISTORY = true;
                  window.location.hash = historyHash;
                  window.setTimeout(function() {
                    LOCK_HISTORY = false;
                  }, 1);
                }
              });
            }
          }
        }
      } else {
        // This is a reference to a TEMPLATE, so inject it.
        // clear the handlers
        $('a').off("click", handleAllLinkClicks);
        // call partialLoader.loadTemplate() with replace = true
        partialLoader.loadTemplate($('#classnamejs-main-page'), href, true);
        // When we load new content, don't want the scroll to be preserved!
        report("$('body, html').scrollTop(0);");
        $('body, html').scrollTop(0);
        // use preventDefault/stopPropagation instead of return true/false
        if (evt) {
          evt.preventDefault();
          evt.stopPropagation();
        }
        // TODO: optimize loadPartials to only load the partials for this section?
        partialLoader.loadPartials(partialsToLoad);
        // Because we just loaded new elements, re-assign the link handlers.
        setupLinks();
        if (evt) {
          // var historyHash = serializeHistory(href, whichAnchor);
          //
          // debugger;
          /**
           * The history hash.
           */
          var historyHash = serializeHistory(href, '-');
          // window.setTimeout(function(){
          LOCK_HISTORY = true;
          window.location.hash = historyHash;
          window.setTimeout(function() {
            LOCK_HISTORY = false;
          }, 1);
          // },1);
          // .split('.html')[0];
        } else {
          // debugger;
          $('li a').removeClass("active");
          // $(this).addClass("active");
          // BPT
          /**
           * The menu el.
           */
          var menuEl = $("a[id = '" + href + "']");
          menuEl.addClass("active");
        }
        initModules(true);
      }
    }
    partialLoader.loadPartials(partialsToLoad);
    $('a').off("click", handleAllLinkClicks);
    setupLinks();
    $(document).on('mousedown', function() {
      mouseDown = true;
      // report('mouse is down');
    });
    $(document).on('mouseup', function() {
      mouseDown = false;
      // report('mouse is up');
      // THIS CAUSES UNINTENDED SIDE EFFECTS
      if (newAnchor) {
        setAnchorHashNow();
      }
    });
    var setAnchorHashNow = function() {
      if (mouseDown) {
        return;
      }
      settingAnchor = true;
      LOCK_HISTORY = true;
      window.location.hash = newAnchor;
      newAnchor = '';
      window.setTimeout(function() {
        settingAnchor = false;
        LOCK_HISTORY = false;
      }, 1);
    };
    /**
     * @param anchor
     */
    function setAnchorHash(anchor) {
      newAnchor = serializeHistory('', anchor);
      // console.log('setAnchorHash: ' + newAnchor + "," + mouseDown);
      window.setTimeout(setAnchorHashNow, 10);
    }
    /**
     * @param evt
     * @param noAnimation
     */
    window.onhashchange = function(evt, noAnimation) {
      /**
       * The new u r l.
       */
      var newURL = window.location.toString();
      report('HASH CHANGED: ' + window.location.hash + " LOCK_HISTORY: " + LOCK_HISTORY);
      if (settingAnchor || LOCK_HISTORY) {
        return;
      }
      //
      // console.log(evt.oldURL, evt.newURL);
      // if (evt && evt.newURL){
      // newURL = evt.newURL;
      // }
      if (newURL.indexOf('#') !== -1) {
        /**
         * The the hash.
         */
        var theHash = newURL.split("#")[1];
        // console.log(theHash);
        // Deserialize.
        /**
         * The history.
         */
        var history = deserializeHistory(theHash);
        // console.log(history);
        if (history.template.indexOf('.html') !== -1) {
          window.setTimeout(function() {
            handleAllLinkClicks(null, history.template, noAnimation);
          }, 1);
        }
        window.setTimeout(function() {
          if (history.anchor.length > 1) {
            /**
             * The find on page.
             */
            var findOnPage = $("#" + history.anchor);
            if (findOnPage.length > 0) {
              report('hash changed to an anchor on the page: ' + history.anchor);
            } else {
              report('hash changed to an anchor OFF the page: ', newURL);
              // $("a[href = 'libraryuidocs/partials/modules.html']").length
            }
            window.setTimeout(function() {
              handleAllLinkClicks(null, '#' + history.anchor, noAnimation);
            }, 1);
          }
        }, 100);
      } else {
        report('Hash change ignored!!!!');
      }
    };
    /**
     * Init modules. Set up event handlers for modules.
     */
    function initModules() {
      prettyPrint();
      $('.pln').hide();
      $('xmp .pln').show();
      report("initModules");
      /**
       * The anchor.
       * 
       * @type {Object}
       */
      var anchor = null;
      var handleScrollSpyActivation = function() {
        if ($("#nav").find('.active').length === 1) {
          anchor = $(this).find('a').data('href');
          setAnchorHash(anchor);
        } else if ($(this).find('ul').length === 0) {
          anchor = $(this).find('a').data('href');
          setAnchorHash(anchor);
        }
      };
      $("ul#nav li").off("activate.bs.scrollspy", handleScrollSpyActivation);
      $("ul#nav li").on("activate.bs.scrollspy", handleScrollSpyActivation);

      // Calling the init() methods on the modules is now done automatically in index.js
      if (templateInit) {
        templateInit();
      }

    }
    initModules();
    if (window.location.hash) {
      // alert(window.location.hash);
      // do we need to restore the hash, or is it a passthrough?
      // console.log(window.location);
      window.onhashchange({
        newURL : window.location.toString()
      }, true);
      // partialLoader.loadTemplate($("#classnamejs-main-page"), "libraryuidocs/partials/foundation.html");
    } else {
      partialLoader.loadTemplate($("#classnamejs-main-page"), "libraryuidocs/partials/foundation.html");
      // var historyHash = serializeHistory("libraryuidocs/partials/foundation.html", '');
      // window.location.hash = historyHash;
      // // Scroll to top of page after we first load.
      // window.setTimeout(function() {
      // report("$('body, html').scrollTop(0);");
      // $('body, html').scrollTop(0);
      // }, 1);
      window.setTimeout(function() {
        $(".libraryuidocs-header-list a").first().click();
      }, 1);
    }
  });

  /** @alias module:libraryuidocs */
  var exports = {
    setPartials : function(partials) {
      partialsToLoad = partials;
    },
    setOneTimeInit : function(handler) {
      oneTimeInit = handler;
    },
    setTemplateInit : function(handler) {
      templateInit = handler;
    }
  };
  return exports;
});