// Initializes the `notebook` service on path `/notebook`
const createService = require("feathers-mongoose");
const createModel = require("../../models/notebook.model");
const hooks = require("./notebook.hooks");

module.exports = function(app) {
  const Model = createModel(app);

  const options = {
    Model
  };

  // Initialize our service with any options it requires
  app.use("/notebook", createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service("notebook");

  service.hooks(hooks);
};
