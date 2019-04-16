//import firebase from 'firebase'
//import firebaseApp from '../src/components/firebaseInit'
var admin = require('firebase-admin');
var serviceAccount = require("./slimeslam-24d26-firebase-adminsdk-7c.json");

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

    function welcome () {}
    function queue(){}
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
    // console.log("GO");
    // res.setHeader('Content-Type', 'application/json');
    // console.log(req.body);
    // console.log("BREAK")
    // var name = req.body.queryResult.parameters['lastname'];
    // var messRes = req.body.queryResult.fulfillmentText;
    // let responseObj =   {
    //                     "fulfillmentText": messRes,
    //                     "fulfillmentMessages":[{"text": {"text": name}}],
    //                     "source":""
    //                     }
    // console.log(responseObj)
    // console.log("Break")
    // console.log("TEXT : " + req.body.queryResult.queryText);
    // console.log("TEXT2: "+ responseObj.fulfillmentText);
    // return res.json(responseObj);
  })

app.get('/', (req, res) => res.send('online'))



module.exports = app