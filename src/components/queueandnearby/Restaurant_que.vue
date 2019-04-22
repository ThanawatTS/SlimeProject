<template>
  <div class = "app"> 
    <div id= "Show_que"  class="grid__text">
        <center>Que in Line</center>
        <ul>
        <tr v-for="(restaurant_que,index) in Que " :key = "index">       
        <td>  {{restaurant_que}} - {{index}} </td>
        </tr>
        </ul>
    </div>

    <div id = "Show_current_que" class="grid__text1">
      <b-card-group deck>
        <b-card bg-variant="primary" text-variant="white" header="Current Que" class="text-center">
        <b-card-text> {{Current_que}} </b-card-text>
         </b-card>
    </b-card-group>
       
  
    </div>

    <div id = "button" class="grid__text2">

        <v-btn small color="black" @click="Next_que()">
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
      Show_restaurant_que : firebaseApp.collection("RestaurantData").doc(this.$route.params.Pid)
    
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
        this.Current_que = doc.data().Queue[0];
  })
 },
    Next_que() {
        
        firebaseApp.collection("RestaurantData").doc(this.$route.params.Pid).get().then(doc => {
            if (doc.exists) {
              var que = doc.data().Queue;
              que.shift();
              this.Current_que = que[0];
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
    },
    
    Update_Current_Que(currentque){
        
        
            firebaseApp.collection("RestaurantData").doc(this.$route.params.Pid).get().then(function(doc) {
            if (doc.exists) {
                var que = doc.data().Queue
            
            
            firebaseApp.collection("RestaurantData").doc(this.$route.params.Pid).update({
                Queue: que[0]
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
  font-size: 20px;
  background: Grey;

}

#Show_current_que{
  display: block;
  font-size: 20px;
  background: greenyellow;
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
  grid-row: 1; /* We want to keep our items on the same row */
}

.grid__text2 {
  grid-column: 3 / 4; /* Start on Column 10 and end at the start of Column 14 */
}


</style>