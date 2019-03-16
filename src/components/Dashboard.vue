<template>
    <div id="dashboard">
        <h1>Dashboard</h1>
        <v-btn v-on:click="getdata">checked</v-btn>
        <v-btn v-on:click="loginByLine">login / Created</v-btn>
    </div>
</template>

<script>
import firebase from 'firebase';
const axios = require('axios');
var jwt = require('jsonwebtoken');
var dataCollectDecode

export default {
    name: 'dashboard',
    data () {
        return {
            userProfile: []
        }
    },
    //https://api.line.me/oauth2/v2.1/token?grant_type=authorization_code&code=2qBVLecLDGP0rrvcqdwv&redirect_uri=https://ab34ef79.ngrok.io&client_id=1554433367&client_secret=88f24f0c0dfa5258983d13850529bcf9
    methods: {
        loginByLine(){
            firebase.auth().signInWithEmailAndPassword(dataCollectDecode[1] , dataCollectDecode[1])
            .then( user => {
                alert('Login successful!');
                console.log('Login Successful');
                this.$router.push('/maps');
            },
            err => {
                alert(err.message);
                console.log('Login Fail');

                firebase.auth().createUserWithEmailAndPassword(dataCollectDecode[1], dataCollectDecode[1])
                .then( user => {
                    alert('Account created successful!');
                    console.log('register');
                    this.$router.push('/maps');
                    },
                    err => {
                        alert(err.message);
                        console.log("Can't created account");
                    });
            });
        },
        getdata(){
            //console.log(this.$route)
            var currentUrl = window.location.href;
            var seperateUrl = currentUrl.slice(currentUrl.search("=")+1,currentUrl.search("&"))
            //console.log(currentUrl);
            //console.log(seperateUrl);

            
            // axios.post('https://api.line.me/oauth2/v2.1/token?grant_type=authorization_code&code=2qBVLecLDGP0rrvcqdwv&redirect_uri=https://ab34ef79.ngrok.io&client_id=1554433367&client_secret=88f24f0c0dfa5258983d13850529bcf9').
            // then(res => {
            //     console.log("AHA")
            //     console.log(res.data)
            // });
            
            // async function makePostRequest() {

            // let res = await axios.post('https://api.line.me/oauth2/v2.1/token?grant_type=authorization_code&code=NEgxvXKpWDGTm0NdQov8&redirect_uri=https://ab34ef79.ngrok.io&client_id=1554433367&client_secret=88f24f0c0dfa5258983d13850529bcf9');

            // // console.log(`Status code: ${res.status}`);
            // // console.log(`Status text: ${res.statusText}`);
            // // console.log(`Request method: ${res.request.method}`);
            // // console.log(`Path: ${res.request.path}`);

            // // console.log(`Date: ${res.headers.date}`);
            // // console.log(`Data: ${res.data}`);
            // }

            var request = require("request");
            
            var options = { method: 'POST',
            url: 'https://api.line.me/oauth2/v2.1/token',
            headers: 
            {'Content-Type': 'application/x-www-form-urlencoded' },
            form: 
            { 
            grant_type: 'authorization_code',
            code: seperateUrl,
            redirect_uri: 'https://d0d8298b.ngrok.io',
            client_id: '1554433367',
            client_secret: '88f24f0c0dfa5258983d13850529bcf9',
            }};
            request(options, function (error, response, body) {
            if (error) throw new Error(error);
            //console.log(body);
            //console.log("BR")
            var seperateBody = body.slice(body.search("id_token")+11,body.search("\"}"))
            // var decoded_id_token = jwt.decode(body,
            //                   "88f24f0c0dfa5258983d13850529bcf9",
            //                   "1554433367",
            //                   'https://access.line.me',
            //                   'HS256')

            // console.log("HAHA"+decoded_id_token)
            //console.log(seperateBody)
            var decoded = jwt.decode(seperateBody, {complete: true});
           // dataCollectDecode = decoded.payload.name;
            //dataCollectDecode.push(decoded.payload.name)
            dataCollectDecode = [decoded.payload.name, decoded.payload.email, decoded.payload.picture]
            //console.log(decoded.payload)
            //console.log(dataCollectDecode)
            //console.log(decoded.payload.name)
            // userProfile.push({
            //     name_U: decode.payload.name,
            //     email_U: decode.payload.email,
            //     picture_U: decode.payload.picture
            // })
        
            });
            
            //console.log("HALLO")
            setTimeout(() => {
            console.log(dataCollectDecode)
            console.log("2")
            console.log(dataCollectDecode[0])
            console.log(dataCollectDecode.length)
            console.log("3")
            
            // this.$data.userProfile.push({
            //     name_U: dataCollectDecode[0]
            //     // email_U: dataCollectDecode[1],
            //     // pic_U: dataCollectDecode[2]
                
            // })
            //     //console.log(this.$data.userProfile.name_U)
            //     console.log(this.$data.userProfile.name_U)
            }, 2000);
            
            //console.log(dataCollectDecode[1])

        }
        
    },
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
