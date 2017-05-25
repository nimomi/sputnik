//==========================================================================
//Copyright: &copy;MyCompany 2016. All rights reserved.
//==========================================================================
'use strict';
/**
 * The fs.
 */
var _fs = require('fs');
/**
 * The path.
 */
var _path = require('path');
/**
 * The wrench.
 */
var _wrench = require('wrench');
/**
 * The csslint stylish.
 */
var csslintStylish = require('csslint-stylish');


function decamelize(input) {
  var test = input.split('_');
  if (test.length > 1 && input.indexOf('_') > 0) {
    var output = trim(input.toLowerCase());
    return output;
  }
  test = input.split('-');
  if (test.length > 1 && input.indexOf('-') > 0) {
    var output = trim(input.toLowerCase());
    return output;
  }
  var words = [];
  var word = '';
  for (var c = 0; c < input.length; c++) {
    var chararcter = input.charAt(c);
    if (chararcter == '_') {
      chararcter = ' ';
    }
    if (isUpperCase(chararcter)) {
      chararcter = chararcter.toLowerCase();
      words.push(trim(word));
      word = '';
      word += chararcter;
    } else {
      word += chararcter;
    }
  }
  if (trim(word)
      .length > 0) {
    words.push(trim(word));
  }
  var name = trim(words.join(' '));
  name = name.split(' ')
  .join('_');
  return name.split('-')
  .join('_');
}

function getModuleName(filePathName) {
  var moduleName = filePathName.split('.');
  moduleName.pop();
  moduleName = moduleName.join('.');
  if (filePathName.indexOf('/') !== -1) {
    moduleName = moduleName.split('/');
  } else {
    moduleName = moduleName.split('\\');
  }
  var modName = moduleName.pop();
  return decamelize(modName);
}

function capitalize(input) {
  if (input == null) {
    return '';
  }
  input = input.split('');
  if (input.length === 0) {
    return '';
  }
  input[0] = input[0].toUpperCase();
  return input.join('');
}

function trim(input) {
  return input.trim();
}

function trimRight(s) {
  return s.replace(new RegExp('/s+$/'), '');
}

function camelize(input) {
  var test = input.split('_');
  if (test.length > 1 && input.indexOf('_') > 0) {
    for (var index = 0; index < test.length; index++) {
      test[index] = capitalize(test[index]);
    }
    return test.join('');
  }
  test = input.split('-');
  if (test.length > 1 && input.indexOf('-') > 0) {
    for (var index = 0; index < test.length; index++) {
      test[index] = capitalize(test[index]);
    }
    return test.join('');
  }
  return capitalize(input);
}

function camelizeVariable(input) {
  var test = input.split('_');
  if (test.length > 1 && input.indexOf('_') > 0) {
    for (var index = 0; index < test.length; index++) {
      test[index] = capitalize(test[index]);
    }
    test[0] = test[0].toLowerCase();
    return test.join('');
  }
  test = input.split('-');
  if (test.length > 1 && input.indexOf('-') > 0) {
    for (var index = 0; index < test.length; index++) {
      test[index] = capitalize(test[index]);
    }
    test[0] = test[0].toLowerCase();
    return test.join('');
  }
  input = input.split('');
  input[0] = input[0].toLowerCase();
  input = input.join('');
  return input;
}

function isUpperCase(aCharacter) {
  return aCharacter >= 'A' && aCharacter <= 'Z';
}

function normalizeName(input) {
  return input.split('-').join('_');
}

/**
 * @param grunt
 */
module.exports = function (grunt) {
  require('load-grunt-tasks')(grunt);
  require('time-grunt')(grunt);
  // require('grunt-postcss')(grunt);
  grunt.initConfig({
    // config: grunt.file.readJSON('.gruntconfig'),
    config: {
      bower: "/bower_components",
      src: "../src",
      staging: "../staging",
      libraryuidocs: "libraryuidocs",
      css: "css",
      js: "js"
    },
    optimize: {},
    clean: {
      build: {
        src: ['<%= config.staging %>']
      },
      options: {
        force: true
      }
    },
    copy: {
      build: {
        cwd: '<%= config.src %>',
        src: [
          'libraryuidocs/assets/**/*.*',
          'libraryuidocs/partials/*.html',
          'libraryuidocs/prettify.css',
          // 'libraryuidocs/js/google-code-prettify/prettify.js',
          // 'libraryuidocs/js/libraryuidocs.js',
          // 'libraryuidocs/js/libraryuidocs-menu.js',
          // 'libraryuidocs/js/index.js',
          // 'libraryuidocs/js/load-partials.js',
          'assets/**/*.*',
          'css/base/fonts/*.*',
          'css/base/font-awesome.css',
          'css/external/*.css',
          // 'js/*.*',
          // 'js/modules/*.*',
          'js/require-2.1.5.min.js',
          'js/jquery-3.1.1.min.js',
          'js/external/*.js',
          'templates/**/*.*',
          'demo/*.*',
          'index.html'
        ],
        dest: '<%= config.staging %>',
        expand: true
      }
    },
    // make a zipfile of the BUILT output
    archiveBuilt: {
      cwd: '<%= config.src %>',
      src: ['staging'],
      dest: '../staging.zip'
    },
    // make a zipfile of the BUILT output // src : [ '../src', '../build/Gruntfile.js', '../build/package.json' ],
    archive: {
      cwd: 'libraryui',
      src: ['../src', '../build/Gruntfile.js', '../build/package.json', '../library Pattern Library Setup.docx'],
      dest: '../libraryui.zip'
    },
    createInlineTemplates: {
      cwd: '<%= config.src %>',
      src: ['libraryuidocs/partials', 'templates'],
      dest: '<%= config.staging %>/index.html'
    },
    sass: {
      options: {
        style: 'expanded'
      },
      dist: {
        files: [{
          "<%= config.staging %>/<%= config.css %>/companynameui.css": "<%= config.src %>/css/mainui.scss",
          "<%= config.staging %>/<%= config.css %>/companynameexternal.css": "<%= config.src %>/css/mainexternal.scss",
          "<%= config.staging %>/<%= config.libraryuidocs %>/libraryuidocs.css": "<%= config.src %>/<%= config.libraryuidocs %>/libraryuidocs.scss"
        }]
      }
    },
    postcss: {
      options: {
        map: {
          inline: false
            // save all sourcemaps as separate files...
            // annotation: '<%= config.staging %>/**/' // ...to the specified directory
        },
        // safe: true,
        processors: [
          // require('pixrem')(), // add fallbacks for rem units
          require('autoprefixer')({
            browsers: 'last 2 versions'
          }) // , // add vendor prefixes
          // require('cssnano')() // minify the result
        ]
      },
      dist: {
        src: '<%= config.staging %>/**/*.css'
      }
    },
    watch: {
      files: ['<%= config.src %>/libraryuidocs/**/*.*', '<%= config.src %>/assets/**/*.*', '<%= config.src %>/css/**/*.*', '<%= config.src %>/js/**/*.*',
        '<%= config.src %>/templates/**/*.*', '<%= config.src %>/demo/*.*', '<%= config.src %>/index.html'
      ],
      tasks: ['build'],
      options: {
        event: ['added', 'deleted', 'changed'],
        debounceDelay: 250
      }
    },
    // configFile : '.sass-lint.yml',
    // config: '.scss-lint.yml',
    scsslint: {
      allFiles: ['<%= config.src %>/css/*.scss', ],
      options: {
        reporterOutput: 'scss-lint-report.xml',
        colorizeOutput: true
      },
    },
    // only apply CSS LINT to real CSS files, not SASS/LESS source
    csslint: {
      options: {
        quiet: true,
        formatters: [{
          id: 'junit-xml',
          dest: 'csslint_junit.xml'
        }, {
          id: 'text',
          dest: 'csslint.txt'
        }, {
          id: require('csslint-stylish'),
          dest: 'csslint_stylish.xml'
        }]
      },
      strict: {
        options: {
          import: 2
        },
        src: ['<%= config.staging %>/css/**/*.css']
      },
      lax: {
        options: {
          import: false
        },
        src: ['<%= config.staging %>/css/**/*.css']
      }
    },
    pkg: grunt.file.readJSON('package.json')
  });
  /**
   * Read file.
   * 
   * @param filePathName
   */
  function readFile(filePathName) {
    /**
     * The file encoding.
     * 
     * @type {string}
     */
    var FILE_ENCODING = 'utf8';
    filePathName = _path.normalize(filePathName);
    /**
     * The source.
     * 
     * @type {string}
     */
    var source = '';
    try {
      source = _fs.readFileSync(filePathName, FILE_ENCODING);
    } catch (er) {
      source = '';
    }
    return source;
  }
  /**
   * Write file.
   * 
   * @param filePathName
   * @param source
   */
  function writeFile(filePathName, source) {
    filePathName = _path.normalize(filePathName);
    safeCreateFileDir(filePathName);
    _fs.writeFileSync(filePathName, source);
  }
  /**
   * Safe create file dir.
   * 
   * @param path
   */
  function safeCreateFileDir(path) {
    /**
     * The dir.
     */
    var dir = _path.dirname(path);
    if (!_fs.existsSync(dir)) {
      _wrench.mkdirSyncRecursive(dir);
    }
  }
  /**
   * Safe create dir.
   * 
   * @param dir
   */
  function safeCreateDir(dir) {
    if (!_fs.existsSync(dir)) {
      _wrench.mkdirSyncRecursive(dir);
    }
  }
  grunt.registerTask('archive', function () {
    /**
     * The config.
     */
    var config = grunt.config('archive');
    /**
     * The cwd.
     */
    var cwd = config.cwd;
    /**
     * The source.
     */
    var source = config.src;
    /**
     * The dest.
     */
    var dest = config.dest;
    /**
     * The done.
     */
    var done = this.async();
    /**
     * The fsx.
     */
    var fsx = require('fs-extra');
    /**
     * The zip zip top.
     */
    var ZipZipTop = require("zip-zip-top");
    /**
     * The index.
     * 
     * @type {number}
     */
    var index = 0;
    /**
     * The source length.
     */
    var sourceLength = source.length;
    // create a temp folder
    safeCreateFileDir('../temp/fake.file');
    // copy files and folders to temp
    /**
     * @type {number}
     */
    for (var index = 0; index < sourceLength; index++) {
      try {
        /**
         * The fixed item.
         */
        var fixedItem = source[index];
        if (fixedItem.indexOf("../") !== -1 || fixedItem.indexOf("./") !== -1 || fixedItem.indexOf("/") !== -1) {
          /**
           * The splitter.
           */
          var splitter = fixedItem.split('/');
          splitter.shift();
          fixedItem = splitter.join('/');
        }
        console.log('Copy "' + source[index] + '" to "' + '../temp/' + fixedItem + '".');
        safeCreateFileDir('../temp/' + fixedItem);
        fsx.copySync(source[index], '../temp/' + fixedItem);
      } catch (err) {
        console.error(err);
      }
    }
    // zip temp
    // zip a folder and change folder destination name
    /**
     * The zip6.
     */
    var zip6 = new ZipZipTop();
    var doneAdding = function () {
      console.log('writing zip archive "' + dest + '".');
      zip6.writeToFile(dest, function (err) {
        if (err) {
          return console.log(err);
        }
        console.log("Done");
        zip6 = null;
        // remove temp
        console.log('delete temp folder');
        fsx.removeSync('../temp');
        done();
      });
    };
    var zipNext = function () {
      /**
       * The item.
       * 
       * @type {string}
       */
      var item = '../temp';
      console.log('zipping directory "' + item + '".');
      zip6.zipFolder(item, function (err) {
        if (err) {
          console.error(err);
        }
        doneAdding();
      }, {
        rootFolder: cwd
      });
    };
    zipNext();
  });
  // TODO: Generate the config for load-partials.js
  // Problem here is the ORDER and TARGET of these partials is user-defined, not defined by a machine-driven sort order.
  // If we load alphabetically, and use parent folder name as target, it can be easilty implemented.
  // var loaderConfig = {
  // "templates/layout/foundation.html": "#inserted-foundation",
  grunt.registerTask('createInlineTemplates', function () {
    /**
     * The config.
     */
    var config = grunt.config('createInlineTemplates');
    /**
     * The cwd.
     */
    var cwd = config.cwd;
    /**
     * The source.
     */
    var source = config.src;
    /**
     * The dest.
     */
    var dest = config.dest;
    /**
     * The loader config builder.
     */
    var loaderConfigBuilder = {};
    /**
     * The jsdom.
     * 
     * @type {object}
     */
    var jsdom = null;
    /**
     * The window.
     * 
     * @type {object}
     */
    var window = null;
    /**
     * The $.
     * 
     * @type {object}
     */
    var $ = null;
    /**
     * The done.
     */
    var done = this.async();
    /**
     * The extract snippets.
     * 
     * @type {boolean}
     */
    var EXTRACT_SNIPPETS = false;
    /**
     * The process snippets.
     * 
     * @type {boolean}
     */
    var PROCESS_SNIPPETS = false;
    /**
     * Process templates.
     * 
     * @funtion
     * @return {string}
     */
    var processTemplates = function () {
      console.log('>>>>>> processTemplates');
      // window.$("body").append('<div class="testing">Hello World, It works</div>');
      // console.log(window.$(".testing").text());
      console.log('CWD: ', cwd);
      console.log('SOURCE: ', source);
      console.log('DEST: ', dest);
      /**
       * Fix template target. Tell me which DOM element I should insert this template into? .
       * 
       * @param {String}
       * @param {String}
       * @return {String} Either the inferred name, or some other target name, if an exception is made in the path name.
       */
      function fixTemplateTarget(name, path) {
        if (path === 'templates/layout/foundation.html' || path === 'templates/layout/grid.html' || path === 'templates/layout/swatch.html') {
          return 'foundation';
        } else if (path.indexOf('templates/layout') !== -1) {
          return 'layouts';
        } else if (path === 'libraryuidocs/partials/setup.html') {
          return 'setup';
        }
        return name;
      }
      /**
       * The buffer.
       */
      var buffer = [];
      /**
       * The snippets.
       */
      var snippets = {};
      /**
       * @type {number}
       */
      for (var index = 0; index < source.length; index++) {
        /**
         * The scan path.
         */
        var scanPath = cwd + "/" + source[index];
        /**
         * The files.
         */
        var files = _wrench.readdirSyncRecursive(scanPath);
        // console.warn(files);
        /**
         * @type {number}
         */
        for (var f = 0; f < files.length; f++) {
          /**
           * The file name.
           */
          var fileName = files[f];
          if (fileName.indexOf('starter-template') !== -1) {
            continue;
          }
          // fix fileName for x-platform:
          fileName = _path.normalize(fileName).replace(/\\/g, '/');
          /**
           * The ext.
           */
          var ext = _path.extname(fileName);
          if (ext === '.html') {
            /**
             * The temp.
             */
            var temp = readFile(scanPath + "/" + fileName);
            // console.log(temp.length);
            /**
             * The short path.
             */
            var shortPath = scanPath.split(cwd + "/")[1];
            /**
             * The key name.
             */
            var keyName = shortPath + "/" + fileName;
            // console.log(0);
            // var pathComponents = _path.parse(shortPath);
            /**
             * The path components.
             */
            var pathComponents = {};
            /**
             * The path split.
             */
            var pathSplit = keyName.split('/');
            pathSplit.shift();
            /**
             * The just file.
             */
            var justFile = pathSplit.pop();
            pathComponents.dir = pathSplit.join('/');
            pathComponents.name = justFile.split('.')[0];
            // console.log(1);
            // only for internal use
            // if temp contains 1 or more code snippets, extract them NOW
            if (temp.indexOf('libraryuidocs-partials-code') !== -1 && PROCESS_SNIPPETS) {
              jsdom = require("jsdom");
              window = jsdom.jsdom().parentWindow;
              $ = window.$;
              snippets[keyName] = [];
              // console.log('>>>>>>> FOUND A CODE SNIPPET in "' + fileName + '".');
              window.$("body").empty();
              window.$("body").append(temp);
              /**
               * The all snippets.
               */
              var allSnippets = $('.libraryuidocs-partials-code');
              // console.log('FOUND ' + allSnippets.length);
              // snippets[keyName]['#'+id] = allSnippets.length;
              /**
               * @type {number}
               */
              for (var s = 0; s < allSnippets.length; s++) {
                /**
                 * The snip.
                 */
                var snip = $(allSnippets[s]);
                /**
                 * The id.
                 */
                var id = snip.parent().attr('id');
                if (!id) {
                  id = snip.parent().parent().attr('id');
                }
                if (!id) {
                  id = snip.parent().parent().parent().attr('id');
                }
                if (id === "yourid") {
                  continue;
                }
                console.log('#' + id);
                // if (!snippets[keyName]['#'+id]){
                // snippets[keyName]['#'+id] = [];
                // }
                // var theSnippet = snip[0].outerHTML;
                // snippets[keyName]['#'+id].push(theSnippet);
                /**
                 * The the snippet.
                 */
                var theSnippet = $(snip.find('.prettyprint'));
                /**
                 * The code block.
                 */
                var codeBlock = $(snip.find('code'));
                /**
                 * The code type.
                 */
                var codeType = codeBlock.attr('class');
                if (codeBlock.html().indexOf('var ') !== -1) {
                  codeType = 'lang-js';
                } else if (codeBlock.html().indexOf('@include') !== -1 || codeBlock.html().indexOf('@media') !== -1) {
                  codeType = 'lang-css';
                }
                /**
                 * The snippet hash.
                 */
                var snippetHash = pathComponents.dir + '/' + pathComponents.name + '_' + id;
                // console.log('codeType', codeType);
                // var snippetHash = keyName;
                if (EXTRACT_SNIPPETS) {
                  // write out the snippets we found
                  if (codeType.indexOf('lang-html') !== -1) {
                    writeFile('../src/snippets/' + snippetHash + '_' + s + '_template' + '.html', theSnippet.text().trim());
                  } else if (codeType.indexOf('lang-css') !== -1) {
                    writeFile('../src/snippets/' + snippetHash + '_' + s + '_stylesheet' + '.html', theSnippet.text().trim());
                  } else if (codeType.indexOf('lang-js') !== -1) {
                    writeFile('../src/snippets/' + snippetHash + '_' + s + '_script' + '.html', theSnippet.text().trim());
                  }
                }
                snippets[snippetHash].push([s]);
              }
            }
            buffer.push('<script type="text/template" id="template_' + shortPath + "/" + fileName + '" >\n\n' + temp + '\n\n</script>');
            // "templates/layout/foundation.html": "#inserted-foundation",
            /**
             * The target name.
             * 
             * @type {string}
             */
            var targetName = '';
            /**
             * The temp splitter.
             */
            var tempSplitter = keyName.split('/');
            // get 2nd to last path component: this should work well if we nest folders in the future
            tempSplitter.pop();
            targetName = tempSplitter.pop();
            targetName = fixTemplateTarget(targetName, keyName);
            // console.log("Found template '" + keyName + "' to be shown in DOM target id '" + "inserted-" + targetName
            // + "'.");
            loaderConfigBuilder[keyName] = "#inserted-" + targetName;
          }
        }
      }
      console.log(JSON.stringify(snippets, null, 2));
      writeFile('../staging/libraryuidocs/partial-config.js', "var loaderConfig = " + JSON.stringify(loaderConfigBuilder, null, 2) + ";");
      /**
       * The index.
       */
      var index = readFile('../src/index.html');
      if (index.length) {
        /**
         * The splitter.
         */
        var splitter = index.split("</body>");
        /**
         * The output.
         */
        var output = splitter[0] + '\n<div style="display:none;">' + buffer.join("\n") + "</div>\n</body>\n" + splitter[1];
        writeFile('../staging/index.html', output);
      } else {
        console.error("ERROR: Can't read index.html");
      }
      done();
    };
    if (PROCESS_SNIPPETS) {
      jsdom.jQueryify(window, "http://code.jquery.com/jquery-2.1.1.js", processTemplates);
    } else {
      processTemplates();
    }
  });
  grunt.registerTask('optimize', function () {
    /**
     * The config.
     */
    var config = grunt.config('optimize');
    /**
     * The requirejs.
     */
    var _requirejs = require('requirejs');
    /**
     * The done.
     */
    var done = this.async();
    config = {
      // The top level directory that contains your app. If this option is used
      // then it assumed your scripts are in a subdirectory under this path.
      // This option is not required. If it is not specified, then baseUrl
      // below is the anchor point for finding things. If this option is specified,
      // then all the files from the app directory will be copied to the dir:
      // output area, and baseUrl will assume to be a relative path under
      // this directory.
      appDir: '../src/libraryuidocs',
      // By default, all modules are located relative to this path. If baseUrl
      // is not explicitly set, then all modules are loaded relative to
      // the directory that holds the build file. If appDir is set, then
      // baseUrl should be specified as relative to the appDir.
      baseUrl: "./",
      dir: '../staging',
      keepBuildDir: true,
      // By default all the configuration for optimization happens from the command
      // line or by properties in the config file, and configuration that was
      // passed to requirejs as part of the app's runtime "main" JS file is *not*
      // considered. However, if you prefer the "main" JS file configuration
      // to be read for the build so that you do not have to duplicate the values
      // in a separate configuration, set this property to the location of that
      // main JS file. The first requirejs({}), require({}), requirejs.config({}),
      // or require.config({}) call found in that file will be used.
      // As of 2.1.10, mainConfigFile can be an array of values, with the last
      // value's config take precedence over previous values in the array
      mainConfigFile: '../src/libraryuidocs/js/index.js',
      // How to optimize all the JS files in the build output directory.
      // Right now only the following values
      // are supported:
      // - "uglify": (default) uses UglifyJS to minify the code.
      // - "uglify2": in version 2.1.2+. Uses UglifyJS2.
      // - "closure": uses Google"s Closure Compiler in simple optimization
      // mode to minify the code. Only available if running the optimizer
      // using
      // Java.
      // - "closure.keepLines": Same as closure option, but keeps line returns
      // in the minified files.
      // - "none": no minification will be done.
      optimize: 'none',
      // //A function that if defined will be called for every file read in
      // the
      // //build that is done to trace JS dependencies. This allows transforms
      // of
      // //the content.
      // onBuildRead: function (moduleName, path, contents) {
      // //Always return a value.
      // //This is just a contrived example.
      // console.log("Reading file "" + moduleName + "".");
      // return contents;
      // },
      //
      // //A function that will be called for every write to an optimized
      // bundle
      // //of modules. This allows transforms of the content before
      // serialization.
      // onBuildWrite: function (moduleName, path, contents) {
      // //Always return a value.
      // //This is just a contrived example.
      // console.log("Writing file "" + moduleName + "".");
      // return contents;
      // },
      // If it is not a one file optimization, scan through all .js files in
      // the
      // output directory for any plugin resource dependencies, and if the
      // plugin
      // supports optimizing them as separate files, optimize them. Can be a
      // slower optimization. Only use if there are some plugins that use
      // things
      // like XMLHttpRequest that do not work across domains, but the built
      // code
      // will be placed on another domain.
      optimizeAllPluginResources: true,
      // Finds require() dependencies inside a require() or define call. By
      // default
      // this value is false, because those resources should be considered
      // dynamic/runtime
      // calls. However, for some optimization scenarios,
      // Introduced in 1.0.3. Previous versions incorrectly found the nested
      // calls
      // by default.
      findNestedDependencies: true,
      // Allow "use strict"; be included in the RequireJS files.
      // Default is false because there are not many browsers that can
      // properly
      // process and give errors on code for ES5 strict mode,
      // and there is a lot of legacy code that will not work in strict mode.
      useStrict: true,
      modules: [{
        // module names are relative to baseUrl
        name: 'libraryuidocs/js/index'
      }]
    };
    // console.log('run r.js');
    // try {
    // _requirejs.optimize(config, function(results) {
    // console.log('run r.js SUCCESS?');
    // console.log(results);
    // console.log('\n\n');
    // done();
    // });
    // } catch (e) {
    // console.error(e);
    // done();
    // }
    /**
     * The paths.
     */
    var paths = {};
    /**
     * The partials.
     */
    var partials = {};
    var pathsSource = readFile('./paths.json');
    paths = JSON.parse(pathsSource);
    
    
    var partialsSource = readFile('./partials.json');
    partials = JSON.parse(partialsSource);
    // console.log(paths);
    /**
     * The base path.
     * 
     * @type {string}
     */
    var basePath = '../src/libraryuidocs/js/';
    /**
     * The new index.
     * 
     * @type {string}
     */
    var newIndex = '';
    var moduleNames = [];
    var moduleInstanceNames = [];
    for (var key in paths) {
      if (paths.hasOwnProperty(key)) {
        var pathItem = paths[key];
        // if no varName is given, generate one now
        if (!pathItem.varName){
          pathItem.varName = camelizeVariable(normalizeName(key));
        }
        var thePath = basePath + pathItem.path + '.js';
        /**
         * The source.
         */
        var source = readFile(thePath);
        if (source.indexOf('define(') === -1) {
          // it's not really AMD
          // console.log("it's not really AMD: " + key);
          source = 'define("' + key + '", [], function(){\n' + source + '\nreturn {};\n});';
        }
        // } else {
        // console.log("it's an AMD module: " + key);
        // }
        newIndex += source + '\n\n';
        moduleNames.push("'" + key + "'");
        moduleInstanceNames.push(pathItem.varName);
      }
    }
    /**
     * The buffer.
     */
    var buffer = [];
    buffer.push("////// MAIN ENTRYPOINT FOR THIS APP /////////");
    buffer.push("////// This is machine-generated. Do not over-write. /////////");
    buffer.push("define([");
    // List of module names
    buffer.push(moduleNames.join(','));
    buffer.push("], function(");
    // List of Module Instance Names
    buffer.push(moduleInstanceNames.join(','));
    buffer.push(") {");
    buffer.push("\t'use strict';");
    buffer.push("\tlogger.enable(false);");
    buffer.push("\tvar report = logger.report;");
    buffer.push("\tvar warn = logger.warn;");
    buffer.push("\tvar error = logger.error;");
    buffer.push("\treport('HELLO AMD');");
    buffer.push("\twindow.setTimeout(function(){");
    buffer.push("\t\t$('body').show();");
    buffer.push("\t}, 15);");
    buffer.push("");
    buffer.push("/* Only call this method once, early on. */");
    
    
    buffer.push("var oneTimeInit = function(){");
    buffer.push("// TBD for future releases.");
    buffer.push("};");
    
    buffer.push("/* Call this method every time DOM contents changes an handlers need to be-initialized. */");
    buffer.push("var templateInit = function(){");
    buffer.push("var importedModules = [" + moduleInstanceNames.join(',') + "];"); 
    
    buffer.push("for (var m = 0; m<importedModules.length; m++){");
    buffer.push("  var module = importedModules[m];");
    buffer.push("  if (module.initializeDom){");
    buffer.push("    module.initializeDom();");
    buffer.push("  }");
    buffer.push("}");

    buffer.push("};");
    
    buffer.push("\tlibraryuidocs.setOneTimeInit(oneTimeInit);");
    buffer.push("\tlibraryuidocs.setTemplateInit(templateInit);");
    buffer.push("\tlibraryuidocs.setPartials(" + JSON.stringify(partials) + ");");
    buffer.push("});");


    
    newIndex += buffer.join('\n');
    writeFile('../staging/libraryuidocs/js/' + 'index.js', newIndex);
    done();
  });
  // load tasks
  grunt.loadNpmTasks('grunt-contrib-csslint');
  grunt.loadNpmTasks('grunt-autoprefixer');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-postcss');
  grunt.loadNpmTasks('grunt-contrib-watch');
  // Used in regular desktop mode
  grunt.registerTask('default', ['build', 'watch']);
  grunt.registerTask('build', ['clean', 'copy', 'sass', 'postcss', 'createInlineTemplates', 'optimize']);
};