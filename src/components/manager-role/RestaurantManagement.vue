<template>
    <div id="restaurantManagement">
        <h1>Restaurant</h1>
        <form>
            <label> Create Restaurant Name </label><br/>
            <input v-model="restName" placeholder="Input restaurant name">
            <v-btn @click.prevent="createRestaurant(restName)">Create</v-btn>
            <v-btn @click.prevent="pushQueue">Queue</v-btn>
            
            <div v-for="listName in showRestaurantList" :key="listName.id">
               <h2 > {{listName}} </h2>
                <v-btn round color="primary" dark @click.prevent="gotoRestaurant(listName)">Queue Manage</v-btn>
            </div>
        </form>



     <div>
      <h2>Search and add a pin</h2>
      <label>
        <gmap-autocomplete
        ref="autocomplete"
          @place_changed="setPlace">
        </gmap-autocomplete>
        <button @click="addMarker">Add</button>
      </label>
      <br/>

    </div>
    <br>
    <gmap-map
      :center="center"
      :zoom="10"
      style="width:100%;  height: 500px;"
    >
    <gmap-marker
        :position="center"
        @dragend="updateMaker" 
        :draggable="true"
    ></gmap-marker>
    
    
      <gmap-marker
        @dragend="updateMaker" 
        :key="index"
        v-for="(m, index) in markers"
        :position="m.position"
        @click="center=m.position"
        :draggable="true"
      ></gmap-marker>
    </gmap-map>
    </div>
</template>

<script>
import firebase from 'firebase'
import firebaseApp from '../firebase/firebaseInit'
import { exists } from 'fs';
import { GeoFire } from "geofire";
var emailDB = firebaseApp.collection("emailSignupFromWebsite")

export default {
    name: 'restaurantManagement',
    data () {
        return {
            userCur: "",
            restName: "",
            restaurantEach: { restaurantName: "", emailOwner: "", emailEmployee: "", restaurantArrange: ""},
            restuarantInfo: [],
            showRestaurantList: [],
            center: { lat: 45.508, lng: -73.587 },
            markers: [],
            places: [],
            currentPlace: null,
            lat: 0,
            lon: 0,
            firebaseRef : firebase.database().ref("location")
        }
    },
    mounted() {
        this.geolocate();
        },
    methods: {
    updateMaker: function(event) {
    let geocoder = new google.maps.Geocoder()

    geocoder.geocode({ 'latLng': event.latLng }, (result, status) => {
        console.log(event.latLng.lat())
        console.log(event.latLng.lng())
        this.lat = event.latLng.lat()
        this.lon = event.latLng.lng()
            
    })
},
        geolocate: function() {
            this.$getLocation(options)
            .then(coordinates => {
                this.center = coordinates;

            });
        },
        setPlace(place) {
             this.currentPlace = place;
        },
        addMarker() {
        this.markers = []
        if (this.currentPlace) {
            const marker = {
            lat: this.currentPlace.geometry.location.lat(), //use this for latitude
            lng: this.currentPlace.geometry.location.lng() //use this for longtitude
            };
            this.lat = this.currentPlace.geometry.location.lat()
            this.lon = this.currentPlace.geometry.location.lng()
            console.log(marker); // show restaurant position
            this.markers.push({ position: marker });
            this.places.push(this.currentPlace);
            this.center = marker;
            this.currentPlace = null;
        }
        },
        geolocate: function() {
        navigator.geolocation.getCurrentPosition(position => {
            this.center = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
            };
        });
        },




        gotoRestaurant(nameRestaurant){
            this.$router.push({name: 'Restaurant_que', params:{Pid: nameRestaurant}})
        },
        checkStatus(){
            var user = firebase.auth().currentUser;
                if(user){
                    this.$data.userCur = user.email;
                    console.log(this.$data.userCur)
                } else {
                    console.log("Didn't login yet")
                }
        },
        genPassword(){
            var emp_password = Math.random().toString(36).slice(-6)
            return emp_password
        },
        createRestaurant(rest_name){
            var user = firebase.auth().currentUser;
                if(user){
                    this.$data.userCur = user.email;
                    console.log(this.$data.userCur)
                } else {
                    console.log("Didn't login yet")
                }

            var restaurantCreate = firebaseApp.collection("RestaurantByUser").doc(this.$data.userCur).collection("RestaurantsListsName")
            var restaurantExist = restaurantCreate
            var checkRestaurantName = rest_name
            var emp_restaurant
            var restaurantArrangeNum = 1
            var existName = false
        
            restaurantExist.get().then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    console.log(doc.id, " => ", doc.data())
                    restaurantArrangeNum++
                    if(checkRestaurantName == doc.id){
                        console.log("This Name is already have!")
                        existName = true;
                    } else if (!existName) {
                        console.log("This Name not have Yet!")
                        console.log("NUM", restaurantArrangeNum)
                    }
                });
            })
            
            setTimeout(() => {
                if(existName){
                    console.log("Not add in database")
                } else {
                    
                    emp_restaurant = "EMP"+restaurantArrangeNum+"_"+this.$data.userCur
                    var emp_password = this.genPassword()

                    setTimeout(() => {
                    firebase.auth().createUserWithEmailAndPassword(emp_restaurant, emp_password).then( () => {

                        var restaurantData = firebaseApp.collection("RestaurantData")
                        restaurantData.doc(rest_name).set({
                            Location: new firebase.firestore.GeoPoint(parseFloat(this.lat),parseFloat(this.lon)),
                            Name: rest_name,
                            Queue: [],
                            RestaurantMail: this.$data.userCur,
                            EmployeeEmail: emp_restaurant
                        })

                        restaurantExist.doc(rest_name).set({
                            restaurantName: rest_name, 
                            emailOwner: this.$data.userCur,
                            emailEmployee: emp_restaurant,
                            restaurantArrange: restaurantArrangeNum
                        })

                        var setEmailToLWC = emp_restaurant.toLowerCase();
                        var employeeEmailDB = firebaseApp.collection("EmployeeEmail")

                        employeeEmailDB.doc(setEmailToLWC).set({
                            owner: this.$data.userCur,
                            role: "employee",
                        })
                        emailDB.doc(this.$data.userCur).collection("EmployeeEmail").doc(setEmailToLWC).set({
                            role: "employee",
                            newUser: false,
                            owner: this.$data.userCur,
                            password: emp_password,
                            restaurantArrange: restaurantArrangeNum
                        })
                        setTimeout(() => {
                            firebase.auth().signOut().then(() =>{
                                console.log("sign out!")
                                this.$router.push('/signin');
                                alert(" Employee\'s password: " + emp_password + " \n Please noted the password you will be force to sign in again");
                                setTimeout(() => {
                                    alert('Please sign in again to vertify Owner account');
                                }, 50);
                            })
                        }, 1200);

                    },  err => {
                            alert(err.message);
                            console.log("Can't created account");
                        });
                    }, 200);
                } 
            }, 1100);


            setTimeout(() => {
            this.addgeofire();
            }, 4000);      
            
            // restaurantExist.get().then(function(doc) {
            //     console.log(doc.data())
            //     if (doc.exists){
            //         for(var checkExistName in doc.data().Restaurant.RestaurantName){
            //             console.log("=========start")
            //             console.log("Count" + checkExistName)
            //             console.log("NAME: " + doc.data().Restaurant.RestaurantName[checkExistName].name)
            //             console.log("=========end")
            //             if(checkName == doc.data().Restaurant.RestaurantName[checkExistName].name){
            //                 console.log("This Name is already have!")
            //                 existName = true;
            //             } else {
            //                 console.log("Not have Yet!")
            //             }
            //         }
            //     }else{
            //         console.log("doc doesn't exist yet")
            //     }
            // })
            // setTimeout(() => {
            //     console.log(existName)
            //     if(existName){
            //         console.log("Not add in database")
            //     } else {

            //         this.$data.restaurantEach.name = this.$data.restuarantName
            //         var tar = this.iterationCopy(this.$data.restaurantEach)
            //         console.log("CheckedrestaurantInfo")
            //         console.log(tar)
            //         console.log(Object.values(tar))
            //         console.log(this.$data.restuarantInfo)
            //         this.$data.restuarantInfo.push(tar)
            //         //this.$data.restuarantInfo.push(this.$data.restaurantEach)
            //         console.log(Object.values(tar))
            //         //console.log(object.values(this.$data.restuarantInfo))
            //         var restaurantData = {
            //             Restaurant: {
            //                 RestaurantName: this.$data.restuarantInfo,
            //             }
            //         }
            //         restaurantCreate.set(restaurantData).then( function() {
            //             console.log("DOC Created!")
            //             this.$data.restaurantEach.name = ""
            //         })
                    

            //         // for (var x in this.$data.restaurantEach){
            //         //     console.log("===Each")
            //         //     console.log(this.$data.restaurantEach.name)
            //         //     console.log("===")
            //         //     console.log("==========Each2")
            //         //     console.log(Object.values(this.$data.restaurantEach))
            //         // }
            //         // for (var x in this.$data.restuarantInfo){
            //         //     console.log("===Info")
            //         //     console.log(this.$data.restuarantInfo[x].name)
            //         //     console.log("===")
            //         // }
                    
            //     } 
                
            // }, 1500);    
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
      },

        iterationCopy(src){
            var target = {}
            for(var prop in src){
                if (src.hasOwnProperty(prop)) {
                    target[prop] = src[prop];
                }
            }
            return target;
        },
        loadData(){
            var user = firebase.auth().currentUser;
                if(user){
                    this.$data.userCur = user.email;
                    console.log(this.$data.userCur)
                } else {
                    console.log("Didn't login yet")
                }

            
            var restaurantData = firebaseApp.collection("RestaurantByUser").doc(this.$data.userCur).collection("RestaurantsListsName")
            var temparr
            restaurantData.get().then((doc) => {

            })
            // restaurantData.get().then(function(doc) {
            //     console.log("1")
            //     if(doc.exists){
            //         console.log("2")
            //         // for(var x in doc.data().Restaurant.RestaurantName){
            //         //     restuarantInfo = doc.data().Restaurant.RestaurantName
            //         // }
            //         console.log("2"+ doc.data().Restaurant.RestaurantName)
            //         temparr = doc.data().Restaurant.RestaurantName
            //         console.log("loadData" + temparr)
            //     } else {
            //         console.log("N Doc")
            //     }
            // })
            setTimeout(() => {
                console.log("DATA", temparr)  
                this.$data.restuarantInfo = temparr
                if(temparr == null){
                    this.$data.restuarantInfo = []
                }
                console.log(this.$data.restuarantInfo)
            }, 1500);
            
        
        },
        
        showRestaurantName(){
            console.log(this.$data.userCur)
            var rest_name = firebaseApp.collection("RestaurantByUser").doc(this.$data.userCur).collection("RestaurantsListsName")
            rest_name.get().then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    console.log(doc.id)
                    this.$data.showRestaurantList.push(doc.id)
                })
            })
        }
    },
    beforeMount(){
        this.checkStatus()
        setTimeout(() => {
            this.showRestaurantName()
        }, 2500);       

      
    }
}

</script>