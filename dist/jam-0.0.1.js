/*  Jam JavaScript Widget library, version 0.0.1
 *  (c) 2010 Oliver Nightingale
 *
 *  Released under MIT license.
 */

Jam = {
  version: '0.0.1'
}
Jam.GridView = function (name, options, methods) {
  methods = methods || {}
  options = options || {}
  var widget = 'gridView'

  var gridView = function (collection, eventHandlerSelector) {
    if (eventHandlerSelector) {
      this.eventHandler = $(eventHandlerSelector)
    } else {
      this.eventHandler = $(document)
    };
    this.eventNamespace = name + ':' + widget
    this.name = name
    this.collection = collection
    this.page = 1
    this.settings = options
  }

  $.extend(gridView.prototype, Jam.GridView.instanceMethods, methods)

  return gridView
}
Jam.GridView.instanceMethods = {

  canPageBackward: function () {
    return this.page > 1
  },

  canPageForward: function () {
    return this.page != this.pagesRequired
  },

  generateHtml: function () {
    var self = this
    $.extend(this.settings, Jam.GridView.defaults)
    this.html = $(this.settings.templateSelector).clone()
    this.holder = $(this.settings.holderSelector)
    var pageTemplate = $('<ul class="grid-view-page clearfix"></ul>')
    var gridItemWrap = $('<li class="grid-view-item"></li>').css({'float': 'left', 'display': 'inline'})

    if (self.collection.length > 0) {
      for (var i=1; i <= pagesRequired(); i++) drawPage(i)
      drawPaginationControls()
      self.eventHandler.bind('pageAnimationStart.' + this.eventNamespace, function () {
        drawPaginationControls()
      })
      displayCurrentPage()
    } else {
      drawBlankState()
    };

    addStyles()
    return this.html.addClass(this.name)

    function addStyles () {
      self.holder.css({
        'width': self.settings.pageWidth
      })
      self.html
        .find('.grid-page-holder')
          .css({
            'width': '10000px',
            'position': 'absolute'
          })
          .end()
        .find('.grid-view-port')
          .css({
            'overflow': 'hidden',
            'position': 'relative',
            'width': self.settings.pageWidth,
            'height': self.settings.pageHeight
          })
          .end()
        .find('.grid-view-page')
          .css({
            'padding': '0px',
            'float': 'left',
            'width': self.settings.pageWidth
          })
    }

    function drawBlankState () {
      if (self.settings.blankStateHtml) {
        self.html.find('.grid-page-holder').append(pageTemplate.clone().append(self.settings.blankStateHtml))
      };
    }

    function displayCurrentPage () {
      if (self.page > self.pagesRequired) self.page = self.pagesRequired
      var position = -1 * ((self.page - 1) * parseInt(self.settings.pageWidth)) + 'px'
      self.html.find('.grid-page-holder').css({'left': position})
    }

    function drawPage (pageNum) {
      var startIndex = (pageNum - 1) * self.settings.pageItems
      var endIndex = pageNum * self.settings.pageItems
      var pageHtml = pageTemplate.clone()

      pageHtml.attr('id', 'grid-view-page-' + pageNum)
      $.each(self.collection.slice(startIndex, endIndex), function () {
        pageHtml.append(gridItemWrap.clone().append(self.settings.gridItemHtml(this)))
      })
      self.html.find('.grid-page-holder').append(pageHtml)
    }

    function drawPaginationControls () {

      function pageNumHref (pageNum) {
        if (self.settings.hashPagination) {
          return '#/' + self.name + '/page/' + pageNum
        } else {
          return '#'
        };
      }

      function previousPageNum () {
        return parseInt(self.page) - 1
      }

      function nextPageNum () {
        return parseInt(self.page) + 1
      }

      self.holder.find('.grid-view-page-controls').remove()

      if (self.pagesRequired > 1) {
        var pageControlsHtml = $('<div class="grid-view-page-controls"><a class="page-link backward">Prev</a><a class="page-link forward">Next</a></div>')
        pageControlsHtml
          .find('.backward')
            .attr('href', self.canPageBackward() ? pageNumHref(previousPageNum()) : '#')
            .click(function () {
              if (self.canPageBackward) {
                self.eventHandler.trigger('paginate.' + self.eventNamespace, previousPageNum())
              };
            })
            .end()
          .find('.forward')
            .attr('href', self.canPageForward() ? pageNumHref(nextPageNum()) : '#')
            .click(function () {
              if (self.canPageForward()) {
                self.eventHandler.trigger('paginate.' + self.eventNamespace, nextPageNum())
              };
            })

        for (var i=1; i <= pagesRequired(); i++) {
          var pageLink = $('<a class="page-link"></a>')
          pageLink
            .attr('href', pageNumHref(i))
            .text(i)
            .addClass(i == self.page ? 'current' : '')
            .click(function () {
              self.eventHandler.trigger('paginate.' + self.eventNamespace, parseInt($(this).text()))
            })
          pageControlsHtml.find('.forward').before(pageLink)
        };

        self.html.append(pageControlsHtml)
      };
    }

    function pagesRequired () {
      self.pagesRequired = Math.ceil(self.collection.length / self.settings.pageItems)
      return self.pagesRequired
    }
  },

  insertHtml: function () {
    this.holder.html(this.html)
  },

  render: function (collection) {
    this.generateHtml()
    this.insertHtml()
  },

  remove: function () {
    this.holder.find('.' + this.name).remove()
    this.eventHandler.unbind(this.name + ':gridView')
  },

  showPage: function (pageNum) {
    var self = this
    var pageNum = pageNum

    function moreCollectionItemsRequired () {
      return pageNum >= (self.pagesRequired - 1)
    }

    function pagePosition () {
      return -1 * ((pageNum - 1) * parseInt(self.settings.pageWidth)) + 'px'
    }

    if (pageNum <= self.pagesRequired && pageNum > 0) {
      this.page = pageNum
      this.eventHandler.trigger('pageAnimationStart.' + this.eventNamespace, pageNum)
      this.html.find('.grid-page-holder').animate({
        left: pagePosition()
      }, this.settings.paginationSpeed, this.settings.paginationEasing, function () {
        self.eventHandler
          .trigger('pageAnimationEnd.' + self.eventNamespace, pageNum)
      })

      if (moreCollectionItemsRequired()) this.eventHandler.trigger('collectionItemsNeeded.' + this.eventNamespace)
    } else {
      throw("cannot show a page that doesn't exist")
    };
  },

  updateCollection: function (collection) {
    this.collection = collection
    this.render()
  }
}
Jam.GridView.defaults = {
  paginationSpeed: 1000,
  paginationEasing: 'swing',
  templateSelector: '#templates .grid-container'
}
