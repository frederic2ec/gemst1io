<template>
  <v-app>
    <Navigation />
    <Snackbar />
    <v-content>
      <v-container fill-height fluid ma-0 pa-0>
        <nuxt />
      </v-container>
    </v-content>
    <v-footer fixed app>
      <span>&copy; 2019</span>
      <v-spacer />
      <v-btn small text @click.stop="toggleDarkModeVue"
        ><v-icon left>{{
          this.$store.state.darkmode.darkMode ? 'wb_sunny' : 'wb_cloudy'
        }}</v-icon>
        {{
          this.$store.state.darkmode.darkMode ? 'Light Mode' : 'Dark Mode'
        }}</v-btn
      >
    </v-footer>
  </v-app>
</template>

<script>
import { mapMutations } from 'vuex'
import Navigation from '~/components/homeNavigation'
import Snackbar from '~/components/Snackbar'

export default {
  components: {
    Navigation,
    Snackbar
  },
  methods: {
    ...mapMutations({
      toggleDarkMode: 'darkmode/toggleDarkMode'
    }),
    toggleDarkModeVue() {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark
      this.toggleDarkMode(this.$vuetify.theme.dark)
    }
  }
}
</script>
