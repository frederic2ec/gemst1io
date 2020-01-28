export default {
  namespaced: true,
  state: () => ({
    message: '',
    color: ''
  }),
  mutations: {
    setSnack(state, payload) {
      state.message = payload.message
      state.color = payload.color
    }
  }
}
