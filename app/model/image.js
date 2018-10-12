'use strict'

module.exports = app => {
  const { STRING, INTEGER } = app.Sequelize
  const Image = app.model.define('Image', {
    title: STRING(40),
    description: STRING(255),
    main_url: STRING(20),
    list_url: STRING(90),
    user_id: {
      type: INTEGER,
      validate: {
        async inSome() {
          const name = await Promise.resolve('123')
          console.log(name)
          return true
        }
      }
    }
  })

  Image.associate = function() {
    app.model.User.hasMany(Image)
    Image.belongsTo(app.model.User)
  }

  return Image
}
