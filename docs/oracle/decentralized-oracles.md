---
sidebar_position: 2
title: Building Decentralized Oracles
---

## How to build a decentralized oracle

In Intear Oracle, you can have a smart contract that can be used as a decentralized oracle that accepts responses from anyone, and validates them before sending them to the requester.

To do this, you need to create a smart contract that implements the `ProducerContract` trait, and you must call `set_send_callback` method to indicate that the Intear Oracle contract should notify your contract when a request is made, so you can save the request details directly in your contract.

Then, add a `submit` (or any other name) method that can be called by anyone, which validates the response, and if valid, calls `respond` method on Intear Oracle contract to send the response to the requester. For example, if you're building an IPFS oracle, you can validate if the file contents that the submitter submitted corresponds to the IPFS CID requested by the requester (it contains file hash, size, etc). You can also forward the fee received to the submitter.

Example: [here](https://github.com/INTEARnear/oracle/tree/main/crates/bitcoin-oracle)
