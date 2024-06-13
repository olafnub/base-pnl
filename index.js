require('dotenv').config()

const baseAPI = process.env.BASE_API;

fetch(`https://api.basescan.org/api
?module=account
&action=balance
&address=0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae
&tag=latest
&apikey=${baseAPI}`)
.then(res => res.json())
.then(data => console.log(data))
.catch(err => console.log(err))
// https://api.basescan.org/api
//    ?module=account
//    &action=balance
//    &address=0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae
//    &tag=latest
//    &apikey=YourApiKeyToken