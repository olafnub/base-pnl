import React from 'react'
import Link from 'next/link'

const LoadNav = () => {
    
    const navigation = ["Learn", "FAQ", "Contact"]

    return (
        <>
        <ul className="ml-1 flex list-none flex-col gap-8 sm:items-center sm:flex-row sm:space-x-4 sm:gap-4">
            {navigation.map((nav, index) => (
                <li key={index} className="rounded-lg p-2 border-b-2 md:border-0 m-0 p-0 px-2 pt-2 pb-3 space-y-1 sm:px-3">
                    <Link href={`/${nav.toLowerCase()}`} className="text-white hover:bg-white hover:text-black rounded-lg p-2">
                        {nav}
                    </Link>
                </li>
            ))}
        </ul>
        </>
    )
}

export default LoadNav