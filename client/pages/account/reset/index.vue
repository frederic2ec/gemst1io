<template>
  <v-layout column justify-center align-center>
    <v-flex md12>
      <v-card class="elevation-12">
        <v-toolbar dark color="primary">
          <v-toolbar-title>Reset password</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-card-text>
          <v-form @submit.prevent="resetPassword" @keydown.prevent.enter>
            <v-text-field
              v-model="payload.value"
              prepend-icon="email"
              label="Email"
              type="email"
              required
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn type="submit" color="primary" @click="resetPassword"
            >Send reset</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>
<script>
import { mapMutations } from 'vuex'

export default {
  layout: 'account',
  middleware: 'notAuth',
  data() {
    return {
      payload: {
        value: '',
        action: 'sendResetPwd'
      }
    }
  },
  methods: {
    ...mapMutations({
      setSnack: 'snackbar/setSnack'
    }),

    resetPassword() {
      const { Authmanagement } = this.$FeathersVuex

      var payload = {
        action: this.payload.action,
        value: { email: this.payload.value }
      }

      const authManagement = new Authmanagement(payload)
      authManagement
        .save()
        .then(() => {
          this.setSnack({
            message: 'Reset link sent ✉️ !',
            color: 'success'
          })
          this.$router.push('/account/login')
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
  head() {
    return {
      title: 'Password Reset'
    }
  }
}
</script>
