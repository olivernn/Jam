Jam.Base = function (name, options) {
  var base = {};
  var containerSelector = options.containerSelector || 'body';
  var eventHandler = options.eventHandler || $(document);
  var errorPrefix = 'Jam.Base';
  var name = name;
  var templateSelector = options.templateSelector;
  var template = $(templateSelector);
  var widget = options.widget;
  var eventNamespace = function () {
    return name + ':' + widget;
  };

  // populate the blank html fragment, should be overriden
  var populate = function () {
    
  };

  // bind a callback to an event on the objects event handler with the passed name and object namespace
  base.bind = function (eventName, callback) {
    eventHandler.bind(eventName + ':' + eventNamespace(), callback);
    return this;
  };

  // return a namespaced class to be used on the objects markup
  base.htmlClass = function (className) {
    return name + ' ' + widget + '-' + className;
  };

  // select the container for this objects html
  base.container = function () {
    return $(containerSelector);
  };

  // generate the html for the object, calls populate and addBehaviour methods which
  // should be overriden to customize the appearance and behaviour of the view
  base.generateHtml = function () {
    populate.call(this);
    addBehaviour.call(this);
    return this.html;
  };

  base.html = template.clone();

  // insert the objects html into the dom
  base.insertHtml = function () {
    this.container().html(this.html);
  };

  base.options = function () {
    return options;
  };

  // generates the html for this object and inserts it into its container
  base.render = function () {
    this.generateHtml();
    this.insertHtml();
  };

  // remove the objects html from the dom and unbind all events
  base.remove = function () {
    this.html.remove();
    eventHandler.unbind(':' + eventNamespace());
  };

  // reload the html from the template
  base.resetHtml = function () {
    this.html = template.clone();
  };

  // trigger an event 
  base.trigger = function (eventName, data) {
    eventHandler.trigger(eventName + ':' + eventNamespace(), data);
  };

  return base;
};