// Initializes the `mailer` service on path `/mailer`
const hooks = require("./mailer.hooks");

const Mailer = require("feathers-mailer");
const smtpTransport = require("nodemailer-smtp-transport");

module.exports = function(app) {
  // Initialize our service with any options it requires
  app.use(
    "/mailer",
    Mailer(
      smtpTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      })
    )
  );

  // Get our initialized service so that we can register hooks and filters
  const service = app.service("mailer");

  service.hooks(hooks);
};
