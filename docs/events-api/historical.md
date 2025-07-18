---
sidebar_position: 3
title: Historical API
---

> Note: This is a beta feature and may not be fully stable.

## How to use

It's a simple HTTP request:

```js
await fetch('https://events-v3.intear.tech/v3/trade_swap/by_trader_newest?trader=slimedragon.near')
  .then(res => res.json())
```

Example response:

```json
[
  {
    "balance_changes": {
      "sinners-1137.meme-cooking.near": "-23301061363321800475880930591",
      "wrap.near": "3337620340721084724988070"
    },
    "block_height": 136919882,
    "block_timestamp_nanosec": "1736386015266755000",
    "receipt_id": "4Y12myPf7hbXpxe9utzMdFN18w54HViWU23n5nesYdVo",
    "trader": "slimedragon.near",
    "transaction_id": "B5zu5rQcYPSNRNR3ghCwkfpLFvh4rKtaVhXnnEC3twM9"
  },
  ...
]
```

> Note 2: Our database has not been fully backfilled yet, so some older data may not be available.

For testnet, use `https://events-v3-testnet.intear.tech/v3/trade_swap/by_trader_newest?trader=slimeeeeeeeee.testnet`.

## Public API

This API server is public and free to use, but we recommend self-hosting [intear-events](https://github.com/INTEARnear/intear-events) or developing your own [inevents](https://github.com/INTEARnear/ienvents) server if you need more flexibility (custom events, higher rate limits, etc.), as well as reliability.

### Endpoints

- `https://events-v3.intear.tech/v3/trade_swap/by_token_newest?account=wrap.near`
- `https://events-v3.intear.tech/v3/trade_swap/by_token_oldest?account=wrap.near`
- `https://events-v3.intear.tech/v3/trade_swap/by_trader_newest?trader=slimedragon.near`
- `https://events-v3.intear.tech/v3/trade_swap/by_trader_oldest?trader=slimedragon.near`
- `https://events-v3.intear.tech/v3/trade_swap/latest`
- `https://events-v3.intear.tech/v3/trade_swap/oldest`
- `https://events-v3.intear.tech/v3/trade_swap/by_transaction?transaction_id=B5zu5rQcYPSNRNR3ghCwkfpLFvh4rKtaVhXnnEC3twM9`
- `https://events-v3.intear.tech/v3/log_nep297/by_standard_event_newest?standard=nep141&event=ft_mint`
- `https://events-v3.intear.tech/v3/log_nep297/by_standard_event_oldest?standard=nep141&event=ft_mint`
- `https://events-v3.intear.tech/v3/log_nep297/by_standard_event_account_newest?standard=nep141&event=ft_mint&account_id=game.hot.tg`
- `https://events-v3.intear.tech/v3/log_nep297/by_standard_event_account_oldest?standard=nep141&event=ft_mint&account_id=game.hot.tg`
- `https://events-v3.intear.tech/v3/log_nep297/by_standard_event_account_version_newest?standard=nep141&event=ft_mint&account_id=game.hot.tg&version=1.0.0`
- `https://events-v3.intear.tech/v3/log_nep297/by_standard_event_account_version_oldest?standard=nep141&event=ft_mint&account_id=game.hot.tg&version=1.0.0`
- `https://events-v3.intear.tech/v3/newtoken_nep141/newest`
- `https://events-v3.intear.tech/v3/newtoken_nep141/oldest`
- `https://events-v3.intear.tech/v3/newtoken_nep141/by_token_id?account_id=example.near`
- `https://events-v3.intear.tech/v3/newtoken_nep141/count`
- `https://events-v3.intear.tech/v3/price_token/latest_price?token=wrap.near`. Note: the price is for 1 yocto, in USDt, so to get the price of 1 NEAR, you need to multiply it by 1e24 (24 is decimals of NEAR) and divide by 1e6 (6 is decimals of USDt)
- `https://events-v3.intear.tech/v3/price_token/price_at_time?token=wrap.near&timestamp_nanosec=1736390058471470000`. Same note as above.
- `https://events-v3.intear.tech/v3/price_token/ohlc?token=wrap.near&resolution=1&count_back=100&to=1736384340000`. Note: Example TradingView implementation: https://github.com/INTEARnear/chart-tradingview
- `https://events-v3.intear.tech/v3/tx_transaction/by_hash?transaction_id=B5zu5rQcYPSNRNR3ghCwkfpLFvh4rKtaVhXnnEC3twM9`
- `https://events-v3.intear.tech/v3/tx_transaction/latest`
- `https://events-v3.intear.tech/v3/tx_transaction/oldest`
- `https://events-v3.intear.tech/v3/tx_transaction/by_signer_newest?signer_id=slimedragon.near`
- `https://events-v3.intear.tech/v3/tx_transaction/by_signer_oldest?signer_id=slimedragon.near`
- `https://events-v3.intear.tech/v3/tx_transaction/by_receiver_newest?receiver_id=v2.ref-finance.near`
- `https://events-v3.intear.tech/v3/tx_transaction/by_receiver_oldest?receiver_id=v2.ref-finance.near`
- `https://events-v3.intear.tech/v3/trade_swap/volume_1h?token_id=wrap.near`
- `https://events-v3.intear.tech/v3/trade_swap/volume_24h?token_id=wrap.near`
- `https://events-v3.intear.tech/v3/trade_swap/volume_7d?token_id=wrap.near`
- `https://events-v3.intear.tech/v3/trade_swap/volume_usd_1h?token_id=wrap.near`
- `https://events-v3.intear.tech/v3/trade_swap/volume_usd_24h?token_id=wrap.near`
- `https://events-v3.intear.tech/v3/trade_swap/volume_usd_7d?token_id=wrap.near`

All these endpoints are configured in [`intear-events/events/*.json`](https://github.com/INTEARnear/intear-events/tree/main/events) files, and are indexed in [`all-inexers`](https://github.com/inTEARnear/all-indexers) repo, so you can easily add your own endpoints or self-host the API, as long as you have Redis and Postgres running.

In the near future, you'll be able to set up everything in [Rainy](https://rainy.intear.tech) and have your own API server running in minutes, with custom events, or same events with different API endpoints, including pagination, aggregations, etc.
