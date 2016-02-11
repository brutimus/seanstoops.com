/**
 * Main JS file for Casper behaviours
 */

/* globals jQuery, document */
(function ($, undefined) {
    "use strict";

    var $document = $(document);

    $document.ready(function () {

        var $postContent = $(".post-content");
        $postContent.fitVids();

        $(".scroll-down").arctic_scroll();

        $(".menu-button, .nav-cover, .nav-close").on("click", function(e){
            e.preventDefault();
            $("body").toggleClass("nav-opened nav-closed");
        });

    });

    // Arctic Scroll by Paul Adam Davis
    // https://github.com/PaulAdamDavis/Arctic-Scroll
    $.fn.arctic_scroll = function (options) {

        var defaults = {
            elem: $(this),
            speed: 500
        },

        allOptions = $.extend(defaults, options);

        allOptions.elem.click(function (event) {
            event.preventDefault();
            var $this = $(this),
                $htmlBody = $('html, body'),
                offset = ($this.attr('data-offset')) ? $this.attr('data-offset') : false,
                position = ($this.attr('data-position')) ? $this.attr('data-position') : false,
                toMove;

            if (offset) {
                toMove = parseInt(offset);
                $htmlBody.stop(true, false).animate({scrollTop: ($(this.hash).offset().top + toMove) }, allOptions.speed);
            } else if (position) {
                toMove = parseInt(position);
                $htmlBody.stop(true, false).animate({scrollTop: toMove }, allOptions.speed);
            } else {
                $htmlBody.stop(true, false).animate({scrollTop: ($(this.hash).offset().top) }, allOptions.speed);
            }
        });

    };
    $(function() {
        ga(function(){
            $("a").click(function(e) {
                e.preventDefault();
                var url = $(this).attr("href");
                if (this.host.indexOf('seanstoops') < 0) {
                    ga("send", "event", "outbound", "click", url, {"hitCallback":
                        function () {
                            document.location = url;
                        }
                    });
                } else {
                    document.location = url;
                }
            });
        });
    });

    var comments = document.getElementsByClassName('comments')[0],
        disqusLoaded = false;

    function loadDisqus() {
      var disqus_shortname = 'seanstoops';
      var dsq = document.createElement('script');
      dsq.type = 'text/javascript';
      dsq.async = true;
      dsq.src = 'http://' + disqus_shortname + '.disqus.com/embed.js';
      (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
      disqusLoaded = true;
    }

    //Get the offset of an object
    function findTop(obj) {
      var curtop = 0;
      if (obj.offsetParent) {
        do {
          curtop += obj.offsetTop;
        } while (obj = obj.offsetParent);
      return curtop;
      }
    }

    if(window.location.hash.indexOf('#comments') > 0)
      loadDisqus();

    if(comments) {
      var commentsOffset = findTop(comments);

      window.onscroll = function() {
        if(!disqusLoaded && window.pageYOffset > commentsOffset - 1000)
          loadDisqus();
      }
    }

})(jQuery);
