define("carousel", ["logger", "jquery"],
    /**
     * @exports modules/carousel
     * @requires logger
     * @requires jquery
     */
    function (logger, $) {
  "use strict";
  /**
   * The slide top.
   */
  var slideTop = -1;
  /**
   * The test mode.
   * @type {Boolean}
   */
  var TEST_MODE = false;
  /**
   * @param carouselElement
   */
  var initCarousel = function (carouselElement) {
    carouselElement = $(carouselElement);
    // get elements directly below ".classnameui-carousel-inner"
    /**
     * The inner div.
     */
    var innerDiv = carouselElement.find(".classnameui-carousel-inner");

    /**
     * The slides.
     */
    var slides = $(innerDiv.children());

    /**
     * The indicator wrapper.
     */
    var indicatorWrapper = carouselElement.find(".classnameui-carousel-indicators");

//    carouselElement.css({
//      "width": "800px"
//    });
//    carouselElement.css({
//      "height": "600px"
//    });
    
    var wrapperHeight = (parseInt(slides.find(".classnameui-card-image img").prop("height"), 10) + 22);
    innerDiv.css({
      "height":  wrapperHeight + "px",
      "width":  parseInt(slides.find(".classnameui-card-image img").prop("width"), 10) + "px"
    });

//  innerDiv.css({
//  "height": "477px"
//  });

    //indicatorWrapper.css("position", "relative");
    
    /**
     * The slide index.
     * @type {Number}
     */
    var slideIndex = 0;
    /**
     * The slide height.
     */
    var slideHeight = carouselElement.height();
    /**
     * The slide height adjust.
     * @type {Number}
     */
    var slideHeightAdjust = 0;
    /**
     * @type {Number}
     */
    var index = 0;

    for (index = 0; index < slides.length; index++) {
      /**
       * The slide.
       */
      var slide = $(slides[index]);
      slide.css({
        "display": "inline",
        "position": "relative"
      });
      slideHeightAdjust = slideHeightAdjust - slideHeight;
      slide.css("width", carouselElement.width() + "px");
      slide.css("height", carouselElement.height() + "px");
      //slide.css("top", slideHeightAdjust + "px");
      slide.css("top", "0px");
      if (slide.hasClass("show") || slide.hasClass("active")) {
        logger.report("active slide is #" + index);
        slide.addClass("active");
        slideIndex = index;
        slideTop = slide.position().top;
      } else {
        slide.css("display", "none");
      }
      slide.removeClass("show");
      slide.removeClass("hide");
    }
    updateIndicators(carouselElement, slideIndex);
    /**
     * The indicators.
     */
    var indicators = carouselElement.find(".classnameui-carousel-indicators ol li");
    indicators.on("click", function () {
      /**
       * The index.
       */
      var index = parseInt($(this).attr("data-slide-to"), 10) - 1;
      seekTo($(".classnameui-carousel"), index);
    });
    /**
     * The prev btn.
     */
    var prevBtn = carouselElement.find(".classnameui-prev");
    prevBtn.attr("href", "javascript:void(0)");
    prevBtn.on("click", function () {
      prev(carouselElement);
    });
    /**
     * The next btn.
     */
    var nextBtn = carouselElement.find(".classnameui-next");
    nextBtn.attr("href", "javascript:void(0)");
    nextBtn.on("click", function () {
      next(carouselElement);
    });
    seekTo($(".classnameui-carousel"), 0);
  };
  /**
   * @param carouselElement
   */
  var getSlideIndex = function (carouselElement) {
    /**
     * The inner div.
     */
    var innerDiv = carouselElement.find(".classnameui-carousel-inner");
    /**
     * The slides.
     */
    var slides = innerDiv.children();
    /**
     * The slide index.
     */
    var slideIndex = -1;
    /**
     * @type {Number}
     */
    for (var index = 0; index < slides.length; index++) {
      /**
       * The slide.
       */
      var slide = $(slides[index]);
      if (slide.hasClass("show") || slide.hasClass("active")) {
        logger.report("active slide is #" + index);
        slideIndex = index;
        return slideIndex;
      }
    }
    return slideIndex;
  };
  /**
   * @param carouselElement
   * @param index
   */
  var updateIndicators = function (carouselElement, index) {
    /**
     * The indicators.
     */
    var indicators = carouselElement.find(".classnameui-carousel-indicators ol li");
    indicators.removeClass("active");
    $(indicators[index]).addClass("active");
  };
  /**
   * @type {Boolean}
   */
  var SEEKING = false;
  // We are emulating the behavior of the bootstrap carousel:
  // 1) get current slide
  // 2) get slide [index]
  // 3) animate both according to rules
  // 4) It"s always slide A + slide B being moved to left or right in tandem
  /**
   * @param carouselElement
   * @param index
   * @param directionIn
   */
  var seekTo = function (carouselElement, index, directionIn) {
    if (SEEKING) {
      return;
    }
    updateIndicators(carouselElement, index);
    /**
     * The current slide index.
     */
    var currentSlideIndex = getSlideIndex(carouselElement);
    /**
     * The inner div.
     */
    var innerDiv = carouselElement.find(".classnameui-carousel-inner");
    /**
     * The slides.
     */
    var slides = innerDiv.children();
    $(slides).hide();
    /**
     * The current slide.
     */
    var currentSlide = $(slides[currentSlideIndex]);
    /**
     * The next slide.
     */
    var nextSlide = $(slides[index]);
    currentSlide.css("display", "inline");
    nextSlide.css("display", "inline");
    currentSlide.stop();
    nextSlide.stop();
    /**
     * The direction.
     * @type {Number}
     */
    var direction = 0;
    if (directionIn) {
      direction = directionIn;
    } else {
      if (index > currentSlideIndex) {
        // scroll to the left
        direction = 1;
      } else if (index < currentSlideIndex) {
        // scroll to the right
        direction = -1;
      } else {
        direction = 0;
        // do nothing, you are where you should be already
        return;
      }
    }
    SEEKING = true;
    currentSlide.css("top", slideTop + "px");
    nextSlide.css("top", slideTop + "px");
    /**
     * The my width.
     */
    var myWidth = currentSlide.find("img").width();
    if (TEST_MODE) {
      myWidth = myWidth / 2;
    }
    /**
     * The current slide destination.
     */
    var currentSlideDestination = "-" + myWidth + "px";
    /**
     * The next slide destination.
     */
    var nextSlideDestination = 0 + "px";
    if (TEST_MODE) {
      nextSlideDestination = myWidth + "px";
    }
    // Set starting points for both slides.
    if (direction === 1) {
      // Place nextSlide to the RIGHT of the frame, hidden.
      nextSlide.css("left", currentSlide.find("img").width() + "px");
      // If nextSlide is to the RIGHT of currentSlide, offset its top.
      nextSlide.css("top", (-currentSlide.find("img").height() + "px"));
    } else if (direction === -1) {
      nextSlide.css("left", "-" + currentSlide.find("img").width() + "px");
      currentSlideDestination = myWidth + "px";
      nextSlideDestination = 0 + "px";
      // If nextSlide is to the LEFT of currentSlide, offset currentSlide"s top.
      currentSlide.css("top", (-currentSlide.find("img").height() + "px"));
      nextSlide.css("display", "inline");
    }
    var doneCurrentSlide = function () {
      if (TEST_MODE) {
        return;
      }
      currentSlide.removeClass("active");
      // currentSlide.removeClass("show");
      // currentSlide.addClass("hide");
      currentSlide.css("display", "none");
      nextSlide.css("top", "0px");
      logger.report("done slide A");
    };
    var doneNextSlide = function () {
      if (TEST_MODE) {
        return;
      }
      nextSlide.addClass("active");
      logger.report("done slide B");
      SEEKING = false;
    };
    logger.report("currentSlideDestination: " + currentSlideDestination + ", nextSlideDestination: " + nextSlideDestination);
    currentSlide.animate({
      left: currentSlideDestination
    }, {
      duration: 700,
      complete: doneCurrentSlide,
      queue: false
    });
    nextSlide.animate({
      left: nextSlideDestination
    }, {
      duration: 700,
      complete: doneNextSlide,
      queue: false
    });
    return carouselElement;
  };
  /**
   * @param carouselElement
   */
  var prev = function (carouselElement) {
    /**
     * The current index.
     */
    var currentIndex = getSlideIndex(carouselElement);
    currentIndex--;
    if (currentIndex < 0) {
      // TEMP
      return;
      /**
       * The inner div.
       */
      var innerDiv = carouselElement.find(".classnameui-carousel-inner");
      /**
       * The slides.
       */
      var slides = innerDiv.children();
      currentIndex = slides.length - 1;
    }
    seekTo(carouselElement, currentIndex, -1);
  };
  /**
   * @param carouselElement
   */
  var next = function (carouselElement) {
    /**
     * The current index.
     */
    var currentIndex = getSlideIndex(carouselElement);
    currentIndex++;
    /**
     * The inner div.
     */
    var innerDiv = carouselElement.find(".classnameui-carousel-inner");
    /**
     * The slides.
     */
    var slides = innerDiv.children();
    if (currentIndex > slides.length - 1) {
      // TEMP
      return;
      currentIndex = 0;
    }
    seekTo(carouselElement, currentIndex, 1);
  };

  /**
   * The exports.
   */
  /**
   * Exports.
   * @alias module:carousel
   */
  var exports = {
      /**
       * Initialize dom. 
       *  Call initializeDom when we need to bind or re-bind with DOM.
       * @method
       */
      initializeDom: function () {
        if ($(".classnameui-carousel").length > 0) {
          logger.enable(true);
          logger.report("found carousel");
          /**
           * The carousels.
           */
          var carousels = $(".classnameui-carousel");
          /**
           * @type {Number}
           */
          for (var index = 0; index < carousels.length; index++) {
            /**
             * The carousel.
             */
            var carousel = $(carousels[index]);
            logger.report("initCarousel " + index);
            initCarousel(carousel);
          }
        }
      }
  };
  return exports;
});