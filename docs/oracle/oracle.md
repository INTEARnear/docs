---
sidebar_position: 1
title: Oracle Marketplace
---

# Oracle

The Oracle contract is currently deployed on `dev-unaudited-v1.oracle.intear.near`.

To quickly try it out, use this command:

```bash
near contract call-function as-transaction dev-unaudited-v1.oracle.intear.near request json-args '{"producer_id":"gpt4o.oracle.intear.near","request_data":"Hello, GPT-4o!"}' prepaid-gas '100.0 Tgas' attached-deposit '0.001 NEAR' sign-as <account.near> network-config mainnet sign-with-keychain send
```

> Note: It will probably fail with 408 error (Timeout) because it uses yielded execution, which takes
> some time to complete, and doesn't return immediately. But it does return the result in the same
> transaction, so you can check the result in the transaction details on Nearblocks.

## Dashboard

The dashboard is currently deployed on [oracle.intear.tech](https://oracle.intear.tech).

You'll find instructions on how to use the oracles or create your own oracle there.
