import React from 'react';
import FormAddress from '../components/FormAddress'
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableRow,
} from "../components/ui/table"

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

interface TransactionLog {
  timeStamp: string
  spent: number
  method: string
}

interface LoadInput {
  token: string
  tokenPrice: number
  currentValue: string
  deposit: string
  difference: number
  log: TransactionLog[]
}

const base_api = process.env.NEXT_PUBLIC_BASE_API; 
const crypto_api = process.env.NEXT_PUBLIC_CRYPTO_COMPARE_API;

const baseUrl = 'https://api.basescan.org' // rounds to the 18th point
const solUrl = ''
const ethUrl = ''
const cryptoUrl = 'https://min-api.cryptocompare.com'

const fetchTemplate = async (name: string, url: string) => {
  const response = await fetch(url, {
    next: {
      revalidate: 60
    }
  })

  if (!response) {
    console.log("Error in fetching reponse", name)
    return
  }

  return await response.json(); // data
}

// Returns the the data of total profit and loss on a coin
const validateRequests = async (userAddress: string, tokenAddress: string, blockchain: string) => {

  let urlChain: string

  switch (blockchain) {
    case "base":
      urlChain = baseUrl
      break
    case "solana":
      urlChain = solUrl
      break
    case "ethereum":
      urlChain = ethUrl
      break
    default:
      throw new Error(`Unsupported blockchain, ${blockchain}`)
  }

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

  const output: LoadInput = {
    token: token,
    tokenPrice: tokenPrice,
    currentValue: convertToCommas(cVal),
    deposit: convertToCommas(dep),
    difference: cVal - dep,
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

const ViewTransactionsPage = async ({searchParams}: {
  searchParams: {
    user: string
    token: string
    chain: string
  }
}) => {

  let inputValue: LoadInput

  inputValue = await validateRequests(searchParams.user, searchParams.token, searchParams.chain)

  // if (process.env.NODE_ENV == "development") {
  //   inputValue = {
  //     token: "BRETT",
  //     tokenPrice: 0.09,
  //     currentValue: "21092034",
  //     deposit: "888888.21",
  //     difference: 120000
  //   }
  // } else {
  //   inputValue = await validateRequests(searchParams.user, searchParams.token, searchParams.chain)
  // }

  const colors: string[] = ["#a4c3b2", "#eaf4f4", "#fdc500", "#bbdefb", "#f6ae2d", "#c0b9dd", "#75c9c8", "#f050ae"]

  const randNumber = Math.floor(Math.random() * colors.length)

  return (
    <>
    <section className="mt-4 flex flex-col flex-auto h-screen">
      <div className="flex flex-col md:flex-row">
        <FormAddress />
        <div className="w-full"> 
          <p>Current Status</p>
          <Alert className="border">

            <AlertTitle style={{color: `${colors[randNumber]}`, fontSize: `1.25rem`}}>{inputValue.token} (${inputValue.tokenPrice})</AlertTitle>
            <div className="flex flex-col md:flex-row gap-3">

              <AlertDescription className="text-xl">
                Current Value ${inputValue.currentValue}
              </AlertDescription>

              <AlertDescription className="text-xl">
                Total Deposit ${inputValue.deposit}
              </AlertDescription>

              <AlertDescription className={`text-xl ${inputValue.difference > 0 ? "text-[#0aff99]": "text-[#ff0000]"}`}>
                Profit/Loss ${convertToCommas(Math.round(inputValue.difference * 100) / 100)}
              </AlertDescription>
            </div>

          </Alert>

          <Alert className="text-center">
            <AlertTitle>Note</AlertTitle>
            <AlertDescription>
              Penny transactions, gas fees, and wallet transfers are not acocunted for
            </AlertDescription>
          </Alert>

        </div>
      </div>
      <div className="w-full text-center h-full"> 
        <p>Log</p>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>Token</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Method</TableCell>
              <TableCell>Amount</TableCell>
            </TableRow>
            {inputValue.log.map((logData, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{inputValue.token}</TableCell>
                <TableCell>{logData.timeStamp}</TableCell>
                <TableCell>{logData.method}</TableCell>
                <TableCell>${logData.spent}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
    </>
  );
}

export default ViewTransactionsPage;
