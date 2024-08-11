'use client'
import React from 'react';
import { useWallet } from '../context';
import FormAddress from '../components/FormAddress'

const ViewTransactionsPage = () => {
  const { userAddress } = useWallet()
  // console.log(userAddress)

  return (
    <>
    <section className="mt-4 flex flex-col flex-auto md:flex-row border b-2 h-screen">
      <div className="flex basis-1/2 justify-center items-center border b-2">
          <FormAddress />
      </div>
      <div className="basis-1/2">
        <p>List</p>
        {/* Transaction log */}
      </div>
    </section>
    </>
  );
}

export default ViewTransactionsPage;
