<template>
  <v-layout column justify-center align-center>
    <v-flex md12>
      <v-card class="elevation-12">
        <v-toolbar dark color="primary">
          <v-toolbar-title>Verify user</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-card-text>
          <v-form @submit.prevent="verifyUser" @keydown.prevent.enter>
            <v-text-field
              v-model="payload.value"
              prepend-icon="vpn_key"
              label="Token"
              type="text"
              required
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn type="submit" color="primary" @click="verifyUser"
            >Verify</v-btn
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
        action: 'verifySignupLong'
      }
    }
  },
  mounted() {
    this.payload.value = this.$route.params.id
    this.verifyUser()
  },
  methods: {
    ...mapMutations({
      setSnack: 'snackbar/setSnack'
    }),

    verifyUser() {
      const { Authmanagement } = this.$FeathersVuex
      const authManagement = new Authmanagement(this.payload)
      authManagement
        .save()
        .then(() => {
          this.setSnack({
            message: 'Account confirmed 🎉 !',
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
  },
  head() {
    return {
      title: 'User confirmation'
    }
  }
}
</script>
