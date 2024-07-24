'use client'
import React from 'react';
import { useWallet } from '../context';

const ViewTransactionsPage = () => {
  const { userAddress } = useWallet()

  return (
    <div>{userAddress}</div>
  );
}

export default ViewTransactionsPage;
