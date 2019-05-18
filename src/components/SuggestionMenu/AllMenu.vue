<template>
 <div class="AllMenu">
  <div class="container">
    
    <div v-for="alacrate in alacratemenuList" :key="alacrate.Name">
        <h3>{{ alacrate.Name }}</h3>
        <v-btn small @click="deleteMenu(alacrate.Name)"> Remove </v-btn>
    </div>

    <input v-model="menu_name" placeholder="Menu Name">
    <v-btn @click="addMenu(menu_name)"> Add Menu </v-btn>

  </div>
 </div>
</template>


<script>
import firebase from 'firebase';
import firebaseApp from '../firebase/firebaseInit'

var setupMenu = firebaseApp.collection("PreparedMenu")
var alacrateMenu = setupMenu.doc("ตามสั่ง")
export default {
    name: 'allMenu',
    data() {
        return {
           alacratemenuList: [],
           menu_name: "",
           duplicateMenu: true
        }
    },
    methods: {
        checkDuplicateName(name){
            for (var x in this.$data.alacratemenuList) {
                if( name == this.$data.alacratemenuList[x].Name) return false
                else if (this.$data.alacratemenuList.length-1 == x) return true
            }
        },
        deleteMenu(menuName) {
            for (var x in this.$data.alacratemenuList){
                if(this.$data.alacratemenuList[x].Name == index){
                    this.$data.alacratemenuList.splice(x, 1)
                }
            }

            this.$data.alacratemenuList.splice(menuName, 1)
            alacrateMenu.update({
                menu: this.$data.alacratemenuList
            })
        },
        addMenu(menuName) {
            if(this.checkDuplicateName(menuName)) {
                this.$data.alacratemenuList.push({
                    Name: menuName
                })
                alacrateMenu.update({
                    menu: this.$data.alacratemenuList
                })
            }
            
        },
        loadData(){
            setupMenu.get().then((querySnapShot) => {
                querySnapShot.forEach((doc) => {
                    if(doc.id == "ตามสั่ง"){
                        this.$data.alacratemenuList = doc.data().menu
                    }
                })
            })
        }
    },
    beforeMount(){
       this.loadData()
    }

 }
</script>