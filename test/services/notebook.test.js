const app = require('../../src/app')

describe("'notebook' service", () => {
  it('registered the service', () => {
    const service = app.service('notebook')
    expect(service).toBeTruthy()
  })
})
