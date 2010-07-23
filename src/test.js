function newObjectFrom(o) {
  function F() {};
  F.prototype = o
  return new F()
}

var Person = function (name) {
  var person = {};

  var name = name

  var hello = function () {
    return 'this is private'
  }

  person.name = function () {
    return name
  }

  person.sayHello = function () {
    return hello()
  }

  return person
}

var Ninja = function (beltColor, name) {
  var ninja = newObjectFrom(Person(name))
  var beltColor = beltColor

  ninja.kick = function () {
    return 'ninja kick!'
  }

  ninja.belt = function () {
    return beltColor
  }

  return ninja
}

var Programmer = function (language, name) {
  var programmer = newObjectFrom(Person(name))
  var language = language

  programmer.favLang = function () {
    return language
  }

  programmer.sayHello = function () {
    return this
  }

  return programmer
}

var JSProgrammer = function () {
  var js_programmer = newObjectFrom(Programmer('js', 'oliver'))

  return js_programmer
}