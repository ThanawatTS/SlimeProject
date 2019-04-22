<template>

<body>

  <div class = "app" id = "color" > 
    <div id= "List">
    <ul>

        Current Restaurant : {{RestaurantName}} <br>
        Your Que :  {{Que}}

    </ul>
    </div>
  </div>
</body>
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

    };
  },
    created(){
        this.Getdata();
    },

    methods: {
    Getdata(){    
        firebaseApp.collection("User").doc("Pure").get().then( doc =>  {
        this.Que = doc.data().Queue;
        this.RestaurantName = doc.data().Restaurant;
        })
        

    }
  },
    updated() {
            this.Getdata();
        },
};
</script>


<style>

#List{

  font-size: 20px;
  background: greenyellow;
}

body {
  background-color: green;
}

#color{
  background: black;
}
.app{
 display: flex;
  height: 100%;
  justify-content: center;
  align-items: center;
  flex-direction: column;

}

</style>
