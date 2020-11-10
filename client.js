const got = require('got')

module.exports = class RPC {
  constructor (endpoint) {
    this.endpoint = endpoint
    this.destroyed = false
  }

  async _request (method, searchParams) {
    const url = this.endpoint + '/' + method
    const res = await got.post({
      url,
      searchParams
    })

    if (res.body.error) {
      const error = new Error(res.body.error.message)
      error.code = res.body.error.code
      throw error
    }

    return res.body.result
  }

  add (addr) {
    return this._request('add', { addr })
  }

  destroy () {}
}
