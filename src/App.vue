<template>
<div id="app">
  <v-app id="inspire" dark>
    <v-navigation-drawer
      clipped
      fixed
      v-model="drawer"
      app
    >
      <v-list dense>
        <v-list-tile @click="Signin()">
          <v-list-tile-action>
            <v-icon>dashboard</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>History</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile @click="Signout()">
          <v-list-tile-action>
            <v-icon>settings_power</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Log Out</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar app fixed clipped-left>
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title>Slime Eater</v-toolbar-title>
    </v-toolbar>
    
    <v-content>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-content>

  </v-app>
</div>

</template>


<script>
export default {
  name: 'app',
  data (){
    return{
      drawer: true
    }
  },
  methods : {
    Signin(){
        this.$router.push('/signin') 
    },

    Signout(){
        this.$router.push('/signin') 
    }
    }
}
</script>
