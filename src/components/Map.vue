<template>
  <div> 
     <button  @click="addMapMarkers">
        Find Restuarant
      </button>
    <br>
    <gmap-map
      :center="mapCenter"
      :zoom="12"
      style="width:100%;  height: 400px;"
    >

      <gmap-marker
         :key="index"
        v-for="(m, index) in markers"
        :position="m.position"
        @click="center=m.position"
        

              ></gmap-marker>
    </gmap-map>
  </div>
</template>

<script>
import firebaseApp from './firebaseInit';
import firebase from 'firebase/app'
export default {
  name: "GoogleMap",
  data() {
    return {
      mapCenter: { lat: 50.508, lng: -73.587 },
      markers: [],
      RestuarantLocation: [],
    };
  },
  firestore() {
      return {
        RestuarantLocation: firebaseApp.collection('RestuarantLocation'),
      }
    },

  mounted() {
    this.geolocate();
  },
  
  methods: {
    //add marker to the map
     addMapMarkers: function()  { 
      for (var i = 0; i < this.RestuarantLocation.length; i++){
        // console.log(typeof(this.RestuarantLocation[i].location.latitude))
      const marker = {
          lat: this.RestuarantLocation[i].location.latitude,
          lng: this.RestuarantLocation[i].location.longitude
        };
        this.markers.push({ position: marker });
        // console.log(markers)
        this.center = marker;
      }
    },
    //Find current location
    geolocate: function() {
      navigator.geolocation.getCurrentPosition(position => {
        this.mapCenter = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
      });
    },

  }
};
</script>