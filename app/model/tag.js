'use strict'
module.exports = (sequelize, DataTypes) => {
  const Tag = sequelize.define(
    'Tag',
    {
      id: DataTypes.STRING
    },
    {}
  )
  Tag.associate = function() {
    // associations can be defined here
  }
  return Tag
}
