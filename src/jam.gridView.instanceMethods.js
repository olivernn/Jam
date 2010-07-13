GridView.InstanceMethods = {

  gridItemHTML: function (collectionItem) {
    console.log('you should overwrite this method and return HTML')
  },

  backHref: function () {
    if (this.canPageBack()) {
      return this.pageNumHref(this.prevPageNum())
    } else {
      return '#'
    };
  },

  canPageBack: function () {
    return this.page > 1
  },

  canPageForward: function () {
    return this.page != this.pagesRequired
  },

  collectionEndIndex: function () {
    return (this.page) * this.perPage
  },

  collectionStartIndex: function () {
    return (this.page - 1) * this.perPage
  },

  draw: function (pageNum) {
    this.holder.empty()
    if (this.collection.length != 0) {
      while(this.pagesRequired >= this.page) {
        this.drawPage()
        this.page++
      }
      this.page = pageNum || 1
      this.drawPaginationControls()
      this.holder.append(this.html)
    } else {
      this.drawBlankState()
    };
  },

  drawBlankState: function () {
    console.log('You should overwrite this method')
  },

  drawPage: function () {
    var self = this
    var pageHtml = this.pageTemplate.clone()
    pageHtml.attr('id', 'page-' + this.page)
    $.each(this.collection.slice(this.collectionStartIndex(), this.collectionEndIndex()), function () {
      pageHtml.append(self.gridItemHTML(this))
    })
    this.pageHolder.append(pageHtml)
  },

  drawPaginationControls: function () {
    var self = this
    this.viewPort.find('.back').attr('href', this.backHref())
    this.viewPort.find('.forward').attr('href', this.forwardHref())
    this.viewPort.find('a.page-link').remove()
    $.each(_.range(this.pagesRequired).reverse(), function () {
      var pageLink = $('<a class="page-link button"></a>')
      pageLink.attr('href', self.pageNumHref(this + 1)).text(this + 1)
      if ((this + 1) == self.page) pageLink.addClass('current')
      self.viewPort.find('.pages-link').after(pageLink)
    })
  },

  forwardHref: function () {
    if (this.canPageForward()) {
      return this.pageNumHref(this.nextPageNum())
    } else {
      return '#'
    };
  },

  needsMoreItems: function () {
    return this.page >= (this.pagesRequired - 1)
  },

  nextPageNum: function () {
    return parseInt(this.page) + 1
  },

  pagePosition: function (pageNumber) {
    return -1 * ((pageNumber - 1) * this.pageWidth) + 'px'
  },

  pageNumHref: function (pageNumber) {
    return this.paginationUrl + pageNumber
  },

  prevPageNum: function () {
    return parseInt(this.page) - 1
  },

  showPage: function (pageNumber) {
    this.page = pageNumber
    this.pageHolder.animate({
      left: this.pagePosition(pageNumber)
    }, 800)
    this.drawPaginationControls()
    if (this.needsMoreItems()) this.holder.trigger('itemsNeeded.grid')
  }
}