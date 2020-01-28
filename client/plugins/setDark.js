import { mapMutations } from 'vuex'
import extend from '~/utils/extend-vue-app'

export default async function({ app }) {
  extend(app, {
    mounted() {
      this.toggleDarkModeVue()
    },
    methods: {
      ...mapMutations({
        toggleDarkMode: 'darkmode/toggleDarkMode'
      }),
      toggleDarkModeVue() {
        try {
          this.$vuetify.theme.dark = JSON.parse(
            localStorage.getItem('gemstone')
          ).darkmode.darkMode
        } catch {
          this.$vuetify.theme.dark = false
        }
      }
    }
  })
}
