//import firebase from 'firebase'
//import firebaseApp from '../src/components/firebaseInit'
var admin = require('firebase-admin');
var serviceAccount = require("./slimeslam-24d26-firebase-adminsdk-7c.json");
const request = require('request-promise');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://slimeslam-24d26.firebaseio.com"
});

var db = admin.firestore();
var menuFB

const {WebhookClient} = require('dialogflow-fulfillment');
//const {WebhookClient} = require('actions-on-google').DialogflowApp;
const express = require('express');
const bodyParser = require('body-parser')


const LINE_MESSAGING_API = 'https://api.line.me/v2/bot/message';
const LINE_HEADER = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer 1hEDucdo64ySMmSQKj3wBqIzsnyiBewDH29Dt5EiE5O1UlSjwv90J1P28ASJjoW5cW0VmLZ0z1n5WH5E5rTpzh9eJXK9vqnZkgq/VqBB7KUbSlMddapMXU29VDQMt8MTo9V6qI0VnHUzFCYkOFvZTlGUYhWQfeY8sLGRXgo3xvw=`
};


const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json({type: 'application/json'}));

app.post('/chatbot', express.json(), (req, res) => {
    //console.log(admin.database())
    var botDialog = db.collection("bot").doc('botdetail')
    var botGetdata = db.collection("bot").doc('getdata')
    

    

    const agent = new WebhookClient({ request: req, response: res });

    // console.log("Header : " + JSON.stringify(request.headers));
    // console.log("Body : " + JSON.stringify(request.body));
    //console.log("Header2 : " + JSON.stringify(req.headers) + '\n');
    console.log("Body2 : " + JSON.stringify(req.body));
    console.log("Replytoken: "+ JSON.stringify(req.body.originalDetectIntentRequest.payload.data.replyToken))
    console.log("UserID", JSON.stringify(req.body.originalDetectIntentRequest.payload.data.source.userId))
    // if(req.body.events[0].message.text.toUpperCase() == 'LIFF'){
    //     console.log("Line test")
    // }
    function authUserid() {
        let userid = req.body.queryResult.parameters.userID;
        let botAuth = db.collection("usersChoosingMenu").doc(userid)
        let dataInDB
        botAuth.get().then(function (doc){
            if(doc.exists){
                dataInDB = doc.data().menu
            } else {

            }
        })
        setTimeout(() => {
            console.log(dataInDB[0].Name)
            menuFB = dataInDB[0].Name
            var setData = botGetdata.set({
                menu: menuFB
            })
        }, 1500);
        
    }
    function confirmQueue() {
        let name = req.body.queryResult.parameters.userName;
        console.log("MENUFB"  + menuFB)
        //agent.add("จองเรียบร้อยโดยคุณ \""+name+"\"");
        botGetdata.get().then(function (doc){
            if(doc.exists){
                var setAda = botDialog.set({
                    first: name,
                    menu: doc.data().menu
                  });
                  
            }
        })
            
        agent.add("จองเรียบร้อยโดยคุณ \""+name+"\"" + "Menu:" + menuFB);
        
    }


    const reply_liff = (bodyResponse) => {
        return request({
          method: `POST`,
          uri:`${LINE_MESSAGING_API}/reply`,
          headers: LINE_HEADER,
          body: JSON.stringify({
            replyToken: bodyResponse.originalDetectIntentRequest.payload.data.replyToken,
            messages: [
              {
                type: `text`,
                text: "Asd"
              }
            ]
        })
      })
    };

    const reserveQueue = (bodyResponse) => {
      return request({
        method: `POST`,
        uri:`${LINE_MESSAGING_API}/reply`,
        headers: LINE_HEADER,
        body: JSON.stringify({
          replyToken: bodyResponse.originalDetectIntentRequest.payload.data.replyToken,
          messages: [
            {
              "type": "template",
              "altText": "This is a buttons template",
              "template": {
                  "type": "buttons",
                  "thumbnailImageUrl": "https://example.com/bot/images/image.jpg",
                  "imageAspectRatio": "rectangle",
                  "imageSize": "cover",
                  "imageBackgroundColor": "#FFFFFF",
                  "title": "Slime Website",
                  "text": "Please select",
                  "defaultAction": {
                      "type": "uri",
                      "label": "View detail",
                      "uri": "https://0affde8f.ngrok.io"
                  },
                  "actions": [
                      {
                        "type": "uri",
                        "label": "Reserve",
                        "uri": "https://0affde8f.ngrok.io"
                      }
                  ]
              }
            }
          ]
      })
    })
  };

  
    function welcome () {}
    function queue(){
      reserveQueue(req.body)
    }
    function askUserName(){}
    function fallback(){}

    let intentMap = new Map();
    intentMap.set('Default Welcome Intent', welcome);
    intentMap.set('Default Welcome Intent - custom', authUserid);
    intentMap.set('show que - custom - yes', confirmQueue);
    intentMap.set('show que', queue);
    intentMap.set('show que - custom', askUserName);
    intentMap.set('Default Fallback Intent', fallback);

    agent.handleRequest(intentMap);
  
  })

app.get('/', (req, res) => res.send('online'))

module.exports = app