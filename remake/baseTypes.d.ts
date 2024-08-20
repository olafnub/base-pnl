interface BuySells {
    sells: string[]
    buys: string[]
  }
  
interface JsonResult {
    to: string
    hash: string
    value: string
    timeStamp: string 
}

interface TransactionLog {
    timeStamp: string
    spent: number
    method: string
}

interface LoadInput {
    token: string
    tokenPrice: number
    currentValue: string
    deposit: string
    unrealizedText: string
    unrealizedNum: number
    log: TransactionLog[]
}