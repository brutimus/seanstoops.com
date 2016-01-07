moment = require('moment')
docpadConfig = {
  templateData:
    site:
      title: 'Sean Stoops'
      tagline: 'Things I do'
      description: 'A places for me to write about things I find interesting'
      logo: '/img/logo.png'
      url: 'http://www.seanstoops.com'
      cover: '/img/cover.jpg'
      navigation: [
        {
          name: 'Home',
          href: '/',
          section: 'home'
        },
        {
          name: 'Sprinter Van',
          href: '/tags/sprinter.html',
          section: 'tag-sprinter'
        },
        {
          name: 'About',
          href: '/about.html',
          section: 'about'
        },
        {
          name: 'Test Posts',
          href: '/tags/test.html',
          section: 'tag-test'
        }
      ]
    author:
      name: 'Sean Stoops'
      img: '/img/mug.png'
      href: '/about.html'
      location: 'Las Vegas, NV',
      bio: ''
    getPreparedTitle: -> if @document.title then "#{@document.title} | #{@site.title}" else @site.title
    getDescription: -> if @document.description then "#{@document.description} | #{@site.description}" else @site.description
    bodyClass: -> if @document.isPost then "post-template" else "home-template"
    masthead: (d) ->
      d = d || @document
      if d.cover then d.cover else @site.cover
    isCurrent: (l) ->
      if @document.section is l.section  then ' nav-current'
      else if @document.url is l.href then ' nav-current'
      else ''
    excerpt: (p,w) ->
      w = w || 26
      if p.excerpt then p.excerpt else p.content.replace(/<%.+%>/gi, '').split(' ').slice(0, w).join(' ')
    encode: (s) -> encodeURIComponent(s)
    slug: (s) -> return s.toLowerCase().replace(' ', '-')
    currentYear: -> new Date().getFullYear()
    time: (ts, format) ->
      format = format || 'MMMM DO, YYYY'
      ts = new Date(ts) || new Date()
      moment(ts).format(format)
  collections:
    posts: ->
      @getCollection("html").findAllLive({active:true, isPost: true, isPagedAuto: {$ne: true}}, {date: -1}).on "add", (model) ->
        model.setMetaDefaults({layout:"post"})
  plugins:
    tags:
      extension: '.html'
      injectDocumentHelper: (doc) ->
        doc.setMeta { layout: 'tag' }
    rss:
      default:
        collection: 'posts'
        url: '/rss.xml'
    tumblr:
      blog: 'seanstoops.tumblr.com'
      apiKey: 'YC5PULJiznlbBiqvnUuiB3MfCctZ1sRuuzW2AjUlKaT2oNhaXT'
    dateurls:
      cleanurl: true
}

module.exports = docpadConfig