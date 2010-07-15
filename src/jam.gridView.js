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