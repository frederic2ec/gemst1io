const { authenticate } = require('@feathersjs/authentication').hooks
const verifyHooks = require('feathers-authentication-management').hooks
const accountService = require('../authmanagement/notifier')
const commonHooks = require('feathers-hooks-common')
const hooks = require('feathers-authentication-hooks')

const {
  hashPassword,
  protect
} = require('@feathersjs/authentication-local').hooks

module.exports = {
  before: {
    all: [],
    find: [commonHooks.disallow('external')],
    get: [authenticate('jwt'), hooks.restrictToOwner({ ownerField: '_id' })],
    create: [hashPassword(), verifyHooks.addVerification()],
    update: [commonHooks.disallow('external')],
    patch: [
      commonHooks.iff(
        commonHooks.isProvider('external'),
        commonHooks.preventChanges(
          true,
          'email',
          'password',
          'username',
          'isVerified',
          'verifyToken',
          'verifyShortToken',
          'verifyExpires',
          'verifyChanges',
          'resetToken',
          'resetShortToken',
          'resetExpires'
        ),
        hashPassword(),
        authenticate('jwt'),
        commonHooks.disallow('external')
      )
    ],
    remove: [commonHooks.disallow('external')]
  },

  after: {
    all: [
      // Make sure the password field is never sent to the client
      // Always must be the last hook
      protect('password')
    ],
    find: [],
    get: [],
    create: [
      context => {
        accountService(context.app).notifier(
          'resendVerifySignup',
          context.result
        )
      },
      verifyHooks.removeVerification(),
      context => {
        console.log(context.result._id)
      },
      async function(context) {
        const userDetails = await context.app.service('profile').create({
          userId: context.result._id,
          username: context.result.username,
          pictureUrl:
            'https://s3.amazonaws.com/37assets/svn/765-default-avatar.png',
          offlineUrl:
            'https://i2.wp.com/streamplaygraphics.com/wp-content/uploads/edd/2018/02/onslaught-offline-banner-02.png',
          bannerUrl:
            'https://marketplace.canva.com/MADOPhuW_os/1/0/thumbnail_large-1/canva-photo-background-twitch-banner-MADOPhuW_os.jpg'
        })
        context.result.UserDetails = userDetails
        return context
      }
    ],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
}
