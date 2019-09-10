// notebook-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function(app) {
  const mongooseClient = app.get('mongooseClient')
  const { Schema } = mongooseClient
  const notebook = new Schema(
    {
      title: { type: String, required: true },
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

  return mongooseClient.model('notebook', notebook)
}
