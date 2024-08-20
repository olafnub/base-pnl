import React from 'react';
import FormAddress from '../components/FormAddress'
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert"
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "../components/ui/table"
import { BaseFetch } from "./BaseFetch"

const baseUrl = 'https://api.basescan.org' // rounds to the 18th point
const solUrl = ''
const ethUrl = ''

// Returns the the data of total profit and loss on a coin
const validateRequests = async (userAddress: string, tokenAddress: string, blockchain: string) => {

  let output: LoadInput

  switch (blockchain) {
    case "base":
      output = await BaseFetch(userAddress, tokenAddress, baseUrl)
      break
    // case "solana":
    //   urlChain = solUrl
    //   break
    // case "ethereum":
    //   urlChain = ethUrl
    //   break
    default:
      throw new Error(`Unsupported blockchain, ${blockchain}`)
  }

  return output!
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
  //     unrealized: 120000
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

              <AlertDescription className={`text-xl ${Number(inputValue.unrealizedNum) > 0 ? "text-[#0aff99]": "text-[#ff0000]"}`}>
                Unrealized ${inputValue.unrealizedText}
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
