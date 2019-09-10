module.exports = function(app) {
  function getLink() {
    const url = process.env.FRONTEND_URI
    return url
  }

  function sendEmail(email) {
    return app
      .service('mailer')
      .create(email)
      .then(function(result) {
        console.log('Sent email', result)
      })
      .catch(err => {
        console.log('Error sending email', err)
      })
  }

  return {
    notifier: function(type, user, notifierOptions) {
      let tokenLink
      let email
      switch (type) {
        case 'resendVerifySignup': //sending the user the verification email
          tokenLink = getLink() + 'account/verify/' + user.verifyToken
          email = {
            from: process.env.FROM_EMAIL,
            to: user.email,
            subject: 'Verify Signup',
            html: tokenLink
          }
          return sendEmail(email)
          break

        case 'verifySignup': // confirming verification
          tokenLink = getLink() + 'account/verify/' + user.verifyToken
          email = {
            from: process.env.FROM_EMAIL,
            to: user.email,
            subject: 'Confirm Signup',
            html: 'Thanks for verifying your email'
          }
          return sendEmail(email)
          break

        case 'sendResetPwd':
          tokenLink = getLink() + 'account/reset/' + user.resetToken
          email = {
            from: process.env.FROM_EMAIL,
            to: user.email,
            subject: 'Reset Password',
            html: tokenLink
          }
          return sendEmail(email)
          break

        case 'resetPwd':
          tokenLink = getLink() + 'account/reset/' + user.resetToken
          email = {
            from: process.env.FROM_EMAIL,
            to: user.email,
            subject: 'Password reset',
            html: 'Your password has been reset'
          }
          return sendEmail(email)
          break

        case 'passwordChange':
          email = {
            from: process.env.FROM_EMAIL,
            to: user.email,
            subject: 'Password reset',
            html: 'Your password has been reset'
          }
          return sendEmail(email)
          break

        case 'identityChange':
          tokenLink = getLink() + 'account/verify/' + user.verifyToken
          email = {
            from: process.env.FROM_EMAIL,
            to: user.email,
            subject: 'Verify Email Change',
            html: tokenLink
          }
          return sendEmail(email)
          break

        default:
          break
      }
    }
  }
}
