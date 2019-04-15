<template>
  <div class = "app"> 
        <div id = "List" class="grid__text">
        <v-btn small color="yellow lighten-2" @click="addgeofire()">
        Test add geofire
        </v-btn>
        <v-btn small color="yellow lighten-2" @click="findnearby()">
        Test Find nearby
        </v-btn>
    
    <div v-for="Restname in RestaurantName">
    <v-layout>
    <v-flex xs12 sm6 offset-sm3>
      <v-card>
        <v-card-title primary-title>
          <div>
            <h3 class="headline mb-0">{{Restname}}</h3>
            <div> asdlksadlkasldklk </div>
          </div>
          <v-card-actions>
          <v-btn flat color="orange" @click="MakeQue(Restname)" >Que</v-btn>

        </v-card-actions>
        </v-card-title>


      </v-card>
    </v-flex>
  </v-layout>
</div>
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
      RestaurantName : [],
      RestuarantLocation: [],
      Currentlocation: [],
      latitude : 0,
      longitude : 0,
      firebaseRef : firebase.database().ref("location")
    };
  },
    
    created(){
      this.geolocate();
    },
    // watch(){
      
    // },
  methods: {
        //Find current location
        geolocate: function() {
          this.Currentlocation = [];
          navigator.geolocation.getCurrentPosition(position => {
            this.latitude = position.coords.latitude;
            this.longitude = position.coords.longitude;
            this.mapCenter = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            this.Currentlocation.push({position : this.mapCenter})
            console.log(this.Currentlocation)
          });
        },

        addgeofire () {
          var geoFire = new GeoFire(this.firebaseRef);
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
     
     findnearby: function() {
          var firebaseRef = firebase.database().ref("location")
          var radius = parseFloat(1000);
          var operation;
          var geoFire = new GeoFire(firebaseRef);
          var geoQuery;        
          this.Restaurant = []

          if (geoQuery) {
          geoQuery.cancel();
          clearLog();
          }
        
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
              this.RestaurantName.push(key);

                  
            });
            console.log(this.firebaseRef)

            geoQuery.on("key_exited", function(key, location, distance) {
              console.log(key + " is located at [" + location + "] which is no longer within the query (" + distance.toFixed(2) + " km from center)");
            });
      },
      MakeQue : function (restname) {
      console.log(restname.RestaurantMail)
      console.log(restname.Name)
      var Get_Que_Value = firebaseApp.collection("RestaurantData").doc(restname)
      
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
