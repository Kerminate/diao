'use strict'

const { globalBaseInitial, globalLogger } = require('./init')

globalBaseInitial(__dirname)

module.exports = app => {
  globalLogger(app)
}
