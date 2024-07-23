import React from 'react'
import { WalletProvider } from "../context"
import WalletAddress from "./FormAddressHelpers/WalletAddress"
import TokenAddress from "./FormAddressHelpers/TokenAddress"
import SelectBlockchain from './FormAddressHelpers/SelectBlockchain'
import ViewTransactionsButton from './FormAddressHelpers/ViewTransactionsButton'

const FormBuild = () => {
    return (
        <section className="flex flex-col gap-4">
            <div className="flex flex-col gap-3">
                <WalletAddress />
                <TokenAddress />
            </div>
            <SelectBlockchain />
            <ViewTransactionsButton />
        </section>
    )
}

const FormAddress = () => {
    return (
        <WalletProvider>
            <FormBuild />
        </WalletProvider>
    )
}

export default FormAddress