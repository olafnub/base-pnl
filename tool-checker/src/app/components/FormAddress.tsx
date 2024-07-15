'use client'
import React, { useState } from 'react'

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
    
    return (
        <div>
            <label htmlFor="user_address">Wallet Address: </label>
            <input
                list="userAddress"
                id="user_address"
                name="userAddress"
                className="inputForm"
                placeholder="Type or select address"
                value={userAddress}
                onChange={(e) => handleWalletChange(e.target.value)}
            />
            <datalist id="userAddress">
                <option value="Crash's wallet" />
                <option value="N/A" />
            </datalist>

            <label htmlFor="">Token Address: </label>
            <input
                list="tokenAddress"
                id="token_address"
                name="tokenAddress"
                className="inputForm"
                placeholder="Type or select address"
                value={tokenAddress}
                onChange={(e) => handleTokenChange(e.target.value)}
            />

            <datalist id="tokenAddress">
                <option value="Brett's address" />
                <option value="Toshi's address" />
            </datalist>
        </div>
    )
}

export default FormAddress