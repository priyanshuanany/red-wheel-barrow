import { RTMClient } from "@slack/rtm-api";
import { WebClient } from "@slack/web-api";
import axios from "axios";

require("dotenv").config();

const botter = new RTMClient(process.env.SLACK_OAUTH_TOKEN);
const web = new WebClient(process.env.SLACK_OAUTH_TOKEN);
const apikey = process.env.API_KEY;
const alpha = require("alphavantage")({ key: `${apikey}` });

botter.start().catch(console.error);

botter.on("ready", async () => {
  console.log("Botter Started");
  sendMessage("#bot-work", "Beep Boop! Who waketh me 🤖");
});

botter.on("slack_event", async (eventType, event) => {
  if (event && event.type === "message") {
    switch (event.text) {
      case "!hi":
        return hello(event.channel, event.user);

      case "!help":
        return noHelp(event.channel, event.user);

      case "!BTC":
        return getData("btc", event.channel);

      case "!LTC":
        return getData("ltc", event.channel);

      case "!DOGE":
        return getData("doge", event.channel);

      case "!ETH":
        return getData("eth", event.channel);

      case "!sleep":
        return sleep(event.channel);
    }
  }
});

function hello(channelId, userId) {
  sendMessage(channelId, `ALLO ZULUL <@${userId}>`);
}

function noHelp(channelId, userId) {
  sendMessage(
    channelId,
    `Type exclamation with the coint name for ex. !BTC, available commands !BTC, !LTC, !DOGE, !ETH <@${userId}>`
  );
}

function sleep(channelId) {
  sendMessage(channelId, `Beep Boop! Im going to sleep 🤖`);
  botter.off();
}

function getData(coin, channelId) {
  // Crypto - BTC, LTC, DOGE

  alpha.crypto.daily(coin, "usd").then((data) => {
    let price = data["Time Series (Digital Currency Daily)"];
    let first = Object.values(price)[0];
    let name = data["Meta Data"];
    let coinName = Object.values(name)[2];
    let cap = first["6. market cap (USD)"];
    let high = first["2b. high (USD)"];
    let low = first["3a. low (USD)"];
    sendMessage(
      channelId,
      `You have searched for ${coinName} \n Total Market Cap : $ ${Number(
        cap
      ).toFixed(2)} \n Days High: $ ${Number(high).toFixed(
        2
      )} \n Days Low : $ ${Number(low).toFixed(2)}`
    );
  });
}

async function sendMessage(channel, message) {
  await web.chat.postMessage({
    channel: channel,
    text: message,
  });
}

