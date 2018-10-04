'use strict'

module.exports = appInfo => {
  const config = (exports = {})

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1538224185398_5349'

  // add your config here
  config.middleware = []

  config.sequelize = {
    dialect: 'mysql',
    database: 'diao',
    host: 'localhost',
    port: '3306',
    username: 'root',
    password: '123456'
  }

  config.flash = {
    key: Symbol.for('flash')
  }

  config.validator = {
    open: 'zh-CN',
    languages: {
      'zh-CN': {
        required: '必须填 %s 字段'
      }
    },
    async formate(ctx, error) {
      // eslint-disable-next-line
      // info('[egg-validator] -> %s', JSON.stringify(error, ' '));
      // throw new Error(error[0].message)
      console.log(error)
      ctx.type = 'json'
      ctx.status = 400
      ctx.body = error
    }
  }

  return config
}
