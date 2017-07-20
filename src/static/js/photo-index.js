(function ($, undefined) {
    "use strict";

    var keys = [],
      gallery_keys = [],
      galleries = [],
      xmlSource = 'http://www.seanstoops.com.s3-us-west-2.amazonaws.com/?prefix=photos/';

    function fetchXML(url) {
      $.get(url)
        .then(function(data){
          $.merge(keys, $(data).find('Key').map(function(){
            return $.trim($(this).text())
          }));

          if ($(data).find('IsTruncated').text() === 'true') {
            fetchXML(xmlSource + '&marker=' + keys[keys.length-1]);
          } else {
            gallery_keys = keys.filter(function(el){
              return el.split('/').length == 3}
            );

            $.each(gallery_keys, function(i, el){
              console.log(el);
              var path = el.split('/').slice(0, 2);
              galleries.push({
                'url': '/' + path.join('/') + '/',
                'title': path[1].split('-').slice(1).join(' '),
                'date': parseInt(path[1].split('-')[0]),
                'thumbs': keys.filter(function(k){
                   return k.indexOf(path.join('/')) >= 0 && k.indexOf('thumbnails') >= 0
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
            renderGalleries();
          }
        });
    }

    function renderGalleries(){
      $('<div>').attr('class', 'photo-index-container').append(
        $(galleries).map(function(index, gal_el){
          return $('<div class="gallery">').append(
            $('<a>')
              .attr('href', gal_el.url)
              .text(gal_el.title).append(
                $('<div class="thumbs">').append(gal_el.thumbs.slice(0,4).map(function(thumb_el){
                  return $('<img>').attr('src', 'http://www.seanstoops.com/' + thumb_el)
                }))
              )
          );
        }).get()
      ).appendTo($('.post-content'));
    }

    $(document).ready(function(){
      fetchXML(xmlSource)
    });

})(jQuery);
