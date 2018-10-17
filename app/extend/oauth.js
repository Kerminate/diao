'use strict'
const VALID_SCOPES = ['r_user', 'r_image']

module.exports = app => {
  const { User, Authorization, Client, Refresh, Access } = app.model
  console.log(app.model.models)
  return class {
    constructor(ctx) {
      this.ctx = ctx
      console.log(ctx.model)
    }

    // 查询通过 saveAuthorizationCode 存储过的授权码并返回
    async getAuthorization(authorizationCode) {
      const auth = await Authorization.findByCode(authorizationCode)
      const [client, user] = await Promise.all([
        Client.findByClientId(auth.client_id),
        User.findById(auth.user_id)
      ])
      return {
        code: auth.code,
        expiresAt: auth.expires_at,
        redirectUri: auth.redirect_uri,
        scope: auth.scope,
        client,
        user
      }
    }

    // 获取对应的 Client，便于后面校验 scope
    async getClient(client_id, client_secret) {
      const client = await Client.Auth(client_id, client_secret)
      if (!client) return false
      return {
        id: client.client_id,
        redirectUris: client.redirect_uris.split(','),
        grants: client.grants.split(',')
      }
    }

    // 保存 token 令牌，包括访问 token 令牌和刷新 token 令牌
    async saveToken(token, client, user) {
      const access = await Access.create({
        token: token.accessToken,
        token_expires_at: token.accessTokenExpiresAt,
        scope: token.scope,
        client_id: client.id,
        user_id: user.id
      })
      const refresh = await Refresh.create({
        token: token.refreshToken,
        token_expires_at: token.refreshTokenExpiresAt,
        scope: token.scope,
        user_id: user.id
      })
      return {
        accessToken: access.token,
        accessTokenExpiresAt: access.token_expires_at,
        refreshToken: refresh.token,
        refreshTokenExpiresAt: refresh.token_expires_at,
        scope: access.scope,
        client: { id: access.client_id },
        user: { id: access.user_id }
      }
    }

    // 保存授权码
    async saveAuthorizationCode(code, client, user) {
      const auth = await Authorization.crate({
        code: code.authorizationCode,
        expires_at: code.expiresAt,
        redirect_uri: code.redirectUri,
        scope: code.scope,
        client_id: client.id,
        user_id: user.id
      })
      return {
        authorizationCode: auth.code,
        expiresAt: auth.expires_at,
        redirectUri: auth.redirect_uri,
        scope: auth.scope,
        client: { id: auth.client_id },
        user: { id: auth.user_id }
      }
    }

    // 当授权之后，应该吊销授权码
    async revokeAuthorizationCode(code) {
      const auth = await Authorization.findByCode(code.code)
      if (auth) return true
      return await auth.destroy()
    }

    // 检验 scope 是否符合规范
    validateScope(user, client, scope) {
      if (!scope) {
        return 'r_user'
      }
      return scope
        .split(',')
        .filter(s => VALID_SCOPES.indexOf(s) >= 0)
        .join(',')
    }

    verifyScope(token, scope) {
      const requestedScopes = scope.split(',')
      const authorizedScopeds = token.scope.split(',')
      return requestedScopes.every(s => authorizedScopeds.indexOf(s) >= 0)
    }

    // 刷新验证码接口
    async getRefreshToken(refreshToken) {
      const token = await Refresh.findByToken(refreshToken.refreshToken)
      const client = await Client.findByClientId(refreshToken.client_id)
      const user = await User.findById(refreshToken.user_id)
      return {
        refreshToken: token.token,
        refreshTokenExpiresAt: token.token_expires_at,
        scope: token.scope,
        client,
        user
      }
    }

    // 吊销 token
    async revokeToken(token) {
      return Refresh.destroy({
        where: {
          token: token.refreshToken
        }
      })
    }

    // 用户验证
    async getUser(username, password) {
      return User.Auth(username, password)
    }

    // 通过 accessToken 去数据库中查找，并验证有效期，再查询出对应的客户端和用户
    async getAccessToken(accessToken) {
      const token = await Access.getByToken(accessToken)
      const client = await Client.findByClientId(token.client_id)
      const user = await User.findById(token.user_id)
      return {
        accessToken: token.token,
        accessTokenExpiresAt: token.token_expires_at,
        scope: token.scope,
        client,
        user
      }
    }
  }
}
