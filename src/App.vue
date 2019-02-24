<template>
  <v-app id="app">
    <v-toolbar dark>
      <v-toolbar-title>Slime Eater</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn flat to="/signup">
          <v-icon left>supervisor_account</v-icon>
          Sign Up
        </v-btn>
        <v-btn flat to="/signin">
          <v-icon left>supervisor_account</v-icon>
          Sign In
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>

    <v-content>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-content>

    <v-footer dark></v-footer>
    
  </v-app>
</template>


<script>
export default {
  name: 'app',
  data (){
    return{

    }
  }
}
</script>
