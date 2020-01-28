const { resolve } = require('path')
const package = require('./package.json')
const config = require('./config/default.json')
const webpack = require('webpack')

const isDev = !['production', 'test'].includes(process.env.NODE_ENV)

require('dotenv').config()

module.exports = {
  mode: 'universal',
  dev: isDev,
  srcDir: resolve(__dirname, './client'),
  /*
   ** Headers of the page
   */
  head: {
    titleTemplate: '%s - ' + 'Gemstone',
    title: 'Gemstone',
    meta: [
      {
        charset: 'utf-8'
      },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: ''
      }
    ]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: {
    color: '#fff'
  },
  /*
   ** Global CSS
   */
  css: [
    'tui-editor/dist/tui-editor.css',
    'tui-editor/dist/tui-editor-contents.css',
    'codemirror/lib/codemirror.css',
    '@fortawesome/fontawesome-free/css/all.css',
    'typeface-roboto/index.css',
    'material-icons/iconfont/material-icons.css',
    'material-icons/css/material-icons.min.css'
  ],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    { src: './plugins/Vuelidate', ssr: false },
    '' + './plugins/login.js',
    './plugins/asyncComputed.js',
    { src: './plugins/localStorage.js', ssr: false },
    { src: './plugins/setDark.js', ssr: false },
    { src: './plugins/tui-editor.client.js', ssr: false }
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    ['@nuxtjs/pwa', { icon: false }],
    '@nuxtjs/dotenv',
    '@nuxtjs/sitemap',
    'nuxt-rfg-icon',
    'nuxt-fullpage.js',
    '@nuxtjs/recaptcha',
    ['nuxt-segment-analytics', { id: process.env.SEGMENT_KEY, useRouter: true }]
  ],
  buildModules: [
    '@nuxtjs/vuetify',
    'nuxt-webpackdashboard',
    '@nuxtjs/eslint-module'
  ],
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {},

  dotenv: {
    /* module options */
    systemvars: true,
    path: resolve(__dirname)
  },
  /*
   ** vuetify module configuration
   ** https://github.com/nuxt-community/vuetify-module
   */
  vuetify: {
    iconfont: 'fa'
  },
  recaptcha: {
    hideBadge: false,
    siteKey: process.env.RECAPTCHA_SITEKEY,
    version: 3
  },

  'rfg-icon': {
    static: true
  },
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {
      config.node = {
        fs: 'empty'
      }
      if (ctx.dev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/,
          options: {
            fix: true
          }
        })
      }
    },
    plugins: [
      new webpack.ProvidePlugin({
        _: 'lodash'
      })
    ]
  }
}
