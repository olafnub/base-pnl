"use client"
import { Button } from "../ui/button"
import Link from "next/link"
import { useWallet } from "../../context"

const ViewTransactionsButton = () => {

  const { userAddress, tokenAddress, blockchain } = useWallet()
  
  // reload the page / revalidate the request when Link is clicked

  const reloadPage = () => {
    window.location.reload();
  }

  // onClick={() => window.location.reload()}

  const LinkWrapper = () => {
    if (userAddress && tokenAddress && blockchain) {
      return (
        <Link href={{
          pathname: '/view-transactions',
          query: {
            user: userAddress,
            token: tokenAddress,
            chain: blockchain.toLowerCase()
          }
        }}
        className="text-center"
        >
          <Button variant="default" className="w-full border b-1 border-accent">
            View Transactions
          </Button>
        </Link>
      )
    } else {
      return (
        <button style={{cursor: "not-allowed"}} className="bg-primary text-primary-foreground w-full h-10">
          View Transactions
        </button>
      )
    }
  }

  return (
    <>
      <LinkWrapper />
    </>
  )
}

export default ViewTransactionsButton