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
 *     borderPencil: 5        // - seconds it's take to draw the picture by using only the pencil for borders
 *   },
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

      // Image reference:
          $image = $(this).find('img');

      // Custom or default options:
          opts = {
            duration: options.duration     || 20,
            background: options.background || '#FFF'
          };


      var $imgBackground = $('<div>').css({'background-color': opts.background});
      $(this).prepend($imgBackground);

      var phaseTiming = opts.duration / PHASES,
          timing = {
            borderPencil: (opts.duration.borderPencil || phaseTiming) + 's'
          };

      $imgBackground
        .addClass('imgBackground')
        .css({'animation-duration': timing.borderPencil})
        .css({'-webkit-animation-duration': timing.borderPencil});

      $image
        .addClass('borderPencil')
        .css({'animation-duration': timing.borderPencil})
        .css({'-webkit-animation-duration': timing.borderPencil})
        .on('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',
          function() {
            $image.removeClass('borderPencil');
        });
    }

  });
})(jQuery);
