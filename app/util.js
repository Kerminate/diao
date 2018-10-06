'use strict'
const chalk = require('chalk')
const { forEachObjIndexed, forEach } = require('ramda')

function initRouterMap(prefix, maps, router) {
  forEachObjIndexed((map, method) => {
    forEachObjIndexed((controller, url) => {
      if (DEV) {
        console.log(
          `${chalk.blue('[' + method + ']')} -> ${chalk.red(prefix + url)}`
        )
      }
      router[method](prefix + url, controller)
    }, map)
  }, maps)
}

// 将 passport 生成的中间件挂载到控制器上，调用 passport.authenticate 方法获得中间件
function mountPassportToController(keys, passport, controller) {
  if (!controller.passport) {
    controller.passport = {}
  }
  forEach(value => {
    if (DEV) {
      console.log(`${chalk.blue('[ mount passport ')} ${chalk.red(value)}`)
    }
    // 需要返回一个 token，不需要重定向，设置为 undefined 跳过 egg-passport 的重定向逻辑
    controller.passport[value] = passport.authenticate(value, {
      session: false,
      successRedirect: undefined
    })
  }, keys)
}

// 给 passport 添加如何验证的逻辑
function installPassport(passport, { verify }) {
  passport.verify(verify)
}

module.exports = {
  initRouterMap,
  mountPassportToController,
  installPassport
}
