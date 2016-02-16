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
 *     pencil: 5              // - seconds it's take to draw the picture by using only the black pencil
 *   },
 *
 * });
 *
 */


(function($) {
  $.fn.extend({

    drawImage: function(opts) {

      // Number of Drawing Phases:
      var PHASES = 4;

      opts = opts || {
        duration: 20
      };

      var phaseTiming = opts.duration / PHASES,
          timing = {
            pencil: (opts.duration.pencil || phaseTiming) + 's'
          };

      $(this)
        .addClass('pencil')
        .css({'animation-duration': timing.pencil})
        .css({'-webkit-animation-duration': timing.pencil});
    }

  });
})(jQuery);
