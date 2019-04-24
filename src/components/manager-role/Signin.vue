<template>
    <div id="signin">
        <main>
        <v-container fill-height id="containerSignin">
            <v-layout row wrap align-center>
                <v-flex class="text-xs-center">
                    <h1>Sign In</h1>
                    <form>
                        <div class = "sign-in">
                            <v-text-field label="Email" type="text" id="userNameInput" v-model="username"></v-text-field>
                        </div>
                        <div class = "sign-in">
                            <v-text-field label="Password" type="password" id="passwordInput"  v-model="password"></v-text-field>
                        </div>
                        <p>Already Have account ? <router-link to="/signup">Sign up</router-link></p>
                        <v-btn id="signin_btn" v-on:click="signinAccount">Sign in</v-btn>
                        <v-btn id="signinline_btn" @click="line"> line </v-btn>
                        
                    </form>
                </v-flex>
            </v-layout>
        </v-container>
        </main>
    </div>
</template>
<script>
import firebase from 'firebase';
import firebaseApp from '../firebase/firebaseInit'
var jwt = require('jsonwebtoken');
var dataCollectDecode
var emailDBW = firebaseApp.collection("emailSignupFromWebsite")
var emailDB = firebaseApp.collection("emailSignupFromLine")
var userIdLineCol = firebaseApp.collection("UserIdLine")
var userChoosingEmail = firebaseApp.collection("usersChoosingMenu")

export default {
    name: 'signin',
    data() {
        return {
            username: '',
            password: '',
            dataUser: []
        }
    },
    methods: {
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
            redirect_uri: 'https://0265096a.ngrok.io',
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
        line(){
            location.replace("https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=1554433367&redirect_uri=https://0265096a.ngrok.io&state=12345abcde&scope=openid%20profile%20email")
        },
        signoutAccount(){
            var user = firebase.auth().currentUser;
            if(user){
                firebase.auth().signOut().then(() => {
                    console.log("Signout")
                }).catch((err) => {
                    console.log(err)
                })
            } else {
                console.log("NO LONGER USER")
            }
        },
        signinAccount() {
            var setEmailToLWC = this.username.toLowerCase();
            firebase.auth().signInWithEmailAndPassword(setEmailToLWC, this.password)
            .then( user => {
                alert('Login successful!');
                var examineEmail = setEmailToLWC.slice(0,3)
                console.log("0: ",examineEmail)
                if(examineEmail == "emp"){
                    console.log("1:",examineEmail)
                    emailDBW = firebaseApp.collection("EmployeeEmail")
                    var ownerEmail
                    emailDBW.get().then((querySnapshot) => {
                        querySnapshot.forEach((doc) => {
                            console.log("DOC",doc.id)
                            if(doc.id == setEmailToLWC){
                                ownerEmail = doc.data().owner
                                 console.log("2:",ownerEmail)
                            }
                        })
                    })
                    console.log("3:",ownerEmail)
                    setTimeout(() => {
                        emailDBW = firebaseApp.collection("emailSignupFromWebsite").doc(ownerEmail).collection("EmployeeEmail")
                    }, 1100);
                }
                setTimeout(() => {
                    emailDBW.get().then((querySnapshot) =>{
                    querySnapshot.forEach((doc) =>{
                        if(doc.id == setEmailToLWC) {
                            switch(doc.data().role) {

                                case "restaurantOwner":
                                    this.$router.push('/restaurantManagement')
                                    break;
                                case "employee":
                                    this.$router.push('/employee')
                                    console.log("Push to rest")
                                    break;
                                case "customer":
                                    this.$router.push('/customerManagement')
                                    console.log("Push to customer")
                                    break;
                                case "newUser":
                                    this.$router.push('/userManager')
                                    console.log("Push to usermanager")
                                    break;

                            }
                        }
                    })
                })
                }, 1100);
                
            },
            err => {
                alert(err.message);
                console.log('Login Fail');
            });
        }
    },
    beforeMount() {
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

<style scoped>

    #signin {
        display: flex;
        align-items: center;
        justify-content: center;
        margin: auto;
        margin-top: 10%;
    }
    

     #signin_btn {
        border-radius: 12px;
    }
    #signinline_btn {
        border-radius: 12px;
    }

    #containerSignin {
        max-width: 300%;
        width: 300px
    }

</style>
