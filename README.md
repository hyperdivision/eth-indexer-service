# eth-indexer-service

Runs a eth-transaction-indexer and logs to a Hyperbee.

## Usage

Start the service with:

```
git clone ...
cd eth-indexer-service
npm install

node index -p <PORT> -d <DIRECTORY>
> index stored at: <FEED_KEY>
```

Data will be a logged to a hypercore with the given FEED_KEY.

To add an Ethereum address to be indexed, send a POST request of the form: 

```sh
curl -X POST http://localhost:8080/add?addr=0xde...adbeef
```
