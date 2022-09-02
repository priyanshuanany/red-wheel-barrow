import { RTMClient } from "@slack/rtm-api";
import { SLACK_OAUTH_TOKEN, BOT_WORK_CHANNEL } from "./constant";
import { WebClient } from "@slack/web-api";

const rtm  = new RTMClient(SLACK_OAUTH_TOKEN);
const web  = new WebClient(SLACK_OAUTH_TOKEN);
const packageJson = require("../package.json")


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
        if(event.text === "!hello"){
            hello(event.channel, event.user)
        }
        else if(event.text === "!currentime"){
                time(event.channel,event.user)
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

// For sending message we have to need web api client with the same token
// it takes a channel and message
async function sendMessage(channel,message){
    await web.chat.postMessage({
        channel:channel,
        text: message,
    })
}