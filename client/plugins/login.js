import { mapActions, mapMutations } from 'vuex'
import extend from '~/utils/extend-vue-app'

export default async function({ app }) {
  extend(app, {
    mounted() {
      this.setLoginState(false)
      this.authenticate()
        .then(() => {
          console.log('logged in')
          this.setLoginState(true)
        })
        .catch(e => {
          console.error('Error:', e)
        })
    },
    methods: {
      ...mapActions('auth', ['authenticate']),
      ...mapMutations({
        setLoginState: 'login/setLoginState'
      })
    }
  })
}
