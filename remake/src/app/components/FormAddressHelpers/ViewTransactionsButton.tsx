import React from 'react'
import { Button } from "../ui/button"
import Link from "next/link"

const ViewTransactionsButton = () => {
  return (
    <>
    {/* Disable button if the other options are not selected */}
    <Link href="/view-transactions" className="text-center">
      <Button variant="secondary" className="bg-primary text-primary-foreground hover:bg-primary/90 w-full">
        View Transactions
      </Button>
    </Link>
    </>
  )
}

export default ViewTransactionsButton