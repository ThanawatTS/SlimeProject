const functions = require('firebase-functions');
const request = require('request-promise');
const admin = require('firebase-admin');

var serviceAccount = require("./slimeslam-24d26-firebase-adminsdk-bojj8-e8297b887f.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://slimeslam-24d26.firebaseio.com"
});

const LINE_MESSAGING_API = 'https://api.line.me/v2/bot/message';
const LINE_HEADER = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer 1hEDucdo64ySMmSQKj3wBqIzsnyiBewDH29Dt5EiE5O1UlSjwv90J1P28ASJjoW5cW0VmLZ0z1n5WH5E5rTpzh9eJXK9vqnZkgq/VqBB7KUbSlMddapMXU29VDQMt8MTo9V6qI0VnHUzFCYkOFvZTlGUYhWQfeY8sLGRXgo3xvw=`
};

exports.LineBot = functions.https.onRequest((req, res) => {
  
  var data = JSON.stringify(reply_profile()) 
  let stickerpack = "3";

  if (req.body.events[0].message.type !== 'text') {
    return;
  }
  if(req.body.events[0].message.text.toUpperCase() == 'LIFF'){
    reply_liff(req.body);
  }
  else if(req.body.events[0].message.text.toUpperCase() == 'SLIME'){
    reply(req.body, stickerpack, data);
  }
  
  
   res.sendStatus(200)
});


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

exports.addMessage = functions.https.onRequest((req, res) => {
  // Grab the text parameter.
  const original = req.query.code;
  // Push the new message into the Realtime Database using the Firebase Admin SDK.
  return admin.database().ref('/messages').push({original: original}).then((snapshot) => {
    // Redirect with 303 SEE OTHER to the URL of the pushed object in the Firebase console.
    return res.redirect(303, snapshot.ref.toString());
  });
});

// Listens for new messages added to /messages/:pushId/original and creates an
// uppercase version of the message to /messages/:pushId/uppercase
exports.makeUppercase = functions.database.ref('/messages/{pushId}/original')
    .onCreate((snapshot, context) => {
      // Grab the current value of what was written to the Realtime Database.
      const original = snapshot.val();
      console.log('Uppercasing', context.params.pushId, original);
      const uppercase = original.toUpperCase();
      // You must return a Promise when performing asynchronous tasks inside a Functions such as
      // writing to the Firebase Realtime Database.
      // Setting an "uppercase" sibling in the Realtime Database returns a Promise.
      return snapshot.ref.parent.child('uppercase').set(uppercase);
    });