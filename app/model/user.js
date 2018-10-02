'use strict'
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      email: DataTypes.STRING(40),
      password: DataTypes.STRING,
      inviter_id: DataTypes.INTEGER,
      username: DataTypes.STRING(40),
      weibo: DataTypes.STRING(40),
      weixin: DataTypes.STRING(40),
      team_id: DataTypes.INTEGER,
      receive_remote: DataTypes.TINYINT(1),
      email_verifyed: DataTypes.TINYINT(1),
      avatar: DataTypes.STRING(40)
    },
    {}
  )
  User.associate = function() {
    // associations can be defined here
  }
  return User
}
