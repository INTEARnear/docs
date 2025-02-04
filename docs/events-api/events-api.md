---
sidebar_position: 1
title: Realtime Events API
---

import WebSocketTester from '../../src/components/WebSocketTester'

# Realtime WebSocket Events API Documentation

You can subscribe to realtime events from the WebSocket API by connecting to `wss://ws-events-v3.intear.tech/events/<event_name>` and sending a filter object.

For testnet, use `wss://ws-events-v3-testnet.intear.tech/events/<event_name>`. Potlock and SocialDB events are not available on testnet.

<WebSocketTester url="wss://ws-events-v3.intear.tech/events/ft_transfer" startingFilter={{"And":[{"path":"token_id","operator":{"Equals":"wrap.near"}}]}} text="Try it out!" />

## Event Names

- `aurora_transaction` - a transaction on Aurora caused by an Aurora account (doesn't index cross-chain transactions from NEAR yet)
- `block_info` - Some information about each block
- `ft_burn` - A token was burned
- `ft_mint` - A token was minted
- `ft_transfer` - A token was transferred
- `liquidity_pool` - Liquidity was added or removed from a pool
- `log_nep297` - A NEP-297 event (`EVENT_JSON:{...}`)
- `log_text` - A raw text log event
- `newtoken_nep141` - A new NEP-141 (FT) token was created
- `newtoken_nep171` - A new NEP-171 (NFT) token was created
- `nft_burn` - An NFT was burned
- `nft_mint` - An NFT was minted
- `nft_transfer` - An NFT was transferred
- `potlock_donation` - A donation was made to a project
- `potlock_pot_donation` - A donation was made to a pot
- `potlock_pot_project_donation` - A donation was made to a potlock project in a pot
- `price_token` - A token price changed
- `socialdb_index` - Something happened on SocialDB (notifications, etc.)
- `trade_pool` - For each trade in a pool. For example, if the trade is USDC -> USDT -> NEAR, there will be 2 events for both `->` arrows
- `trade_pool_change` - A pool has changed. Maybe liquidity was added or removed, or a trade was made that changed liquidity ratio, or something else. Also fired when a pool is created.
- `trade_swap` - For each *real* swap. For example, if the trade is USDC -> USDT -> NEAR, there will be 1 event with balance changes for USDC and NEAR.
- `tx_receipt` - A receipt
- `tx_transaction` - A transaction

## Custom Events

You can't add custom events to the API right now, but it will be possible in the future with the release of Rainy.

<WebSocketTester url="wss://ws-events-v3.intear.tech/events/tx_transaction" startingFilter={{"And":[{"path":"receiver_id","operator":{"Equals":"v2.ref-finance.near"}}]}} text="Try filtering transactions" />

## Filter Structure

A filter object consists of two main components:
- `path`: A string that specifies the JSON path to the field you want to filter on
- `operator`: An object that defines the filtering operation

Basic filter structure:
```json
{
  "path": "data.user_age",
  "operator": {
    "GreaterThan": 21
  }
}
```

## Path Syntax

The path uses dot notation to traverse the JSON object structure:

- Use dots (`.`) to access nested fields: `"data.user.age"`
- Use array indexing with square brackets: `"tokens[0]"`
- Use `.` to reference the root object when using logical operators
- Complex paths can combine both: `"data.users[0].account_id"`

## Available Operators

### Numeric Operators
```json
{"GreaterThan": 100}
{"LessThan": 100}
{"GreaterOrEqual": 100}
{"LessOrEqual": 100}
```
These operators expect numeric values and will return a type mismatch error if used with non-numeric fields.

### Equality Operators
```json
{"Equals": <any-json-value>}
{"NotEqual": <any-json-value>}
```
These operators can compare any JSON values.

### String Operators
```json
{"StartsWith": "prefix"}
{"EndsWith": "suffix"}
{"Contains": "substring"}
```
These operators expect string values and will return a type mismatch error if used with non-string fields.

### Array Operators
```json
{"ArrayContains": <any-json-value>}
```
Checks if an array contains the specified value. Requires the target field to be an array.

### Object Operators
```json
{"HasKey": "field_name"}
```
Checks if an object has the specified key. Requires the target field to be an object.

### Logical Operators
```json
{
  "path": ".",
  "operator": {
    "And": [
      {
        "path": "age",
        "operator": {"GreaterThan": 21}
      },
      {
        "path": "status",
        "operator": {"Equals": "active"}
      }
    ]
  }
}
```

## Examples

### Filter for Shitzu LP lockup events on Ref (`log_nep297`)
```json
{
  "And": [
    {
        "path": "event_standard",
        "operator": {
            "Equals": "token-locker"
        }
    },
    {
        "path": "event_event",
        "operator": {
            "Equals": "locked_token"
        }
    },
    {
        "path": "data.token_id",
        "operator": {
            "Equals": "token.0xshitzu.near"
        }
    },
    {
        "path": "account_id",
        "operator": {
            "Equals": "token-locker.ref-labs.near"
        }
    }
  ]
}
```

### Filter for when Shitzu is added or removed from a liquidity pool (`liquidity_pool`)
```json
{
  "And": [
    {
        "path": "tokens",
        "operator": {
            "HasKey": "token.0xshitzu.near"
        }
    }
  ]
}
```

### Transfers of tokens on meme.cooking (`ft_transfer`, but can also be implemented with `log_nep297` with standard `nep141`)
```json
{
  "And": [
    {
        "path": "token_id",
        "operator": {
            "EndsWith": ".meme-cooking.near"
        }
    }
  ]
}
```

### Empty filter that matches all events
```json
{"And": []}
```

<WebSocketTester url="wss://ws-events-v3.intear.tech/events/log_nep297" startingFilter={{"And":[]}} text="Try with NEP-297 events" />

## Usage Notes

1. Filters can be updated by sending a new filter object through the WebSocket connection
2. All string comparisons are case-sensitive
3. Numeric comparisons use 64-bit floating-point precision
4. When using logical operators (`And`/`Or`), you would usually want to set the path to "." and provide an array of sub-filters
5. Array indices are zero-based
6. The filter is evaluated against each event before it is sent to the client
7. The messages contain an array of events, not just one event. The events are grouped by block.

## The old (v2) Events API

Different filters (they're hardcoded), not grouped by block, different endpoint.

<WebSocketTester url="wss://ws-events.intear.tech/events/log_nep297" startingFilter={{"version_match":"^1.0.0", "standard":"nep141"}} text="Logs" />
