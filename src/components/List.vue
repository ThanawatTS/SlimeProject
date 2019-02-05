<template>
  <ul>
     <li v-for="Restname in RestuarantLocation">{{ Restname.Name }}
       <v-btn color="info" @click="FindLocation(Restname.location.latitude,Restname.location.longitude)">
          Find Location
       </v-btn>
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
        this.center = marker;
       }
    }
  }

</script>