'use strict'
const bcrypt = require('bcryptjs')

module.exports = app => {
  const { INTEGER, STRING, TINYINT } = app.Sequelize
  const User = app.model.define('User', {
    email: {
      type: STRING(40),
      unique: true
    },
    password: STRING,
    inviter_id: INTEGER,
    username: STRING(40),
    weibo: STRING(40),
    weixin: STRING(40),
    team_id: INTEGER,
    receive_remote: TINYINT(1),
    email_verifyed: TINYINT(1),
    avatar: STRING(40)
  })

  User.associate = function() {
    // associations can be defined here
  }

  /**
   * * 哈希密码 Hooks
   * @param {*} user 用户实例
   * @return {void}
   */
  const hashPwd = async user => {
    if (!user.changed('password')) return
    user.password = await bcrypt.hash(user.password, 10)
  }

  User.beforeSave(hashPwd)

  /**
   * * 用户登录方法
   * @param {string} email 邮箱
   * @param {string} password 密码
   * @return {(User|boolean)} 登陆成功的用户
   */
  User.Auth = async function(email, password) {
    const user = await this.findOne({
      where: {
        email
      }
    })
    if (await bcrypt.compare(password, user.password)) {
      return user
    }
    return false
  }

  User.findByEmail = async function(email) {
    await this.findOne({
      where: {
        email
      }
    })
  }

  return User
}
