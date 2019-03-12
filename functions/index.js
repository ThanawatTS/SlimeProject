const functions = require('firebase-functions');
const request = require('request-promise');

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


