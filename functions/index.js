const functions = require('firebase-functions');
const request = require('request-promise');
const admin = require('firebase-admin');

const app = require('./botdialogflow')
//const app = require('../backend/botdialogflow.js')

const { WebhookClient } = require('dialogflow-fulfillment');
const {Card, Suggestion} = require('dialogflow-fulfillment');
const { Carousel } = require('actions-on-google');

process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements



const LINE_MESSAGING_API = 'https://api.line.me/v2/bot/message';
const LINE_HEADER = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer 1hEDucdo64ySMmSQKj3wBqIzsnyiBewDH29Dt5EiE5O1UlSjwv90J1P28ASJjoW5cW0VmLZ0z1n5WH5E5rTpzh9eJXK9vqnZkgq/VqBB7KUbSlMddapMXU29VDQMt8MTo9V6qI0VnHUzFCYkOFvZTlGUYhWQfeY8sLGRXgo3xvw=`
};

exports.app = functions.https.onRequest(app)
// exports.LineBot = functions.https.onRequest((req, res) => {
//   var data = JSON.stringify(reply_profile())
//   let stickerpack = "3";
  
//   if (req.body.events[0].message.type !== 'text') {
//     return;
//   }
//   if(req.body.events[0].message.text.toUpperCase() == 'LIFF'){
//     reply_liff(req.body);
//   } else if(req.body.events[0].message.text.toUpperCase() == 'SLIME'){
//     reply(req.body, stickerpack, data);
//   }
//   //  else if (req.body.events[0].message.text.toUpperCase() == 'คิว') {
//   //   app(req.body, res)
//   // }
//    res.sendStatus(200)
// });

// var request = require("request");

// var options = { method: 'POST',
//   url: 'https://dialogflow.googleapis.com/v2/projects/slimeslam-24d26/agent/sessions/f5c83a8d-3613-e88d-fca2-48e60446ed62:detectIntent',
//   headers: 
//    { 'Postman-Token': '926bb739-72e8-4cf8-8c6c-1b9066d19632',
//      'cache-control': 'no-cache',
//      Authorization: 'Bearer ya29.c.ElroBvhLFfihcAOXMIvnsomSfqdNLISV-ZV4azy44GqhWhA-GPG4sKQzfliD92Nl062BJBT3ZxWiKg6q1WgSqRimcbH6VSwDtGFOnSWrY6ooyu9mj_mxDdmak_8',
//      'Content-Type': 'application/json' },
//   body: 
//    { queryInput: { text: { text: 'ขอคิว', languageCode: 'th' } },
//      queryParams: { timeZone: 'Asia/Bangkok' } },
//   json: true };

// request(options, function (error, response, body) {
//   if (error) throw new Error(error);

//   console.log(body);
// });



const reply_liff = (bodyResponse) => {
  return request({
    method: `POST`,
    uri:`${LINE_MESSAGING_API}/reply`,
    headers: LINE_HEADER,
    body: JSON.stringify({
      replyToken: bodyResponse.events[0].replyToken,
      messages: [
        {
          type: `text`,
          text: "line://app/1648357069-N4goRqx1"
        }
      ]
    })
  })
};


// var requestDialog = require("request");
// var authDialog = require('./slimeslam-24d26-4834f1593470')


// const dataDialog = () => {
//   return request({
//     method: 'POST',
//     url: 'https://dialogflow.googleapis.com/v2/projects/slimeslam-24d26/agent/sessions/f5c83a8d-3613-e88d-fca2-48e60446ed62:detectIntent',
//     headers: 
//      { 'Postman-Token': '03c46562-7c03-408c-930c-173fe7b3f251',
//        'cache-control': 'no-cache',
//        'Authorization':  'Bearer ya29.c.ElrkBlVG2xDrlmq_wODnTKGdcd35BFXT-jd_PW-CC3YOLAolFFXOx_E13vQ5Iu0AE0_S-rzzxWz0nYpvBzNCWavt_BNxv1drWWfxWx1AfpYgaJjrn1PavhT-3GA',
//        'Content-Type': 'application/json; charset=utf-8' },
//     body: '{"queryInput":{"text":{"text":"สวัสดี","languageCode":"th"}},"queryParams":{"timeZone":"Asia/Bangkok"}}' 
//   })
// }

// var optionsDialog = {
//   method: 'POST',
//   url: 'https://dialogflow.googleapis.com/v2/projects/slimeslam-24d26/agent/sessions/f5c83a8d-3613-e88d-fca2-48e60446ed62:detectIntent',
//   headers: 
//    { 'Postman-Token': '03c46562-7c03-408c-930c-173fe7b3f251',
//      'cache-control': 'no-cache',
//      'Authorization':  'Bearer ya29.c.ElrkBmtjqDrldRdDtuObHonsSyvznY7fG1On4Uis9C4aFD_qY6vwlpttMbwmlcIpHkQPmYvDeQFFS8MVkP6KD8xSCmlYvhkwhj_TiWFlXks3PVBnV-uktm7krww',
//      'Content-Type': 'application/json; charset=utf-8' },
//   body: '{"queryInput":{"text":{"text":"สวัสดี","languageCode":"th"}},"queryParams":{"timeZone":"Asia/Bangkok"}}' };

// requestDialog(optionsDialog, function (error, response, body) {
//   if (error) throw new Error(error);

//   console.log(body);
// });

// const dialogLine = (data) => {
//   return request({
//     method: `POST`,
//     uri: `${LINE_MESSAGING_API}/reply`,
//     headers: LINE_HEADER,
//     body: JSON.stringify({
//       replyToken: bodyResponse.events[0].replyToken,
//       messages: [
//         {
//           type: 'text',
//           text: data
//         }
//       ]
//     })
      
//   })
// }

const reply = (bodyResponse, sticker, dataReply) => {
  return request({
    method: `POST`,
    uri: `${LINE_MESSAGING_API}/reply`,
    headers: LINE_HEADER,
    body: JSON.stringify({
      replyToken: bodyResponse.events[0].replyToken,
      messages: [
        {
          type: `text`,
          text: "สวัสดีค๊าบบ"
        },
        {
          type: "sticker",
          packageId: sticker,
          stickerId: "180"
        },
        {
          type: `text`,
          text: dataReply
        },
        {
          type: `text`,
          //text: bodyResponse.events[0].message.text
          text: bodyResponse.events[0].source.userId,
          
          quickReply: {
            items: [
              {
                type: "action",
                action: {
                  type: "location",
                  label: "Location",
                  
                }
              }
            ]
          }
        }
	  ]
    })
  });
};

const reply_profile = () => {
  return request({
    method: `Get`,
    uri: `https://api.line.me/v2/bot/profile/{userId}`,
    headers: LINE_HEADER
  })
}


//---------------------Line Login--------------------------

exports.loginwithLine = functions.https.onRequest((req, res) => {
  if (req.body.access_token === undefined) {
      const ret = {
        error_message: 'AccessToken not found',
      };
      return response.status(400).send(ret);
    }
    
    return verifyLineToken(req.body)
      .then((customAuthToken) => {
        const ret = {
          firebase_token: customAuthToken,
        };
        return response.status(200).send(ret);
      }).catch((err) => {
        const ret = {
          error_message: `Authentication error: ${err}`,
        };
        return res.status(200).send(ret);
  });
  
});


function verifyLineToken(body) {
  return request({
    method: 'GET',
    uri: `https://api.line.me/oauth2/v2.1/verify?access_token=${body.access_token}`,
    json: true
  }).then((response) => {
    if (response.client_id !== functions.config().line.channelid) {
      return Promise.reject(new Error('LINE channel ID mismatched'));
    }
    return getFirebaseUser(body);
  }).then((userRecord) => {
    return admin.auth().createCustomToken(userRecord.uid);
  }).then((token) => {
    return token;
  });
}

function getFirebaseUser(body) {
  const firebaseUid = `line:${body.id}`;

  return admin.auth().getUser(firebaseUid).then(function(userRecord) {
    return userRecord;
  }).catch((error) => {
    if (error.code === 'auth/user-not-found') {
        return admin.auth().createUser({
          uid: firebaseUid,
          displayName: body.name,
          photoURL: body.picture,
          email: body.email
        });
    }
    return Promise.reject(error);
  });
}
//----------end line login------


// exports.addMessage = functions.https.onRequest((req, res) => {
//   // Grab the text parameter.
//   const original = req.query.code;
//   // Push the new message into the Realtime Database using the Firebase Admin SDK.
//   return admin.database().ref('/messages').push({original: original}).then((snapshot) => {
//     // Redirect with 303 SEE OTHER to the URL of the pushed object in the Firebase console.
//     return res.redirect(303, snapshot.ref.toString());
//   });
// });

// Listens for new messages added to /messages/:pushId/original and creates an
// uppercase version of the message to /messages/:pushId/uppercase
// exports.makeUppercase = functions.database.ref('/messages/{pushId}/original')
//     .onCreate((snapshot, context) => {
//       // Grab the current value of what was written to the Realtime Database.
//       const original = snapshot.val();
//       console.log('Uppercasing', context.params.pushId, original);
//       const uppercase = original.toUpperCase();
//       // You must return a Promise when performing asynchronous tasks inside a Functions such as
//       // writing to the Firebase Realtime Database.
//       // Setting an "uppercase" sibling in the Realtime Database returns a Promise.
//       return snapshot.ref.parent.child('uppercase').set(uppercase);
//     });


// const dialogflow = require('actions-on-google');
// const app = dialogflow();
// app.intent('Default Welcome Intent', (conv)=>{
//   conv.ask('how are you');
// });

// app.catch((conv, error) => {
//   console.error(error);
//   conv.ask('I encountered a glitch. Can you say that again?');
// });

// exports.fullfillment = functions.https.onRequest(app);
    // See https://github.com/dialogflow/dialogflow-fulfillment-nodejs
// for Dialogflow fulfillment library docs, samples, and to report issues
//'use strict';



// exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
//   var data = JSON.stringify(reply_profile())
//   let stickerpack = "3";
//  // var dialog = JSON.stringify(dataDialog())
  
//   if (request.body.events[0].message.type !== 'text') {
//       return;
//   }
//   if(request.body.events[0].message.text.toUpperCase() == 'LIFF'){
//       reply_liff(request.body);
//       console.log("TEST")
//   }
//   else if(request.body.events[0].message.text.toUpperCase() == 'SLIME'){
//       reply(request.body, stickerpack, data);
//   } else if (request.body.events[0].message.text.toUpperCase() == 'ขอ'){
//     requestDialog(optionsDialog, function (error, response, body) {
//       if (error) throw new Error(error);
    
//       console.log(body);
//       console.log("ดูrespone");
//       console.log(response);
//       console.log("เจาะจง")
//       console.log(body.responseId)
//       console.log("เจาะจง2")
//       console.log(response.responseId)
//       console.log("Loop")
      
//       var dataDialog = JSON.parse(body);
//       console.log(dataDialog.responseId)
//       localStorage.setItem("tempData",dataDialog);
//     });
//   } else if (request.body.events[0].message.text.toUpperCase() == 'ลอง'){
//     var tempGetdata = localStorage.getItem("tempData");
//     var getData = JSON.parse(tempGetdata);
//     console.log(getData)
//     console.log("Parse")
//     console.log(dataDialog)
//   }
    

//   response.sendStatus(200)

  
//   const agent = new WebhookClient({ request, response });
//   console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
//   console.log('Dialogflow Request body: ' + JSON.stringify(request.body));
 
//   function welcome(agent) {
//     agent.add(`Welcome to my agent!`);
//   }
 
//   function fallback(agent) {
//     agent.add(`I didn't understand`);
//     agent.add(`I'm sorry, can you try again?`);
//   }

//   function showque(agent) {
//     agent.add('dialogflow work!');
//   }

//   // // Uncomment and edit to make your own intent handler
//   // // uncomment `intentMap.set('your intent name here', yourFunctionHandler);`
//   // // below to get this function to be run when a Dialogflow intent is matched
//   // function yourFunctionHandler(agent) {
//   //   agent.add(`This message is from Dialogflow's Cloud Functions for Firebase editor!`);
//   //   agent.add(new Card({
//   //       title: `Title: this is a card title`,
//   //       imageUrl: 'https://developers.google.com/actions/images/badges/XPM_BADGING_GoogleAssistant_VER.png',
//   //       text: `This is the body text of a card.  You can even use line\n  breaks and emoji! 💁`,
//   //       buttonText: 'This is a button',
//   //       buttonUrl: 'https://assistant.google.com/'
//   //     })
//   //   );
//   //   agent.add(new Suggestion(`Quick Reply`));
//   //   agent.add(new Suggestion(`Suggestion`));
//   //   agent.setContext({ name: 'weather', lifespan: 2, parameters: { city: 'Rome' }});
//   // }

//   // // Uncomment and edit to make your own Google Assistant intent handler
//   // // uncomment `intentMap.set('your intent name here', googleAssistantHandler);`
//   // // below to get this function to be run when a Dialogflow intent is matched
//   // function googleAssistantHandler(agent) {
//   //   let conv = agent.conv(); // Get Actions on Google library conv instance
//   //   conv.ask('Hello from the Actions on Google client library!') // Use Actions on Google library
//   //   agent.add(conv); // Add Actions on Google library responses to your agent's response
//   // }
//   // // See https://github.com/dialogflow/dialogflow-fulfillment-nodejs/tree/master/samples/actions-on-google
//   // // for a complete Dialogflow fulfillment library Actions on Google client library v2 integration sample

//   //Run the proper function handler based on the matched Dialogflow intent name
//   let intentMap = new Map();
//   intentMap.set('Default Welcome Intent', welcome);
//   intentMap.set('Default Fallback Intent', fallback);
//   intentMap.set('show que', showque);
//   // intentMap.set('your intent name here', yourFunctionHandler);
//   // intentMap.set('your intent name here', googleAssistantHandler);
  
//   agent.handleRequest(intentMap);
// });





// const {Storage} = require('@google-cloud/storage');
// const storage = new Storage({
//   projectId: 'slimeslma-24d26',
//   keyFilename: './slimeslam-24d26-4834f1593470.json'
// });

// storage.getBuckets().then((results) => {
//     const buckets = results[0];

//     console.log('Buckets:');
//     buckets.forEach((bucket) => {
//     nsole.log(bucket.name);
//     });
//   })
//   .catch((err) => {
//     console.error('ERROR:', err);
//   });


