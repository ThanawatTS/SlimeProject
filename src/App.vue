<template>
<div id="app">
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