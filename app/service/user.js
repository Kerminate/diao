'use strict'

const R = require('ramda')
class User extends S {
  constructor(ctx) {
    super(ctx)
    this._User = this.ctx.model.User
    this._Invitation = this.ctx.model.Invitation
    this.where = this.ctx.helper.where
  }

  /**
   * * 校验邀请码有效性
   * @param {*} code 邀请码
   * @return {boolean} 是否有效
   * @memberof User
   */
  async checkInvitation(code) {
    const invitation = await this._Invitation.find(this.where({ code }))
    if (!invitation || invitation.use_user_id) {
      return this.ctx.helper.throw(400, 'code', '无效的邀请码')
    }
    return invitation
  }

  /**
   * * 生成邀请码
   * @param {*} user_id 用户ID
   * @param {*} length 生成的个数
   * @return {Array<Invitation>} 所生成的邀请码数组
   * @memberof User
   */
  async generatorInvitation(user_id, length) {
    const invitation_promise = this.ctx.helper.range(length).map(() => {
      return this._Invitation.create({ user_id })
    })
    return Promise.all(invitation_promise)
  }

  /**
   * * 注册逻辑
   * TODO:通知邀请码所有者，user.id 成功使用了你的激活码
   * TODO:向用户邮箱发送验证邮件
   * @return {Object} 注册成功的用户与生成的邀请码
   * @memberof User
   */
  async signUp() {
    const body = this.ctx.request.body
    const invitation = await this.checkInvitation(body.code)
    // pick 返回指定属性组成的新对象
    const user = await this._User.create(
      R.pick(['username', 'password', 'email'], body)
    )
    /* eslint-disable no-proto */
    console.dir(user.__proto__)
    console.dir(invitation.__proto__)
    invitation.use_user_id = user.id
    invitation.use_username = user.username
    await invitation.save()
    const invitations = await this.generatorInvitation(user.id, 5)
    return { user, invitations }
  }

  /**
   * * 发送验证邮件
   * @param {*} title 标题
   * @param {*} email 邮件地址
   * @param {*} getTemplate 获取模板
   * @return {void}
   * @memberof User
   */
  async sendVerifyEmail(title, email, getTemplate) {
    let user = null
    if (R.type(email) === 'Object') {
      user = email
      email = user.email
    } else {
      user = await this._User.findByEmail(email)
    }
    const token = this.ctx.random(4)
    await this.app.redis.set(
      'email:' + user.id,
      token,
      'EX',
      60 * 3 * 1000 // 3分钟
    )
    const template = getTemplate(user, token)
    info('[send email template] -> ' + email + ' | ' + template)
    const mail_ret = await this.app.email.sendEmail(title, template, email)
    info(mail_ret)
    if (mail_ret.code === 0) {
      return true
    }
    return false
  }

  /**
   * * 验证邮件 Token
   * @param {*} user_id 用户 ID
   * @param {*} token 验证码
   * @return {boolean} 是否通过
   * @memberof User
   */
  async verifyToken(user_id, token) {
    const key = 'email:' + user_id
    const local_token = await this.app.redis.get(key)
    if (local_token === token) {
      await this.app.redis.del(key)
      const user = await this._User.findById(user_id)
      user.email_verifyed = 1
      await user.save()
      return true
    }
    return false
  }
}

module.exports = User
