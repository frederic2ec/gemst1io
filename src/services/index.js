const users = require('./users/users.service.js');
const mailer = require('./mailer/mailer.service.js');
const authmanagement = require('./authmanagement/authmanagement.service.js');
const profile = require('./profile/profile.service.js');
const chat = require('./chat/chat.service.js');
const notes = require('./notes/notes.service.js');
const notebook = require('./notebook/notebook.service.js');
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(users);
  app.configure(mailer);
  app.configure(authmanagement);
  app.configure(profile);
  app.configure(chat);
  app.configure(notes);
  app.configure(notebook);
};
