<template>
<div id="app">

  <v-app id="inspire" dark>
    
    <v-toolbar app fixed clipped-left>
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title>Slime Eater</v-toolbar-title>
    </v-toolbar>
    
    <v-content>
      <v-container fluid>
        <router-view></router-view>
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
