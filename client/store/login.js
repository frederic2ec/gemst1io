export default {
  namespaced: true,
  state: () => ({
    logged: false
  }),
  mutations: {
    setLoginState(state, payload) {
      state.logged = payload
    }
  }
}
