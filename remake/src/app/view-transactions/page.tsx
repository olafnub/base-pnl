'use client'
import React from 'react';
import { useWallet } from '../context';
import FormAddress from '../components/FormAddress'

const ViewTransactionsPage = () => {

  const { userAddress, tokenAddress, blockchain } = useWallet()

  const base_api = process.env.NEXT_PUBLIC_BASE_API; 
  const crypto_api = process.env.NEXT_PUBLIC_CRYPTO_COMPARE_API;

  console.log(base_api)

  const baseUrl = 'https://api.basescan.org'
  const cryptoUrl = 'https://min-api.cryptocompare.com'

  return (
    <>
    <section className="mt-4 flex flex-col flex-auto md:flex-row h-5/6">
      <FormAddress />
      <div className="w-full text-center border b-2"> 
        <p>Transaction Log</p>
        {/* Transaction log */}
      </div>
    </section>
    </>
  );
}

export default ViewTransactionsPage;
