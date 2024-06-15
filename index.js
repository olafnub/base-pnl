const express = require("express")

const app = express();
const PORT = 3000;

app.use(express.static('public'));
app.use(express.json());

require("dotenv").config();

const baseAPI = process.env.BASE_API;
const address = '0x4200000000000000000000000000000000000011';  


app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html")
})

app.post("/base-api", (req, res) => {
    const { address } = req.body;
    fetch(`https://api.basescan.org/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=10&sort=asc&apikey=${baseAPI}`)
        .then(response => response.json())
        .then(data => res.json(data))
        .catch(err => {
            console.error(err);
            res.status(500).send("Error fetching data");
        });
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})

// How express and PORT works: https://medium.com/@ralph1786/how-to-setup-an-express-server-5fd9cd9ae073
// How rendering index.html works: https://gist.github.com/ryanoglesby08/1e1f49d87ae8ab2cabf45623fc36a7fe?permalink_comment_id=3620942
fetch(`https://api.basescan.org/api?module=account
&action=balance&address=${address}&tag=latest&apikey=${baseAPI}`)

.then(res => res.json())
.then(data => console.log('Balance:',data))
.catch(err => console.log(err))

const blockNumber = 15841878; 
fetch(`https://api.basescan.org/api?module=block&action=getblockreward&blockno=${blockNumber}&apikey=${baseAPI}`)
  .then(res => res.json())
  .then(data => console.log('Block Information:', data))
  .catch(err => console.log(err));

  const txHash = '0x0326787a723546e7f8c193dcd6bcb603ac7cfad97c0ebd5e34a5c0578359666b'; 
fetch(`https://api.basescan.org/api?module=transaction&action=gettxreceiptstatus&txhash=${txHash}&apikey=${baseAPI}`)
  .then(res => res.json())
  .then(data => console.log('Transaction Receipt Status:', data))
  .catch(err => console.log(err));


  fetch(`https://api.basescan.org/api?module=proxy&action=eth_gasPrice&apikey=${baseAPI}`)
  .then(res => res.json())
  .then(data => console.log('Gas Price:', data))
  .catch(err => console.log(err));

  fetch(`https://api.basescan.org/api?module=account&action=txlistinternal&txhash=${txHash}&apikey=${baseAPI}`)
  .then(res => res.json())
  .then(data => console.log('Internal Transactions by Tx Hash:', data))
  .catch(err => console.log(err));
