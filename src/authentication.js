const authentication = require('@feathersjs/authentication')
const jwt = require('@feathersjs/authentication-jwt')
const local = require('@feathersjs/authentication-local')
const verifyHooks = require('feathers-authentication-management').hooks

const JWTVerifier = require('./JWTVerifier')
const LocalVerifier = require('./LocalVerifier')

module.exports = function(app) {
  const config = app.get('authentication')

  // Set up authentication with the secret
  app.configure(authentication(config))
  app.configure(jwt(/* {
      Verifier: JWTVerifier
    } */))
  app.configure(local(/* {
      Verifier: LocalVerifier
    } */))

  // The `authentication` service is used to create a JWT.
  // The before `create` hook registers strategies that can be used
  // to create a new valid JWT (e.g. local or oauth2)
  app.service('authentication').hooks({
    before: {
      create: [
        authentication.hooks.authenticate(config.strategies),
        verifyHooks.isVerified()
      ],
      remove: [authentication.hooks.authenticate('jwt')]
    },
    after: {
      create: [
        context => {
          // Add the user to the result response
          context.result.user = context.params.user
          // Don't expose sensitive information.
          delete context.result.user.password
          delete context.result.user.resetExpires
          delete context.result.user.resetToken
          delete context.result.user.verifyExpires
          delete context.result.user.verifyToken
        }
      ]
    }
  })
}
