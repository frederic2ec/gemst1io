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
    remove: [
      commonHooks.iff(
        commonHooks.isProvider('external'),
        authenticate('jwt'),
        hooks.restrictToOwner({
          ownerField: '_id'
        })
      )
    ]
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
            'https://s3.amazonaws.com/37assets/svn/765-default-avatar.png'
        })
        context.result.UserDetails = userDetails
        return context
      }
    ],
    update: [],
    patch: [],
    remove: [
      async function(context) {
        const profileCleanup = await context.app
          .service('profile')
          .remove(null, { query: { userId: context.result._id } })

        const notebookCleanup = await context.app
          .service('notebook')
          .remove(null, { query: { owner: context.result._id } })

        const notesCleanup = await context.app
          .service('notes')
          .remove(null, { query: { owner: context.result._id } })

        context.result.notesCleanup = notesCleanup

        context.result.notebookCleanup = notebookCleanup

        context.result.profileCleanup = profileCleanup

        return context
      }
    ]
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
