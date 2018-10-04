const R = require('ramda')
const func = R.curry((a, b) => [a, b])

console.log(func(1, 2))
console.log(func(1)(2))
console.log(func(R.__, 2)(1))

function curry(fn, args = []) {
  const length = fn.length
  return function() {
    const _args = args.slice(0)
    Array.prototype.push.apply(_args, Array.prototype.slice.call(arguments))
    if (_args.length === length) {
      return fn.apply(this, _args)
    }
    return curry.call(this, fn, _args)
  }
}

const func2 = curry((a, b, c) => [a, b, c])

console.log(func2(1, 2, 3))
console.log(func2(1)(2)(3))

const check = (obj, key) => {
  if (typeof obj[key] === 'undefined') {
    return false
  }
  return true
}

const compose = (...fns) => (...args) =>
  fns.reduceRight((acc, val) => val(acc), fns[fns.length - 1](...args))
