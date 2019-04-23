<template>
  <div class = "content"> 
    <div id = "top">
    <h1>Find restaurants around you</h1>
    <p>Restaurant on the list are within 10 km.</p>
    <p>Use button below to refresh your location</p>
    <a href="#" class="btn-3d cyan" @click="geolocate()">Refresh</a>
    </div>

    <div id = "right"> 
      <VueAutoVirtualScrollList
        :totalHeight="422"
        :defaultHeight="30"
        style="width: 100%;"
      >
    <div v-for="Restname in RestaurantName" >
      
      <v-layout>
      <v-flex >
        <v-card height="200%" color="blue-grey">
          <v-card-title primary-title>
              <div>
                <h1 class="headline mb-0">{{Restname}}</h1>
            </div>
              <v-spacer></v-spacer>
              <v-card-actions>
                 <a href="#" class="btn-two blue rounded" @click="MakeQue(Restname)">Join</a>

              </v-card-actions>
          </v-card-title>


            </v-card>
          </v-flex>
        </v-layout>
      </div>
    </VueAutoVirtualScrollList>
  </div>



  <div id = "left"> 
    <br>
        <gmap-map ref = "gmap"
        :center="mapCenter"
        :zoom="10"
        style="width:100%;  height: 400px;"
        >
       
        <gmap-marker
        :key="index"
        v-for="(m, index) in markers"
        :position="m.position"
        ></gmap-marker>

        
        <gmap-marker
        :position="mapCenter"
        icon = "https://img.icons8.com/color/48/000000/region-code.png"
        ></gmap-marker>
          
          <GmapCircle
            :center="mapCenter"
            :radius="10000"
            :visible="true"
          ></GmapCircle>
        </gmap-map>
    </div>
  </div>
</template>

<script>
import VueAutoVirtualScrollList from 'vue-auto-virtual-scroll-list';
import firebaseApp from '../firebase/firebaseInit';
import firebase from 'firebase/app';
import {gmapApi} from 'vue2-google-maps'
import { GeoFire } from "geofire";
export default {
    name: "Maps",
    data() {
    return {
      mapCenter: { lat: 0, lng: 0 },
      icon: {},
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
    // watch(){
      
    // },
  methods: {
        //Find current location
        geolocate: function() {
          console.log("from geolocation")
          this.$watchLocation({
          enableHighAccuracy: false, //defaults to false
          timeout: Infinity, //defaults to Infinity
          maximumAge: 0 //defaults to 0
          })
          .then(location => {
          this.mapCenter = location
          this.icon ='https://image.flaticon.com/teams/slug/google.jpg'
        
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
                    geoFire.update(myID, [lat, lon]).then(function() {
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
p{
    font-family : "Courier New";

}
#content > div {
    height:240px;
    box-sizing:border-box;
    -moz-box-sizing:border-box;
}
#left {
    float:left;
    width: 50%;
    margin: auto;

    text-align: center;
}
#right {
    float:right;
    width: 45%;
    text-align: center;
    

}
#bottom {
    border-top:1px solid black;
    clear: both;

}

/* If you want the content centered horizontally and vertically */


body {
    margin: 0;
    background: #eaedf1;
    font-family: 'Lato', sans-serif;
}

h2 {
    color: #89867e;
    text-align: center;
    font-weight: 300;
}
.color {
    width: 350px;
    margin: 0 auto;
}
.color li {
    margin: 0 15px 0 0;
    width: 30px;
    height: 30px;
    display: inline-block;
    border-radius: 100%;
}
.color .red    {background: #fa5a5a;}
.color .yellow {background: #f0d264;}
.color .green  {background: #82c8a0;}
.color .cyan   {background: #7fccde;}
.color .blue   {background: #6698cb;}
.color .purple {background: #6e899b;}

.content, 
.content-gradient, 
.content-3d {
  margin: 40px auto;
}
.content {
  width: 80%;
  max-width: 900px;

}
.content-3d {
  width: 50%;
  max-width: 300px;
}
pre {
    width: 100%;
    padding: 30px;
    background-color: rgba(0, 0, 0, 0.72);
    color: #f8f8f2;
    border-radius: 0 0 4px 4px;
    margin-top: 20px;
  white-space: pre-wrap; /* css-3 */
  white-space: -moz-pre-wrap; /* Mozilla, since 1999 */
  white-space: -pre-wrap; /* Opera 4-6 */
  white-space: -o-pre-wrap; /* Opera 7 */
  word-wrap: break-word; /* Internet Explorer 5.5+ */
}
pre .bt  {color: #f8f8f2;} /* <> */
pre .anc {color: #f92672;} /* anchor tag */
pre .att {color: #a6a926;} /* attribute */
pre .val {color: #e6db74;} /* value */


.btn, .btn-two {
    margin: 9px;
}
.btn-gradient {
    margin: 5px;
}
a[class*="btn"] {text-decoration: none;}
input[class*="btn"], 
button[class*="btn"] {border: 0;}

/* Here you can change the button sizes */
.btn.large, 
.btn-two.large, 
.btn-effect.large {
  padding: 20px 40px; 
  font-size: 22px;
}
.btn.small, 
.btn-two.small, 
.btn-gradient.small, 
.btn-effect.small {
  padding: 8px 18px;  
  font-size: 14px;
}
.btn.mini, 
.btn-two.mini, 
.btn-gradient.mini, 
.btn-effect.mini {
  padding: 4px 12px;  
  font-size: 12px;
}
.btn.block, 
.btn-two.block, 
.btn-gradient.block, 
.btn-effect.block {
  display: block;
  width: 60%;
  margin-left: auto;
  margin-right: auto;
  text-align: center;
}
.btn-gradient.large {
  padding: 15px 45px; 
  font-size: 22px;
}

/* Colors for .btn and .btn-two */
.btn.blue, .btn-two.blue     {background-color: #7fb1bf;}
.btn.green, .btn-two.green   {background-color: #9abf7f;}
.btn.red, .btn-two.red       {background-color: #fa5a5a;}
.btn.purple, .btn-two.purple {background-color: #6e899b;}
.btn.cyan, .btn-two.cyan     {background-color: #7fccde;}
.btn.yellow, .btn-two.yellow {background-color: #f0d264;}

.rounded {
  border-radius: 10px;
}

/* default button style */
.btn {
    position: relative;
    border: 0;
    padding: 15px 25px;
    display: inline-block;
    text-align: center;
    color: white;
}
.btn:active {
    top: 4px;   
}

/* color classes for .btn */
.btn.blue {box-shadow: 0px 4px #74a3b0;}
.btn.blue:active {box-shadow: 0 0 #74a3b0; background-color: #709CA8;}

.btn.green {box-shadow: 0px 4px 0px #87a86f;}
.btn.green:active {box-shadow: 0 0 #87a86f; background-color: #87a86f;}

.btn.red {box-shadow:0px 4px 0px #E04342;}
.btn.red:active {box-shadow: 0 0 #ff4c4b; background-color: #ff4c4b;}

.btn.purple {box-shadow:0px 4px 0px #6e899b;}
.btn.purple:active {box-shadow: 0 0 #BA8CB5; background-color: #BA8CB5;}

.btn.cyan {box-shadow:0px 4px 0px #73B9C9;}
.btn.cyan:active {box-shadow: 0 0 #73B9C9; background-color: #70B4C4;}

.btn.yellow {box-shadow:0px 4px 0px #D1B757;}
.btn.yellow:active {box-shadow: 0 0 #ff4c4b; background-color: #D6BB59;}

/* Button two - I have no creativity for names */
.btn-two {
    color: white;   
    padding: 3px 15px;
    display: inline-block;
    border: 1px solid rgba(0,0,0,0.21);
    border-bottom-color: rgba(0,0,0,0.34);
    text-shadow:0 1px 0 rgba(0,0,0,0.15);
    box-shadow: 0 1px 0 rgba(255,255,255,0.34) inset, 
                      0 2px 0 -1px rgba(0,0,0,0.13), 
                      0 3px 0 -1px rgba(0,0,0,0.08), 
                      0 3px 13px -1px rgba(0,0,0,0.21);
}
.btn-two:active {
    top: 1px;
    border-color: rgba(0,0,0,0.34) rgba(0,0,0,0.21) rgba(0,0,0,0.21);
    box-shadow: 0 1px 0 rgba(255,255,255,0.89),0 1px rgba(0,0,0,0.05) inset;
    position: relative;
}
/* 3D Button */
.btn-3d {
    position: relative;
    display: inline-block;
    font-size: 22px;
    padding: 2px 20px;
    color: white;
    margin: 20px 10px 10px;
    border-radius: 6px;
    text-align: center;
    transition: top .01s linear;
    text-shadow: 0 1px 0 rgba(0,0,0,0.15);
}
.btn-3d.red:hover    {background-color: #e74c3c;}
.btn-3d.blue:hover   {background-color: #699DD1;}
.btn-3d.green:hover  {background-color: #80C49D;}
.btn-3d.purple:hover {background-color: #D19ECB;}
.btn-3d.yellow:hover {background-color: #F0D264;}
.btn-3d.cyan:hover   {background-color: #82D1E3;}

.btn-3d:active {
    top: 9px;
}

/* 3D button colors */
.btn-3d.red {
    background-color: #e74c3c;
    box-shadow: 0 0 0 1px #c63702 inset,
        0 0 0 2px rgba(255,255,255,0.15) inset,
        0 8px 0 0 #C24032,
        0 8px 0 1px rgba(0,0,0,0.4),
                0 8px 8px 1px rgba(0,0,0,0.5);
}
.btn-3d.red:active {
    box-shadow: 0 0 0 1px #c63702 inset,
                0 0 0 2px rgba(255,255,255,0.15) inset,
                0 0 0 1px rgba(0,0,0,0.4);
}

.btn-3d.blue {
    background-color: #6DA2D9;
    box-shadow: 0 0 0 1px #6698cb inset,
                0 0 0 2px rgba(255,255,255,0.15) inset,
                0 8px 0 0 rgba(110, 164, 219, .7),
                0 8px 0 1px rgba(0,0,0,.4),
                0 8px 8px 1px rgba(0,0,0,0.5);
}
.btn-3d.blue:active {
    box-shadow: 0 0 0 1px #6191C2 inset,
                0 0 0 2px rgba(255,255,255,0.15) inset,
                0 0 0 1px rgba(0,0,0,0.4);
}

.btn-3d.green {
    background-color: #82c8a0;
    box-shadow: 0 0 0 1px #82c8a0 inset,
                0 0 0 2px rgba(255,255,255,0.15) inset,
                0 8px 0 0 rgba(126, 194, 155, .7),
                0 8px 0 1px rgba(0,0,0,.4),
                0 8px 8px 1px rgba(0,0,0,0.5);
}
.btn-3d.green:active {
    box-shadow: 0 0 0 1px #82c8a0 inset,
                0 0 0 2px rgba(255,255,255,0.15) inset,
                0 0 0 1px rgba(0,0,0,0.4);
}

.btn-3d.purple {
    background-color: #cb99c5;
    box-shadow: 0 0 0 1px #cb99c5 inset,
                0 0 0 2px rgba(255,255,255,0.15) inset,
                0 8px 0 0 rgba(189, 142, 183, .7),
                0 8px 0 1px rgba(0,0,0,.4),
                0 8px 8px 1px rgba(0,0,0,0.5);
}
.btn-3d.purple:active {
    box-shadow: 0 0 0 1px #cb99c5 inset,
                0 0 0 2px rgba(255,255,255,0.15) inset,
                0 0 0 1px rgba(0,0,0,0.4);
}

.btn-3d.cyan {
    background-color: #7fccde;
    box-shadow: 0 0 0 1px #7fccde inset,
                0 0 0 2px rgba(255,255,255,0.15) inset,
                0 8px 0 0 rgba(102, 164, 178, .6),
                0 8px 0 1px rgba(0,0,0,.4),
                0 8px 8px 1px rgba(0,0,0,0.5);
}
.btn-3d.cyan:active {
    box-shadow: 0 0 0 1px #7fccde inset,
                0 0 0 2px rgba(255,255,255,0.15) inset,
                0 0 0 1px rgba(0,0,0,0.4);
}

.btn-3d.yellow {
    background-color: rgb(13, 87, 100);
    box-shadow: 0 0 0 1px #F0D264 inset,
                0 0 0 2px rgba(255,255,255,0.15) inset,
                0 8px 0 0 rgba(196, 172, 83, .7),
                0 8px 0 1px rgba(0,0,0,.4),
                0 8px 8px 1px rgba(0,0,0,0.5);
}
.btn-3d.yellow:active {
    box-shadow: 0 0 0 1px #F0D264 inset,
                0 0 0 2px rgba(255,255,255,0.15) inset,
                0 0 0 1px rgba(0,0,0,0.4);
}

/* Gradient buttons */
.btn-gradient {
    text-decoration: none;
    color: white;
    padding: 10px 30px;
    display: inline-block;
    position: relative;
    border: 1px solid rgba(0,0,0,0.21);
    border-bottom: 4px solid rgba(0,0,0,0.21);
    border-radius: 4px;
    text-shadow: 0 1px 0 rgba(0,0,0,0.15);
}
/* Gradient - ugly css is ugly */
.btn-gradient.cyan {
    background: rgba(27,188,194,1);
    background: -webkit-gradient(linear, 0 0, 0 100%, from(rgba(27,188,194,1)), to(rgba(24,163,168,1)));
    background: -webkit-linear-gradient(rgba(27,188,194,1) 0%, rgba(24,163,168,1) 100%);
    background: -moz-linear-gradient(rgba(27,188,194,1) 0%, rgba(24,163,168,1) 100%);
    background: -o-linear-gradient(rgba(27,188,194,1) 0%, rgba(24,163,168,1) 100%);
    background: linear-gradient(rgba(27,188,194,1) 0%, rgba(24,163,168,1) 100%);
    filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#1bbcc2', endColorstr='#18a3a8', GradientType=0);
}

.btn-gradient.red{ 
    background: rgba(250,90,90,1);
    background: -webkit-gradient(linear, 0 0, 0 100%, from(rgba(250,90,90,1)), to(rgba(232,81,81,1)));
    background: -webkit-linear-gradient(rgba(250,90,90,1) 0%, rgba(232,81,81,1) 100%);
    background: -moz-linear-gradient(rgba(250,90,90,1) 0%, rgba(232,81,81,1) 100%);
    background: -o-linear-gradient(rgba(250,90,90,1) 0%, rgba(232,81,81,1) 100%);
    background: linear-gradient(rgba(250,90,90,1) 0%, rgba(232,81,81,1) 100%);
    filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#fa5a5a', endColorstr='#e85151', GradientType=0 );
}
.btn-gradient.orange {
    background: rgba(255,105,30,1);
    background: -webkit-gradient(linear, 0 0, 0 100%, from(rgba(255,105,30,1)), to(rgba(230,95,28,1)));
    background: -webkit-linear-gradient(rgba(255,105,30,1) 0%, rgba(230,95,28,1) 100%);
    background: -moz-linear-gradient(rgba(255,105,30,1) 0%, rgba(230,95,28,1) 100%);
    background: -o-linear-gradient(rgba(255,105,30,1) 0%, rgba(230,95,28,1) 100%);
    background: linear-gradient(rgba(255,105,30,1) 0%, rgba(230,95,28,1) 100%);
}
.btn-gradient.blue {
    background: rgba(102,152,203,1);
    background: -moz-linear-gradient(top, rgba(102,152,203,1) 0%, rgba(92,138,184,1) 100%);
    background: -webkit-gradient(left top, left bottom, color-stop(0%, rgba(102,152,203,1)), color-stop(100%, rgba(92,138,184,1)));
    background: -webkit-linear-gradient(top, rgba(102,152,203,1) 0%, rgba(92,138,184,1) 100%);
    background: -o-linear-gradient(top, rgba(102,152,203,1) 0%, rgba(92,138,184,1) 100%);
    background: -ms-linear-gradient(top, rgba(102,152,203,1) 0%, rgba(92,138,184,1) 100%);
    background: linear-gradient(to bottom, rgba(102,152,203,1) 0%, rgba(92,138,184,1) 100%);
    filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#6698cb', endColorstr='#5c8ab8', GradientType=0 );
}
.btn-gradient.purple { 
    background: rgba(203,153,197,1);
    background: -moz-linear-gradient(top, rgba(203,153,197,1) 0%, rgba(181,134,176,1) 100%);
    background: -webkit-gradient(left top, left bottom, color-stop(0%, rgba(203,153,197,1)), color-stop(100%, rgba(181,134,176,1)));
    background: -webkit-linear-gradient(top, rgba(203,153,197,1) 0%, rgba(181,134,176,1) 100%);
    background: -o-linear-gradient(top, rgba(203,153,197,1) 0%, rgba(181,134,176,1) 100%);
    background: -ms-linear-gradient(top, rgba(203,153,197,1) 0%, rgba(181,134,176,1) 100%);
    background: linear-gradient(to bottom, rgba(203,153,197,1) 0%, rgba(181,134,176,1) 100%);
    filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#cb99c5', endColorstr='#b586b0', GradientType=0 );
}
.btn-gradient.yellow {
    background: rgba(240,210,100,1);
    background: -webkit-gradient(linear, 0 0, 0 100%, from(rgba(240,210,100,1)), to(rgba(229,201,96,1)));
    background: -webkit-linear-gradient(rgba(240,210,100,1) 0%, rgba(229,201,96,1) 100%);
    background: -moz-linear-gradient(rgba(240,210,100,1) 0%, rgba(229,201,96,1) 100%);
    background: -o-linear-gradient(rgba(240,210,100,1) 0%, rgba(229,201,96,1) 100%);
    background: linear-gradient(rgba(240,210,100,1) 0%, rgba(229,201,96,1) 100%);
    filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#f0d264', endColorstr='#e5c960', GradientType=0 );
}
.btn-gradient.green {
    background: rgba(130,200,160,1);
    background: -moz-linear-gradient(top, rgba(130,200,160,1) 0%, rgba(130,199,158,1) 100%);
    background: -webkit-gradient(left top, left bottom, color-stop(0%, rgba(130,200,160,1)), color-stop(100%, rgba(130,199,158,1)));
    background: -webkit-linear-gradient(top, rgba(130,200,160,1) 0%, rgba(130,199,158,1) 100%);
    background: -o-linear-gradient(top, rgba(130,200,160,1) 0%, rgba(130,199,158,1) 100%);
    background: -ms-linear-gradient(top, rgba(130,200,160,1) 0%, rgba(130,199,158,1) 100%);
    background: linear-gradient(to bottom, rgba(130,200,160,1) 0%, rgba(124, 185, 149, 1) 100%);
    filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#82c8a0', endColorstr='#82c79e', GradientType=0 );
}

.btn-gradient.red:active      {background: #E35252;}
.btn-gradient.orange:active {background: #E8601B;}
.btn-gradient.cyan:active   {background: #169499;}
.btn-gradient.blue:active   {background: #608FBF;}
.btn-gradient.purple:active {background: #BD8EB7;}
.btn-gradient.yellow:active {background: #DBC05B;}
.btn-gradient.green:active  {background: #72B08E;}
</style>