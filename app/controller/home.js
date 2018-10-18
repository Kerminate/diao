'use strict'

const Controller = require('egg').Controller

class HomeController extends Controller {
  async index() {
    // console.log(global.use)
    // const r = use('app.schemas.signup')
    // this.ctx.type = 'json'
    // this.ctx.body = JSON.stringify(r)
    // this.ctx.type = 'json'
    // this.ctx.body = this.ctx.state
    return this.ctx.render('user/login.njk', { query: this.ctx.querystring })
  }
}

module.exports = HomeController
