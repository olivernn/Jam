Jam = {
  version: '<%= VERSION %>',
  newObjectFrom: function (oldObject) {
    function F() {};
    F.prototype = oldObject;
    return new F();
  }
}