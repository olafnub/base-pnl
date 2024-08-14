import React from 'react'

interface Props {
    userAddress: string
    tokenAddress: string
    blockchain: string
}

interface BuySells {
    sells: string[]
    buys: string[]
}

interface JsonResult {
    to: string
    hash: string
    value: string
    timeStamp: string 
}

const base_api = process.env.NEXT_PUBLIC_BASE_API; 
const crypto_api = process.env.NEXT_PUBLIC_CRYPTO_COMPARE_API;

const baseUrl = 'https://api.basescan.org'
// const solUrl = ''
// const ethUrl = ''
const cryptoUrl = 'https://min-api.cryptocompare.com'

// Returns the the data of total profit and loss on a coin
const validateRequests = async (userAddress: string, tokenAddress: string, blockchain: string) => {
    const result = await addressWithContractList(userAddress, tokenAddress)
    const seperateTransactions = seperateTransaction(result, userAddress)
    const boughtAndSold = await normalTransactions(userAddress, seperateTransactions)

    return JSON.stringify(Math.round(boughtAndSold! * 100) / 100)
}

const addressWithContractList = async (userAddress: string, tokenAddress: string) => {
    
  const response = await fetch(`${baseUrl}/api?module=account&action=tokentx&contractaddress=${tokenAddress}&address=${userAddress}&page=1&offset=100&startblock=0&endblock=27025780&sort=asc&apikey=${base_api}`, {
    next: {
        revalidate: 60
    }
  });
  
  if (!response.ok) {
      console.log("Error in fetching basescan data, addressWithContractList")
      return
  }
  
  const data = await response.json();
  const result = data.result;

  return result;
}

const seperateTransaction = (result: JsonResult[], userAddress: string) => { 

    let transactionHashList: BuySells = {
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

const normalTransactions = async (address: string, seperateTransactions: BuySells) => {
    const response = await fetch(`${baseUrl}/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=100&sort=asc&apikey=${base_api}`)

    if (!response.ok) {
        console.log("Error in fetching data, normalTransactions")
        return
    }

    const data = await response.json();
    const result = data.result;

    let pnl = boughtAndSold(result, seperateTransactions)
    return pnl
}

const boughtAndSold = async (result: JsonResult[], seperateTransactions: BuySells) => {
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

const cryptoCompareApi = async (timestamp: string) => {

    const coin = "ETH"
    const response = await fetch(`${cryptoUrl}/data/pricehistorical?fsym=${coin}&tsyms=USD&ts=${timestamp}&api_key=${crypto_api}`)
    if (!response.ok) {
        console.log("Crypto api failed to fetch, cryptoCompareApi", response)
        return
    }
    const data = await response.json()

    const priceUSD = data.ETH.USD;

    return priceUSD
}

const convertToEth = (value: number) => {
    // wei to ether
    return value / 10e17;
}

const TransactionsFetch: React.FC<Props> = async ({userAddress, tokenAddress, blockchain}) => {

    const data = await validateRequests(userAddress, tokenAddress, blockchain)

    console.log(data)

    return (
        <>
            <p>HI</p>
        </>
    )
}

export default TransactionsFetch