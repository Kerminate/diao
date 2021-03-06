'use strict'

module.exports = app => {
  const { STRING, INTEGER } = app.Sequelize
  const ImageComment = app.model.define('ImageComment', {
    image_id: INTEGER,
    content: STRING,
    parent_id: INTEGER,
    user_id: INTEGER
  })

  ImageComment.associate = function() {
    this.belongsTo(app.model.Image)
    app.model.Image.hasMany(this)

    this.belongsTo(app.model.User)
    app.model.User.hasMany(this)

    this.hasMany(this, {
      foreginKey: 'parent_id',
      as: 'children'
    })

    this.belongsTo(this, {
      as: 'parent'
    })
  }

  return ImageComment
}
