<template>
  <div class = "app"> 
    <div id= "List"  class="grid__text">
    <ul>
    
    <td v-for="Restname in Restaurantname">       
        {{Restname.Name}}
          <v-btn small color="yellow lighten-2" @click="MakeQue(Restname)">
          Que
          </v-btn>
       </td>
      </ul>
    </div>
  </div>
</template>

<script>
import firebaseApp from './firebaseInit';
import firebase from 'firebase/app'
export default {
  name: "Que",
  data() {
    return {
      que : [1,2]
    }
  },
  firestore() {
      return {
         Restaurantname : firebaseApp.collection("RestaurantData")
        
      }
  },

  methods: {
    MakeQue : function (restname) {
      console.log(restname.RestaurantMail)
      console.log(restname.Name)
      var Get_Que_Value = firebaseApp.collection("RestaurantByUser").doc(restname.RestaurantMail).collection("RestaurantsListsName").doc(restname.Name)
      
      Get_Que_Value.get().then(function(doc) {
          if (doc.exists) {
              var que = doc.data().Queue
              console.log("Document data:", doc.data().Queue);
              console.log(que[que.length-1])
              console.log(que[que.length-1]+1)
              que.push(que[que.length-1]+1)
              console.log(que)
          
          Get_Que_Value.update({
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

          
          // //temp[0].queue.push(temp[0].queue[temp[0].queue.length-1]+1)
          // temp[0].queue.push(2)

          // console.log('test' + temp[0].queue )
          // que.update({
          //     queue: temp[0].queue
          // })
          // .then(function() {
          //     console.log("Document successfully updated!");
          // })
          // .catch(function(error) {
          //     // The document probably doesn't exist.
          //     console.error("Error updating document: ", error);
          // });     
    },
  },
};
</script>
<style>
#List{
  display: block;
  font-size: 20px;
  background: greenyellow;
}
#Maps{
}
.app{
  display: grid;
  grid-template-columns: 
  minmax(20px, 1fr) repeat(12, minmax(0, 100px)) minmax(20px, 1fr);
  grid-column-gap: 20px;
}
.grid__media {
  grid-column: 2 / 10; /* Start on Column 2 and end at the start of Column 9 */
}
.grid__text {
  grid-column: 10 / 14; /* Start on Column 10 and end at the start of Column 14 */
}
.grid__media,
.grid__text {
  grid-row: 1; /* We want to keep our items on the same row */
}
</style>
