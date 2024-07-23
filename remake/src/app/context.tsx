"use client"
import React, { createContext, useState, useContext, ReactNode } from "react"

interface WalletContextProps {
    userAddress: string
    tokenAddress: string
    blockchain: string
    setUserAddress: (address: string) => void
    setTokenAddress: (address: string) => void
    setBlockchain: (network: string) => void
}

const WalletContext = createContext<WalletContextProps | undefined>(undefined)

export const WalletProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

    const [userAddress, setUserAddress] = useState<string>('')
    const [tokenAddress, setTokenAddress] = useState<string>('')
    const [blockchain, setBlockchain] = useState<string>('')

    return (
        <WalletContext.Provider value={{ userAddress, setUserAddress, tokenAddress, setTokenAddress, blockchain, setBlockchain }}>
          {children}
        </WalletContext.Provider>
      )
}

export const useWallet = () => {
    const context = useContext(WalletContext);
    if (!context) {
      throw new Error('useWallet must be used within a WalletProvider');
    }
    return context;
};