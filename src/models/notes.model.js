// notes-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function(app) {
  const mongooseClient = app.get('mongooseClient')
  const { Schema } = mongooseClient
  const notes = new Schema(
    {
      title: { type: String, required: true },
      content: { type: String },
      notebook: {
        type: Schema.Types.ObjectId,
        ref: 'notebook',
        required: true
      },
      owner: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true
      }
    },
    {
      timestamps: true
    }
  )

  return mongooseClient.model('notes', notes)
}
