'use strict'
module.exports = ({ model: sequelize, Sequelize: DataTypes }) => {
  const Access = sequelize.define(
    'Access',
    {
      token: {
        type: {
          type: DataTypes.STRING,
          unique: true
        }
      },
      token_expires_at: DataTypes.DATE,
      scope: DataTypes.STRING,
      client_id: DataTypes.INTEGER,
      user_id: DataTypes.INTEGER
    },
    {
      underscored: false
    }
  )
  Access.associate = function(models) {
    // associations can be defined here
  }
  return Access
}
