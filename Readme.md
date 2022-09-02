#### ECMAScript module loader
- `npm i esm`
- This allows us to use es6 imports

#### Slack Real Time Messaging API / RTM api
- `npm install @slack/rtm-api`
- it is used for real-time messaging basically a way to open up a websocket and listen for messages.
- This is a scoped package

#### Slack Web api
- `npm i @slack/web-api`
- The web api gives us the http client that we can interact with slack in restfull way so this allows us to get resources and post resources, we are using here for post messages.

> First in index.js, so we need to require our esm and then export our app.js. Once we do that we can use es6 imports instead of using require everywhere

> In app.js, first thing we are going to do is import our rtm client this is our real-time messaging client so we can subscribe to events from slack then we need to initialize our client and we need to do with a token

> not slash command because it require apis and web hooks 