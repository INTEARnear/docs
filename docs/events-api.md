---
sidebar_position: 1
title: Events API
---

> This documentation is not complete, it's a temporary thing before the full docs are written.

# Events API

Intear provides a simple and easy to get events on blockchain in 2 ways:

1. REST API
2. Realtime Websocket API

> **Note:** The current REST APIs don't have full historical data and may skip or contain
> some events twice, and are intended for testing and development purposes only. They
> also don't have some frequent events like `log_text` or `log_nep297` that may produce
> thousands of events per second. When the API becomes stable and syncs with the
> blockchain, we will make sure it's reliable.

Both APIs are open-source and can be found in [`INTEARnear/inevents`](https://github.com/INTEARnear/inevents)
repository. `inevents` is a framework for events with some custom modules like HTTP, WebSocket,
redis-to-db. It also contains `redis/` directory with `inevents-redis` crate that is used for
reading and emitting events using Redis streams. The `intear-events` directory contains all
Intear's pre-built events that are available in the API.

## REST API

The REST API is available at `https://events.intear.tech/query/` and uses pagination by block
timestamps. For example, `https://events.intear.tech/query/nft_transfer?start_block_timestamp_nanosec=171498830749111100&blocks=3`
will return the last 3 blocks that have `nft_transfer` events. If some block has 5 events, the
endpoint will return all 7 (5 + 1 + 1) events in the same response. After that, if you want to
continue iteration, use `block_timestamp_nanosec + 1` from the last event as the `start_block_timestamp_nanosec`
parameter. The maximum `blocks` value is `100`.

Check out [this interactive UI](https://events.intear.tech/query/swagger-ui/) for all events.

## Realtime Websocket API

To use the API, you need to connect to `wss://ws-events.intear.tech/(events|events-testnet)/event-name`
and send a JSON message containing the filter. For example, `wss://ws-events.intear.tech/events/nft_transfer`
and `{"contract_id":"shitzu.bodega-lab.near"}`. **All fields in the filter are optional**, so even `{}` is
a valid filter message. After sending the filter, you will receive JSON events that match the filter.
Each message is a JSON object of the event itself and no other fields.

### NFT Events

Indexed by [`nft-indexer`](https://github.com/INTEARnear/nft-indexer).

#### `nft_transfer`

Fired when NFTs are transferred or sold.

Supported on mainnet: `true`

Supported on testnet: `false`

Filter example:

```json
{
  "contract_id": "shitzu.bodega-lab.near",
  "old_owner_id": "slimedragon.near",
  "new_owner_id": "slimedrgn.tg",
  "involved_account_ids": ["slimedragon.near", "slimedrgn.tg"],
}
```

> **Note:** The `involved_account_ids` field is a list of accounts that are involved in the transfer
> and can be either the old or new owner. The exact filtering logic is
> ```rs
> if let Some(involved_account_ids) = &self.involved_account_ids {
>     if !involved_account_ids.contains(&event.old_owner_id)
>         && !involved_account_ids.contains(&event.new_owner_id)
>     {
>         return false;
>     }
> }
> ```

Event example:

```json
{
    "block_height": 118177130,
    "block_timestamp_nanosec": "1714763770692115000",
    "contract_id": "usmen.hot.tg",
    "memo": null,
    "new_owner_id": "a.mitte-orderbook.near",
    "old_owner_id": "asdvlone.tg",
    "receipt_id": "9nQq8aZwbL2viqTroF9m2TN1zJqGkPHut1bUjgS9Ecvr",
    "token_ids": [
        "1666"
    ],
    "token_prices_near": [
      null
    ],
    "transaction_id": "4iugkbvYonSEK72dw7kcqUmPVviJsh6vVECMDEMraW6J"
}
```

> **Note:** The `token_prices_near` field is a list of prices for each token in NEAR, if the
> transaction was a trade on a [NEP-199](https://nomicon.io/Standards/Tokens/NonFungibleToken/Payout)-compliant
> NFT marketplace.

#### `nft_mint`

Fired when NFTs are minted.

Supported on mainnet: `true`

Supported on testnet: `false`

Filter example:

```json
{
  "contract_id": "shitzu.bodega-lab.near",
  "owner_id": "slimedragon.near"
}
```

Event example:

```json
{
    "block_height": 118178828,
    "block_timestamp_nanosec": "1714765868727660000",
    "contract_id": "mint.sharddog.near",
    "memo": null,
    "owner_id": "alishun_am-hot.tg",
    "receipt_id": "F6oEYHM67nNpqhQEDtXR5Sa8jrVfgmd9WsGbwADiA4mT",
    "token_ids": [
        "542:324"
    ],
    "transaction_id": "Cr48qnfZq4TKnguMN5LWg6dGfpbzhjFt6jKhtKNPxjPV"
}
```

#### `nft_burn`

Fired when NFTs are burned.

Supported on mainnet: `true`

Supported on testnet: `false`

Filter example:

```json
{
  "contract_id": "shitzu.bodega-lab.near",
  "owner_id": "slimedragon.near"
}
```

Event example:

```json
{
    "block_height": 118243491,
    "block_timestamp_nanosec": "1714845936855594000",
    "contract_id": "x.paras.near",
    "memo": null,
    "owner_id": "riri.near",
    "receipt_id": "HbvGKg2YtsCmvcgRvvwnRzNQKDBhjyM2eZCwGTHURG1F",
    "token_ids": [
        "506795:1"
    ],
    "transaction_id": "CxgyKjLzupukfdc8etsZpRN69yWa8YsDxWYS2srrgdZY"
}
```

### Potlock Events

Indexed by [`potlock-indexer`](https://github.com/INTEARnear/potlock-indexer).

#### `potlock_donation`

Supported on mainnet: `true`

Supported on testnet: `false`

Filter example:

```json
{
  "project_id": "indexers.intear.near",
  "donor_id": "slimedragon.near",
  "referrer_id": "slimedrgn.tg",
  "min_amounts": {
      "near": "1000000000000000000000000",
      "intel.tkn.near": "69000000000000000000000"
  }
}
```

> **Note:** The `min_amounts` field is a map of token contract IDs to the minimum amounts.
> Potlock allows donations in different tokens, so you can specify minimal donation in each
> token. If the donation is in a token that is not in the map, it is ignored. NEAR is always
> `near`, not `wrap.near`.

#### `potlock_pot_donation`

Supported on mainnet: `true`

Supported on testnet: `false`

Filter example:

```json
{
  "project_id": "indexers.intear.near",
  "donor_id": "slimedragon.near",
  "referrer_id": "slimedrgn.tg"
}

Event example:

```json
{
    "block_height": 121769567,
    "block_timestamp_nanosec": "1719093157347256000",
    "chef_fee": "4900000000000000000000",
    "chef_id": "edgeai.near",
    "donated_at": 1719093155097,
    "donation_id": 422,
    "donor_id": "fandix.near",
    "message": null,
    "net_amount": "0",
    "pot_id": "ai.v1.potfactory.potlock.near",
    "protocol_fee": "2000000000000000000000",
    "receipt_id": "BwsBrHcbMnVygyxHuFbZ54iFQ7bjnmHtiCbQsfUsLw5",
    "referrer_fee": null,
    "referrer_id": null,
    "total_amount": "100000000000000000000000",
    "transaction_id": "HBnmGpEQ54yA2weufzgzYnsV7rLUqRxdNZeYLvrAPmzS"
}
```

#### `potlock_pot_project_donation`

Supported on mainnet: `true`

Supported on testnet: `false`

Filter example:

```json
{
  "project_id": "indexers.intear.near",
  "donor_id": "slimedragon.near",
  "referrer_id": "slimedrgn.tg"
}
```

Event example:

```json
{
    "block_height": 118541815,
    "block_timestamp_nanosec": "1715218033357664000",
    "chef_fee": null,
    "chef_id": null,
    "donated_at": 1715218030726,
    "donation_id": 187,
    "donor_id": "kazanderdad.near",
    "message": null,
    "net_amount": "0",
    "pot_id": "oss.v1.potfactory.potlock.near",
    "project_id": "keypom.near",
    "protocol_fee": "20000000000000000000000",
    "receipt_id": "6MbUMZd9bXoXcb1vcpPxumurgrFiedrJ9ETsKqzgSW7H",
    "referrer_fee": null,
    "referrer_id": null,
    "total_amount": "1000000000000000000000000",
    "transaction_id": "AC7PVVt5fCyShZ97x79nauhrashgqcwoTAeXU5PwrteD"
}
```

### New Token Events

Indexed by [`new-token-indexer`](https://github.com/INTEARnear/new-token-indexer).

#### `newtoken_nep141`

Supported on mainnet: `true`

Supported on testnet: `false`

Filter example:

```json
{
  "account_id": "intel.tkn.near",
  "parent_account_id": "tkn.near"
}
```

> **Note:** The `account_id` field is the account ID of a specific token you're
> looking to get the event of. The only use case I can think of is snipe bots
> that are waiting for a specific token to launch.

Event example:

```json
{
    "account_id": "rnc.tkn.near",
    "block_height": 123341313,
    "block_timestamp_nanosec": "1720924294882797000",
    "receipt_id": "voTG7k88EAYPhknrEsXa1zzoyCw3Vgi8VBNzW6cLq52",
    "transaction_id": "BNNEBxDsCGeTby1QsYdQ7FFsT21S35F618eMewUaQoFd"
}
```

#### `newtoken_memecooking`

Meme.cooking does not create a NEP-141 contract when a new meme is created, it
only creates a new token if the meme has reached the necessary market cap by the
end of the auction, so there is no `newtoken_nep141` event for it at the time
of creation. That's why we have a separate event for it.

Supported on mainnet: `false`

Supported on testnet: `true`

Filter example:

```json
{
  "meme_id": 52,
  "owner": "slimedragon.near"
}
```

> **Note:** The `meme_id` field is the ID of the meme as in `https://meme.cooking/meme/52`.
> `owner` is the account ID of the person who created the meme.

Event example:

```json
{
    "block_height": 170162064,
    "block_timestamp_nanosec": "1722240007034834000",
    "decimals": 24,
    "deposit_token_id": "wrap.testnet",
    "end_timestamp_ms": "1722240307034",
    "meme_id": 52,
    "name": "Shitcoin",
    "owner": "slimedrgn.testnet",
    "receipt_id": "6KmZhhr7n3zLH8MYjjhHZNki8F6N8HVmTLK6NMZiFD7Y",
    "reference": "QmaAjh6sTYKq5XETwfnaWQFvaozfhAPYshDtymTajnTenH",
    "reference_hash": "47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU=",
    "symbol": "SHITCOIN",
    "total_supply": "1000000000000000000000000000000000",
    "transaction_id": "2mWVnURKZsBUmb6ZnET7uRZYYpHdztgaLTBqL3mbo6fM"
}
```

### Price

Emitted by [`price-indexer`](https://github.com/INTEARnear/price-indexer).

#### `price_pool`

Fired for every `trade_pool_change` event, with token prices calculated, in the same format
for all pools (ref, ref stable swap, ref rated swap, ref dcl, others). Pools with != 2
tokens are not supported.

Supported on mainnet: `true`

Supported on testnet: `false`

Filter example:

```json
{
  "pool_id": "REF-4663",
  "involved_token_account_ids": ["wrap.near", "intel.tkn.near"],
}
```

> **Note:** The `involved_token_account_ids` field is a list of token account IDs that are
> involved in the pool. The exact filtering logic is
> ```rs
> if let Some(involved_token_account_ids) = &self.involved_token_account_ids {
>     for token_account_id in involved_token_account_ids {
>         if token_account_id != &event.token0 && token_account_id != &event.token1 {
>             return false;
>         }
>     }
> }
> ```

Event example:

```json
{
    "block_height": 121767590,
    "pool_id": "REF-4663",
    "timestamp_nanosec": "1719090911919325000",
    "token0": "wrap.near",
    "token0_in_1_token1": "0.1411208118239615191769355427024566622283081247808332616013700701009990402462115096320525964642433602",
    "token1": "intel.tkn.near",
    "token1_in_1_token0": "7.0861270359430119940540910523880472472289861766291330489235503867094510800393592960583712607916823000"
}
```

> **Note:** The `token0_in_1_token1` and `token1_in_1_token0` fields are the prices of the tokens
> represented in each other. In this example, 1e-24 `wrap.near` is 7.08e-18 `intel.tkn.near`. The
> prices are returned in the smallest units, so you have to multiply them by `decimals` of the tokens
> to get the actual price.

#### `price_token`

Fired approximately every 1-15 seconds for each token if its price has changed (even if the quote asset has changed its price but no transaction with the token itself), and for every transaction if a token price has been directly changed in the transaction (e.g. swap with a token). Contains the price in USD.

Supported on mainnet: `true`

Supported on testnet: `false`

Filter example:

```json
{
  "token_id": "intel.tkn.near"
}
```

Event example:

```json
{
    "block_height": 121767590,
    "price_usd": "0.000000000000000000725934599566688178154430559644496275286926587422741890483931756491220464591700420166872749357465442482340378420589190670546147210441475250700963751404872994918040671056934546797384694859981687145025",
    "timestamp_nanosec": "1719090911919325000",
    "token": "intel.tkn.near"
}
```

> **Note:** The `price_usd` field is the price of the token in USDt. The price is returned in the
> smallest units, so you have to multiply it by `decimals` and divide by USDt's `decimals` (`6`)
> to get the actual price.

### SocialDB

Indexed by [`socialdb-indexer`](https://github.com/INTEARnear/socialdb-indexer).

#### `socialdb_index`

More about SocialDB index events [here](https://github.com/NearSocial/standards/blob/8713aed325226db5cf97ab9744ba78b561cc377b/types/index/Index.md).

Supported on mainnet: `true`

Supported on testnet: `false`

Filter example:

```json
{
  "account_id": "slimedragon.near",
  "index_type": "like",
  "index_key": "slimedrgn.tg",
  "index_value": {
    // Exact value of the event
  }
}
```

> **Note:** `account_id` is the account that triggered the event, and `index_key` is any JSON primitive.
> Usually it's just a string containing someone's account ID, but sometimes it can be an arbitrary string
> (`"NEARDevHub"`) or a JSON object (`{"type":"social","path":"slimedragon.near/widget/MyTokens"}` for
> widget star events).

Event example:

```json
{
    "account_id": "euro1967.near",
    "block_height": 124136096,
    "block_timestamp_nanosec": "1721811611086520000",
    "index_key": "nearbrasil.near",
    "index_type": "notify",
    "index_value": {
        "item": {
            "blockHeight": 124093824,
            "path": "nearbrasil.near/post/main",
            "type": "social"
        },
        "type": "like"
    },
    "receipt_id": "4qfnJjn3nA4YEpsMVfMzEgMeXEED9AvxYDCPKhACezc2",
    "transaction_id": "4nV4JiM9cUaUJ4Y7UY3KTNiHzwB5qgmYXJHEQwE4JdjE"
}
```

### Trade

Indexed by [`trade-indexer`](https://github.com/INTEARnear/trade-indexer).

#### `trade_pool`

Fired for each pool a trade goes through. For example, if someone exchanges `USDT -> USDC -> NEAR`, this event will be fired twice, for `USDT -> USDC` and `USDC -> NEAR`.

Supported on mainnet: `true`

Supported on testnet: `false`

Filter example:

```json
{
  "pool_id": "REF-4663",
  "trader_account_id": "slimedragon.near",
}
```

Event example:

```json
{
    "amount_in": "590500000000000000",
    "amount_out": "205595628990574354388667",
    "block_height": 118532904,
    "block_timestamp_nanosec": "1715206878053766000",
    "pool": "REF-4528",
    "receipt_id": "2su8zkexexHyfTzrWXWy8pPhoSUNsiBEmvVhDR21CrSX",
    "token_in": "438e48ed4ce6beecf503d43b9dbd3c30d516e7fd.factory.bridge.near",
    "token_out": "wrap.near",
    "trader": "muhams06.tg",
    "transaction_id": "4udHSmgoLiR4LxSoTfREPFiqNb5itopHyk5Z5oAxhU6Y"
}
```

#### `trade_pool_change`

Fired when a DEX pool changes. For example, when someone exchanges tokens, adds or removes liquidity, or when fee is changed. The behavior is different for each pool, but it's pretty much guaranteed that 2 consecutive events will have different data.

Supported on mainnet: `true`

Supported on testnet: `false`

Filter example:

```json
{
  "pool_id": "REF-4663",
}
```

Event example:

```json
{
    "block_height": 118534310,
    "block_timestamp_nanosec": "1715208645742472000",
    "pool": {
        "Ref": {
            "SimplePool": {
                "amounts": [
                    "https://github.com/INTEARnear/log-indexer3763291308863591537433666722",
                    "16720985987503673017748084113"
                ],
                "exchange_fee": 0,
                "referral_fee": 0,
                "shares_total_supply": "1037156190898767482872151",
                "token_account_ids": [
                    "wrap.near",
                    "intel.tkn.near"
                ],
                "total_fee": 100,
                "volumes": [
                    {
                        "input": "31414111565383646112652781298",
                        "output": "271307865818294592226811576515"
                    },
                    {
                        "input": "187676207214295505041484206659",
                        "output": "28218417708838038210936894379"
                    }
                ]
            }
        }
    },
    "pool_id": "REF-4663",
    "receipt_id": "M6hKmJ4F1iH9JUmV3G2hNg7wswYtoVpnmQP6bkEG5w9"
}
```

> **Note:** The `pool` field is a JSON object that contains the pool data. The exact structure
> is different for each DEX and pool type (for eaxmple, Ref has simple pools for most tokens,
> and pools like StableSwap or RatedSwap for more specific use cases).

#### `trade_swap`

Fired when someone exchanges tokens. 1 trade = 1 event, even if it goes through multiple pools. This event is a net result of all sub-trades, and only includes the net balance changes of different tokens. If a trade involves a token but net change is 0 (for example, `USDT -> USDC -> NEAR`, all received USDC is exchanged for NEAR, so it's not included in the event). That means trades made by arbitrage bots will mostly have positive NEAR balance and no other tokens.

Supported on mainnet: `true`

Supported on testnet: `false`

Filter example:

```json
{
  "trader_account_id": "slimedragon.near",
  "involved_token_account_ids": ["wrap.near", "intel.tkn.near"],
}
```

> **Note:** The `involved_token_account_ids` field is a list of token account IDs that are
> involved in the trade. The exact filtering logic is
> ```rs
> if let Some(involved_token_account_ids) = &self.involved_token_account_ids {
>     for token_account_id in involved_token_account_ids {
>         if !event.balance_changes.contains_key(token_account_id) {
>             return false;
>         }
>     }
> }

Event example:

```json
{
    "balance_changes": {
        "intel.tkn.near": "24541924589951464825715754",
        "wrap.near": "-5571247163705000000000000"
    },
    "block_height": 118534310,
    "block_timestamp_nanosec": "1715208645742472000",
    "receipt_id": "M6hKmJ4F1iH9JUmV3G2hNg7wswYtoVpnmQP6bkEG5w9",
    "trader": "harooni007.tg",
    "transaction_id": "9nAj55jhDmcmB2oCn7gbSZKiztTRYsPvR1s2fz84Xxu9"
}
```

### Contract Logs

Indexed by [`log-indexer`](https://github.com/INTEARnear/log-indexer).

#### `log_text`

All logs produced by smart contracts.

Supported on mainnet: `true`

Supported on testnet: `true`

Filter example:

```json
{
    "account_id": "intel.tkn.near",
    "predecessor_id": "slimedragon.near",
    "text": "Minted 1000 tokens",
    "text_starts_with": "Minted ",
    "text_ends_with": " tokens",
    "text_contains": "tokens",
}
```

Event example:

```json
{
    "account_id": "game.hot.tg",
    "block_height": 124766310,
    "block_timestamp_nanosec": "1722521008924147927",
    "log_text": "EVENT_JSON:{\"standard\":\"nep141\",\"version\":\"1.0.0\",\"event\":\"ft_mint\",\"data\":[{\"owner_id\":\"razantio.tg\",\"amount\":\"59801\"}]}",
    "predecessor_id": "ibra31ammar.tg",
    "receipt_id": "2db2GHn4axMqA8fwR42z7UdyiSdyZiDsP4stkFwuFmnH",
    "transaction_id": "6uHDr58NnvRy7kEbG4irTkio13o5zyH8Sf77c6MGy7rs"
}
```

#### `log_nep297`

All [NEP-297](https://nomicon.io/Standards/EventsFormat) events produced by smart contracts.

Supported on mainnet: `true`

Supported on testnet: `true`

Filter example:

```json
{
    "account_id": "intel.tkn.near",
    "predecessor_id": "slimedragon.near",
    "event_standard": "nep141",
    "event_version": "^1.0",
    "event_event": "ft_transfer"
}
```

Event example:

```json
{
    "account_id": "earn.kaiching",
    "block_height": 124766422,
    "block_timestamp_nanosec": "1722521135460598891",
    "event_data": [
        {
            "amount": "1388",
            "memo": "sws:359cd0ba631ec0d0807530f911725d23143d89ec7e2f651add8d18e616f53429",
            "reward_id": "T-3e8c7-6wp2w-2024-08-01"
        }
    ],
    "event_event": "ft_lockup_claim_lockup",
    "event_standard": "rewards-lockup",
    "event_version": "1.0.0",
    "predecessor_id": "earn.kaiching",
    "receipt_id": "4YzHBiNwiV1UicGZt6w7fNuW8UipbEzqu1MR1eT4u7aF",
    "transaction_id": "EfwjuU9m8Phrx77gNM7AJaR3wHsKk1zpLxi9DmtBGjxT"
}
```
