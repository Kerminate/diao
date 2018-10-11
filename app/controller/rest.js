'use strict'

const { defaultTo } = require('ramda')
// defaultTo: 如果第二个参数不是 null、undefined 或 NaN，则返回第二个参数，否则返回第一个参数（默认值）
const Base = require('./base')

class RESTController extends Base {
  constructor(ctx, modelName) {
    super(ctx)
    this.model = this.ctx.model[modelName]
  }

  /**
   * 留下的修改和删除的验证窗口
   * @param {*} id model ID
   * @return {model} model instance
   * @memberof RESTController
   */
  async getInstance(id) {
    const data = await this.model.findOne({ where: { id } })
    return data
  }

  /**
   * get list
   * @param {*} ctx Context
   * @param {*} where 所有条件但排除 order 和 include
   * @param {*} order order 排序
   * @param {*} include 表连接
   * @return {void}
   * @memberof RESTController
   */
  async index(ctx, where, order, include) {
    const { page, split } = ctx.query
    where = defaultTo({}, where)
    where.order = defaultTo([], order)
    where.include = defaultTo([], include)
    where.offset = defaultTo([], parseInt(page) * parseInt(split))
    where.limit = defaultTo(10, split)
    info(where)
    const data = await this.model.findAll(where)
    ctx.body = data
  }

  // POST
  async create() {
    const { ctx } = this
    ctx.body = await this.model.create(ctx.request.body)
  }

  // Get one
  async show() {
    const { ctx } = this
    const data = await this.model.findOne({
      where: {
        id: ctx.params.id
      }
    })
    ctx.body = data
  }

  // Put
  async update() {
    const { id } = this.ctx.params
    const instance = await this.getInstance(id)
    Object.assign(instance, this.ctx.request.body)
    this.ctx.body = await instance.save()
  }

  // Delete
  async destroy() {
    const { id } = this.ctx.params
    const instance = await this.getInstance(id)
    this.ctx.body = await instance.destroy()
  }
}

module.exports = RESTController
