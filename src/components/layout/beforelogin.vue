<template>
<div id="user_sidebar">
  <v-app id="inspire" dark>
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
  name: 'beforelogin',
  data (){
    return{
      drawer: true
    }
  },
  methods : {

    }
}
</script>
