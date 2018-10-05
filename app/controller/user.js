'use strict'

class User extends C {
  /**
   * @description 注册
   * @return {void}
   */
  async signup() {
    await this.ctx.verify('user.signup', 'body')
    const json = await this.ctx.service.user.signup()
    this.ctx.body = json
  }
  async signin() {
    this.ctx.body = '登录'
  }
}

module.exports = User
