import React from 'react'
import WalletAddress from "./FormAddressHelpers/WalletAddress"
import TokenAddress from "./FormAddressHelpers/TokenAddress"
import SelectBlockchain from './FormAddressHelpers/SelectBlockchain'
import ViewTransactionsButton from './FormAddressHelpers/ViewTransactionsButton'
import {
    Card,
    CardContent
  } from "@/app/components/ui/card"

const FormAddress = () => {
    return (
        <Card>
            <CardContent>
                <section className="flex flex-col gap-4">
                    <div className="flex flex-col gap-3">
                        <WalletAddress />
                        <TokenAddress />
                    </div>
                    <SelectBlockchain />
                    <ViewTransactionsButton />
                </section>
            </CardContent>
        </Card>
    )
}

export default FormAddress