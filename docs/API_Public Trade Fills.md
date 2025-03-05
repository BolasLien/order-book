Public Trade Fills
------------------

> Request

```
{
  "op": "subscribe",
  "args": [
    "tradeHistoryApi:BTCPFC"
  ]
}

```

> Response

```
{
  "topic": "tradeHistoryApi:BTCPFC",
  "data": [
  {
    "symbol": "BTCPFC",
    "side": "SELL",
    "size": 0.007,
    "price": 5302.8,
    "tradeId": 118974855,
    "timestamp": 1584446020295
  }
  ]
}

```

Subscribe to recent trade feed for a market. The topic will be `tradeHistoryApi:<market>` where `<market>` is the market symbol.

### Response Content

#### TradeHistory Object

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| topic | string | Yes | Websocket topic |
| data | Data Object | Yes | Refer to data object below |

#### Data Object

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| symbol | string | Yes | Market symbol |
| side | string | Yes | Trade Side, BUY or SELL |
| size | double | Yes | Transacted size |
| price | double | Yes | Transacted price |
| tradeId | long | Yes | Trade sequence Id |
| timestamp | long | Yes | Trade timestamp |

Authentication
--------------

> Request

```
{
  "op":"authKeyExpires",
  "args":["APIKey", "nonce", "signature"]
}

```

Authenticate the websocket session to subscribe to authenticated websocket topics. Assume we have values as follows:

-   `request-nonce`: 1624985375123
-   `request-api`: 4e9536c79f0fdd72bf04f2430982d3f61d9d76c996f0175bbba470d69d59816x
-   `secret`: 848db84ac252b6726e5f6e7a711d9c96d9fd77d020151b45839a5b59c37203bx

Our subscription request will be:

```
{
  "op":"authKeyExpires",
  "args":["4e9536c79f0fdd72bf04f2430982d3f61d9d76c996f0175bbba470d69d59816x", "1624985375123", "c410d38c681579adb335885800cff24c66171b7cc8376cfe43da1408c581748156b89bcc5a115bb496413bda481139fb"]
}

```

### Request Parameters

Below details the arguments needed to be sent in.

| Index | Type | Required | Description |
| --- | --- | --- | --- |
| 0 | string | Yes | First argument is the API key |
| 1 | long | Yes | Nonce which is the current timestamp |
| 2 | string | Yes | Generated signature |

> Generating a signature

```
echo -n "/ws/futures1624985375123"  | openssl dgst -sha384 -hmac "848db84ac252b6726e5f6e7a711d9c96d9fd77d020151b45839a5b59c37203bx"
(stdin)= bd8afb8bee58ba0a2c67f84dcfe6e64d0274f55d064bb26ea84a0fe6dd8c621b541b511982fb0c0b8c244e9521a80ea1

```

`\
`