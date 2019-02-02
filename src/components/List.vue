<template>
  <ul>
     <li v-for="Restname in RestuarantLocation">{{ Restname.Name }}
       <button @click="FindLocation(Restname.location.latitude,Restname.location.longitude)">
          Find Location
       </button>


     </li>
   
  </ul>
</template>

<script>
  import firebaseApp from './firebaseInit';
  import firebase from 'firebase/app'
  export default {
    name: "List",
    data () {
      return {
          RestuarantLocation: [],
      }
    },
    firestore() {
      return {
        RestuarantLocation: firebaseApp.collection('RestuarantLocation'),
      }
    },
    method: {

       FindLocation : function (Latitude,Longtitude) {
            const marker = {
          lat: Latitude,
          lng: Longtitude
        };
        this.markers.push({ position: marker });
        // console.log(markers)
        this.center = marker;

       }
    }
  }


</script>