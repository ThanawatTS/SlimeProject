<template>

  <div class = "app"> 
    <div id= "List"  class="grid__text">
    <ul>

        Current Restaurant : {{RestaurantName}} <br>
        Your Que :  {{Que}}

    </ul>
    </div>
  </div>
</template>

<script>
import firebaseApp from './firebase/firebaseInit';
import firebase from 'firebase/app'
export default {
  name: "Maps",
  data() {
    return {
      Que : 0,
      RestaurantName : "",
      User_Que : firebaseApp.collection("User").doc("Pure")

    };
  },
    created(){
        this.test();
    },

    methods: {
    test(){    
        firebaseApp.collection("User").doc("Pure").get().then( doc =>  {
        this.Que = doc.data().Queue;
        this.RestaurantName = doc.data().Restaurant;
        })
        
        console.log("test")
    }
  },
    updated() {
            this.test();
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
