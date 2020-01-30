<template>
  <v-layout column justify-center align-center>
    <v-flex md12>
      <v-card class="elevation-12">
        <v-toolbar dark color="primary">
          <v-toolbar-title>Login</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-card-text>
          <v-form @submit.prevent="login" @keydown.prevent.enter>
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
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn text router to="/account/reset">Trouble logging in?</v-btn>
          <v-spacer></v-spacer>
          <v-btn type="submit" color="primary" @click="login">Login</v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'
import { mapActions, mapMutations } from 'vuex'

export default {
  layout: 'account',
  name: 'Login',
  middleware: 'notAuth',
  mixins: [validationMixin],

  data() {
    return {
      user: {
        username: '',
        password: ''
      },
      error: false,
      errorMsg: ''
    }
  },

  validations: {
    user: {
      username: { required },
      password: { required }
    }
  },

  computed: {
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
    }
  },

  async mounted() {
    await this.$recaptcha.init()
  },

  methods: {
    ...mapActions('auth', ['authenticate']),
    ...mapMutations({
      setSnack: 'snackbar/setSnack'
    }),

    async login() {
      this.$v.$touch()
      if (!this.$v.$invalid) {
        try {
          const token = await this.$recaptcha.execute('login')
          if (token) {
            this.authenticate({
              strategy: 'local',
              username: this.user.username,
              password: this.user.password
            })
              .then(async r => {
                this.$router.go()
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
      title: 'Login'
    }
  }
}
</script>
