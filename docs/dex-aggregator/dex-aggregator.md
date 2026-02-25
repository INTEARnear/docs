---
sidebar_position: 1
title: DEX Aggregator
---

# DEX Aggregator API

The Intear DEX Aggregator provides optimal trading routes across multiple decentralized exchanges on the NEAR blockchain, ensuring users get the best prices with minimal slippage.

The main API endpoint is available at: `https://router.intear.tech/route`

This service is currently not supported on testnet.

## Supported DEXs

The aggregator currently integrates with the following decentralized exchanges:

- **Rhea** & **RheaDcl** - AMM DEX at [dex.rhea.finance](https://dex.rhea.finance/)
- **Intear Plach** - AMM DEX at [dex.intea.rs](https://dex.intea.rs). Early alpha, launched mid February 2026. Not to confuse with Intear DEX, the synchronous engine for multiple DEXes to live in a single contract.
- **NearIntents** - Sometimes-guaranteed-quote DEX & Bridge at [app.near-intents.org](https://app.near-intents.org/). Has poor liquidity and long wait times, so not recommended unless no other route is found
- **Aidols** - Bonding-curve launchpad at [aidols.bot](https://aidols.bot/)
- **Wrap** - Wrap tokens directly, such as NEAR↔wNEAR, token↔rhea:token
- **MetaPool**, **Linear**, **RNear** & **XRhea** - Liquid stake & unstake (if liquid unstake is supported by the protocol)

## Getting Routes

### Route Request

Get the best route for a token swap:

```
GET https://router.intear.tech/route?token_in=near&token_out=nep141:17208628f84f5d6ad33f0da3bbbeb27ffcb398eac501a31bd6ad2011e36133a1&amount_in=100000000000000000000000&max_wait_ms=2000&slippage_type=Fixed&slippage=0.01&dexes=Rhea,Aidols,Wrap,RheaDcl,MetaPool,Linear,XRhea,RNear,Plach&trader_account_id=slimedragon.near&signing_public_key=ed25519:HDXaKmewwTBHp87V8tCZWqDkgMLbJ7Eb3jifMC38r2kw&referrer_id=intear.near
```

**Parameters:**

- `token_in` - Token to swap from (`near` for NEAR, or contract ID for NEP-141 tokens)
- `token_out` - Token to swap to (`near` for NEAR, or contract ID for NEP-141 tokens)
- `amount_in` OR `amount_out` - Amount to swap (in token's smallest unit)
- `max_wait_ms` - Maximum wait time in milliseconds (up to 60000ms). Some DEXes like Near Intents can benefit from a longer wait time to get a better quote
- `slippage_type` - Either `Auto` or `Fixed`
  - For `Auto`: also provide `max_slippage` and `min_slippage`
  - For `Fixed`: also provide `slippage`
- `slippage` / `max_slippage` / `min_slippage` - Slippage as decimal (e.g., 0.01 = 1%)
- `dexes` (optional) - Comma-separated list of DEX IDs to use. If empty, all available exchanges will be used
- `trader_account_id` (optional) - Account ID for storage deposit actions
- `signing_public_key` (optional) - Public key for NEAR Intents signing (it requires `add_public_key` transaction)
- `referrer_id` (optional) - Acconut ID of the referrer, which can be used by some DEXes for either tracking or fee sharing

**Token ID Format:**
- NEAR: `near`
- NEP-141 tokens: Contract account ID (e.g., `usdt.tether-token.near`) or explicit definition (`nep141:usdt.tether-token.near`)
- NEP-141 tokens on Rhea inner balance: `rhea-nep141: usdt.tether-token.near`

### Route Response

The API returns a `Route` object with the following structure:

```json
[
  {
    "deadline": null,
    "has_slippage": true,
    "estimated_amount": {
      "amount_out": "102743"
    },
    "worst_case_amount": {
      "amount_out": "101714"
    },
    "dex_id": "Rhea",
    "execution_instructions": [
      {
        "NearTransaction": {
          "receiver_id": "wrap.near",
          "actions": [
            {
              "FunctionCall": {
                "method_name": "near_deposit",
                "args": "e30=",
                "gas": 2000000000000,
                "deposit": "100000000000000000000000"
              }
            },
            {
              "FunctionCall": {
                "method_name": "ft_transfer_call",
                "args": "eyJhbW91bnQiOiIxMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAiLCJtc2ciOiJ7XCJhY3Rpb25zXCI6W3tcImFtb3VudF9pblwiOlwiNTcwMDAwMDAwMDAwMDAwMDAwMDAwMDBcIixcImFtb3VudF9vdXRcIjpcIjBcIixcIm1pbl9hbW91bnRfb3V0XCI6XCIwXCIsXCJwb29sX2lkXCI6Mzg3OSxcInRva2VuX2luXCI6XCJ3cmFwLm5lYXJcIixcInRva2VuX291dFwiOlwidXNkdC50ZXRoZXItdG9rZW4ubmVhclwifSx7XCJhbW91bnRfb3V0XCI6XCIwXCIsXCJtaW5fYW1vdW50X291dFwiOlwiMFwiLFwicG9vbF9pZFwiOjU1MTYsXCJ0b2tlbl9pblwiOlwidXNkdC50ZXRoZXItdG9rZW4ubmVhclwiLFwidG9rZW5fb3V0XCI6XCJhMGI4Njk5MWM2MjE4YjM2YzFkMTlkNGEyZTllYjBjZTM2MDZlYjQ4LmZhY3RvcnkuYnJpZGdlLm5lYXJcIn0se1wiYW1vdW50X291dFwiOlwiMFwiLFwibWluX2Ftb3VudF9vdXRcIjpcIjBcIixcInBvb2xfaWRcIjo0NzEzLFwidG9rZW5faW5cIjpcImEwYjg2OTkxYzYyMThiMzZjMWQxOWQ0YTJlOWViMGNlMzYwNmViNDguZmFjdG9yeS5icmlkZ2UubmVhclwiLFwidG9rZW5fb3V0XCI6XCI0MzhlNDhlZDRjZTZiZWVjZjUwM2Q0M2I5ZGJkM2MzMGQ1MTZlN2ZkLmZhY3RvcnkuYnJpZGdlLm5lYXJcIn0se1wiYW1vdW50X291dFwiOlwiMFwiLFwibWluX2Ftb3VudF9vdXRcIjpcIjU4MDI5XCIsXCJwb29sX2lkXCI6NTExOCxcInRva2VuX2luXCI6XCI0MzhlNDhlZDRjZTZiZWVjZjUwM2Q0M2I5ZGJkM2MzMGQ1MTZlN2ZkLmZhY3RvcnkuYnJpZGdlLm5lYXJcIixcInRva2VuX291dFwiOlwiMTcyMDg2MjhmODRmNWQ2YWQzM2YwZGEzYmJiZWIyN2ZmY2IzOThlYWM1MDFhMzFiZDZhZDIwMTFlMzYxMzNhMVwifSx7XCJhbW91bnRfaW5cIjpcIjQzMDAwMDAwMDAwMDAwMDAwMDAwMDAwXCIsXCJhbW91bnRfb3V0XCI6XCIwXCIsXCJtaW5fYW1vdW50X291dFwiOlwiMFwiLFwicG9vbF9pZFwiOjQ1MjUsXCJ0b2tlbl9pblwiOlwid3JhcC5uZWFyXCIsXCJ0b2tlbl9vdXRcIjpcIjg1M2Q5NTVhY2VmODIyZGIwNThlYjg1MDU5MTFlZDc3ZjE3NWI5OWUuZmFjdG9yeS5icmlkZ2UubmVhclwifSx7XCJhbW91bnRfb3V0XCI6XCIwXCIsXCJtaW5fYW1vdW50X291dFwiOlwiMFwiLFwicG9vbF9pZFwiOjQ2OTQsXCJ0b2tlbl9pblwiOlwiODUzZDk1NWFjZWY4MjJkYjA1OGViODUwNTkxMWVkNzdmMTc1Yjk5ZS5mYWN0b3J5LmJyaWRnZS5uZWFyXCIsXCJ0b2tlbl9vdXRcIjpcIjQzOGU0OGVkNGNlNmJlZWNmNTAzZDQzYjlkYmQzYzMwZDUxNmU3ZmQuZmFjdG9yeS5icmlkZ2UubmVhclwifSx7XCJhbW91bnRfb3V0XCI6XCIwXCIsXCJtaW5fYW1vdW50X291dFwiOlwiNDM2ODVcIixcInBvb2xfaWRcIjo1MTE4LFwidG9rZW5faW5cIjpcIjQzOGU0OGVkNGNlNmJlZWNmNTAzZDQzYjlkYmQzYzMwZDUxNmU3ZmQuZmFjdG9yeS5icmlkZ2UubmVhclwiLFwidG9rZW5fb3V0XCI6XCIxNzIwODYyOGY4NGY1ZDZhZDMzZjBkYTNiYmJlYjI3ZmZjYjM5OGVhYzUwMWEzMWJkNmFkMjAxMWUzNjEzM2ExXCJ9XSxcImZvcmNlXCI6MCxcInJlZmVycmFsX2lkXCI6XCJkZXgtYWdncmVnYXRvci5pbnRlYXIubmVhclwiLFwic2tpcF9kZWdlbl9wcmljZV9zeW5jXCI6dHJ1ZSxcInNraXBfdW53cmFwX25lYXJcIjp0cnVlfSIsInJlY2VpdmVyX2lkIjoidjIucmVmLWZpbmFuY2UubmVhciJ9",
                "gas": 150000000000000,
                "deposit": "1"
              }
            }
          ]
        }
      }
    ],
    "token_output": "nep141:17208628f84f5d6ad33f0da3bbbeb27ffcb398eac501a31bd6ad2011e36133a1"
  },
  {
    "deadline": null,
    "has_slippage": true,
    "estimated_amount": {
      "amount_out": "101491"
    },
    "worst_case_amount": {
      "amount_out": "100476"
    },
    "dex_id": "RheaDcl",
    "execution_instructions": [
      {
        "NearTransaction": {
          "receiver_id": "wrap.near",
          "actions": [
            {
              "FunctionCall": {
                "method_name": "near_deposit",
                "args": "e30=",
                "gas": 2000000000000,
                "deposit": "100000000000000000000000"
              }
            },
            {
              "FunctionCall": {
                "method_name": "ft_transfer_call",
                "args": "eyJhbW91bnQiOiIxMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAiLCJtc2ciOiJ7XCJTd2FwXCI6e1wibWluX291dHB1dF9hbW91bnRcIjpcIjEwMDQ3NlwiLFwib3V0cHV0X3Rva2VuXCI6XCIxNzIwODYyOGY4NGY1ZDZhZDMzZjBkYTNiYmJlYjI3ZmZjYjM5OGVhYzUwMWEzMWJkNmFkMjAxMWUzNjEzM2ExXCIsXCJwb29sX2lkc1wiOltcIjE3MjA4NjI4Zjg0ZjVkNmFkMzNmMGRhM2JiYmViMjdmZmNiMzk4ZWFjNTAxYTMxYmQ2YWQyMDExZTM2MTMzYTF8d3JhcC5uZWFyfDEwMFwiXSxcInNraXBfdW53cmFwX25lYXJcIjp0cnVlfX0iLCJyZWNlaXZlcl9pZCI6ImRjbHYyLnJlZi1sYWJzLm5lYXIifQ==",
                "gas": 100000000000000,
                "deposit": "1"
              }
            }
          ]
        }
      }
    ],
    "token_output": "nep141:17208628f84f5d6ad33f0da3bbbeb27ffcb398eac501a31bd6ad2011e36133a1"
  },
  {
    "deadline": null,
    "has_slippage": true,
    "estimated_amount": {
      "amount_out": "101148"
    },
    "worst_case_amount": {
      "amount_out": "100136"
    },
    "dex_id": "Plach",
    "execution_instructions": [
      {
        "NearTransaction": {
          "receiver_id": "dex.intear.near",
          "actions": [
            {
              "FunctionCall": {
                "method_name": "deposit_near",
                "args": "eyJvcGVyYXRpb25zIjp7Im9wZXJhdGlvbnMiOlt7IlN3YXBTaW1wbGUiOnsiYW1vdW50Ijp7IkFtb3VudCI6eyJFeGFjdEluIjoiMTAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwIn19LCJhc3NldF9pbiI6Im5lYXIiLCJhc3NldF9vdXQiOiJuZXAxNDE6MTcyMDg2MjhmODRmNWQ2YWQzM2YwZGEzYmJiZWIyN2ZmY2IzOThlYWM1MDFhMzFiZDZhZDIwMTFlMzYxMzNhMSIsImNvbnN0cmFpbnQiOiIxMDAxMzYiLCJkZXhfaWQiOiJzbGltZWRyYWdvbi5uZWFyL3h5ayIsIm1lc3NhZ2UiOiJHQUFBQUE9PSJ9fSx7IldpdGhkcmF3Ijp7ImFtb3VudCI6eyJGdWxsIjp7ImF0X2xlYXN0IjoiMTAwMTM2In19LCJhc3NldF9pZCI6Im5lcDE0MToxNzIwODYyOGY4NGY1ZDZhZDMzZjBkYTNiYmJlYjI3ZmZjYjM5OGVhYzUwMWEzMWJkNmFkMjAxMWUzNjEzM2ExIiwicmVzY3VlX2FkZHJlc3MiOm51bGwsInRvIjpudWxsfX1dLCJyZWZlcnJlciI6ImRleC1hZ2dyZWdhdG9yLmludGVhci5uZWFyIn19",
                "gas": 280000000000000,
                "deposit": "100000000000000000000000"
              }
            }
          ]
        }
      }
    ],
    "token_output": "nep141:17208628f84f5d6ad33f0da3bbbeb27ffcb398eac501a31bd6ad2011e36133a1"
  }
]
```

**Response Fields:**

- `deadline` - Route expiration time (refresh 2-3 seconds before)
- `has_slippage` - Whether the route includes slippage (AMM vs guaranteed quote)
- `estimated_amount` - Expected swap amount
- `worst_case_amount` - Minimum guaranteed amount with slippage
- `dex_id` - Which DEX provided this route
- `execution_instructions` - Array of instructions to execute the swap
- `token_output` - The output token of this route. Can be different from your specified `token_out` if there's a need for a two-step conversion

## Execution Instructions

Routes contain execution instructions that must be processed sequentially:

### NEAR Transaction

```json
{
  "NearTransaction": {
    "receiver_id": "v2.ref-finance.near",
    "actions": [
      {
        "FunctionCall": {
          "method_name": "ft_transfer_call",
          "args": "base64-encoded-args",
          "gas": "30000000000000",
          "deposit": "1"
        }
      }
    ],
    "continue_if_failed": false
  }
}
```

Execute this as a standard NEAR transaction with the specified receiver and actions.

### NEAR Intents Quote (Advanced)

```json
{
  "IntentsQuote": {
    "message_to_sign": "{...}",
    "quote_hash": "quote-hash"
  }
}
```

For NEAR Intents, sign the NEP-413 message and send it to:
```
POST https://solver-relay-v2.chaindefuser.com/rpc
```

See [NEAR Intents documentation](https://docs.near-intents.org/near-intents/market-makers/bus/solver-relay) for more details and examples.

## Amount Types

The API supports two swap modes:

### Amount In (Most Common)
Specify the input amount, get the estimated output:
```
amount_in=1000000000000000000000000
```

### Amount Out
Specify the desired output amount, get the required input:
```
amount_out=4250000
```

*Note: Rhea doesn't support AmountOut mode, in that case there might be less routes returned*

## Slippage Configuration

### Auto Slippage
```
slippage_type=Auto&max_slippage=0.05&min_slippage=0.001
```
Automatically determines optimal slippage based on market conditions.

### Fixed Slippage
```
slippage_type=Fixed&slippage=0.01
```
Uses a fixed slippage percentage (1% in this example).

## DEX Capabilities

| DEX | Amount In | Amount Out | Special Notes |
|-----|-----------|------------|---------------|
| Rhea | ✅ | ❌ | AMM with slippage |
| RheaDcl | ✅ | ✅ | AMM with slippage |
| Plach | ✅ | ✅ | AMM with slippage |
| NearIntents | ✅ | ✅ | Request-for-quote, no slippage |
| Aidols | ✅ | ✅ | Only `*.aidols.near` tokens |
| Wrap | ✅ | ✅ | NEAR ↔ wNEAR only |
| MetaPool | ✅ | ✅ | NEAR ↔ STNEAR only |
| Linear | ✅ | ✅ | NEAR ↔ LiNEAR only |
| XRhea | ✅ | ✅ | RHEA ↔ XRHEA only |
| RNear | ✅ | ✅ | NEAR ↔ rNEAR only |

## What is handled and what is not

If you choose `near` as input / output asset, wrapping / unwrapping will be handled by the API, all wrap / unwrap / storage_deposit / add_public_key (for Intents) / register_assets (for Intear DEX) / other required methods will be included in the response, as long as the necessary data is there (make sure to include optional fields such as `trader_account_id` to have these calls included in the response).

For more information, read [dex-aggregator's README](https://github.com/INTEARnear/dex-aggregator/blob/main/README.md)

## Referral fees

If you specify `referrer_id=`, you may be eligible for receiving fees. Here's how to set it up for each DEX that supports referral fees:

- Rhea (not DCL): Manual approval from Rhea team is needed for receiving 20% of protocol fees (protocol fee is 20% of pool fees). For $1,000,000 volume in a pool with 0.3% fees, you will get around $120 in referral fees, as shares in the liquidity pool. Without manual approval it can still be used for tracking with [Events API](https://docs.intear.tech/docs/events-api/), referral field in the events is extracted regardless of whether the referrer is approved (receives fees) or not
- Aidols: No manual approval needed, fee is sent to the recipient as wNEAR on every trade. Make sure you have a storage deposit on `wrap.near`, otherwise fees will be lost. The amount is equal to 1% of the protocol fee, where protocol fee is max(0.01 NEAR, 1% of trade volume). For $1,000,000 volume you'll get around $100 (or more, if you have a lot of smaller trades where 0.01 NEAR minimum fee is applied)
- NearIntents: No fees (yet), but can be used for tracking via intents dashboards (not with Intear Events API; intear token-diffs are not considered trades by Events API). Can be easily added as a PR to [dex-aggregator repo](https://github.com/INTEARnear/dex-aggregator), but we're considering removing NearIntents support
- Plach: Can be used for tracking with no setup, or can be used to charge a configurable amount of fee up to 5%. You can configure fees using [manage CLI](https://github.com/INTEARnear/dex/tree/main/manage) with commands `manage xyk referrers set-settings intear.near 10000 1000` (sets fee to 10000 = 1% for all assets, and 1000 = 0.1% for pairs of both stable assets). Fee can be different for 'stable' class of assets, which include NEAR, wNEAR, stablecoins, and other stable tokens. The list of stable assets will change, and is up to Intear to decide. The fee goes to your Plach fees account, so make sure to register all assets you expect to receive, otherwise the fee is not charged. The fee is usually charged from the input token, with an exception of Launch pools, where the fee is always converted to NEAR. To register tokens, run `manage xyk referrers register-fee-assets intear.near nep141:wrap.near near nep141:usdt.tether-token.near` with the list of assets to register.

Currently, the quote does not account for referral fees when calculating expected / worst-case amounts for routes. You can add a special case for Plach, since other DEXes pay out referral fees from their own protocol fee, which is predictable, unlike Plach where it's configurable. Once the referral fee calculation is implemented, there will be a new field in the request to enable this, so it's safe to rely on the current behavior and expect no breaking changes.
