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
          href: '/pages/sprinter/',
          section: 'sprinter'
        },
        {
          name: 'About',
          href: '/about.html',
          section: 'about'
        },
        {
          name: 'Old Blog',
          href: 'http://blog.seanstoops.com',
          section: 'old-blog'
        }
      ]
    author:
      name: 'Sean Stoops'
      img: '/img/mug.png'
      href: '/about.html'
      website: 'http://www.seanstoops.com'
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
  events:
    writeBefore: (opts) ->
        getTag = (ogName, data) ->
          return "\n    <meta property=\"#{ogName}\" content=\"#{data}\" />"
        docpad = @docpad
        templateData = docpad.getTemplateData()
        siteUrl = templateData.site.url
        for model in opts.collection.models
            if model.get('outExtension') == 'html'
                url = getTag('og:url', siteUrl + model.get('url'))
                title = getTag('og:title', model.get('title'))
                description = getTag('og:description', model?.get('excerpt') || model.get('content').replace(/<%.+%>/gi, '').split(' ').slice(0, 26).join(' '))
                image = getTag('og:image', siteUrl + (model?.get('cover') || templateData.site.cover))
                app_id = getTag('fb:app_id', '1684341971851739')
                admins_id = getTag('fb:admins', '62900719')
                content = model.get('contentRendered')
                extra = image+app_id+admins_id
                if model.get('isPost')
                  extra = extra + url + title + description
                content = content.replace(/<\/title>/, '</title>' + extra)
                model.set('contentRendered', content)
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
    dateurls:
      cleanurl: true
      trailingSlashes: true
    cleanurls:
      static: true
      trailingSlashes: true
    sunny:
      configFromEnv: true
      onlyIfProduction: false
}

module.exports = docpadConfig
