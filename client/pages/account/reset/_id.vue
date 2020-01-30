<template>
  <v-layout column justify-center align-center>
    <v-flex md12>
      <v-card class="elevation-12">
        <v-toolbar dark color="primary">
          <v-toolbar-title>Reset password</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-card-text>
          <v-form @submit.prevent="login" @keydown.prevent.enter>
            <v-text-field
              v-model="payload.token"
              prepend-icon="vpn_key"
              label="Token"
              type="text"
              required
            ></v-text-field>
            <v-text-field
              v-model="payload.value"
              prepend-icon="lock"
              label="New password"
              type="password"
              required
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn type="submit" color="primary" @click="verifyUser"
            >Reset password</v-btn
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
        token: '',
        action: 'resetPwdLong'
      }
    }
  },
  mounted() {
    this.payload.token = this.$route.params.id
  },
  methods: {
    ...mapMutations({
      setSnack: 'snackbar/setSnack'
    }),

    verifyUser() {
      const { Authmanagement } = this.$FeathersVuex

      var payload = {
        action: this.payload.action,
        value: { token: this.payload.token, password: this.payload.value }
      }
      const authManagement = new Authmanagement(payload)
      authManagement
        .save()
        .then(() => {
          this.setSnack({
            message: 'Password reset successfull 🎉 !',
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
