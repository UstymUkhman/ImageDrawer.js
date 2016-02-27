/*! 
 * ImageDrawer.js - jQuery plugin to animate a drawing image
 * 
 * @version v1.0.0
 * @link    GitHub       - https://github.com/UstymUkhman/ImageDrawer.js
 * @license MIT License  - https://opensource.org/licenses/MIT
 * @author  Ustym Ukhman - <ustym.ukhman@gmail.com>
 * 
 */

/**
 * Usage:
 * ------
 *
 * <div id="container">
 *   <img src="./path/to/image/<image>.jpg">
 * </div>
 * _________________________________________
 *
 * $(div#container).drawImge({
 *   duration: 20,              @number|@object - seconds it's take to draw the entire picture
 *
 *                              Instead of specifying the duration on the whole animation,
 *   || {                       it's also possible to set the duration of single drawing phases:
 *     borderPencil : 9,                @number - seconds it's take to draw the picture by using only the pencil for borders
 *     pencilShades : 6,                @number - seconds it's take to draw sharpest shades with black pencil
 *     colorShades  : 7.5,              @number - seconds it's take to draw first, basic, vanish colors
 *     fullColors   : 7.5               @number - seconds it's take to define better all colors on the picture
 *   },
 *
 *   background: '#949494',     @string   - background color for image while it's been drawing
 *   callback: fn(),            @function - function to execute after the last phase
 *   pencil: {
 *      src       : './img/pencil.png'  @string         - path to the pencil image
 *      width     : '50px',             @string|@number - pencil image width
 *      height    : '50px',             @string|@number - pencil image height
 *      marginTop : -40,                @string|@number - initial margin top distance
 *      marginLeft: -15,                @string|@number - initial margin left distance
 *      disappear : 5,                  @number         - seconds for a disappearing pencil animation
 *    }
 * });
 *
 */


'use strict';

(function($) {
  $.fn.extend({

    /**
     * $.drawImage() - function to imitate accelerated drawn image
     *
     * @param {object|function} - custom drawing options | callback function
     * @function drawImage
     * @memberof jQuery
     * @public
     *
     * @returns {array} - object(s) selected by $
     */
    drawImage: function(args) {

      // Number of drawing phases:
      var PHASES = 4,

      // Phase wacher:
          currPhase = 0,

      // Callback function:
          cb = null,

      // Custom options:
          options = { },

      // Image reference:
          $image = $(this).find('img'),

      // Object with duration value of each phase:
          timing = null,

      // Drawing pencil icon:
          $pencilImage = null,

      // Drawing pencil animation:
          pencilAnimationID = null;

      // Checking for a calback or custom options:
           if (typeof args === 'function')    cb = args;
      else if (typeof args === 'object') options = args;

      // Setting up custom or default options:
      var opts = {
            duration: options.duration     || { borderPencil: 6, pencilShades: 4,
                                                colorShades:  5, fullColors:   5 },

            callback: cb                   || options.callback,
            background: options.background || '#FFF',
            pencil: options.pencil         || null
          },

          // Creating a background:
          $imgBackground = $('<div>').css({'background-color': opts.background}),

          checkOptionsType = function(pencilOpts) {
            var ok = true;

            $.each(pencilOpts, function(key, value) {
              if (key === 'src' || key === 'invertAxis' || key === 'fromBottom') {
                return;
              }

              if (typeof value !== 'number') {
                console.warn('The value of \"' + key + '\" in \"pencil\" has to be a number.');
                ok = false;
              }
            });

            return ok;
          },

          setPencilAnimation = function($pencil, opt) {
            var x         = opt.pos.marginLeft,
                y         = opt.pos.marginTop,
                Y         = (opt.pos.invertAxis) ? 5.925925 : 177.77777,
                X         = (opt.pos.invertAxis) ? 100 : 10,
                xStep     = opt.width  / X,
                yStep     = opt.height / Y,
                xNextStep = x + xStep,
                yNextStep = y + yStep;

            X = x,
            Y = y;

            var pencilAnim = function() {
              $pencil.css({'transform': 'translate3d(' + x + 'px, ' + y + 'px, 0px)',
                           '-webkit-transform': 'translate3d(' + x + 'px, ' + y + 'px, 0px)'});

              if (xNextStep >= opt.width || xNextStep <= X) xStep = -xStep;
              x += xStep;
              xNextStep = x + xStep;

              if (yNextStep >= opt.height || yNextStep < Y) yStep = -yStep;
              y += yStep;
              yNextStep = y + yStep;

              pencilAnimationID = requestAnimationFrame(pencilAnim);
            };

            pencilAnimationID = requestAnimationFrame(pencilAnim);
          };

          if (typeof opts.duration === 'number') {
            var quarter = duration /  4,
                tenth   = duration / 10;

            timing = {
              borderPencil: tenth * 6 + 's',
              pencilShades: tenth * 4 + 's',
              colorShades : quarter   + 's',
              fullColors  : quarter   + 's'
            };
          }

          if ($.isArray(opts.duration)) {
            var d = 0;
            timing = {
              borderPencil: opts.duration[0] + 's',
              pencilShades: opts.duration[1] + 's',
              colorShades : opts.duration[2] + 's',
              fullColors  : opts.duration[3] + 's'
            };

            for (var i = 0; i < 4; i++)
              d += opts.duration[i];

            opts.duration = d;
          } else {
            timing = {
              borderPencil: opts.duration.borderPencil + 's',
              pencilShades: opts.duration.pencilShades + 's',
              colorShades : opts.duration.colorShades  + 's',
              fullColors  : opts.duration.fullColors   + 's'
            };

            opts.duration = 20;
          }

          if (opts.pencil !== null && checkOptionsType(opts.pencil)) {
            $pencilImage = $('<img>')
              .attr({src: opts.pencil.src})
              .css({'position': 'absolute', 'width': opts.pencil.width + 'px',
              'height': opts.pencil.height + 'px', 'z-index': 1500});

            $(this).prepend($pencilImage);
            setPencilAnimation($pencilImage, {
              height: $image.height() + opts.pencil.marginTop,
              width:  $image.width(),
              pos:    opts.pencil
            });
          }

      // Setting up the background:
      $(this).prepend($imgBackground);

      $imgBackground
        .addClass('imgBackground')
        .css({'animation-duration': timing.borderPencil})
        .css({'-webkit-animation-duration': timing.borderPencil});

      // Starting to draw the picture:
      $image
        // Phase 1:
        .addClass('visibleImage borderPencil')
        .css({'animation-duration': timing.borderPencil,
              '-webkit-animation-duration': timing.borderPencil})
        .on('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',

          // Render image's style each phase:
          function() {
            var oldClass, newClass, duration;

            switch (currPhase++) {
              // Phase 2:
              case 0:
                $imgBackground.remove();
                oldClass = 'borderPencil';
                newClass = 'pencilShades';
                duration = timing.pencilShades;
              break;

              // Phase 3:
              case 1:
                oldClass = 'pencilShades';
                newClass = 'colorShades';
                duration = timing.colorShades;
              break;

              // Phase 4:
              case 2:
                oldClass = 'colorShades';
                newClass = 'fullColors';
                duration = timing.fullColors;
              break;

              case 3:
                // Restore to initial state:
                $image.css({'filter': 'brightness(1.05) saturate(1.05)',
                            '-webkit-filter': 'brightness(1.05) saturate(1.05)'})
                      .removeClass('fullColors').removeClass('visibleImage');

                if (pencilAnimationID !== null) {
                  cancelAnimationFrame(pencilAnimationID);

                  if (opts.pencil.disappear) {
                    $pencilImage
                    .addClass('pencil')
                      .css({'top': $pencilImage.offset().top + 'px',
                            'left': $pencilImage.offset().left + 'px',
                            'animation-duration': opts.pencil.disappear + 's',
                            '-webkit-animation-duration': opts.pencil.disappear + 's'});
                  }

                  setTimeout(function() {
                    $pencilImage.remove();

                    if (opts.callback !== null) {
                      opts.callback();
                    }
                  }, opts.pencil.disappear * 1000);
                } else if (opts.callback !== null) {
                  opts.callback();
                }

              return;
            }

            // Updating new drawing phases by CSS classes:
            $image.removeClass(oldClass).addClass(newClass)
                  .css({'animation-duration'        : duration,
                        '-webkit-animation-duration': duration});
          });

        // jQuery style:
        return this;
    }

  });
})(jQuery);
