Jam.Pagination = function (options) {
  var pagination = {}

  var currentPage = 1
  var perPage = options.perPage || 1
  var pagesRequired = function () {
    return this.getCollection() / perPage
  }

  pagination.pagesRequired = function () {
    return this.html.text('Hello')
  }

  return pagination
}