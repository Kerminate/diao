'use strict'
const Email = require('emailjs/email')
const mailK = Symbol.for('MY_EMAIL')

module.exports = {
  random(len) {
    return Math.random()
      .toString(36)
      .slice(3, len + 3)
  },
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
  },
  async send(title, html, email, other) {
    const opts = this.app.config.email
    if (!this[mailK]) {
      this[mailK] = Email.server.connect(
        Object.assign({}, opts, { user: opts.username, ssl: true })
      )
    }
    let attachment = [{ data: html, alternative: true }]
    if (other) attachment = attachment.concat(other)
    return new Promise((resolve, reject) => {
      this[mailK].send(
        {
          subject: title,
          from: opts.sender,
          to: email,
          attachment
        },
        (err, msg) => {
          if (err) reject({ code: -1, msg: 'failure' })
          resolve({ code: 0, msg: 'success' })
        }
      )
    })
  }
}
