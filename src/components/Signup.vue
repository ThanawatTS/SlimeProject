<template>
    <div id="signup">
        <h1>Signup</h1>
        <input type="text" v-model="email" placeholder="Email"><br>
        <input type="password" v-model="password" placeholder="Password"><br>

        <router-link to='/login'>
        <button @click="signUp()">Sign Up</button>
        </router-link>
    </div>
</template>

<script>
import db from './firebase';

export default {
    name: 'signup',
    data () {
        return {
            email: '',
            password: ''
        }
    },
    created () {
        db.collection('customer').get().then(querySnapshot => {
            querySnapshot.forEach(doc => {
                console.log(doc.data());
            })
        })
    },
    methods: {
        signUp() {
            db.collection('customer').add({
              email: this.email,
              password: this.password  
            })
            alert ("Data have been add to database")
        }
    }
}
</script>

