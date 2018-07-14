'use strict'

module.exports = expand

function expand (what, options) {
  var i

  if (!what)
    return what

  if (typeof what === 'string')
    return what.replace(/\$\{([^${}]+)\}/g, replace)

  if (isArray(what))
    for (i = what.length - 1; i >= 0; --i)
      what[i] = expand(what[i])

  if (typeof what === 'object')
    for (i in what)
      if (what.hasOwnProperty(i))
        what[i] = expand(what[i])

  return what

  function replace (match, variable) {
    var value
    value = process.env[variable] || ''
    if (options && options.substitute) {
      if (typeof options.substitute === 'function')
        value = options.substitute(variable, value)
      else if (variable in options.substitute)
        value = options.substitute[variable](value)
    }
    return value
  }
}

function isArray (arg) {
  return Object.prototype.toString.call(arg) === '[object Array]'
}
