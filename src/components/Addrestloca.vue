<template>
  <div id="app">
    <div>
      <input type="text"
        v-model="Name"
        @keyup.enter="addRestName">
      <input type="text"
        v-model="latt"
        @keyup.enter="addRestName">
        <input type="text"
        v-model="lon"
        @keyup.enter="addRestName">
      
      <button  @click="addRestName">
        Add Restuarant Name
      </button>
    
    </div>
    <ul class="Addrestname">
      <li v-for="Restname in RestuarantLocation" >
        {{ Restname.Name }} 
        {{ Restname.location.latitude}}
        <button @click="deleteRest(Restname)">
          Remove
        </button>
      </li>
    </ul>
  </div>
</template>

<script>
  import firebaseApp from './firebaseInit';
  import firebase from 'firebase/app'
  export default {
    name: 'app',
    data() {
      return {
        RestuarantLocation: [],//reptiles
        Name: '',
        latt : 0 ,
        lon : 0,
      }
    },
    firestore() {
      return {
        RestuarantLocation: firebaseApp.collection('RestuarantLocation'),
      }
    },
    methods: {
      addRestName: function() {
        this.$firestore.RestuarantLocation.add(
          {
            Name: this.Name,
            timestamp: new Date(),
            location: new firebase.firestore.GeoPoint(parseFloat(this.latt),parseFloat(this.lon)),
          }
        );
        this.Name = '';
        this.latt = 0;
        this.lon = 0;
        for (let i = 0; i < this.RestuarantLocation.length; i++){
        console.log(this.RestuarantLocation[i].location.latitude)
        }
      },
      deleteRest: function(restname) {
        this.$firestore.RestuarantLocation.doc(restname['.key']).delete();
      }
    }
  }
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }
  .reptileList {
    list-style: none;
  }
</style>
