'use strict'

const init = require('./util').initRouterMap
const mount = require('./util').mountPassportToController
const install = require('./util').installPassport

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app
  router.get('/', controller.home.index)
  router.get('/email/forget_password', controller.user.forgetPasswordG)
  router.post('/email/forget_password', controller.user.forgetPasswordP)
  router.get('/email/verify', controller.user.emailVerify)

  router.resources('images', '/images', controller.image)

  install(app.passport, require('./passport')) // 添加验证逻辑
  mount(['local'], app.passport, controller) // 将 local 添加到路由上
  init('/api/v1', require('./api')(controller), router)
}
