//==========================================================================
//Copyright: &copy;MyCompany 2016. All rights reserved.
//==========================================================================

define("load-partials", ['jquery', 'logger'],
  /**
   * @exports load-partials
   * @requires jquery
   * @requires logger
   */
  function ($, logger) {
    /**
     * The all scripts.
     */
    var allScripts = [];
    /**
     * The use new snippet panel.
     * @type {Boolean}
     */
    var USE_NEW_SNIPPET_PANEL = true;
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
     * Trim. Polyfill for String.trim().
     * @param {String}  
     * @return {String}
     */
    function trim(input) {
      if (input == null) {
        return "";
      }
      return input.replace(/^\s*(\S*(\s+\S+)*)\s*$/, "$1");
    }
    // Define a config object with all partials.
    /**
     * The loader config.
     */
    var loaderConfig = {
      
    };
    /**
     * Get template. 
     *  Fetch the inline template injected into index.html during build.
     * @param {String}  
     * @return {String} The HTML source for the template.
     */
    function getTemplate(id) {
      // report('getTemplate');
      // TODO: cache scripts array here
      /**
       * The s.
       * @type {Number}
       */
      var s = 0;
      /**
       * The scripts.
       */
      var scripts = [];
      if (allScripts.length > 0) {
        // report('getTemplate: allScripts not empty');
        scripts = allScripts;
      } else {
        // error('getTemplate: allScripts is empty');
        // scripts = document.getElementsByTagName('script');
        scripts = $("script[type='text/template']");
        // allScripts = scripts;
        for (s = 0; s < scripts.length; s++) {
          /**
           * The script.
           */
          var script = scripts[s];
          /**
           * The script id.
           */
          var scriptId = script.id;
          if (scriptId.length === 0) {
            continue;
          }
          if (scriptId.indexOf('template_') === 0) {
            /**
             * The $script.
             */
            var $script = $(script);
            allScripts.push({
              id: scriptId,
              text: $script.text()
            });
          }
        }
        scripts = allScripts;
        // report('remove script tags');
        for (s = 0; s < scripts.length; s++) {
          /**
           * The script id.
           */
          var scriptId = scripts[s].id;
          /**
           * The script.
           */
          var script = $("script[id='" + scriptId + "']");
          if (script.length === 0) {
            console.error(scriptId);
          }
          script.remove();
        }
        // report('remove script tags done');
      }
      for (s = 0; s < scripts.length; s++) {
        /**
         * The script.
         */
        var script = scripts[s];
        /**
         * The script id.
         */
        var scriptId = script.id;
        // report('getTemplate: looking for ' + id + ' in script ' + scriptId);
        if (scriptId.length === 0) {
          continue;
        }
        if (scriptId === 'template_' + id) {
          // report('getTemplate: FOUND ' + id + ' in script ' + scriptId);
          return script.text;
        }
      }
      warn("getTemplate could not find " + id);
      return "";
    }
    /**
     * Create/Inject/Bind all code panel on this template while it's being loaded.
     * 
     * @param {jQueryElement}
     *          $template
     */
    function injectCodePanel($template, templateId, targetId) {
      if ($template.injected) {
        return;
      }
      $template.injected = true;
      // $(".libraryuidocs-partials").children().last()
      // var patternsOnPage = $template.find(".libraryuidocs-partials");
      /**
       * The patterns on page.
       */
      var patternsOnPage = $template.find(".libraryuidocs-partials-code");
      /**
       * @type {Number}
       */
      for (var index = 0; index < patternsOnPage.length; index++) {
        /**
         * The pattern.
         */
        var pattern = $(patternsOnPage[index]);
        /**
         * The pattern id.
         */
        var patternId = pattern.parent().attr('id');
        if (!patternId) {
          patternId = pattern.parent().parent().attr('id');
        }
        if (!patternId) {
          patternId = pattern.parent().parent().parent().attr('id');
        }
        if (!patternId) {
          continue;
        }
        /**
         * The existing code panel.
         */
        var existingCodePanel = pattern;
        // var existingCodePanel = pattern.find(".libraryuidocs-partials-code");
        if (existingCodePanel.length > 0) {
          existingCodePanel = $(existingCodePanel);
          // is it a new panel or an old panel?
          // if (existingCodePanel.find('.libraryuijs-code-snippet-tab-1').length === 0) {
          // replace
          // load a tempate for... what?
          // template_templates/snippets/layout/grid_1_stylesheet.htm
          // templateId = "templates/layout/grid.html"
          /**
           * The path splitter.
           */
          var pathSplitter = templateId.split('/');
          pathSplitter.shift();
          /**
           * The snippet path.
           */
          var snippetPath = 'templates/snippets/' + pathSplitter.join('/');
          snippetPath = snippetPath.split('.')[0];
          // TEMPLATE_TARGET_INDEX_TYPE
          // toggle-switch_toggleswitch_0_template.html
          // templates/snippets/elements/toggle-switch_toggleswitch_0_template.html
          // templates/snippets/layout/grid_mediaqueries_0_template.html
          /**
           * The snippet path full.
           */
          var snippetPathFull = snippetPath + '_' + patternId + '_' + index + '_' + 'template' + '.html';
          /**
           * The html.
           * @type {String}
           */
          var html = '';
          /**
           * The css.
           * @type {String}
           */
          var css = '';
          /**
           * The js.
           * @type {String}
           */
          var js = '';
          /**
           * The snippet source.
           */
          var snippetSource = partialLoader.getTemplate(snippetPathFull);
          if (snippetSource) {
            // alert(patternId);
            html = '<xmp>' + trim(snippetSource) + '</xmp>';
          }
          snippetPathFull = snippetPath + '_' + patternId + '_' + index + '_' + 'stylesheet' + '.html';
          snippetSource = partialLoader.getTemplate(snippetPathFull);
          if (snippetSource) {
            css = '<xmp>' + trim(snippetSource) + '</xmp>';
          }
          snippetPathFull = snippetPath + '_' + patternId + '_' + index + '_' + 'script' + '.html';
          snippetSource = partialLoader.getTemplate(snippetPathFull);
          if (snippetSource) {
            js = '<xmp>' + trim(snippetSource) + '</xmp>';
          }
          if (!html && !css && js) {
            report('no new snippet found for ', patternId);
          } else {
            /**
             * The new panel.
             */
            var newPanel = createCodePanel(templateId, html, css, js);
            existingCodePanel.replaceWith(newPanel);
          }
        } else {
          // ?? Don't do anything? Or assume we should always replace?
        }
      }
    }
    /**
     * Create code panel. 
     *  Inject a code view panel.
     * @param id
     * @param html
     * @param css
     * @param js
     */
    function createCodePanel(id, html, css, js) {
      /**
       * The buffer.
       */
      var buffer = [];
      buffer.push('<div id="code_' + id + '" class="libraryuidocs-partials-code">');
      buffer.push('<button id="code-snippet" class="classnameui-button classnameui-small" type="button">');
      buffer.push('Show Source Code');
      buffer.push('</button>');
      buffer.push('<div class="libraryuijs-code-snippet-container libraryuidocs-code-snippet-container" style="display:none;">');
      buffer.push('  <ul class="libraryuijs-code-snippet-tabs libraryuidocs-code-snippet-tabs">');
      /**
       * The current.
       * @type {Boolean}
       */
      var current = false;
      /**
       * The current value.
       * @type {String}
       */
      var currentValue = '';
      if (html) {
        current = true;
        currentValue = 'current';
        buffer.push('    <li class="tab-link  ' + currentValue + '" data-tab="libraryuijs-code-snippet-tab-1">');
        buffer.push('HTML');
        buffer.push('</li>');
      }
      if (current) {
        currentValue = '';
      }
      if (css) {
        if (!current) {
          current = true;
          currentValue = 'current';
        }
        buffer.push(' <li class="tab-link  ' + currentValue + '" data-tab="libraryuijs-code-snippet-tab-2">');
        buffer.push('CSS');
        buffer.push('</li>');
      }
      if (current) {
        currentValue = '';
      }
      if (js) {
        if (!current) {
          current = true;
          currentValue = 'current';
        }
        buffer.push(' <li class="tab-link ' + currentValue + '" data-tab="libraryuijs-code-snippet-tab-3">');
        buffer.push('   JS');
        buffer.push('</li>');
      }
      buffer.push('</ul>');
      current = false;
      currentValue = '';
      if (html) {
        current = true;
        currentValue = 'current';
        buffer.push(' <div id="libraryuijs-code-snippet-tab-1" class="libraryuijs-code-snippet-tab-content ' + currentValue + ' libraryuidocs-code-snippet-tab-content current">');
        buffer.push('  <pre class="prettyprint">');
        // buffer.push(' <code class="lang-html" style="display:inline-block">');
        buffer.push(trim(html));
        // buffer.push(' </code>');
        buffer.push('         </pre>');
        buffer.push(' </div>');
      }
      if (current) {
        currentValue = '';
      }
      if (css) {
        if (!current) {
          current = true;
          currentValue = 'current';
        }
        buffer.push(' <div id="libraryuijs-code-snippet-tab-2" class="libraryuijs-code-snippet-tab-content ' + currentValue + ' libraryuidocs-code-snippet-tab-content ">');
        buffer.push(' <pre class="prettyprint">');
        // buffer.push(' <code class="lang-html" style="display:inline-block">');
        buffer.push(trim(css));
        // buffer.push(' </code>');
        buffer.push('             </pre>');
        buffer.push(' </div>');
      }
      if (current) {
        currentValue = '';
      }
      if (js) {
        if (!current) {
          current = true;
          currentValue = 'current';
        }
        buffer.push('<div id="libraryuijs-code-snippet-tab-3" class="libraryuijs-code-snippet-tab-content ' + currentValue + ' libraryuidocs-code-snippet-tab-content ">');
        buffer.push('   <pre class="prettyprint">');
        // buffer.push(' <code class="lang-html" style="display:inline-block">');
        buffer.push(trim(js));
        // buffer.push(' </code>');
        buffer.push('              </pre>');
        buffer.push(' </div>');
      }
      buffer.push(' </div>');
      buffer.push('</div>');
      /**
       * The source.
       */
      var source = trim(buffer.join('\n'));
      // alert(source);
      /**
       * The new panel.
       */
      var newPanel = $(source);
      /**
       * The all code panel tabs.
       */
      var allCodePanelTabs = newPanel.find(".tab-link");
      /**
       * The all code panels.
       */
      var allCodePanels = newPanel.find(".libraryuijs-code-snippet-tab-content");
      /**
       * The panel.
       * @type {Object}
       */
      var panel = null;
      /**
       * The tab.
       * @type {Object}
       */
      var tab = null;
      allCodePanelTabs.on('click', function () {
        // report('clicked on a code tab');
        /**
         * @type {Number}
         */
        for (var index = 0; index < allCodePanelTabs.length; index++) {
          tab = $(allCodePanelTabs[index]);
          /**
           * The panel id.
           */
          var panelId = tab.attr("data-tab");
          panel = newPanel.find('#' + panelId);
          if (allCodePanelTabs[index] === this) {
            if (!tab.hasClass('current')) {
              panel.show();
              tab.addClass('current');
            }
            // else, do nothing!
          } else if (tab.hasClass('current')) {
            // it's the one that is down
            panel.hide();
            tab.removeClass('current');
          } else {
            panel.hide();
          }
        }
      });
      /**
       * The show button.
       */
      var showButton = newPanel.find("#code-snippet");
      // report('attach click handler to showButton: ' + showButton.length);
      // toggle visibility of code snippets
      // $(document).on('click', '.libraryuidocs-partials-code', function(event) {
      // $(this).find("code").slideToggle();
      // });
      showButton.on("click", function (evt) {
        /**
         * The my panel.
         */
        var myPanel = $(this).parent();
        report('clicked [View Source Codes] button for "' + myPanel.parent().attr('id') + '".');
        evt.preventDefault();
        evt.stopPropagation();
        // $('.libraryuidocs-code-snippet-container').hide();
        /**
         * The container.
         */
        var container = myPanel.find('.libraryuidocs-code-snippet-container');
        if (container.css("display") === 'none') {
          container.fadeIn(function () {
            myPanel.find('#code-snippet').text('Hide Source Code');
          });
        } else {
          container.fadeOut(function () {
            myPanel.find('#code-snippet').text('Show Source Code');
          });
        }
        // window.MP = myPanel;
      });
      return newPanel;
    }
    /**
     * Inject code panel. 
     *  Create/Inject/Bind all code panel on this template while it's being loaded.
     * @param {jQueryElement}
     */
    function injectCodePanel($template, templateId, targetId) {
      if ($template.injected) {
        return;
      }
      $template.injected = true;
      // $(".libraryuidocs-partials").children().last()
      // var patternsOnPage = $template.find(".libraryuidocs-partials");
      /**
       * The patterns on page.
       */
      var patternsOnPage = $template.find(".libraryuidocs-partials-code");
      /**
       * @type {Number}
       */
      for (var index = 0; index < patternsOnPage.length; index++) {
        /**
         * The pattern.
         */
        var pattern = $(patternsOnPage[index]);
        /**
         * The pattern id.
         */
        var patternId = pattern.parent().attr('id');
        if (!patternId) {
          patternId = pattern.parent().parent().attr('id');
        }
        if (!patternId) {
          patternId = pattern.parent().parent().parent().attr('id');
        }
        if (!patternId) {
          continue;
        }
        /**
         * The existing code panel.
         */
        var existingCodePanel = pattern;
        // var existingCodePanel = pattern.find(".libraryuidocs-partials-code");
        if (existingCodePanel.length > 0) {
          existingCodePanel = $(existingCodePanel);
          // is it a new panel or an old panel?
          // if (existingCodePanel.find('.libraryuijs-code-snippet-tab-1').length === 0) {
          // replace
          // load a tempate for... what?
          // template_templates/snippets/layout/grid_1_stylesheet.htm
          // templateId = "templates/layout/grid.html"
          /**
           * The path splitter.
           */
          var pathSplitter = templateId.split('/');
          pathSplitter.shift();
          /**
           * The snippet path.
           */
          var snippetPath = 'templates/snippets/' + pathSplitter.join('/');
          snippetPath = snippetPath.split('.')[0];
          // TEMPLATE_TARGET_INDEX_TYPE
          // toggle-switch_toggleswitch_0_template.html
          // templates/snippets/elements/toggle-switch_toggleswitch_0_template.html
          // templates/snippets/layout/grid_mediaqueries_0_template.html
          /**
           * The snippet path full.
           */
          var snippetPathFull = snippetPath + '_' + patternId + '_' + index + '_' + 'template' + '.html';
          /**
           * The html.
           * @type {String}
           */
          var html = '';
          /**
           * The css.
           * @type {String}
           */
          var css = '';
          /**
           * The js.
           * @type {String}
           */
          var js = '';
          /**
           * The snippet source.
           */
          var snippetSource = getTemplate(snippetPathFull);
          if (snippetSource) {
            // alert(patternId);
            html = '<xmp>' + trim(snippetSource) + '</xmp>';
          }
          snippetPathFull = snippetPath + '_' + patternId + '_' + index + '_' + 'stylesheet' + '.html';
          snippetSource = getTemplate(snippetPathFull);
          if (snippetSource) {
            css = '<xmp>' + trim(snippetSource) + '</xmp>';
          }
          snippetPathFull = snippetPath + '_' + patternId + '_' + index + '_' + 'script' + '.html';
          snippetSource = getTemplate(snippetPathFull);
          if (snippetSource) {
            js = '<xmp>' + trim(snippetSource) + '</xmp>';
          }
          if (!html && !css && js) {
            report('no new snippet found for ', patternId);
          } else {
            /**
             * The new panel.
             */
            var newPanel = createCodePanel(templateId, html, css, js);
            existingCodePanel.replaceWith(newPanel);
          }
        } else {
          // ?? Don't do anything? Or assume we should always replace?
        }
      }
    }
    /**
     * Load template.
     * @param {Object} |  
     * @param {String}  
     * @param {Boolean}
     */
    function loadTemplate(dest, source, replace) {
      try {
        // report("loadTemplate: ", source, " to ", dest);
        if (typeof dest === 'string') {
          dest = $(dest);
        }
        /**
         * The html.
         */
        var html = getTemplate(source);
        if (replace) {
          dest.empty();
        }
        /**
         * The new element from template.
         */
        var newElementFromTemplate = $(html);
        if (USE_NEW_SNIPPET_PANEL) {
          injectCodePanel(newElementFromTemplate, source, dest);
        }
        dest.append(newElementFromTemplate);
        // report("loadTemplate: ", source, " to ", dest, "SUCCESS");
      } catch (err) {
        error(err);
      }
    }
    // console.log("loaderConfig: ", loaderConfig);
    /**
     * Load partials. 
     *  Load all the partials declared in global loaderConfig.
     *  @param {Object} config
     */
    function loadPartials(config) {
      if (!config){
        alert('loadPartials error: no config');
      }
      loaderConfig = config;
      /**
       * The buffer element.
       */
      var bufferElement = $("div");
      /**
       * The key count.
       * @type {Number}
       */
      var keyCount = 0;
      /**
       * The counter.
       * @type {Number}
       */
      var counter = 0;
      /**
       * The key.
       * @type {String}
       */
      var key = "";
      for (key in loaderConfig) {
        if (loaderConfig.hasOwnProperty(key)) {
          keyCount++;
        }
      }
      for (key in loaderConfig) {
        if (loaderConfig.hasOwnProperty(key)) {
          loadTemplate(loaderConfig[key], key);
          counter++;
          if (counter === keyCount) {
            // // console.log('done loading all partials');
            return;
          }
        }
      }
    }
    return /**@alias module:load-partials */ {
      loadPartials: loadPartials,
      loaderConfig: loaderConfig,
      getScriptCache: function () {
        return allScripts;
      },
      getTemplate: getTemplate,
      loadTemplate: loadTemplate
    };
  });