'use strict'

module.exports = ctl => ({
  post: {
    '/signup': ctl.user.signup, // 注册
    '/signin': ctl.user.signin // 登录
  }
})
