const app = require('../../src/app')

describe("'profile' service", () => {
  it('registered the service', () => {
    const service = app.service('profile')
    expect(service).toBeTruthy()
  })
})
