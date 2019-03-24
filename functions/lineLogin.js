const functions = require('firebase-functions');
const request = require('request-promise');
const admin = require('firebase-admin');

var serviceAccount = require("./slimeslam-24d26-firebase-adminsdk-bojj8-e8297b887f.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://slimeslam-24d26.firebaseio.com"
});

exports.loginwithLine = functions.https.onRequest((req, res) => {

    if (request.body.access_token === undefined) {
        const ret = {
          error_message: 'AccessToken not found',
        };
        return response.status(400).send(ret);
      }
      
      return verifyLineToken(request.body)
        .then((customAuthToken) => {
          const ret = {
            firebase_token: customAuthToken,
          };
          return response.status(200).send(ret);
        }).catch((err) => {
          const ret = {
            error_message: `Authentication error: ${err}`,
          };
          return response.status(200).send(ret);
    });
    
});
