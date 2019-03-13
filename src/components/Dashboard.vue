<template>
    <div id="dashboard">
        <h1>Dashboard</h1>
        <v-btn v-on:click="getdata">checked</v-btn>
    </div>
</template>

<script>
const axios = require('axios');
export default {
    name: 'dashboard',
    data () {
        return {
        }
    },
    //https://api.line.me/oauth2/v2.1/token?grant_type=authorization_code&code=2qBVLecLDGP0rrvcqdwv&redirect_uri=https://ab34ef79.ngrok.io&client_id=1554433367&client_secret=88f24f0c0dfa5258983d13850529bcf9
    methods: {
        getdata(){
            console.log(this.$route)
            var currentUrl = window.location.href;
            var seperateUrl = currentUrl.slice(currentUrl.search("=")+1,currentUrl.search("&"))
            console.log(currentUrl);
            console.log(seperateUrl);

            
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
            redirect_uri: 'https://47aa800f.ngrok.io',
            client_id: '1554433367',
            client_secret: '88f24f0c0dfa5258983d13850529bcf9',
            }};
            request(options, function (error, response, body) {
            if (error) throw new Error(error);
            console.log(body);
            });

            
        }
    },
    beforeMount(){
        setTimeout(() => {
                this.getdata()
            }, 2000);
    }
    
}
</script>
