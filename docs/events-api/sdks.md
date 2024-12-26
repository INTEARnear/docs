---
sidebar_position: 1
title: Rust and TypeScript SDKs
---

# Rust SDK

To use the realtime WebSocket Events API, use [inevents-websocket-client](https://crates.io/crates/inevents-websocket-client) crate.

Example usage: [here](https://github.com/INTEARnear/oracle/blob/7dfbcee2021ed11f306b6d38d1fb56789f80a175/crates/dashboard-backend/src/main.rs#L170-L222)

# TypeScript SDK

<br/>

Install [@intear/inevents-websocket-client](https://www.npmjs.com/package/@intear/inevents-websocket-client) package, and use it in either Node.js or in browser.

Example usage: [here](https://github.com/INTEARnear/oracle/blob/7dfbcee2021ed11f306b6d38d1fb56789f80a175/crates/dashboard-frontend/api/oracles.ts#L61-L128)

The SDK doesn't include types for the events, as in the future you'll be able to create your own events, but includes types for filtering.
