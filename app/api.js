'use strict'

module.exports = ctl => ({
  post: {
    '/signup': ctl.user.signUp, // 注册
    '/signin': ctl.passport.local, // 登录
    '/email/send': ctl.user.emailSend
  }
})
