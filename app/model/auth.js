'use strict'
module.exports = ({ model: sequelize, Sequelize: DataTypes }) => {
  const Auth = sequelize.define(
    'Auth',
    {
      provider: DataTypes.STRING,
      uid: DataTypes.STRING,
      user_id: DataTypes.INTEGER
    },
    {
      timestamps: false
    }
  )
  Auth.associate = function(models) {
    // associations can be defined here
  }
  return Auth
}
