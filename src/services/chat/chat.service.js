// Initializes the `chat` service on path `/chat`
const createService = require('feathers-mongoose');
const createModel = require('../../models/chat.model');
const hooks = require('./chat.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/chat', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('chat');

  service.hooks(hooks);
};
