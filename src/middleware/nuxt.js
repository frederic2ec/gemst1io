const path = require('path')
const { Nuxt, Builder } = require('nuxt')
const nuxtConfig = require('../../nuxt.config')
nuxtConfig.rootDir = path.resolve(__dirname, '../..')
nuxtConfig.dev = process.env.NODE_ENV !== 'production'

const nuxt = new Nuxt(nuxtConfig)

if (nuxtConfig.dev) {
  const builder = new Builder(nuxt)
  builder.build()
}

module.exports = nuxt
