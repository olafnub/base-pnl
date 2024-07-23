import React from 'react'
import WalletAddress from "./FormAddressHelpers/WalletAddress"
import TokenAddress from "./FormAddressHelpers/TokenAddress"
import SelectBlockchain from './FormAddressHelpers/SelectBlockchain'
import ViewTransactionsButton from './FormAddressHelpers/ViewTransactionsButton'

const FormAddress = () => {
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

export default FormAddress