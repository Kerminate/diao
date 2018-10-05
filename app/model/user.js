'use strict'
const bcrypt = require('bcrypt')

module.exports = app => {
  const { INTEGER, STRING, TINYINT } = app.Sequelize
  const User = app.model.define('User', {
    email: STRING(40),
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

  return User
}
