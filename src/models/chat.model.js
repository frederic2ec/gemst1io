// chat-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function(app) {
  const mongooseClient = app.get('mongooseClient')
  const { Schema } = mongooseClient
  const chat = new Schema(
    {
      text: { type: String, maxlength: 500, required: true },
      sender: {
        type: Schema.Types.ObjectId,
        ref: 'users'
      },
      channel: {
        type: Schema.Types.ObjectId,
        ref: 'profile'
      }
    },
    {
      timestamps: true
    }
  )

  return mongooseClient.model('chat', chat)
}
