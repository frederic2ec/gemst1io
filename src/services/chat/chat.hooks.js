const { authenticate } = require("@feathersjs/authentication").hooks;
const commonHooks = require("feathers-hooks-common");
const { fastJoin } = require("feathers-hooks-common");
const hooks = require("feathers-authentication-hooks");

const postResolvers = {
  joins: {
    sender: $select => async (chat, context) => {
      chat.sender = (await context.app.service("/profile").find({
        query: {
          userId: chat.sender
        }
      })).data[0];
    }
  }
};

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [
      authenticate("jwt"),
      hooks.associateCurrentUser({
        as: "sender"
      })
    ],
    update: [commonHooks.disallow("external")],
    patch: [commonHooks.disallow("external")],
    remove: [commonHooks.disallow("external")]
  },

  after: {
    all: [fastJoin(postResolvers)],
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
