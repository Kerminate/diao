'use strict'
module.exports = app => {
  const { STRING, INTEGER, FLOAT, TINYINT } = app.Sequelize
  const Order = app.model.define(
    'Order',
    {
      order_id: STRING(48),
      user_id: INTEGER,
      price: FLOAT,
      state: TINYINT
    },
    {}
  )
  Order.associate = function(models) {
    // associations can be defined here
    Order.belongsTo(app.model.User)
    app.model.User.hasMany(Order)
  }
  return Order
}
