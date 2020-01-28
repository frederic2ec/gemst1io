export default {
  namespaced: true,
  state: () => ({
    darkMode: false
  }),
  mutations: {
    toggleDarkMode(state, payload) {
      state.darkMode = payload
    }
  }
}
