'use strict'
const R = require('ramda')
const chalk = require('chalk')

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

  config.security = {
    csrf: {
      enable: false,
      ignoreJSON: true
    }
  }

  config.jwt = {
    secret: '123456',
    enable: false,
    ignore(ctx) {
      return true
      // const paths = ['api/v1/signin', '/api/v1/signup']
      // if (DEV) {
      //   const tip = `${chalk.yellow('[ JWT ]')} --> ${
      //     R.contains(ctx.path, paths)
      //       ? chalk.green(ctx.path)
      //       : chalk.red(ctx.red)
      //   }`
      //   console.log(tip)
      // }
      // return R.contains(ctx.path, paths)
    }
  }

  config.passportLocal = {
    usernameField: 'email',
    passwordField: 'password'
  }

  config.email = {
    username: '1716857218@qq.com',
    password: 'krqjwpqjvmlabcbb',
    host: 'smtp.qq.com',
    sender: 'bob <1716857218@qq.com>'
  }

  config.redis = {
    client: {
      port: 6379,
      host: '127.0.0.1',
      password: '',
      db: 0
    }
  }

  config.view = {
    defaultViewEngine: 'nunjucks',
    mapping: {
      '.njk': 'nunjucks'
    }
  }

  config.oAuth2Server = {
    debug: true,
    grants: ['authorization_code', 'refresh_token']
  }

  return config
}
