'use strict'
const { resolve } = require('path')

module.exports = () => {
  const config = {}
  config.logger = {
    consoleLevel: 'DEBUG',
    level: 'INFO'
  }

  config.pay = {
    gateway: 'https://openapi.alipaydev.com/gateway.do',
    appId: '2016072400106012',
    notifyUrl: 'http://16700459.ngrok.io/alipay/callback/',
    returnUrl: 'http://16700459.ngrok.io/alipay/success',
    rsaPrivate: resolve('config/pems/sandbox_private_key.pem'),
    rsaPublic: resolve('config/pems/sandbox_public_ali_key.pem'),
    sandbox: true,
    signType: 'RSA2'
  }

  return config
}
