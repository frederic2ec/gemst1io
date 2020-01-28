import createPersistedState from 'vuex-persistedstate'

export default ({ store }) => {
  window.onNuxtReady(() => {
    createPersistedState({
      key: 'gemstone',
      paths: ['darkmode.darkMode']
    })(store)
  })
}
