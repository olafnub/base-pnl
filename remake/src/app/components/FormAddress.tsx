'use client'
import React, { useState } from 'react'
import {
    Select,
    SelectContent,
    // SelectGroup,
    SelectItem,
    // SelectLabel,
    SelectTrigger,
    SelectValue,
  } from "./ui/select"
import { Button } from "./ui/button"

const FormAddress = () => {
    const [userAddress, setUserAddress] = useState('')
    const [tokenAddress, setTokenAddress] = useState('')

    const walletAddressMap: { [key: string]: string} = {
        "Crash's wallet": "0x55CAFC85C68cC2F558fA4dA995173ED6CEbE213d",
    }

    const tokenAddressMap: { [key: string]: string} = {
        "Brett's address": "0x532f27101965dd16442E59d40670FaF5eBB142E4",
        "Toshi's address": "0xAC1Bd2486aAf3B5C0fc3Fd868558b082a531B2B4"
    }

    const handleWalletChange = (value: string) => {
        const walletAddress = walletAddressMap[value] || value
        setUserAddress(walletAddress)
    }

    const handleTokenChange = (value: string) => {
        const coinAddress =  tokenAddressMap[value] || value
        setTokenAddress(coinAddress)
    }
    
    const blockchains = ["Solana", "Ethereum", "Base"]

    return (
        <section className="flex flex-col gap-4">
            <div className="flex flex-col gap-3">
                <label htmlFor="user_address">Wallet Address: </label>
                <input
                    list="userAddress"
                    id="user_address"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Type or select address"
                    value={userAddress}
                    onChange={(e) => handleWalletChange(e.target.value)}
                />
                <datalist id="userAddress">
                    <option value="Crash's wallet" />
                </datalist>

                <label htmlFor="token_address">Token Address: </label>
                <input
                    list="tokenAddress"
                    id="token_address"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Type or select address"
                    value={tokenAddress}
                    onChange={(e) => handleTokenChange(e.target.value)}
                />
            </div>

            <datalist className="bg-primary" id="tokenAddress">
                <option value="Brett's address" />
                <option value="Toshi's address" />
            </datalist>
        
            <Select>
                <SelectTrigger className="w-[280px] text-white">
                    <SelectValue placeholder="Select blockchain" />
                </SelectTrigger>
                <SelectContent>
                    {blockchains.map((blockchain, index) => (
                        <SelectItem key={index} value={blockchain}>{blockchain}</SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <Button variant="secondary" className="bg-primary text-primary-foreground hover:bg-primary/90">View transactions</Button>
        </section>
    )
}

export default FormAddress