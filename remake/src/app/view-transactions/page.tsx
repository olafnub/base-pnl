import React from 'react';
import { useWallet } from '../context';

const ViewTransactionsPage = () => {
  const { userAddress } = useWallet()
  console.log(userAddress);

  return (
    <div>page</div>
  );
}

export default ViewTransactionsPage;
