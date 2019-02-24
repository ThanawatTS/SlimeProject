const functions = require('firebase-functions');
const request = require('request-promise');

const LINE_MESSAGING_API = 'https://api.line.me/v2/bot/message';
const LINE_HEADER = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer 1hEDucdo64ySMmSQKj3wBqIzsnyiBewDH29Dt5EiE5O1UlSjwv90J1P28ASJjoW5cW0VmLZ0z1n5WH5E5rTpzh9eJXK9vqnZkgq/VqBB7KUbSlMddapMXU29VDQMt8MTo9V6qI0VnHUzFCYkOFvZTlGUYhWQfeY8sLGRXgo3xvw=`
};

exports.LineBot = functions.https.onRequest((req, res) => {
  if (req.body.events[0].message.type !== 'text') {
    return;
  }
  reply(req.body);
  
  // res.sendStatus(200)
});

const reply = (bodyResponse) => {
  return request({
    method: `POST`,
    uri: `${LINE_MESSAGING_API}/reply`,
    headers: LINE_HEADER,
    body: JSON.stringify({
      replyToken: bodyResponse.events[0].replyToken,
      messages: [
        {
          type: `text`,
          //text: bodyResponse.events[0].message.text
          //text: "line://app/1648357069-N4goRqx1"
          //message: reply_profile()
          text: bodyResponse.events[0].source.userId,
          
          quickReply: {
            items: [
              {
                type: "action",
                action: {
                  type: "location",
                  label: "Message",
                  
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
    headers: LINE_HEADER,
  })
}