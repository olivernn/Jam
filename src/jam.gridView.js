Jam.GridView = function (name, options, methods) {
  var methods = methods || {}
  var name = name
  var options = options

  var gridView = function (collection) {
    this.name = name
    this.options = options
    this.collection = collection
    this.html = $(this.options.templateSelector).clone()
    this.holder = $(this.options.holderSelector)
    this.page = 1
  }

  $.extend(gridView.prototype, Jam.GridView.instanceMethods, methods)

  return gridView
}