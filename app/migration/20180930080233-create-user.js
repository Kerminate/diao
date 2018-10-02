'use strict'
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      email: {
        type: Sequelize.STRING(40)
      },
      password: {
        type: Sequelize.STRING
      },
      inviter_id: {
        type: Sequelize.INTEGER
      },
      username: {
        type: Sequelize.STRING(40)
      },
      weibo: {
        type: Sequelize.STRING(40)
      },
      weixin: {
        type: Sequelize.STRING(40)
      },
      team_id: {
        type: Sequelize.INTEGER
      },
      receive_remote: {
        type: Sequelize.TINYINT(1)
      },
      email_verifyed: {
        type: Sequelize.TINYINT(1)
      },
      avatar: {
        type: Sequelize.STRING(40)
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    })
  },
  down: queryInterface => {
    return queryInterface.dropTable('Users')
  }
}
