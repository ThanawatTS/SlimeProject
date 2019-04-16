<template>
    <div id="dashboard">
        <h1>Dashboard</h1>
        <v-btn v-on:click="getdata">checked</v-btn>
        <v-btn v-on:click="loginByLine">login / Created</v-btn>
    </div>
</template>

<script>
import firebase from 'firebase';
var jwt = require('jsonwebtoken');
var dataCollectDecode

export default {
    name: 'dashboard',
    data () {
        return {
          dataUser: []
        }
    },
    methods: {
        // Choose think about login logic!!!!
        // Now create firebase authentication by using email for both username and password
        loginByLine(){
            firebase.auth().signInWithEmailAndPassword(dataCollectDecode.email_U , dataCollectDecode.email_U)
            .then( user => {
                alert('Login successful!');
                console.log('Login Successful');
                this.updateUserProfile()
                this.$router.push('/usermanager');
            },
            err => {
                alert(err.message);
                console.log('Login Fail');

                firebase.auth().createUserWithEmailAndPassword(dataCollectDecode.email_U, dataCollectDecode.email_U)
                .then( user => {
                    alert('Account created successful!');
                    console.log('register');
                    
                    },
                    err => {
                        alert(err.message);
                        console.log("Can't created account");
                    });
            });
        },
        updateUserProfile(){
            var user = firebase.auth().currentUser;

            user.updateProfile({
            displayName: dataCollectDecode.name_U,
            photoURL: dataCollectDecode.pic_U
            }).then(function() {
                console.log("Update successful")
            }).catch(function(error) {
                console.log("error, Couldn't update")
            });

        },
        getdata(){
            // userCode will get code from currentUrl to specific identity of user by line
            // This Below is API to line application to get user information
            //redirect_url choose change to web when the web application already deploy
            //id_token is a encrypt code that consist of user information
            //jwt is a library that will decode of id_token and took the data out
            var currentUrl = window.location.href;
            var userUrlCode = currentUrl.slice(currentUrl.search("=")+1,currentUrl.search("&"))
            var request = require("request");

            var options = { method: 'POST',
            url: 'https://api.line.me/oauth2/v2.1/token',
            headers: 
            {'Content-Type': 'application/x-www-form-urlencoded' },
            form: 
            { 
            grant_type: 'authorization_code',
            code: userUrlCode,
            redirect_uri: 'https://b5b9cb36.ngrok.io',
            client_id: '1554433367',
            client_secret: '88f24f0c0dfa5258983d13850529bcf9',
            }};
            request(options, function (error, response, body) {
            if (error) throw new Error(error);
            var id_token = body.slice(body.search("id_token")+11,body.search("\"}"))            
            var decoded = jwt.decode(id_token, {complete: true});
            dataCollectDecode = {name_U: decoded.payload.name, email_U: decoded.payload.email, pic_U: decoded.payload.picture}
            // userProfile.push({
            //     name_U: decode.payload.name,
            //     email_U: decode.payload.email,
            //     picture_U: decode.payload.picture
            // })
            });
        }
    },
    //Should set time delay because data need to time to load
    beforeMount(){
        setTimeout(() => {
            setTimeout(() => {
                this.loginByLine()
            }, 1000);
            this.getdata()
        }, 1000);
        
    }
    
}
</script>
