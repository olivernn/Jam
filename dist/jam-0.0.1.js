/*  Jam JavaScript Widget library, version 0.0.1
 *  (c) 2010 Oliver Nightingale
 *
 *  Released under MIT license.
 */

Jam = {
  version: '0.0.1'
}
Jam.GridView = function (name, options, methods) {
  var methods = methods || {}
  var name = name
  var options = options

  var gridView = function (collection) {
    this.name = name
    this.collection = collection
    this.settings = $.extend(options, Jam.GridView.defaults)
    this.page = 1
    this.html = $(this.settings.templateSelector).clone()
    this.holder = $(this.settings.holderSelector)
  }

  $.extend(gridView.prototype, Jam.GridView.instanceMethods, methods)

  return gridView
}
Jam.GridView.instanceMethods = {
  draw: function () {
    var self = this

    function addStyles () {
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

    function drawPage (pageNum) {
      var startIndex = (pageNum - 1) * self.settings.pageItems
      var endIndex = pageNum * self.settings.pageItems
      var pageHtml = $('<ul class="grid-view-page clearfix"></ul>')
      var gridItemWrap = $('<li></li>').css({'float': 'left', 'display': 'inline'})

      pageHtml.attr('id', 'grid-view-page-' + pageNum)
      $.each(self.collection.slice(startIndex, endIndex), function () {
        pageHtml.append(gridItemWrap.clone().append(self.settings.gridItemHtml(this)))
      })
      self.html.find('.grid-page-holder').append(pageHtml)
    }

    function pagesRequired () {
      return Math.ceil(self.collection.length / self.settings.pageItems)
    }

    for (var i=1; i <= pagesRequired(); i++) drawPage(i)
    addStyles()
    this.holder.html(this.html.addClass(this.name))
  },

  showPage: function (pageNum) {
    var self = this

    function pagePosition (pageNum) {
      return -1 * ((pageNum - 1) * parseInt(self.settings.pageWidth)) + 'px'
    }

    this.html.find('.grid-page-holder').animate({
      left: pagePosition(pageNum)
    }, this.settings.paginationSpeed, this.settings.paginationEasing)
  }
}
