<template>
<div id="user_sidebar">
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
            <v-icon>account_box</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>History</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
          <v-list-tile @click="suggestionMenu()">
          <v-list-tile-action>
            <v-icon>chrome_reader_mode</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>suggestionMenu</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
          <v-list-tile @click="queuing()">
          <v-list-tile-action>
            <v-icon>supervised_user_circle</v-icon>
          </v-list-tile-action> 
          <v-list-tile-content>
            <v-list-tile-title>Que</v-list-tile-title>
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
  name: 'restaurant_sidebar',
  data (){
    return{
      drawer: false
    }
  },
  methods : {
    Signin(){
        this.$router.push('/signin') 
    },

    Signout(){
        this.$router.push('/signin') 
    },
    suggestionMenu() {
            this.$router.push('/suggestion')
        },
    queuing() {
            this.$router.push('/maps')
        }
    }
}
</script>
