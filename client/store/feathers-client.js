import feathers from '@feathersjs/feathers'
import socketio from '@feathersjs/socketio-client'
import auth from '@feathersjs/authentication-client'
import io from 'socket.io-client'
import { CookieStorage } from 'cookie-storage'

const socket = io({
  transports: ['polling', 'websocket']
})

const feathersClient = feathers()
  .configure(socketio(socket))
  .configure(
    auth({
      storage: new CookieStorage({
        path: '/'
      })
    })
  )

export default feathersClient
