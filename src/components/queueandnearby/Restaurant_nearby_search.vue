<template>
  <div class = "app"> 
    <div id = "List" class="grid__text">
    
    <VueAutoVirtualScrollList
      :totalHeight="422"
      :defaultHeight="30"
      style="width: 100%;"
      
    >
   <div v-for="Restname in RestaurantName">
    
    <v-layout>
    <v-flex >
      <v-card height="200%">
        <v-card-title primary-title>
            <div>
              <h1 class="headline mb-0">{{Restname}}</h1>
              <h5> asdlksadlkasldklk </h5>
            </div>
            
            <v-card-actions>
            <v-btn flat color="orange" @click="MakeQue(Restname)" >Que</v-btn>
            </v-card-actions>
        </v-card-title>


          </v-card>
        </v-flex>
      </v-layout>
    </div>
  </VueAutoVirtualScrollList>
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
        :position="mapCenter"
        ></gmap-marker>
          
          <GmapCircle
            :center="mapCenter"
            :radius="5000"
            :visible="true"
          ></GmapCircle>

        </gmap-map>



    </div>
  </div>
</template>

<script>
import VueAutoVirtualScrollList from 'vue-auto-virtual-scroll-list'
import firebaseApp from '../firebase/firebaseInit';
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
      firebaseRef : firebase.database().ref("location"),
      geoQuery : null,
      queueArr: []
    };
  },
  components: { VueAutoVirtualScrollList },
    
    // created(){
    //   this.geolocate();
    // },
    created(){
      this.geolocate();
    },
    beforeUpdate(){
     this.geolocate();
    },
    // watch(){
      
    // },
  methods: {
        //Find current location
        geolocate: function() {
          this.$watchLocation({
          enableHighAccuracy: false, //defaults to false
          timeout: Infinity, //defaults to Infinity
          maximumAge: 0 //defaults to 0
          })
          .then(location => {
          this.mapCenter = location
          var firebaseRef = firebase.database().ref("location")
          var radius = parseFloat(10);
          var operation; 
          var geoFire = new GeoFire(firebaseRef);
          this.Restaurant = []
          
          if (this.geoQuery != null) {
          this.operation = "Updating";

          this.geoQuery.updateCriteria({
            center: [location.lat, location.lng],
            radius: radius
          });
            } else {
          console.log(location[0] + "///" + location[1])
          operation = "Creating";
          this.geoQuery = geoFire.query({
            center: [location.lat, location.lng],
            radius: radius
          });
         
          this.geoQuery.on("key_entered", (key, location, distance) => {
              const marker = {
                lat: location[0],
                lng: location[1]
              };
              this.markers.push({ position: marker });
              this.RestaurantName.push(key); 
            });
          }  
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
     
      MakeQue : function (restname) {
      var Get_Que_Value = firebaseApp.collection("RestaurantData").doc(restname)
      var user = firebase.auth().currentUser;
        if(user){
          var Save_User_Que = firebaseApp.collection("User").doc(user.email)
        } else {
          console.log("Didn't login yet")
        }

      Save_User_Que.get().then((doc) => {
        console.log("doc queue" , doc.data().Queue)
        if(doc.data().Queue == 0){

          Get_Que_Value.get().then( (doc) =>  {
            console.log("IN restname: ", restname)
            if (doc.exists) {
              var que = doc.data().Queue
              this.$data.queueArr = doc.data().Queue
              console.log("que",que)
              console.log("que length", doc.data().Queue.length)
              console.log("Document data:", doc.data().Queue);
              console.log(que[que.length-1].queue+1)
              this.$data.queueArr.push({
                queue: que[que.length-1].queue+1,
                customerEmail: user.email
              })
              console.log("queuearr", this.$data.queueArr)
         
              Get_Que_Value.update({
                Queue: this.$data.queueArr
              })

              Save_User_Que.update({
                Restaurant : restname,
                Queue: que[que.length-1].queue+1
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
        
        } else {
          console.log("User only have Queue")
        }

        })


    },




  }//end method
};
</script>


<style>
#List{
  display: block;
}

.app{
  display: grid;
  grid-template-columns: 
  minmax(20px, 1fr) repeat(12, minmax(0, 100px)) minmax(20px, 1fr);
  grid-column-gap: 20px;
  grid-row-gap: 20px;
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