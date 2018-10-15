'use strict'

module.exports = app => {
  const { User, Authorization, Client, Refresh, Access } = app.model
  console.log(app.model.models)
  return class {
    constructor(ctx) {
      this.ctx = ctx
      console.log(ctx.model)
    }

    async getAuthorization(authorizationCode) {
      const auth = await Authorization.findByCode(authorizationCode)
      const [client, user] = await Promise.all([
        Client.findByClientId(auth.client_id),
        User.findById(auth.user_id)
      ])
      return {
        code: auth.code,
        expiresAt: auth.expires_at,
        redirectUrl: auth.redirect_uri,
        scope: auth.scope,
        client,
        user
      }
    }

    async getClient(client_id, client_secret) {
      const client = await Client.Auth(client_id, client_secret)
      if (!client) return false
      return {
        id: client.client_id,
        redirectUrls: client.redirect_uris.split(','),
        grants: client.grants.split(',')
      }
    }

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
  }
}
