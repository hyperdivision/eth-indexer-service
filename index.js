const http = require('http')
const url = require('url')
const replicate = require('@hyperswarm/replicator')
const hypercore = require('hypercore')
const Indexer = require('@hyperdivision/eth-transaction-indexer')
const minimist = require('minimist')

var args = minimist(process.argv.slice(2), {
  string: ['p', 'd', 'h'],
  alias: { h: 'help', p: 'port', d: 'directory' },
  unknown: function () {
    console.log('unrecognised command.')
    process.exit(1)
  }
})

const port = parseInt(args.p) || 8080
const dir = args.d || './ropsten-index'

const TESTNET = 'https://ropsten.infura.io/v3/2aa3f1f44c224eff83b07cef6a5b48b5'
const feed = new hypercore(dir)

const index = new Indexer(feed, {
  endpoint: TESTNET
})

const server = http.createServer(async (req, res) => {
  if (req.method === 'POST') {
    const u = new url.URL(req.url, 'http://dummyurl:0000')

    switch (u.pathname) {
      case '/add' :
        const address = u.searchParams.get('addr')

        await index.add(address)
        console.log('now tracking: ' + address)

        res.end('ok')
        return

      default :
        res.end()
        return
    }
  }
})

process.on('SIGINT', stop)
process.on('SIGTERM', stop)

let swarm
feed.ready(async () => {
  index.start()

  console.log('index stored at:', feed.key.toString('hex'))

  server.listen(port)
  const swarm = replicate(feed, { lookup: false, announce: true, live: true, upload: true })

  feed.on('close', err => {
    if (err) throw err
    swarm.destroy()
  })
})

async function stop () {
  server.close()
  await index.stop()
  feed.close()
}
