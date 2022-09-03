import { RTMClient } from "@slack/rtm-api";
import { SLACK_OAUTH_TOKEN, BOT_WORK_CHANNEL } from "./constant";
import { WebClient } from "@slack/web-api";
import axios from "axios";

const rtm  = new RTMClient(SLACK_OAUTH_TOKEN);
const web  = new WebClient(SLACK_OAUTH_TOKEN);
const packageJson = require("../package.json")
const apikey = process.env.API_KEY;
const alpha = require("alphavantage")({ key: `${apikey}` });


// we actually start the client here then we will add a chache
// to log out there if we get an error
rtm.start()
    .catch(console.error);

rtm.on("ready",async () => {
    console.log("bot started");
    sendMessage(BOT_WORK_CHANNEL,`Bot Version ${packageJson.version} is online`)
});


rtm.on("slack_event",async(eventType, event)=>{
    console.log(event)
    console.log(eventType)
    if(event && event.type === "message"){
        // if(event.text === "!hello"){
        //     hello(event.channel, event.user)
        // }
        // else if(event.text === "!currentime"){
        //         time(event.channel,event.user)
        // }
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

// function time(channelId,userId){
//     const timeElapsed = Date.now();
//     const today = new Date(timeElapsed)
//     today.toDateString();
//     console.log(today);
//     sendMessage(channelId, today)
// }
function time(channelId,userId){
    sendMessage(channelId,`Time <@${userId}>`);
}

function hello(channelId,userId){
    sendMessage(channelId, `Hey! <@${userId}>`)
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


// For sending message we have to need web api client with the same token
// it takes a channel and message
async function sendMessage(channel,message){
    await web.chat.postMessage({
        channel:channel,
        text: message,
    })
}