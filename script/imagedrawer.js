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
 *   duration: 20,              @number - seconds it's take to draw the entire picture
 *
 *                              Instead of specifying the duration on the whole animation,
 *   || {                       it's also possible to set the duration of single drawing phases:
 *     borderPencil : 9,              @number - seconds it's take to draw the picture by using only the pencil for borders
 *     pencilShades : 6,              @number - seconds it's take to draw sharpest shades with black pencil
 *     colorShades  : 7.5,            @number - seconds it's take to draw first, basic, vanish colors
 *     fullColors   : 7.5             @number - seconds it's take to define better all colors on the picture
 *   },
 *
 *   background: '#949494',     @string   - background color for image while it's been drawing
 *   callback: fn(),            @function - function to execute after the last phase
 *   pencil: {
 *      height: '50px',
 *      width : '50px',
 *      src   : './img/pencil.png'    @string - path to the pencil image
 *    }
 * });
 *
 */


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
          timing = null;

      // Checking for a calback or custom options:
           if (typeof args === 'function')    cb = args;
      else if (typeof args === 'object') options = args;

      // Setting up custom or default options:
      var opts = {
            duration: options.duration     || { borderPencil: 6, pencilShades: 4,
                                                colorShades:  5, fullColors:   5 },

            background: options.background || '#FFF',
            pencil: options.pencil         || null,
            callback: cb
          },

          // Creating a background:
          $imgBackground = $('<div>').css({'background-color': opts.background}),

          setPencilAnimation = function($pencil, width, height) {
            // drawing pencil animation
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

      if (opts.pencil !== null) {
        var w  = opts.pencil.width      || '50px',
            h  = opts.pencil.height     || '50px',
            mt = opts.pencil.marginTop  ||  '0px',
            ml = opts.pencil.marginLeft ||  '0px';

        $pencilImage = $('<img>')
          .attr({src: opts.pencil.src})
          .css({'position': 'absolute', 'z-index': 1500,
                'width': w, 'height': h, 'margin-top': mt, 'margin-left': ml});

        $(this).prepend($pencilImage);
        setPencilAnimation($pencilImage, $image.width(), $image.height());
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
            var oldClass, newClass;

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

                // Custom callback:
                if (opts.callback !== null) opts.callback();
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
