'use strict'

module.exports = {
  async sign_token(user, remember_me) {
    return new Promise((resolve, reject) => {
      // 生成 token 用的是 将诉讼webtoken 的库
      this.app.jwt.sign(
        user,
        this.app.config.jwt.secret,
        {
          expiresIn: remember_me ? '7d' : '1d'
        },
        (err, token) => {
          err && reject(err)
          // 使用 koa-kwt 自动解析 token
          resolve(token)
        }
      )
    })
  }
}
