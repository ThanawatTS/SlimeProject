<template>
    <div id="usermanager" class="center">

        <h1>Welcome ! </h1>
        <h2> Please Choose Your Role </h2>

        
        <v-btn color="info" @click="claimTobeOwner"> Restuarant Owner</v-btn>


    
        <v-btn color="error" @click="claimTobeCustomer"> Customer </v-btn>
    
    
    
    </div>
</template>
 
<script>
import firebase from 'firebase';
import firebaseApp from '../firebase/firebaseInit'
var emailDB = firebaseApp.collection("emailSignupFromWebsite")

export default {
    name: 'userManager',
    data () {
        return {
            userCurrentEmail: ""
        }
    },
    methods: {
        claimTobeOwner(){
            this.setRestaurantRole()
            this.$router.push('/restaurantManagement')
        },
        claimTobeCustomer(){
            this.setCustomerRole()
            this.$router.push('/customerManagement')
        },
        setRestaurantRole(){
            var dbSetRole = emailDB.doc(this.$data.userCurrentEmail)
            dbSetRole.get().then((doc) => {
                if(doc.data().role == "newUser"){
                    console.log("INCONDITION")
                    console.log(doc.data())
                    dbSetRole.update({
                        role: "restaurantOwner",
                        newUser: false
                    }).then(() => {
                        console.log("Update! role become: restaurantOwner")
                    })
                    
                }
            })
        
        },
        setCustomerRole(){
            console.log("CUS",this.$data.userCurrentEmail)
            var dbSetRole = emailDB.doc(this.$data.userCurrentEmail)
            dbSetRole.get().then((doc) => {
                if(doc.data().role == "newUser"){
                    console.log("INCONDITION")
                    console.log(doc.data())
                    dbSetRole.update({
                        role: "customer",
                        newUser: true
                    }).then(() => {
                        console.log("Update! role become: customer")
                    })
                    
                }
            })
        },
        userCurrent(){
            var user = firebase.auth().currentUser;
             if(user){
            //     console.log(user.displayName)
            //     console.log(user.email)
            //     console.log(user.photoURL)
                this.$data.userCurrentEmail = user.email
                console.log(this.$data.userCurrentEmail)
             } else {
                   console.log("NO LONGER USER")
            }
        }
        
    },
    beforeMount(){        
        this.userCurrent()
    }
}
</script>
<style>
.center {
  text-align: center;

}
</style>