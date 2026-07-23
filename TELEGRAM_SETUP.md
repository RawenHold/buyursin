# Telegram delivery setup

If a token was ever pasted into a public chat, screenshot, issue, or repository, revoke it in **@BotFather** and create a new one before continuing.

The contact form sends one structured message with name, company, phone, email, object type and task through `src/app/api/lead/route.ts`.

## Required server variables

Set these in Vercel under **Project Settings → Environment Variables** for Production, Preview and Development:

- `TELEGRAM_BOT_TOKEN` — the bot token from BotFather.
- `TELEGRAM_CHAT_ID` — the numeric ID of the private chat or group receiving leads.

The current repository does not contain a local `.env.local`, so Telegram delivery will return `not_configured` until both values are added to the deployment environment.

Do not put either value in client-side code and do not prefix it with `NEXT_PUBLIC_`.

## Getting the chat ID

1. Open the bot in Telegram and send `/start`.
2. Open `https://api.telegram.org/botYOUR_TOKEN/getUpdates` in a private browser window. Replace `YOUR_TOKEN` with the token itself; do not type `<` or `>`.
3. Find `message.chat.id` in the response and use that number as `TELEGRAM_CHAT_ID`.
4. Delete the token from the browser history after setup.
5. Redeploy the Vercel project after adding or changing variables.

## Exact Vercel setup

1. Open the project in Vercel.
2. Go to **Settings → Environment Variables**.
3. Add `TELEGRAM_BOT_TOKEN` and paste only the token value from BotFather. Both `123:abc...` and an accidentally prefixed `bot123:abc...` are accepted by the server route.
4. Add `TELEGRAM_CHAT_ID` with the numeric `message.chat.id` value. Group IDs usually begin with `-100`.
5. Enable the variables for **Production**, **Preview**, and **Development** as needed.
6. Open **Deployments**, select the latest deployment, and choose **Redeploy**. Existing deployments do not receive newly added variables automatically.
7. Submit one test request from the deployed `/contacts` page and confirm that one structured message appears in the destination chat.

For a group, add the bot to the group, send a message that mentions the bot, and use that group's negative `chat.id`.

## If the form shows a delivery error

The production deployment must contain both variables in the **same Vercel project** that serves the website. Adding them to a local `.env.local` file does not configure the deployed site.

1. Confirm `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` exist for the **Production** environment.
2. Make sure the bot has received `/start` from the destination private chat, or has permission to post in the destination group.
3. Trigger a new production deployment after every variable change.
4. Open `/api/lead` only through a POST request from the form. A delivery failure returns a safe error code such as `not_configured`, `invalid_token_format`, `invalid_chat_id`, `chat_not_found`, `bot_blocked`, `invalid_token`, `rate_limited`, or `network_error`; the token is never returned.

Telegram and the optional `LEAD_WEBHOOK_URL` are independent delivery channels. A failure in the optional webhook no longer turns a successful Telegram delivery into a form error.
