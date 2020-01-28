<template>
  <v-layout column justify-center align-center
    ><v-flex md12>
      <v-card class="elevation-12">
        <v-toolbar dark color="primary">
          <v-toolbar-title>Register</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-card-text>
          <v-form @submit.prevent="signup" @keydown.prevent.enter>
            <v-text-field
              v-model="user.email"
              :error-messages="emailErrors"
              prepend-icon="email"
              label="Email"
              type="email"
              required
              @input="$v.user.email.$touch()"
              @blur="$v.user.email.$touch()"
            ></v-text-field>
            <v-text-field
              v-model="user.username"
              :error-messages="usernameErrors"
              prepend-icon="person"
              label="Username"
              type="text"
              required
              @input="$v.user.username.$touch()"
              @blur="$v.user.username.$touch()"
            ></v-text-field>
            <v-text-field
              v-model="user.password"
              :error-messages="passwordErrors"
              prepend-icon="lock"
              label="Password"
              type="password"
              required
              @input="$v.user.password.$touch()"
              @blur="$v.user.password.$touch()"
            ></v-text-field>
            <v-text-field
              v-model="user.passwordConfirm"
              :error-messages="passwordConfirmErrors"
              prepend-icon="lock"
              label="Confirm password"
              type="password"
              required
              @input="$v.user.passwordConfirm.$touch()"
              @blur="$v.user.passwordConfirm.$touch()"
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn text router to="/account/login">Login instead?</v-btn>
          <v-spacer></v-spacer>
          <v-btn type="submit" color="primary" @click="signup">Signup</v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required, sameAs, email } from 'vuelidate/lib/validators'
import { mapMutations } from 'vuex'

export default {
  layout: 'home',
  name: 'SignUp',
  middleware: 'notAuth',
  mixins: [validationMixin],

  data() {
    return {
      user: {
        email: '',
        username: '',
        password: '',
        passwordConfirm: ''
      },
      error: false,
      errorMsg: ''
    }
  },

  validations: {
    user: {
      email: {
        email,
        required
      },
      username: { required },
      password: { required },
      passwordConfirm: {
        required,
        sameAsPassword: sameAs(function() {
          return this.user.password
        })
      }
    }
  },

  computed: {
    emailErrors() {
      const errors = []
      if (!this.$v.user.email.$dirty) return errors
      !this.$v.user.email.email && errors.push('Must be valid e-mail')
      !this.$v.user.email.required && errors.push('E-mail is required')
      return errors
    },
    usernameErrors() {
      const errors = []
      if (!this.$v.user.username.$dirty) return errors
      !this.$v.user.username.required && errors.push('Username is required.')
      return errors
    },
    passwordErrors() {
      const errors = []
      if (!this.$v.user.password.$dirty) return errors
      !this.$v.user.password.required && errors.push('Password is required.')
      return errors
    },
    passwordConfirmErrors() {
      const errors = []
      if (!this.$v.user.passwordConfirm.$dirty) return errors
      !this.$v.user.passwordConfirm.required &&
        errors.push('Password confirmation is required.')
      !this.$v.user.passwordConfirm.sameAsPassword &&
        errors.push('Passwords does not match')
      return errors
    }
  },

  async mounted() {
    await this.$recaptcha.init()
  },

  methods: {
    ...mapMutations({
      setSnack: 'snackbar/setSnack'
    }),

    async signup() {
      this.$v.$touch()
      if (!this.$v.$invalid) {
        try {
          const token = await this.$recaptcha.execute('login')
          if (token) {
            const { User } = this.$FeathersVuex
            const user = new User(this.user)
            user
              .save()
              .then(() => {
                this.setSnack({
                  message:
                    'Account created successfully, please check you inbox for confirmation ✉️ !',
                  color: 'success'
                })
                this.$router.push('/account/login')
              })
              .catch(e => {
                this.setSnack({
                  message: '❌ ' + e.message,
                  color: 'error'
                })
              })
          }
        } catch (error) {
          console.log('Login error:', error)
        }
      }
    }
  },
  head() {
    return {
      title: 'Register'
    }
  }
}
</script>
