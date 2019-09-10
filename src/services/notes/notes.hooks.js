const { authenticate } = require("@feathersjs/authentication").hooks;
const hooks = require("feathers-authentication-hooks");
const commonHooks = require("feathers-hooks-common");

module.exports = {
  before: {
    all: [authenticate("jwt")],
    find: [hooks.restrictToOwner({ ownerField: "owner" })],
    get: [hooks.restrictToOwner({ ownerField: "owner" })],
    create: [
      hooks.associateCurrentUser({
        as: "owner"
      })
    ],
    update: [commonHooks.disallow("external")],
    patch: [
      commonHooks.iff(
        commonHooks.isProvider("external"),
        commonHooks.preventChanges(true, "owner"),
        authenticate("jwt"),
        hooks.restrictToOwner({
          ownerField: "owner"
        })
      )
    ],
    remove: [hooks.restrictToOwner({ ownerField: "owner" })]
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
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
};
