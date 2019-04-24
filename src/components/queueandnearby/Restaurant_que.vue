<template>
  <div class = "app"> 
    
    <div id= "Show_que" >
        <center>Que in Line</center>
        <ul>
        <tr v-for="(restaurant_que,index) in Que " :key = "index"> 
          <p v-if="index == 0">  Queue: {{restaurant_que.queue}}</p>     
          <p v-if="index != 0">  No.{{index}} - Queue: {{restaurant_que.queue}}  </p>
        <td>  </td>
        </tr>
        </ul>
    </div>
    
    <div id = "Show_current_que" >
      <b-card-group deck>
        <b-card id ="cardeck" text-variant="white" header="Current Que" class="text-center">
        <b-card-text> {{Current_que}} </b-card-text>
         </b-card>
    </b-card-group>

    
    </div>

    <div id = "button_nextque" >
        <v-btn large="" @click="Next_que()">
        Next Que
        </v-btn>
    </div>

  </div>
  
</template>

<script>
import firebaseApp from '../firebase/firebaseInit';
import firebase from 'firebase/app'


export default {
  name: "Que",
  data() {
    return {
      Que : {},
      Current_que : 0,
      Show_restaurant_que : firebaseApp.collection("RestaurantData").doc(this.$route.params.Pid),
      notiQueue: [],
      lineUserId: []

    }
  },

  created () {
    this.Restaurant_show_que()
    this.Restaurant_show_current_que ()
  },
  beforeCreate(){
    //this.Restaurant_show_que()
    //this.Restaurant_show_current_que ()
  },
  methods: {
    Restaurant_show_que () {
        firebaseApp.collection("RestaurantData").doc(this.$route.params.Pid).get().then(doc => {
        this.Que = doc.data().Queue;  
  })
 },
  verifyUser(Pid) {
    var employeeEmail = firebaseApp.collection("RestaurantData").doc(Pid)
    var userCur = firebase.auth().currentUser
    employeeEmail.get().then((doc) => {
      if(doc.exists){
        var lwcEmploy = doc.data().EmployeeEmail.toLowerCase();
        var lwcOwner = doc.data().RestaurantMail.toLowerCase();
        var lwcUser = userCur.email.toLowerCase();
        var examineEmail = lwcUser.slice(0,3)
        console.log("1", lwcEmploy)
        console.log("2", lwcOwner)
        console.log("3", lwcUser)
        console.log("4", examineEmail)
        if(lwcEmploy == lwcUser || lwcOwner == lwcUser) console.log("correct path")
        else if(examineEmail != "emp") this.$router.push('/restaurantManagement')
        else this.$router.push('/employee');
      } else {
        console.log("Doc doesn't exist")
      }
    })
  },
    Restaurant_show_current_que () {
        firebaseApp.collection("RestaurantData").doc(this.$route.params.Pid).get().then(doc => {
        this.Current_que = doc.data().Queue[0].queue;
        
          // var setemail
          // setemail = doc.data().Queue[0].customerEmail
          // console.log("update before:", setemail)
          // firebaseApp.collection("User").doc(setemail).update({
          //   Queue: 0,
          //   Restaurant: ""
          // })
        
  })
 },
    Next_que() {
        firebaseApp.collection("RestaurantData").doc(this.$route.params.Pid).get().then(doc => {
        this.Current_que = doc.data().Queue[0].queue;
        this.$data.notiQueue = []
          var setemail
          setemail = doc.data().Queue[0].customerEmail
          
          setTimeout(() => {
            firebaseApp.collection("User").doc(setemail).update({
            Queue: 0,
            Restaurant: ""
          })
        
          }, 1000);
          
          })
        
         firebaseApp.collection("RestaurantData").doc(this.$route.params.Pid).get().then(doc => {
          console.log("GET in")
            if (doc.exists) {
              var que = doc.data().Queue;

              if(que.length > 1){
                que.shift();
              }

              this.Current_que = que[0].queue;
              console.log(que);
          
           firebaseApp.collection("RestaurantData").doc(this.$route.params.Pid).update({
              Queue: que
          })
          .then(function() {
              console.log("Document successfully updated!");
          })
          .catch(function(error) {
              // The document probably doesn't exist.
              console.error("Error updating document: ", error);
          });        
          } else {
              // doc.data() will be undefined in this case
              console.log("No such document!");
          }
      }).catch(function(error) {
          console.log("Error getting document:", error);
      });

      firebaseApp.collection("RestaurantData").doc(this.$route.params.Pid).get().then((doc) => {
        if(doc.exists){
          for(var x in doc.data().Queue){
            if( x < 5){
              this.$data.notiQueue[x] = doc.data().Queue[x]
              console.log("Data in: ",this.$data.notiQueue[x])
            }
          }
        }
      })


      

      var checkEmailLine = firebaseApp.collection("emailSignupFromLine")
      checkEmailLine.get().then((queryShapShot) => {
        queryShapShot.forEach((doc) => {
          if (this.$data.notiQueue.length > 2){
            for(var x = 2 ; x < this.$data.notiQueue.length ; x++){
              if(doc.id == this.$data.notiQueue[x].customerEmail){
                console.log("find Data")
                console.log("Doc user", doc.data().userIdLine)
                console.log("Queue", this.$data.notiQueue[x].queue)
                this.$data.lineUserId.push({
                  userId: doc.data().userIdLine,
                  userQueue: this.$data.notiQueue[x].queue
                })
                console.log("DATA", this.$data.lineUserId)
              } else {
              console.log("not find")
              }
            }
          } else {
            this.$data.lineUserId = []
          }
          
        })
      })

      setTimeout(() => {
        console.log("IN userid" , this.$data.lineUserId)
        var restaurantQueue = firebaseApp.collection("RestaurantData").doc(this.$route.params.Pid).collection("RestaurantQueue").doc("userId")
          restaurantQueue.set({
          userId: this.$data.lineUserId
        })
        setTimeout(() => {
          this.$data.lineUserId = []
          console.log("Notiqueue: ", this.$data.notiQueue)
          this.queueDone()
          var sendNoti = restaurantQueue
          sendNoti.get().then((doc) => {
            if(doc.data().userId.length > 0){
                for(var x in doc.data().userId) {
                  console.log("IN noti", doc.data().userId[x])
                  if(this.$data.notiQueue.length > 2){
                  this.sendNotitoUser(doc.data().userId[x].userId, this.Current_que, doc.data().userId[x].userQueue)
                  }
                }
       
              //this.sendNotitoUser(doc.data().userId[x])
            }
          })
          
          


        }, 500);
      }, 1000);
      
    },
    queueDone() {
      firebaseApp.collection("RestaurantData").doc(this.$route.params.Pid).get().then((doc) => {
        this.$data.Current_que = doc.data().Queue[0].queue;
          var setemail = doc.data().Queue[0].customerEmail
          setTimeout(() => {
            firebaseApp.collection("User").doc(setemail).get().then((doc) => {
              if(doc.data().Queue == this.$data.Current_que){
                  firebaseApp.collection("User").doc(setemail).update({
                  Queue: 0,
                  Restaurant: ""
                  })
              }
            })
          }, 500);
          
          })
    },
    sendNotitoUser(userId, currentQueue, userQueue){
      console.log("IN userid", userId)
      console.log("IN currentQueue", currentQueue)
      console.log("IN userQueue", userQueue)
      //console.log("trying to send noti", userId)
      //const request = require('request-promise');
      // var invocation = new XMLHttpRequest();
      // var urlline = 'https://api.line.me/v2/bot/message/push'
      // var bodyline = "body: {to: 'Uc7d94e2bf96f8cb56389107f8fbff8d1', messages: [{ type 'text', text: 'Hello, world'}]}"
      // if(invocation){
      //   invocation.open('POST', urlline, true);
      //   invocation.setRequestHeader('Authorization', 'Bearer 1hEDucdo64ySMmSQKj3wBqIzsnyiBewDH29Dt5EiE5O1UlSjwv90J1P28ASJjoW5cW0VmLZ0z1n5WH5E5rTpzh9eJXK9vqnZkgq/VqBB7KUbSlMddapMXU29VDQMt8MTo9V6qI0VnHUzFCYkOFvZTlGUYhWQfeY8sLGRXgo3xvw=')
      //   invocation.setRequestHeader('Content-Type', 'application/json' )
      //   invocation.setRequestHeader('Access-Control-Allow-Origin', '*')
      //   invocation.onreadystatechange = handler
      //   invocation.send(bodyline)
      // }


//       var request = require("request");

// var options = { method: 'POST',
//   url: 'https://api.line.me/v2/bot/message/push',
//   headers: 
//    { 'Postman-Token': '2949cf44-facc-4c5f-bfcc-aced5940189a',
//      'cache-control': 'no-cache',
//      'Access-Control-Allow-Origin': '*',
//      "X-Requested-With": "XMLHttpRequest",
//      'Authorization': 'Bearer 1hEDucdo64ySMmSQKj3wBqIzsnyiBewDH29Dt5EiE5O1UlSjwv90J1P28ASJjoW5cW0VmLZ0z1n5WH5E5rTpzh9eJXK9vqnZkgq/VqBB7KUbSlMddapMXU29VDQMt8MTo9V6qI0VnHUzFCYkOFvZTlGUYhWQfeY8sLGRXgo3xvw=',
//      'Content-Type': 'application/json' },
//   body: 
//    { to: 'Uc7d94e2bf96f8cb56389107f8fbff8d1',
//      messages: 
//       [ { type: 'text', text: 'Hello, world1' },
//         { type: 'text', text: 'Hello, world2' } ] },
//   json: true };

// request(options, function (error, response, body) {
//   if (error) throw new Error(error);

//   console.log(body);
// });

// var data = JSON.stringify({
//   "to": "Uc7d94e2bf96f8cb56389107f8fbff8d1",
//   "messages": [
//     {
//       "type": "text",
//       "text": "Hello, world1"
//     },
//     {
//       "type": "text",
//       "text": "Hello, world2"
//     }
//   ]
// });

// var xhr = new XMLHttpRequest();
// xhr.withCredentials = true;

// xhr.addEventListener("readystatechange", function () {
//   if (this.readyState === 4) {
//     console.log(this.responseText);
//   }
// });

// xhr.open("POST", "https://7d824f1d.ngrok.io/chatbot/1");
// xhr.setRequestHeader("Content-Type", "application/json");
// xhr.setRequestHeader("Authorization", "Bearer 1hEDucdo64ySMmSQKj3wBqIzsnyiBewDH29Dt5EiE5O1UlSjwv90J1P28ASJjoW5cW0VmLZ0z1n5WH5E5rTpzh9eJXK9vqnZkgq/VqBB7KUbSlMddapMXU29VDQMt8MTo9V6qI0VnHUzFCYkOFvZTlGUYhWQfeY8sLGRXgo3xvw=");
// xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
// xhr.setRequestHeader("cache-control", "no-cache");
// xhr.setRequestHeader("Postman-Token", "725538d2-f13e-435a-afd3-950cfefc6a3b");

// xhr.send(data);
// const line = require('@line/bot-sdk');

// const client = new line.Client({
//   channelAccessToken: 'Bearer 1hEDucdo64ySMmSQKj3wBqIzsnyiBewDH29Dt5EiE5O1UlSjwv90J1P28ASJjoW5cW0VmLZ0z1n5WH5E5rTpzh9eJXK9vqnZkgq/VqBB7KUbSlMddapMXU29VDQMt8MTo9V6qI0VnHUzFCYkOFvZTlGUYhWQfeY8sLGRXgo3xvw='
// });

// const message = {
//   type: 'text',
//   text: 'Hello World!'
// };

// client.pushMessage('Uc7d94e2bf96f8cb56389107f8fbff8d1', message)
//   .then(() => {
//     console.log("in push")
//   })
//   .catch((err) => {
//     // error handling
//     console.log("Not push")
//     console.log(err)
//   });



var xhr = new XMLHttpRequest();
xhr.withCredentials = true;

xhr.addEventListener("readystatechange", function () {
  if (this.readyState === 4) {
   //console.log(this.responseText);
  }
});

xhr.open("POST", "https://30353dd5.ngrok.io/noti/"+userId+"/"+currentQueue+"/"+userQueue, true);
xhr.send();

    },
    
    Update_Current_Que(currentque){
        
        
            firebaseApp.collection("RestaurantData").doc(this.$route.params.Pid).get().then(function(doc) {
            if (doc.exists) {
                var que = doc.data().Queue[0].queue

            firebaseApp.collection("RestaurantData").doc(this.$route.params.Pid).update({
                Queue: que
            })
            .then(function() {
                console.log("Document successfully updated!");
            })
            .catch(function(error) {
                // The document probably doesn't exist.
                console.error("Error updating document: ", error);
            });     

                
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        }).catch(function(error) {
            console.log("Error getting document:", error);
        });
        } 
}, // /method
 updated(){
    this.Restaurant_show_que();
    this.Restaurant_show_current_que()
},
beforeRouteUpdate (to, from, next){
  this.verifyUser(to.params.Pid)
  console.log("VERIFY BEFORE")
  setTimeout(() => {
    next()  
  }, 700);
  
},
beforeMount(){
  this.verifyUser(this.$route.params.Pid)
  console.log("VERIFY MOUNT")
}
};
</script>
<style>

#Show_que{
  display: block;
  background: #3CB371;
  font-size: 20px;
  width: 400px;
  height: 80%;
  margin-left: 900px;
  border-radius: 18px;
  margin-top: 150%;
  margin-right: 200px
}

#Show_current_que{
  display: block;
  background: #00BFFF;
  font-size: 20px;
  width: 400%;
  height: 20%;
  margin-left: 150px;
  border-radius: 18px;
  margin-top: 150%
  
}
#cardeck{
  background: #00BFFF;
  border-radius: 18px;
  
}
#button_nextque {
        display: flex;
        align-items: right;
        justify-content: right;
        margin-left: 1300%;
        margin-top: 500%;
}

.app{
  display: grid;
  grid-template-columns: 
  minmax(20px, 1fr) repeat(12, minmax(0, 100px)) minmax(20px, 1fr);
  grid-column-gap: 20px;
}
.grid__media {
  grid-column: 1 / 6; /* Start on Column 2 and end at the start of Column 9 */
}
.grid__text {
  grid-column: 10 / 14; /* Start on Column 10 and end at the start of Column 14 */
}

.grid__media,
.grid__text {
  grid-row: 1; /* We want to keep our items on the same row */
}



.grid__text1 {
  grid-column: 1 / 7; /* Start on Column 10 and end at the start of Column 14 */
}

.grid__media1 {
  grid-column: 6 / 10; /* Start on Column 10 and end at the start of Column 14 */
}
.grid__media1,
.grid__text1 {
  grid-row: 2; /* We want to keep our items on the same row */
}

.grid__text2 {
  grid-column: 3 / 4; /* Start on Column 10 and end at the start of Column 14 */
}


</style>