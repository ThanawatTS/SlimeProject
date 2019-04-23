<template>
<div id="user_sidebar">
<v-app style="
    background: #3A1C71;
    background: -webkit-linear-gradient(to right, #FFAF7B, #D76D77, #3A1C71);
    background: linear-gradient(to right, rgba(212,228,239,1) 0%, rgba(134,174,204,1) 100%);
  ">
    <v-navigation-drawer
      clipped
      fixed
      v-model="drawer"
      app
    >
      <v-list dense>
        <v-list-tile @click="customerManager()">
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
  
        <router-view></router-view>
     
    </v-content>
  </v-app>

</div>

</template>


<script>
export default {
  name: 'user_sidebar',
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
        },
    customerManager() {
            this.$router.push('/customerManagement')
        },
        
    
      
    }
}
</script>
<style>
#user_sidebar{
color:red
}
</style>