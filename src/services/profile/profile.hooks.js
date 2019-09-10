const { authenticate } = require("@feathersjs/authentication").hooks;
const verifyHooks = require("feathers-authentication-management").hooks;
const commonHooks = require("feathers-hooks-common");
const hooks = require("feathers-authentication-hooks");

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [commonHooks.disallow("external")],
    update: [commonHooks.disallow("external")],
    patch: [
      commonHooks.iff(
        commonHooks.isProvider("external"),
        commonHooks.preventChanges(true, "username", "userId"),
        authenticate("jwt"),
        hooks.restrictToOwner({
          ownerField: "userId"
        })
      )
    ],
    remove: [commonHooks.disallow("external")]
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
