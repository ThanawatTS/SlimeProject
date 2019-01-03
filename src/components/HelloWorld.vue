<template>
  <div>
    <input type="text" v-model="name"/>
    <button @click="submitName()">Add</button>
  </div>
</template>

<script>

export default {
  name: 'HelloWorld',
  data () {
    return {
      name: 'Name'
    }
  },
  methods: {
    submitName() {
      userCollection.push({ name: this.name, edit: false })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
