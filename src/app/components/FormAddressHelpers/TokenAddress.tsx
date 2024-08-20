'use client'
import React from 'react'
import { useWallet } from '../../context'

// For tokens, Brett, Toshi, etc...

const TokenAddress = () => {
    
    const { tokenAddress, setTokenAddress } = useWallet()
    const tokenAddressMap: { [key: string]: string} = {
        "Brett's address": "0x532f27101965dd16442E59d40670FaF5eBB142E4",
        "Toshi's address": "0xAC1Bd2486aAf3B5C0fc3Fd868558b082a531B2B4"
    }
    const handleTokenChange = (value: string) => {
        const coinAddress =  tokenAddressMap[value] || value
        setTokenAddress(coinAddress)
    }

  return (
    <>
    <label htmlFor="token_address">Token Address: </label>
    <input
        list="tokenAddress"
        id="token_address"
        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        placeholder="Type or select address"
        value={tokenAddress ? tokenAddress : ""}
        onChange={(e) => handleTokenChange(e.target.value)}
    />

    <datalist id="tokenAddress">
        <option value="Brett's address" />
        <option value="Toshi's address" />
    </datalist>
    </>
  )
}

export default TokenAddress