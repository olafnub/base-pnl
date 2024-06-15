require('dotenv').config()

const baseAPI = process.env.BASE_API;
const address = '0x4200000000000000000000000000000000000011';  


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
