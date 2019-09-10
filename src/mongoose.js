const mongoose = require("mongoose");

module.exports = function(app) {
  mongoose.connect(app.get("mongodb"), {
    useCreateIndex: true,
    useNewUrlParser: true
  });
  mongoose.Promise = global.Promise;
  //mongoose.set("debug", true);

  app.set("mongooseClient", mongoose);
};
