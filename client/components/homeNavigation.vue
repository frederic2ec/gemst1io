<template>
  <div>
    <v-app-bar clipped-left fixed app>
      <v-toolbar-title>
        <router-link class="toolbar-title" to="/">
          Gemstone
        </router-link>
      </v-toolbar-title>
      <v-btn text link href="/#home">Home</v-btn>
      <v-btn text href="/#features">Features</v-btn>
      <v-btn text href="/#pricing">Pricing</v-btn>
      <v-spacer />
      <v-btn
        v-if="!this.$store.state.auth.payload"
        text
        link
        router
        to="/account/login"
      >
        <v-icon>account_circle</v-icon>
        Login
      </v-btn>
      <v-btn
        v-if="!this.$store.state.auth.payload"
        text
        link
        router
        to="/account/register"
      >
        <v-icon>person_add</v-icon>
        Register
      </v-btn>
      <v-btn v-if="this.$store.state.auth.payload" text link router to="/dash">
        <v-icon>dashboard</v-icon>
        Dashboard
      </v-btn>
    </v-app-bar>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState('auth', { user: 'payload' })
  }
}
</script>

<style scoped>
.toolbar-title {
  color: inherit;
  text-decoration: inherit;
}
</style>
