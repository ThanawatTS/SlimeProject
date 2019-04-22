<template>
    <div id="dashboard">
        <h1>Dashboard</h1>
        <v-btn v-on:click="getdata">checked</v-btn>
        <v-btn v-on:click="loginByLine">login / Created</v-btn>
        <v-btn @click="line"> line </v-btn>
    </div>
</template>

<script>
import firebase from 'firebase';
var jwt = require('jsonwebtoken');
var dataCollectDecode

import firebaseApp from './firebase/firebaseInit'
import { decode } from 'jsonwebtoken';
var emailDB = firebaseApp.collection("emailSignupFromLine")
var userIdLineCol = firebaseApp.collection("UserIdLine")
var userChoosingEmail = firebaseApp.collection("usersChoosingMenu")

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
        line(){
            location.replace("https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=1554433367&redirect_uri=https://20d9fdeb.ngrok.io&state=12345abcde&scope=openid%20profile%20email")
        },
        loginByLine(){
            let lineEmail = "lineid"+dataCollectDecode.email_U;
            firebase.auth().signInWithEmailAndPassword(lineEmail , dataCollectDecode.email_U)
            .then( user => {
                alert('Login successful!');
                console.log('Login Successful');
                this.updateUserProfile()
                this.$router.push('/customerManagement')
            },
            err => {
                alert(err.message);
                console.log('Login Fail');

                firebase.auth().createUserWithEmailAndPassword(lineEmail, dataCollectDecode.email_U)
                .then( user => {
                    alert('Account created successful!');
                    console.log('register');
                    
                    },
                    err => {
                        alert(err.message);
                        console.log("Can't created account");
                    });

                var setEmailToLWC = lineEmail.toLowerCase();
                emailDB.doc(setEmailToLWC).set({
                    role: "customer",
                    newUser: true,
                    userIdLine: dataCollectDecode.userID
                })

                userIdLineCol.doc(dataCollectDecode.userID).set({
                    email: lineEmail
                })

                userChoosingEmail.doc(setEmailToLWC).set({
                    menu: [],
                    lastThreePick: [],
                    favouriteMenu: []
                })

                setTimeout(() => {
                    this.loginByLine()
                }, 700);

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
            redirect_uri: 'https://20d9fdeb.ngrok.io',
            client_id: '1554433367',
            client_secret: '88f24f0c0dfa5258983d13850529bcf9',
            }};
            request(options, function (error, response, body) {
            if (error) throw new Error(error);
            var id_token = body.slice(body.search("id_token")+11,body.search("\"}"))            
            var decoded = jwt.decode(id_token, {complete: true});
            dataCollectDecode = {name_U: decoded.payload.name, email_U: decoded.payload.email, pic_U: decoded.payload.picture, userID: decoded.payload.sub}
            console.log("ID_TOKEN", id_token)
            console.log("BODy", body)
            // userProfile.push({
            //     name_U: decode.payload.name,
            //     email_U: decode.payload.email,
            //     picture_U: decode.payload.picture
            // })

            
            
            });
        },
        userCurrent(){
            var user = firebase.auth().currentUser;
            if(user){
                // firebase.auth().signOut().then(() => {
                //     console.log("Signout")
                // }).catch((err) => {
                //     console.log(err)
                // })
                console.log(user.email)
            } else {
                console.log("NO LONGER USER")
            }
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
        firebase.auth().signOut().then(() => {
        console.log("Signout")
      }).catch((err) => {
        console.log(err)
      })
    }
    
}
</script>
