/*! 
 * ImageDrawer.js - jQuery plugin to animate a drawing image
 * 
 * @version v0.0.1
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
 *   duration: 20,            // Seconds it's take to draw the entire picture.
 *   ||                        
                              // Instead of specifying the duration on the whole animation,
     {                        // it's also possible to set the duration of single drawing phases:
 *     borderPencil: 5,       // - seconds it's take to draw the picture by using only the pencil for borders
 *     pencilShades: 5,       // - seconds it's take to draw sharpest shades with black pencil
 *     firstColors: 5         // - seconds it's take to draw first, basic colors to the picture
 *   },
 *   background: '#949494'    // background color for image while it's been drawing
 *
 * });
 *
 */


(function($) {
  $.fn.extend({

    drawImage: function(options) {

      options = options || { };

      // Number of Drawing Phases:
      var PHASES = 4,

      // Phase wacher:
          currPhase = 0;

      // Image reference:
          $image = $(this).find('img');

      // Custom or default options:
          opts = {
            duration: options.duration     || { borderPencil: 6, pencilShades: 4,
                                                colorShades:  4, fullColors:   6 },
            background: options.background || '#FFF'
          };


      var $imgBackground = $('<div>').css({'background-color': opts.background});
      $(this).prepend($imgBackground);

      var phaseTiming = opts.duration / PHASES,
          timing = {
            borderPencil: opts.duration.borderPencil + 's',
            pencilShades: opts.duration.pencilShades + 's',
            fullColors  : opts.duration.fullColors   + 's' // saturation(1.5)
          };

      $imgBackground
        .addClass('imgBackground')
        .css({'animation-duration': timing.borderPencil})
        .css({'-webkit-animation-duration': timing.borderPencil});

      $image
        .addClass('visibleImage borderPencil')
        .css({'animation-duration': timing.borderPencil})
        .css({'-webkit-animation-duration': timing.borderPencil})
        .on('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',
          function() {
            var oldClass, newClass, phaseDuration;

            switch (currPhase) {
              case 0:
                $imgBackground.remove();
                oldClass = 'borderPencil';
                newClass = 'pencilShades';
                duration = timing.pencilShades;
              break;

              case 1:
                oldClass = 'pencilShades';
                newClass = 'colorShades';
                duration = timing.colorShades;
              break;

              case 2:
                oldClass = 'colorShades';
                newClass = 'fullColors';
                duration = timing.fullColors;
              break;
            }

            $image.removeClass(oldClass).addClass(newClass)
                  .css({'animation-duration'        : duration,
                        '-webkit-animation-duration': duration});

            currPhase++;

          });
    }

  });
})(jQuery);
