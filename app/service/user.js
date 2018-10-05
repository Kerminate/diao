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
}

module.exports = User
