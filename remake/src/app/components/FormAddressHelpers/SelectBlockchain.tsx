"use client"
import React from 'react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select"
import { useWallet } from "../../context"

const SelectBlockchain = () => {

  const { blockchain, setBlockchain } = useWallet()

  const handleBlockchainChange = (value: string) => {
    setBlockchain(value)
  }

  const blockchains = ["Solana", "Ethereum", "Base"]
    
  return (
    <>
    <Select onValueChange={handleBlockchainChange} value={blockchain}>
        <SelectTrigger className="w-full text-white">
            <SelectValue placeholder="Select blockchain"/>
        </SelectTrigger>
        <SelectContent>
            {blockchains.map((blockchain, index) => (
                <SelectItem key={index} value={blockchain}>{blockchain}</SelectItem>
            ))}
        </SelectContent>
    </Select>
    </>
  )
}

export default SelectBlockchain