---
sidebar_position: 1
title: Events API
---

import WebSocketTester from '../../src/components/WebSocketTester'

> Probably nothing.

<WebSocketTester url="wss://ws-events-v3-experimental.intear.tech/events/ft_transfer" startingFilter={{"And":[{"path":"token_id","operator":{"Equals":"wrap.near"}}]}} />
