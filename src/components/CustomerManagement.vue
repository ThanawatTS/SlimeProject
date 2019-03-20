<template>
    <div id="customerManagement">
        <h1>Customer</h1>
        
    </div>
</template>

<script>
import firebase from 'firebase'
import firebaseApp from './firebaseInit'

export default {
    name: 'customerManagement',
    data() {
        return {}
    },
    methods: {
        checkStatus(){
            firebase.auth().onAuthStateChanged(function(user) {
                if(user){
                    console.log(user.email)
                } else {
                    console.log("Didn't login")
                }
            })

            
        }
    },
    beforeMount(){
        this.checkStatus()
    }
}
</script>