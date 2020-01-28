import Vue from 'vue'
import Vuex from 'vuex'
import feathersVuex, { initAuth } from 'feathers-vuex'
import feathersClient from './feathers-client'
import darkMode from './darkmode'
import Login from './login'
import Snackbar from './snackbar'

const { service, auth, FeathersVuex } = feathersVuex(feathersClient, {
  idField: '_id'
})

Vue.use(Vuex)
Vue.use(FeathersVuex)

const createStore = () => {
  return new Vuex.Store({
    actions: {
      nuxtServerInit({ commit, dispatch }, { req }) {
        return initAuth({
          commit,
          dispatch,
          req,
          moduleName: 'auth',
          cookieName: 'feathers-jwt'
        })
      }
    },

    modules: {
      darkmode: darkMode,
      login: Login,
      snackbar: Snackbar
    },

    plugins: [
      service('users', {
        instanceDefaults: {
          pictureUrl:
            'https://s3.amazonaws.com/37assets/svn/765-default-avatar.png'
        }
      }),
      service('authManagement'),
      service('profile'),
      service('chat'),
      service('notes'),
      service('notebook'),
      auth({ userService: 'users' })
    ]
  })
}

export default createStore
