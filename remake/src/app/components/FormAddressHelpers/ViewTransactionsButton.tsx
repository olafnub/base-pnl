"use client"
import { Button } from "../ui/button"
import Link from "next/link"
import { useWallet } from "../../context"

const ViewTransactionsButton = () => {

  const { userAddress, tokenAddress, blockchain } = useWallet()

  const LinkWrapper = () => {
    if (userAddress && tokenAddress && blockchain) {
      return (
        <Link href="/view-transactions" className="text-center">
          <Button variant="secondary" className="bg-primary text-primary-foreground hover:bg-primary/90 w-full">
            View Transactions
          </Button>
        </Link>
      )
    } else {
      return (
        <Button variant="secondary" className="bg-primary text-primary-foreground hover:bg-primary/90 w-full" style={{cursor: "not-allowed"}}>
          View Transactions
        </Button>
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