---
sidebar_position: 1
title: Near AI Extensions
---

After we added Near AI agent support in Bettear Bot, we realized that the UX can be improved by adding a few more features. These extensions are backward compatible with the existing Near AI interface at app.near.ai, so implementing them won't break existing user interactions.

## 1. Welcome buttons

Add `buttons` field in the `welcome` object in `metadata.json`:

```json
{
  "category": "agent",
  "name": "inteartest",
  "version": "0.0.1",
  "description": "",
  "tags": [],
  "details": {
    "agent": {
      "defaults": {
        "model": "llama-v3p1-70b-instruct",
        "model_provider": "fireworks",
        "model_temperature": 1,
        "model_max_tokens": 16384
      },
      "welcome": {
        "title": "Test Agent",
        "description": "This is a test.",
        "buttons": [
          [
            "Gm",
            "Still Row 1"
          ],
          [
            "Row 2"
          ]
        ]
      },
      "framework": "web-agent"
    }
  },
  "show_entry": true
}
```

How it looks:

![Welcome buttons](https://i.imgur.com/FHHKK4O.png)

## 2. Buttons in messages

Add suggestions of how the user can reply to the agent's message. For example, in a staking agent, you can add buttons like "Stake more", "Stake 10 NEAR (amount that the user has)", "Unstake" etc.

Here's how to add it in the code:

```python
env.add_reply("""
              {
                "buttons": [
                  ["Simple Text", "Column 2 on row 1"],
                  [{"LongText":{"text_on_button":"Short","text_message":"Full message that will be sent to the agent. Can even be a JSON payload"}}],
                  [{"Url":{"text":"Claim free 1 NEAR","url":"https://youtube.com/watch?v=dQw4w9WgXcQ"}}]
                ]
              }
              """, message_type = "buttons")
env.add_reply("Welcome!")
```

You should add a reply with message_type = "buttons" *before* the message itself.

How it looks:

![Buttons in messages](https://i.imgur.com/C8F5jnT.png)

## 3. Run Status

If the run takes long time to process, you can send multiple messages to inform the user about the status. But even better is to add "ephemeral" messages that edit previous progress messages, and are removed when the agent is done. To do this, you can use `env.add_reply` with `message_type = "status"`:

```python
env.add_reply("Welcome!")
time.sleep(1)
env.add_reply("""
              {
                "message": "Loading...",
                "progress": 0.5
              }
              """, message_type = "status")
time.sleep(1)
env.add_reply("""
              {
                "message": "Almost done...",
                "progress": 0.8
              }
              """, message_type = "status")
time.sleep(1)
env.add_reply("Done")
```

The `progress` field is optional, and ranges from 0 (0%) to 1 (100%), so that the frontends can display a progress bar.

## 4. Runner Environment

You can check `os.environ["RUNNING_IN_BETTEAR"]` environment variable to see if the agent is running in Bettear Bot, and communicate in more Telegram-friendly way.
