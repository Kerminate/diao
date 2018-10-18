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

  // token 用来发放访问令牌的路由，authorize 用来获取授权码的路由，authenticate 是登录之后可以访问的路由
  app.all('/token', app.oAuth2Server.token(), ctx => ctx.state.oauth.token) // 获取 access_token
  app.all('/authorize', app.oAuth2Server.authorize()) // 获取授权码
  app.all('/authenticate', app.oAuth2Server.authenticate(), ctx => {
    ctx.body = ctx.state.oauth
  })

  install(app.passport, require('./passport')) // 添加验证逻辑
  mount(['local'], app.passport, controller) // 将 local 添加到路由上
  init('/api/v1', require('./api')(controller), router)
}
