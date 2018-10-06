'use strict'
const passportDebug = require('debug')('app:passport')

module.exports = {
  async verify(ctx, user) {
    // user.provider 就是 local,weibo,Github 等
    passportDebug('use ' + user.provider)
    return require('./' + user.provider)(ctx, user)
  },
  /**
   * * 在存储到 Session 或者 Cookie 前序列化
   * @param {*} ctx 上下文
   * @param {*} user 用户
   * @return {object} user
   */
  async serializeUser(ctx, user) {
    return user
  },
  /**
   * * 将序列化的数据还原
   * @param {*} ctx 上下文
   * @param {*} user 用户
   * @return {object} user
   */
  async deserializeUser(ctx, user) {
    return user
  }
}
