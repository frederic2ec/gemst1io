<template>
  <v-layout justify-center align-center>
    <v-flex md12 fill-height>
      <v-toolbar dark color="primary">
        <v-toolbar-title>Profile Settings</v-toolbar-title>
        <v-spacer></v-spacer>
      </v-toolbar>
      <v-tabs active background-color="primary" color="white" dark>
        <v-tab key="1">Profile</v-tab>
        <v-tab key="2">Security and Privacy</v-tab>
        <v-tab-item key="1">
          <v-card class="elevation-12">
            <v-card-text>
              <v-layout column justify-center align-center>
                <v-avatar size="128" class="grey lighten-2"
                  ><img :src="profile.pictureUrl"
                /></v-avatar>
              </v-layout>
              <v-spacer></v-spacer>
              <v-file-input
                accept="image/*"
                placeholder="Pick an avatar"
                prepend-icon="mdi-camera"
                @change="updateAvatar"
              ></v-file-input>
            </v-card-text>
          </v-card>
        </v-tab-item>
        <v-tab-item key="2">
          <v-card class="elevation-12">
            <v-card-text
              ><v-form @submit.prevent="updateEmail" @keydown.prevent.enter>
                <v-text-field
                  v-model="currentPassword"
                  :error-messages="currentPasswordErrors"
                  prepend-icon="lock"
                  label="Current password"
                  type="password"
                  required
                  @input="$v.currentPassword.$touch()"
                  @blur="$v.currentPassword.$touch()"
                ></v-text-field>
                <v-text-field
                  v-model="email"
                  :error-messages="emailErrors"
                  prepend-icon="email"
                  label="Email"
                  type="email"
                  required
                  @input="$v.email.$touch()"
                  @blur="$v.email.$touch()"
                ></v-text-field>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn type="submit" color="primary" @click="updateEmail"
                >Change Email</v-btn
              >
            </v-card-actions>
            <v-card-text
              ><v-form @submit.prevent="updatePassword" @keydown.prevent.enter>
                <v-text-field
                  v-model="oldPassword"
                  :error-messages="oldPasswordErrors"
                  prepend-icon="lock"
                  label="Old password"
                  type="password"
                  required
                  @input="$v.oldPassword.$touch()"
                  @blur="$v.oldPassword.$touch()"
                ></v-text-field>
                <v-text-field
                  v-model="newPassword"
                  :error-messages="newPasswordErrors"
                  prepend-icon="lock"
                  label="New password"
                  type="password"
                  required
                  @input="$v.newPassword.$touch()"
                  @blur="$v.newPassword.$touch()"
                ></v-text-field>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn type="submit" color="primary" @click="updatePassword"
                >Change Password</v-btn
              >
            </v-card-actions>
            <v-card-actions>
              <v-spacer />
              <p>Be aware ! This action is final and irreversible !</p>
              <v-btn block color="error" @click="deleteAccount"
                >Delete account !</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-tab-item>
      </v-tabs>
    </v-flex>
  </v-layout>
</template>
<script>
import { validationMixin } from 'vuelidate'
import { required, email } from 'vuelidate/lib/validators'
import { mapMutations, mapActions, mapState } from 'vuex'

export default {
  layout: 'account',
  middleware: 'auth',
  mixins: [validationMixin],
  data() {
    return {
      profile: '',
      oldPassword: '',
      newPassword: '',
      email: '',
      currentPassword: '',
      currrentEmail: ''
    }
  },
  computed: {
    ...mapState('auth', { user: 'payload' }),

    oldPasswordErrors() {
      const errors = []
      if (!this.$v.oldPassword.$dirty) return errors
      !this.$v.oldPassword.required && errors.push('Password is required.')
      return errors
    },
    newPasswordErrors() {
      const errors = []
      if (!this.$v.newPassword.$dirty) return errors
      !this.$v.newPassword.required && errors.push('Password is required.')
      return errors
    },
    currentPasswordErrors() {
      const errors = []
      if (!this.$v.currentPassword.$dirty) return errors
      !this.$v.currentPassword.required && errors.push('Password is required.')
      return errors
    },
    emailErrors() {
      const errors = []
      if (!this.$v.email.$dirty) return errors
      !this.$v.email.email && errors.push('Must be valid e-mail')
      !this.$v.email.required && errors.push('E-mail is required')
      return errors
    }
  },

  validations: {
    email: {
      email,
      required
    },
    oldPassword: { required },
    newPassword: { required },
    currentPassword: { required }
  },

  mounted() {
    this.getProfile({
      query: {
        userId: this.$store.state.auth.payload.userId
      }
    }).then(result => {
      this.profile = result.data[0]
    }),
      this.getUser(this.$store.state.auth.payload.userId).then(result => {
        this.email = result.email
        this.currrentEmail = result.email
      })
  },

  methods: {
    ...mapActions('profile', { getProfile: 'find' }),
    ...mapActions('users', { getUser: 'get' }),
    ...mapMutations({
      setSnack: 'snackbar/setSnack'
    }),
    ...mapActions('auth', { authLogout: 'logout' }),

    updateAvatar(file) {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = r => {
        this.profile.pictureUrl = r.target.result
        const { Profile } = this.$FeathersVuex
        const profile = new Profile()
        ;(profile._id = this.profile._id),
          (profile.pictureUrl = this.profile.pictureUrl)
        profile
          .patch()
          .then(() => {
            this.setSnack({
              message: 'Profile picture successfully updated 🎉 !',
              color: 'success'
            })
          })
          .catch(e => {
            this.setSnack({
              message: '❌ ' + e.message,
              color: 'error'
            })
            console.log(e)
          })

        console.log(r.target.result)
      }
    },

    updatePassword() {
      this.$v.oldPassword.$touch()
      this.$v.newPassword.$touch()
      if (!this.$v.oldPassword.$invalid && !this.$v.newPassword.$invalid) {
        const { Authmanagement } = this.$FeathersVuex

        var payload = {
          action: 'passwordChange',
          value: {
            user: { email: this.currrentEmail },
            oldPassword: this.oldPassword,
            password: this.newPassword
          }
        }
        console.log(payload)
        const authManagement = new Authmanagement(payload)
        authManagement
          .save()
          .then(() => {
            this.setSnack({
              message: 'Password change successfull 🎉 ',
              color: 'success'
            })
          })
          .catch(e => {
            this.setSnack({
              message: '❌ ' + e.message,
              color: 'error'
            }),
              console.log(e)
          })
      }
    },

    updateEmail() {
      this.$v.email.$touch()
      this.$v.currentPassword.$touch()

      if (!this.$v.email.$invalid && !this.$v.currentPassword.$invalid) {
        const { Authmanagement } = this.$FeathersVuex

        var payload = {
          action: 'identityChange',
          value: {
            user: { email: this.currrentEmail },
            changes: { email: this.email },
            password: this.currentPassword
          }
        }
        console.log(payload)
        const authManagement = new Authmanagement(payload)
        authManagement
          .save()
          .then(() => {
            this.setSnack({
              message: 'Email change successfull 🎉 !',
              color: 'success'
            })
          })
          .catch(e => {
            this.setSnack({
              message: '❌ ' + e.message,
              color: 'error'
            }),
              console.log(e)
          })
      }
    },

    deleteAccount() {
      const { User } = this.$FeathersVuex
      const user = new User()
      user._id = this.$store.state.auth.user._id
      user
        .remove()
        .then(() => {
          this.setSnack({
            message: 'User succesfully deleted ❎ !',
            color: 'success'
          })
          this.authLogout().then(() => this.$router.push('/'))
        })
        .catch(e => {
          this.setSnack({
            message: '❌ ' + e.message,
            color: 'error'
          })
        })
    }
  },
  head() {
    return {
      title: 'Account Settings'
    }
  }
}
</script>
