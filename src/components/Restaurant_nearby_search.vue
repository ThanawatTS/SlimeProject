<template>

  <div class = "app"> 
        <div id = "List" class="grid__text">
        <v-btn small color="yellow lighten-2" @click="addgeofire()">
        Test add geofire
        </v-btn>
        <v-btn small color="yellow lighten-2" @click="findnearby()">
        Test Find nearby
        </v-btn>
        
     <v-layout>
    <v-flex xs12 sm6 offset-sm3>
      <v-card>
        <v-card-title primary-title>
          <div>
            <h3 class="headline mb-0">Kangaroo Valley Safari</h3>
            <div> hello </div>
          </div>
          <v-card-actions>
          <v-btn flat color="orange">Share</v-btn>
          <v-btn flat color="orange">Explore</v-btn>
        </v-card-actions>
        </v-card-title>


      </v-card>
    </v-flex>
  </v-layout>
</div>
  <div id = "Maps" class="grid__media"> 
    <br>
        <gmap-map ref = "gmap"
        :center="mapCenter"
        :zoom="15"
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
import { GeoFire } from "geofire";
export default {
    name: "Maps",
    data() {
    return {
      mapCenter: { lat: 0, lng: 0 },
      markers: [],
      test : [],
      RestuarantLocation: [],
      Currentlocation: [],
      latitude : 0,
      longitude : 0,
      firebaseRef : firebaseApp.collection("Geofire").doc("Location")
    };
  },
    
    mounted(){
      this.geolocate();
  },

  methods: {
        //Find current location
        geolocate: function() {
          navigator.geolocation.getCurrentPosition(position => {
            this.latitude = position.coords.latitude;
            this.longitude = position.coords.longitude;
            this.mapCenter = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            this.Currentlocation.push({position : this.mapCenter})
          });
        },

        addgeofire () {
          var firebaseRef = firebase.database().ref("location");
          var geoFire = new GeoFire(firebaseRef);
          // Create a new GeoFire instance at the random Firebase location
          firebaseApp.collection("RestaurantData").get().then(function(querySnapshot) {
              querySnapshot.forEach(function(doc) {
                    var lat = doc.data().Location.latitude;
                    var lon = doc.data().Location.longitude;
                    var myID = doc.data().Name;
                    geoFire.set(myID, [lat, lon]).then(function() {
                    console.log(myID + ": setting position to [" + lat + "," + lon + "]");
                     });


                  console.log(doc.data().Name);
              });
          });
      },//end addgeofire
     
     findnearby () {
          var firebaseRef = firebase.database().ref("location");
          var radius = parseFloat(1000);
          var operation;
          var geoFire = new GeoFire(firebaseRef);
          var geoQuery;        
          var self =this;

        //   var getNearbyRestaurants = function() {
        // // Cancel the previous GeoQuery, if it exists, and clear the log
        //   if (geoQuery) {
        //   geoQuery.cancel();
        //   clearLog();
        //   }
        // }
          if (typeof geoQuery !== "undefined") {
          operation = "Updating";

          geoQuery.updateCriteria({
            center: [this.latitude, this.longitude],
            radius: radius
          });
            } else {
          operation = "Creating";

          geoQuery = geoFire.query({
            center: [this.latitude, this.longitude],
            radius: radius
          });
          }          

            geoQuery.on("key_entered", (key, location, distance ) => {
              console.log(key + " is located at [" + location[0] + "] which is within the query (" + distance.toFixed(2) + " km from center)");
              const marker = {
                lat: location[0],
                lng: location[1]
              };
              this.markers.push({ position: marker });
  
                  
            });
            console.log(firebaseRef)

            geoQuery.on("key_exited", function(key, location, distance) {
              console.log(key + " is located at [" + location + "] which is no longer within the query (" + distance.toFixed(2) + " km from center)");
            });
      },




  }//end method
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
