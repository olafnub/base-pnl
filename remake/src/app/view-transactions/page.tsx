import React from 'react';
import FormAddress from '../components/FormAddress'
import Transactions from './Transactions'
import TransactionsFetch from "./TransactionsFetch"
import { RocketIcon } from "@radix-ui/react-icons"
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert"

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

interface LoadInput {
  token: string
  tokenPrice: number
  currentValue: number
  deposit: number
}

const base_api = process.env.BASE_API; 
const crypto_api = process.env.CRYPTO_COMPARE_API;

const baseUrl = 'https://api.basescan.org'
// const solUrl = ''
// const ethUrl = ''
const cryptoUrl = 'https://min-api.cryptocompare.com'

// Returns the the data of total profit and loss on a coin
const validateRequests = async (userAddress: string, tokenAddress: string, blockchain: string) => {
  const result = await addressWithContractList(userAddress, tokenAddress)
  const seperateTransactions = seperateTransaction(result, userAddress)
  const boughtAndSold = await normalTransactions(userAddress, seperateTransactions)

  const token = result[0].tokenSymbol
  const tokenPrice = await getTokenPrice(token)
  const tokenBalance = await getTokenBalance(token, tokenPrice, userAddress, tokenAddress)

  const output: LoadInput = {
    token: token,
    tokenPrice: tokenPrice,
    currentValue: tokenBalance * tokenPrice,
    deposit: Math.round(boughtAndSold! * 100) / 100
  }

  return output
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

  if (!data) {
    console.log("Crypto compare Eth USD is not working", data)
    return
  }

  const priceUSD = data.ETH.USD;

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

const getTokenBalance = async (token: string, price: number, userAddress: string, tokenAddress: string) => {
  const response = await fetch(`${base_api}/api?module=account&action=tokenbalance&contractaddress=${tokenAddress}&address=${userAddress}&tag=latest&apikey=${base_api}`)
  const data = await response.json()

  if (!data) {
    console.log("Getting user token balance is not working")
  }

  return data.result
}

const ViewTransactionsPage = async ({searchParams}: {
  searchParams: {
    user: string
    token: string
    chain: string
  }
}) => {

  let inputValue: LoadInput

  // inputValue = await validateRequests(searchParams.user, searchParams.token, searchParams.chain)

  if (process.env.NODE_ENV == "development") {
    inputValue = {
      token: "BRETT",
      tokenPrice: 0.09,
      currentValue: 21092034,
      deposit: 888888.21 
    }
  } else {
    inputValue = await validateRequests(searchParams.user, searchParams.token, searchParams.chain)
  }

  return (
    <>
    <section className="mt-4 flex flex-col flex-auto h-screen">
      <div className="flex md:flex-row">
        <FormAddress />
        <div className="w-full"> 
          <p>Status Info</p>
          <Alert>
            <AlertTitle>{inputValue.token} (${inputValue.tokenPrice})</AlertTitle>
            <div className="flex  gap-3">
              
              <AlertDescription>
                Current Value ${inputValue.currentValue}
              </AlertDescription>

              <AlertDescription>
                Total Deposit ${inputValue.deposit}
              </AlertDescription>
            </div>
          </Alert>

          {/* <Transactions>
            <TransactionsFetch 
              userAddress={userAddress}
              tokenAddress={tokenAddress}
              blockchain={blockchain}
            />
          </Transactions> */}
          {/* Transaction log */}
        </div>
      </div>
      <div className="w-full text-center border b-2 h-5/6"> 
        <p>Logs</p>
        {/* Transaction log */}
      </div>
    </section>
    </>
  );
}

export default ViewTransactionsPage;
