var Widget = function (name, options, instanceMethods) {
  var instanceMethods = instanceMethods || {}
  var name = name

  var widget = function (bar) {
    this.name = name
    this.bar = bar
  }

  $.extend(widget.prototype, Widget.InstanceMethods, instanceMethods, options)

  return widget
}