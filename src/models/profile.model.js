// profile-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function(app) {
  const mongooseClient = app.get('mongooseClient')
  const { Schema } = mongooseClient
  const profile = new Schema(
    {
      pictureUrl: { type: String, required: true },
      userId: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        unique: true,
        required: true
      },
      username: { type: String, required: true }
    },
    {
      timestamps: true
    }
  )

  return mongooseClient.model('profile', profile)
}
