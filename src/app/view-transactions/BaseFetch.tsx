import { fetchTemplate } from "../utils"

const base_api = process.env.NEXT_PUBLIC_BASE_API
const crypto_api = process.env.NEXT_PUBLIC_CRYPTO_COMPARE_API
const cryptoUrl = 'https://min-api.cryptocompare.com'

export const BaseFetch = async (userAddress: string, tokenAddress: string, urlChain: string) => {
    const result = await addressWithContractList(userAddress, tokenAddress, urlChain)
    const seperateTransactions = seperateTransaction(result, userAddress)
    const boughtSoldLog = await normalTransactions(userAddress, seperateTransactions, urlChain)
    const boughtAndSold = boughtSoldLog.difference
    const transactionLog = boughtSoldLog.transactionLog
  
    const token = result[0].tokenSymbol
    const tokenPrice = await getTokenPrice(token)
    const tokenBalance = await getTokenBalance(userAddress, tokenAddress, urlChain)
  
    const cVal = Math.round(tokenBalance * tokenPrice * 100) / 100
    const dep = Math.round(boughtAndSold! * 100) / 100

    const unrealized = Math.round((cVal - dep) * 100) / 100
  
    const output: LoadInput = {
      token: token,
      tokenPrice: tokenPrice,
      currentValue: convertToCommas(cVal),
      deposit: convertToCommas(dep),
      unrealizedText: convertToCommas(unrealized),
      unrealizedNum: unrealized,
      log: transactionLog
    }

    return output
}

const addressWithContractList = async (userAddress: string, tokenAddress: string, urlChain: string) => {
  
    const url = `${urlChain}/api?module=account&action=tokentx&contractaddress=${tokenAddress}&address=${userAddress}&page=1&offset=100&startblock=0&endblock=27025780&sort=asc&apikey=${base_api}`
  
    const data = await fetchTemplate("addressWithContractList", url)
    return data.result;
  }
  
  const seperateTransaction = (result: JsonResult[], userAddress: string) => { 
  
    let transactionHashList: BuySells = {
        sells: [],
        buys: [],
    }
  
    // to == user buying, from == user selling, HOW IT WORKS: the algorithm is filtered through 
    // looking at the contact address given (the token) and seen what's been done with it
    // example see if the token has been sent else where or if it's coming in
    for (let i = 0; i < result.length; i ++) {
        if (result[i].to == userAddress.toLowerCase() && 
        !transactionHashList.buys.includes(result[i].to)) {  // this makes sure we don't get duplicates
            transactionHashList.buys.push(result[i].hash)
        } else if (result[i].to != userAddress.toLowerCase() &&
        !transactionHashList.sells.includes(result[i].to)) {
            transactionHashList.sells.push(result[i].hash)
        }
    }
    return transactionHashList
  }
  
  const normalTransactions = async (address: string, seperateTransactions: BuySells, urlChain: string) => {
    const url = `${urlChain}/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=100&sort=asc&apikey=${base_api}`
  
    const result = await fetchTemplate("normalTransactions", url);
  
    let pnl = await boughtAndSold(result.result, seperateTransactions)
    return pnl
  }
  
  const convertTime = (unixTime: string): string => {
    const time = new Date(Number(unixTime) * 1000)
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const year = time.getFullYear()
    const month = months[time.getMonth()]
    const date = time.getDate()
  
    return year + ' ' + month + ' ' + date
  
  }
  
  const boughtAndSold = async (result: JsonResult[], seperateTransactions: BuySells) => {
    let totalBought = 0
    let totalSold = 0
  
    let transactions: TransactionLog[] = []
  
    let transactionLength = seperateTransactions.sells.length + seperateTransactions.buys.length
  
    for (let i = 0; i < result.length; i++) {
        let amount = 0
        let current = 0
        for (let j = 0; j < transactionLength; j++) {
            if (seperateTransactions.sells[j] == result[i].hash) {
                current = convertToEth(Number(result[i].value)) // penny transactions aren't being stored
                amount = Math.round(await cryptoCompareApi(result[i].timeStamp) * current * 100) / 100
                totalSold += amount
                transactions.push({
                  timeStamp: convertTime(result[i].timeStamp),
                  spent: amount,
                  method: "Sell"
                })
                break;
            } else if (seperateTransactions.buys[j] == result[i].hash) {
                current = convertToEth(Number(result[i].value))
                amount = Math.round((await cryptoCompareApi(result[i].timeStamp) * current) * 100) / 100
                transactions.push({
                  timeStamp: convertTime(result[i].timeStamp),
                  spent: amount,
                  method: "Buy"
                })
                totalBought += amount
                break;
            }
        }
    }
  
    return {difference: totalBought - totalSold, transactionLog: transactions}
  }
  
  const cryptoCompareApi = async (timestamp: string) => {
  
    const coin = "ETH"
    const response = await fetch(`${cryptoUrl}/data/pricehistorical?fsym=${coin}&tsyms=USD&ts=${timestamp}&api_key=${crypto_api}`)
    if (!response.ok) {
        console.log("Crypto api failed to fetch, cryptoCompareApi", response)
        return 0
    }
    const data = await response.json()
  
    if (!data.ETH) {
      console.log("Crypto compare Eth USD is not working", data)
      return 0
    }
  
    const priceUSD = Math.round(Number(data.ETH.USD) * 100) / 100;
    return priceUSD
  }
  
  const convertToEth = (value: number) => {
    // wei to ether
    return value / 10e17;
  }
  
  const getTokenPrice = async (token: string) => {
    const response = await fetch(`${cryptoUrl}/data/price?fsym=${token}&tsyms=USD`)
    const data = await response.json()
  
    if (!data) {
      console.log("Getting token price from Crypto compare is not working")
      return
    }
  
    return data.USD
  }
  
  const getTokenBalance = async (userAddress: string, tokenAddress: string, urlChain: string ) => {
    const response = await fetch(`${urlChain}/api?module=account&action=tokenbalance&contractaddress=${tokenAddress}&address=${userAddress}&tag=latest&apikey=${base_api}`)
    const data = await response.json()
  
    if (!data) {
      console.log("Getting user token balance is not working")
    }
  
    // if on base, divide by 10^18 because there are no decimals givcen in the fetch request
    return (data.result / 10**18)
  }
  
  const convertToCommas = (x: number): string => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }