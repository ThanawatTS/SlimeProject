<template>
    <div id="customerManagement">
        <h1>Customer</h1>
        
    </div>
</template>

<script>
import firebase from 'firebase'
import firebaseApp from '../firebase/firebaseInit'

var emailDB = firebaseApp.collection("emailSignupFromWebsite")

export default {
    name: 'customerManagement',
    data() {
        return {
            emailUser: ""
        }
    },
    methods: {
        checkStatus(){
            var user = firebase.auth().currentUser;
                if(user){
                    this.$data.emailUesr = user.email;
                    console.log(this.$data.emailUesr)
                } else {
                    console.log("Didn't login yet")
                }
        },
        setCustomerRole(){
            var dbSetRole = emailDB.doc(this.$data.emailUesr)
            dbSetRole.get().then((doc) => {
                if(doc.data().role == "newUser"){
                    console.log("INCONDITION")
                    console.log(doc.data())
                    dbSetRole.update({
                        "role": "customer"
                    }).then(() => {
                        console.log("Update! role become: customer")
                    })
                    
                }
            })
        }
    },
    beforeMount(){
        setTimeout(() => {
            setTimeout(() => {
                this.setCustomerRole()
            }, 100);
        this.checkStatus()
        }, 1000);
        
    }
}
</script>