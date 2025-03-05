Orderbook Incremental Updates
-----------------------------

> Request

```
{
  "op": "subscribe",
  "args": [
    "update:BTCPFC_0"
  ]
}

```

```
{
  "op": "unsubscribe",
  "args": [
    "update:BTCPFC_0"
  ]
}

```

> Response

```
{
  "topic": "update:BTCPFC_0",
  "data": {
    "bids": [
      [
        "59252.5",
        "0.06865"
      ],
      [
        "59249.0",
        "0.24000"
      ],
      [
        "59235.5",
        "0.16073"
      ],
      [
        "59235.0",
        "0.26626"
      ],
      [
        "59233.0",
        "0.50000"
      ]
    ],
    "asks": [
      [
        "59292.0",
        "0.50000"
      ],
      [
        "59285.5",
        "0.24000"
      ],
      [
        "59285.0",
        "0.15598"
      ],
      [
        "59278.5",
        "0.01472"
      ]
    ],
    "seqNum": 628282,
    "prevSeqNum": 628281,
    "type": "snapshot",
    "timestamp": 1565135165600,
    "symbol": "BTCPFC"
  }
}

```

```
{
  "topic": "update:BTCPFC",
  "data": {
    "bids": [],
    "asks": [
      [
        "59367.5",
        "2.15622"
      ],
      [
        "59325.5",
        "0"
      ]
    ],
    "seqNum": 628283,
    "prevSeqNum": 628282,
    "type": "delta",
    "timestamp": 1565135165600,
    "symbol": "BTCPFC"
  }
}

```

Subscribe to Orderbook incremental updates through the endpoint `wss://ws.btse.com/ws/oss/futures`. The format of topic will be `update:symbol_grouping` (eg. `update:BTCPFC_0`). The first response received will be a snapshot of the current orderbook (this is indicated in the `type` field) and 50 levels will be returned. Incremental updates will be sent in subsequent packets with type `delta`.

Bids and asks will be sent in `price` and `size` tuples. The size sent will be the new updated size for the price. If a value of `0` is sent, the price should be removed from the local copy of the orderbook.

To ensure that the updates are received in sequence, `seqNum` indicates the current sequence and `prevSeqNum` refers to the packet before. `seqNum` will always be one after the `prevSeqNum`. If the sequence is out of order, you will need to unsubscribe and re-subscribe to the topic again.

Also if [crossed orderbook](https://en.wikipedia.org/wiki/Order_book#Crossed_book) ever occurs when the best bid higher or equal to the best ask, please unsubscribe and re-subscribe to the topic again.

### Response Content

#### Orderbook Object

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| topic | string | Yes | Websocket topic |
| data | Data Object | Yes | Refer to data object below |

#### Data Object

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| bids | Quote Object | Yes | Bid quotes |
| asks | Quote Object | Yes | Asks quotes |
| seqNum | int | Yes | Current sequence number |
| prevSeqNum | int | Yes | Previous sequence number |
| type | string | Yes | `snapshot` - Snapshot of the orderbook with a maximum of 50 levels\
`delta` - Updates of the orderbook |
| timestamp | long | Yes | Timestamp of the orderbook |
| symbol | string | Yes | Orderbook symbol |

#### Orderbook Error Response

| Error Code | Message |
| --- | --- |
| 1000 | Market pair provided is currently not supported. |
| 1001 | Operation provided is currently not supported. |
| 1002 | Invalid request. Please check again your request and provide all information required. |
| 1005 | Topic provided does not exist. |
| 1007 | User message buffer is full. |
| 1008 | Reached maximum failed attempts, closing the session.

 |