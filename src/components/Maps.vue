<template>
  <div class = "app"> 
    <div id= "List"  class="grid__text">
    <ul>
     <li v-for="Restname in RestuarantLocation">{{ Restname.Name }}
       <button @click="FindLocation(Restname.location.latitude,Restname.location.longitude)">
          Find Location
       </button>
     </li>
    </ul>
  </div>
   <div id = "Maps" class="grid__media"> 
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
    ></gmap-marker>

    <gmap-marker
      :key="index"
      v-for="(x, index) in Currentlocation"
      :position="x.position"
      @click="center=m.position"
    ></gmap-marker>
    </gmap-map>

    </div>
  </div>
</template>

<script>
import firebaseApp from './firebaseInit';
import firebase from 'firebase/app'
export default {
  name: "Maps",
  data() {
    return {
      mapCenter: { lat: 0, lng: 0 },
      markers: [],
      RestuarantLocation: [],
      Currentlocation: [],
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
    //Find current location
    geolocate: function() {
      navigator.geolocation.getCurrentPosition(position => {
        this.mapCenter = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        console.log(position.coords.latitude)
        this.Currentlocation.push({position : this.mapCenter})
      });
    },
    FindLocation : function (Latitude,Longtitude) {
        this.markers.pop();
        const marker = {
          lat: Latitude,
          lng: Longtitude
        };
        this.markers.push({ position: marker });
        this.center = marker;
       }
  }
};
</script>
<style>
#List{
  display: block;
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
