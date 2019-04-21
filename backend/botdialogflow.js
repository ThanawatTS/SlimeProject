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

app.post('/noti/:userId/:currentQueue/:userQueue', express.json(),(req, res) => {



  var request = require("request");
  console.log(req.params.userId)
  var options = { method: 'POST',
    url: 'https://api.line.me/v2/bot/message/push',
    headers: 
     { 'Postman-Token': '5e9ae977-611e-47eb-8ad1-e8a668c79b28',
       'cache-control': 'no-cache',
       'Access-Control-Allow-Origin': '*',
       Authorization: 'Bearer 1hEDucdo64ySMmSQKj3wBqIzsnyiBewDH29Dt5EiE5O1UlSjwv90J1P28ASJjoW5cW0VmLZ0z1n5WH5E5rTpzh9eJXK9vqnZkgq/VqBB7KUbSlMddapMXU29VDQMt8MTo9V6qI0VnHUzFCYkOFvZTlGUYhWQfeY8sLGRXgo3xvw=',
       'Content-Type': 'application/json' },
    body: 
     { to: req.params.userId,
       messages: 
        [ { type: 'text', text: "ปัจจุบันคิวที่: " + req.params.currentQueue},
          { type: 'text', text: "คิวของคุณคือ: " + req.params.userQueue}
        ] },
    json: true };
  
  request(options, function (error, response, body) {
    if (error) throw new Error(error);
  });
})


app.post('/chatbot', express.json(), (req, res) => {
    //console.log(admin.database())
    

    var botDialog = db.collection("bot").doc('botdetail')
    var botGetdata = db.collection("bot").doc('getdata')
    var verifyUserid = db.collection('UserIdLine')
    var userchooseMenu = db.collection("usersChoosingMenu")
    var emailfromLine
    var userCheckQueue = db.collection("User")
    var restaurant
    var userCurrentQueue
    var restaurantDB
    var restaurantCurrentQueue

    

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
    


    verifyUserid.get().then((querySnapShot) => {
      querySnapShot.forEach((doc) => {
        if(doc.id == req.body.originalDetectIntentRequest.payload.data.source.userId){
          console.log("Match")
            emailfromLine = doc.data().email
        } else {
          console.log("Not match")
        }
      })
    })

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


    // const reply_liff = (bodyResponse, menu) => {
    //     return request({
    //       method: `POST`,
    //       uri:`${LINE_MESSAGING_API}/reply`,
    //       headers: LINE_HEADER,
    //       body: JSON.stringify({
    //         replyToken: bodyResponse.originalDetectIntentRequest.payload.data.replyToken,
    //         messages: [
    //           {
    //             type: `text`,
    //             text: menu
    //           }
    //         ]
    //     })
    //   })
    // };
  

    const suggestionCon = (bodyResponse, menu) => {
          return request({
            method: `POST`,
            uri:`${LINE_MESSAGING_API}/reply`,
            headers: LINE_HEADER,
            body: JSON.stringify({
              replyToken: bodyResponse.originalDetectIntentRequest.payload.data.replyToken,
              messages: [
                {
                  type: `text`,
                  text: menu
                }
              ]
          })
        })
      };

    const suggestion = (bodyResponse, inputText) => {
      return request({
        method: `POST`,
        uri:`${LINE_MESSAGING_API}/reply`,
        headers: LINE_HEADER,
        body: JSON.stringify({
          replyToken: bodyResponse.originalDetectIntentRequest.payload.data.replyToken,
          messages: [
            {
              "type": "template",
              "altText": "this is a confirm template",
              "template": {
                  "type": "confirm",
                  "text": inputText,
                  "actions": [
                      {
                        "type": "message",
                        "label": "ใช่",
                        "text": "ใช่"
                      },
                      {
                        "type": "message",
                        "label": "ไม่",
                        "text": "ไม่"
                      }
                  ]
              }
            }
          ]
        })
      })
    };

    


    const pushMessage = (bodyResponse, menu) => {
      return request({
        method: `POST`,
        uri:`${LINE_MESSAGING_API}/push`,
        headers: LINE_HEADER,
        body: JSON.stringify({
          "to": bodyResponse.originalDetectIntentRequest.payload.data.source.userId ,
          "messages": [
            {
              "type": "flex",
              "altText": "This is a Flex Message",
              "contents": {
                "type": "bubble",
                "body": {
                  "type": "box",
                  "layout": "horizontal",
                  "contents": [
                    {
                      "type": "text",
                      "text": menu,
                      "align": "center"
                    }
                  ]
                }
              }
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
                  "thumbnailImageUrl": "https://banner2.kisspng.com/20180401/hlw/kisspng-slime-rancher-atomega-zooming-secretary-puddle-5ac0a2ee84f323.6288183815225740625446.jpg",
                  "imageAspectRatio": "rectangle",
                  "imageSize": "cover",
                  "imageBackgroundColor": "#FFFFFF",
                  "title": "Slime Website",
                  "text": "Please select",
                  "defaultAction": {
                      "type": "uri",
                      "label": "View detail",
                      "uri": "https://d33e15c1.ngrok.io"
                  },
                  "actions": [
                      {
                        "type": "uri",
                        "label": "Reserve",
                        "uri": "https://d33e15c1.ngrok.io"
                      }
                  ]
              }
            }
          ]
      })
    })
  };
  


  const emptyQueue = (bodyResponse) => {
    return request({
      method: `POST`,
      uri:`${LINE_MESSAGING_API}/push`,
      headers: LINE_HEADER,
      body: JSON.stringify({
        "to": bodyResponse.originalDetectIntentRequest.payload.data.source.userId ,
        "messages": [
          {
            "type": "flex",
            "altText": "This is a Flex Message",
            "contents": {
              "type": "bubble",
              "body": {
                "type": "box",
                "layout": "horizontal",
                "contents": [
                  {
                    "type": "text",
                    "text": "ไม่มีคิวอยู่ในรายการจอง",
                    "align": "center"
                  }
                ]
              }
            }
          }
        ]
    })
  })
};


  const checkQueLine = (bodyResponse, userCur, restaurantCur, restaurantName) => {
    return request({
      method: `POST`,
      uri:`${LINE_MESSAGING_API}/push`,
      headers: LINE_HEADER,
      body: JSON.stringify({
        "to": bodyResponse.originalDetectIntentRequest.payload.data.source.userId ,
        "messages": [
          {
            "type": "flex",
            "altText": "This is a Flex Message",
            "contents": {
              "type": "bubble",
              "header": {
                "type": "box",
                "layout": "vertical",
                "contents": [
                {
                  "type": "text",
                  "text": "รายละเอียดคิวตอนนี้",
                  "size": "xl",
                  "align": "center",
                }      
                ]
              },
              "body": {
                "type": "box",
                "layout": "vertical",
                "flex": 0,
                "contents": [
                  {
                    "type": "text",
                    "text": "คิวปัจจุบันของร้าน " + restaurantName + " ที่คุณจองคิอ " + restaurantCur,
                    "size": "lg",
                    "align": "center",
                    "wrap": true,
                    "weight": "bold"
                  },
                  {
                    "type": "text",
                    "text": "คิวปัจจุบันของคุณคือ " + userCur,
                    "align": "center",
                    "color": "#008080"
                  }
                ]
              }
            }
          }
        ]
    })
  })
};
  
  function vertify(){

    verifyUserid.get().then((querySnapShot) => {
      querySnapShot.forEach((doc) => {
        if(doc.id == req.body.originalDetectIntentRequest.payload.data.source.userId){
          console.log("Match")
            emailfromLine = doc.data().email
        } else {
          console.log("Not match")
        }
      })
    })

  }

  function randomMenu (amountofMenu){
    return Math.floor(Math.random()*amountofMenu)
  }
  
    function welcome () {}
    function fallback(){}

    function showQueue(){

      // console.log("IN queue")
      // var userCheckQueue = db.collection("User")
      // var checkUserid = db.collection("UserIdLine")
      // var emailLine
      // var restaurant
      // var userCurrentQueue
      // var restaurantDB = db.collection("RestaurantData").doc(restaurant)
      // var restaurantCurrentQueue
      // verifyUserid.get().then((querySnapShot) => {
      //   querySnapShot.forEach((doc) => {
      //     if(doc.id == req.body.originalDetectIntentRequest.payload.data.source.userId){
      //       emailLine = doc.data().email
      //     }
      //   })
      // })
  
    
      //   console.log("EMAIL", emailLine)
      // userCheckQueue.get().then((querySnapShot) => {
      // querySnapShot.forEach((doc) => {
      //   if(emailLine == doc.id){
      //     restaurant = doc.data().Restaurant
      //     userCurrentQueue = doc.data().Queue
      //   }
      // })
      // })
  
     
      // restaurantDB.get().then((doc) => {
      //   if(doc.exists){
      //   restaurantCurrentQueue = doc.data().Queue[0].queue
      //   }
      // })
  
  
      // setTimeout(() => {
      //   checkQueLine(req.body, userCurrentQueue, restaurantCurrentQueue, restaurant)
      // }, 100);
     
      //suggestion(req.body, "ต้องการดูคิวใช่หรือไม่?")
      setTimeout(() => {
        console.log("show queue")
      userCheckQueue.get().then((querySnapShot) => {
        querySnapShot.forEach((doc) => {
          if(emailfromLine == doc.id){
            restaurant = doc.data().Restaurant
            userCurrentQueue = doc.data().Queue
            console.log("rest", restaurant)
            console.log("userCur", userCurrentQueue)
            
          }
        })
      })



      setTimeout(() => {
        // verifyUserid.get().then((querySnapShot) => {
        //   querySnapShot.forEach((doc) => {
        //     console.log(emailfromLine)
        //     if(doc.id = emailfromLine){
        //         console.log("Getin")
                
        //           console.log(restaurant)
                  
                
        //     }
        //   })
        // })
          if(restaurant == "" || userCurrentQueue == 0){
            emptyQueue(req.body)
          } else {
            restaurantDB = db.collection("RestaurantData").doc(restaurant)
            restaurantDB.get().then((doc) => {
            if(doc.exists){
              restaurantCurrentQueue = doc.data().Queue[0].queue
            }
            })
            setTimeout(() => {
              checkQueLine(req.body, userCurrentQueue, restaurantCurrentQueue, restaurant)
            }, 500);
          }
          
          
      }, 500);

      }, 1000);
      

    }
    
    function reserve(){
      reserveQueue(req.body)
    }
    
    function suggestmenu(){
      suggestion(req.body, "ต้องการสุ่มเมนูใช่หรือไม่?")
    }

    function suggestmenuConfirm() {
      console.log("access")
      userchooseMenu.get().then((querySnapShot) => {
        querySnapShot.forEach((doc) => {
          console.log(doc.id)
          console.log(emailfromLine)
          if(doc.id == emailfromLine){
            //suggestionCon(req.body, doc.data().favouriteMenu[randomMenu(doc.data().favouriteMenu.length)].favouriteName)
            var menuname = doc.data().favouriteMenu[randomMenu(doc.data().favouriteMenu.length)].favouriteName;
            console.log(doc.data().favouriteMenu[randomMenu(doc.data().favouriteMenu.length)].favouriteName)
           // doc.data().favouriteMenu[randomMenu(doc.data().favouriteMenu.length)].favouriteName
            //agent.add(doc.data().favouriteMenu[randomMenu(doc.data().favouriteMenu.length)])
            pushMessage(req.body, menuname)
            
          } else {
            console.log("Not match in suggest menu")
          }
        })
      })
    }

    let intentMap = new Map();
    intentMap.set('Default Welcome Intent', welcome);
    intentMap.set('Default Fallback Intent', fallback);
    intentMap.set('suggestmenu', suggestmenu);
    intentMap.set('suggestmenu - yes', suggestmenuConfirm);
    intentMap.set('show que', showQueue);
    intentMap.set('reserve', reserve)

    agent.handleRequest(intentMap);
  
  })

app.get('/', (req, res) => res.send('online'))

module.exports = app