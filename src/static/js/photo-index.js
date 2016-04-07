(function ($, undefined) {
    "use strict";

    $(document).ready(function(){

      $.get('http://www.seanstoops.com.s3-us-west-2.amazonaws.com/?prefix=photos/')
        .then(function(data){
          var galleries = [],
            keys = $(data).find('Contents'),
            gallery_keys = keys.filter(function(){return $(this).find('Key').text().split('/').length == 3});

          gallery_keys.each(function(index, el){
            var path = $(this).find('Key').text().split('/').slice(0, 2);
            galleries.push({
              'url': '/' + path.join('/') + '/',
              'title': path[1].split('-').slice(1).join(' '),
              'date': parseInt(path[1].split('-')[0]),
              'thumbs': keys.filter(function(){
                 var k = $(this).find('Key').text();
                 return k.indexOf(path.join('/')) >= 0 && k.indexOf('thumbnails') >= 0
              }).map(function(i, el){
                return $(el).find('Key').text()
              })
            })
          });
          galleries.sort(function(a, b){
            if (a.date < b.date) {
              return 1
            } else if (a.date > b.date) {
              return -1
            } else {
              return 0
            }
          });

          $('<div>').attr('class', 'photo-index-container').append(
            $(galleries).map(function(index, gal_el){
              return $('<div class="gallery">').append(
                $('<a>')
                  .attr('href', gal_el.url)
                  .text(gal_el.title).append(
                    $('<div class="thumbs">').append(gal_el.thumbs.slice(0,4).map(function(i, thumb_el){
                      return $('<img>').attr('src', 'http://www.seanstoops.com/' + thumb_el)
                    }).get())
                  )
              );
            }).get()
          ).appendTo($('.post-content'));
        })
    });


})(jQuery);
