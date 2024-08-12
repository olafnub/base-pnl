'use client'
import React from 'react';
import { useWallet } from '../../context'

// For wallet address, Crash, etc..

const WalletAddress = () => {

    const { userAddress, setUserAddress } = useWallet()
    const walletAddressMap: { [key: string]: string} = {
        "Crash's wallet": "0x55CAFC85C68cC2F558fA4dA995173ED6CEbE213d",
    }

    const handleWalletChange = (value: string) => {
        const walletAddress = walletAddressMap[value] || value
        setUserAddress(walletAddress)
    }

  return (
    <>
    <label htmlFor="user_address">Wallet Address: </label>
    <input
        list="userAddress"
        id="user_address"
        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        placeholder="Type or select address"
        value={userAddress ? userAddress : ""}
        onChange={(e) => handleWalletChange(e.target.value)}
    />
    <datalist id="userAddress">
        <option value="Crash's wallet" />
    </datalist>
    </>
  )
}

export default WalletAddress