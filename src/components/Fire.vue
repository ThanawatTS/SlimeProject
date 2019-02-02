<template>
  <div id="app" class = "app">
   
   <div id= "List"  class="grid__text">
    <List />
   </div>
   <div id = "Maps" class="grid__media"> 
    <Maps />
   </div>

  </div>
</template>

<script>
import List from "./List.vue";
import Maps from "./Maps.vue";
export default {
  name: "App",
  components: {
    List,
    Maps
  }
};
</script>
<style>
#List{
  display: block;
  background: greenyellow;

}
#Maps{
  
}

.app{
  display: grid;
  grid-template-columns: 
  minmax(20px, 1fr) repeat(12, minmax(0, 100px)) minmax(20px, 1fr);
  grid-column-gap: 20px;
}
.grid__media {
  grid-column: 2 / 10; /* Start on Column 2 and end at the start of Column 9 */
}

.grid__text {
  grid-column: 10 / 14; /* Start on Column 10 and end at the start of Column 14 */
}

.grid__media,
.grid__text {
  grid-row: 1; /* We want to keep our items on the same row */
}
</style>
