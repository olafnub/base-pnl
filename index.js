// How express and PORT works: https://medium.com/@ralph1786/how-to-setup-an-express-server-5fd9cd9ae073
// How rendering index.html works: https://gist.github.com/ryanoglesby08/1e1f49d87ae8ab2cabf45623fc36a7fe?permalink_comment_id=3620942

const express = require("express")

const app = express();
const PORT = 3000;

app.use(express.static('public'));
app.use(express.json());

require("dotenv").config();

const base_api = process.env.BASE_API; 
const crypto_api = process.env.CRYPTO_COMPARE_API;

const baseUrl = 'https://api.basescan.org'
const cryptoUrl = 'https://min-api.cryptocompare.com'

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html")
})

app.get("/show-pnl", (req, res) => {
    res.sendFlile(__dirname + "/public/pnl.html")
})

app.post("/base-api", async (req, res) => {

    const { userAddress, tokenAddress } = req.body; 

    const result = await addressWithContractList(userAddress, tokenAddress)
    const seperateTransactions = seperateTransaction(result, userAddress)
    const boughtAndSold = await normalTransctions(userAddress, seperateTransactions)


    res.json(Math.round(boughtAndSold * 100) / 100)
})

const addressWithContractList = async (userAddress, tokenAddress) => {
    
    const response = await fetch(`${baseUrl}/api?module=account&action=tokentx&contractaddress=${tokenAddress}&address=${userAddress}&page=1&offset=100&startblock=0&endblock=27025780&sort=asc&apikey=${base_api}`);
    
    if (response.ok == false) {
        console.log("Error in fetching data")
    }
    
    const data = await response.json();
    const result = data.result;

    return result;
}

const seperateTransaction = (result, userAddress) => { 
    let transactionHashList = {
        sells: [],
        buys: [],
    }

    for (let i = 0; i < result.length; i ++) {
        if (result[i].to == userAddress.toLowerCase()) { // to == user buying, from == user selling
            transactionHashList.buys.push(result[i].hash)
        } else {
            transactionHashList.sells.push(result[i].hash)
        }
    }
    
    return transactionHashList
}

const normalTransctions = async (address, seperateTransactions) => {
    const response = await fetch(`${baseUrl}/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=100&sort=asc&apikey=${base_api}`)

    if (response.ok == false) {
        console.log("Error in fetching data")
    }

    const data = await response.json();
    const result = data.result;

    let pnl = boughtAndSold(result, seperateTransactions)
    return pnl
}

const boughtAndSold = async (result, seperateTransactions) => {
    let totalBought = 0
    let totalSold = 0

    let transactionLength = seperateTransactions.sells.length + seperateTransactions.buys.length

    for (let i = 0; i < result.length; i++) {
        let amount = 0
        let current = 0
        for (let j = 0; j < transactionLength; j++) {
            if (seperateTransactions.sells[j] == result[i].hash) {
                current = convertToEth(Number(result[i].value)) // penny transactions aren't being stored
                amount = await cryptoCompareApi(result[i].timeStamp) * current
                totalSold += amount
                break;
            } else if (seperateTransactions.buys[j] == result[i].hash) {
                current = convertToEth(Number(result[i].value))
                amount = await cryptoCompareApi(result[i].timeStamp) * current
                totalBought += amount
                break;
            }
        }
    }

    return totalBought - totalSold
}

const cryptoCompareApi = async (timestamp) => {

    const coin = "ETH"
    const response = await fetch(`${cryptoUrl}/data/pricehistorical?fsym=${coin}&tsyms=USD&ts=${timestamp}&api_key=${crypto_api}`)
    const data = await response.json()

    const priceUSD = data.ETH.USD;

    return priceUSD
}

const convertToEth = (value) => {
    // wei to ether
    return value / 10e17;
}

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})