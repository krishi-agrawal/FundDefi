'use client';

import { useState, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { MdClose } from "react-icons/md";
import { IoMenuOutline } from "react-icons/io5";
import Link from 'next/link';


const Wallet = dynamic(() => import('./Wallet.jsx'), { ssr: false });

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);
 
    return (
        <nav className="bg-black p-4">
            <div className="container mx-auto flex justify-around items-center">
                <img src='/fundefi-logo-black.png'  width="200px" height="200px"
                />
                <div className="md:hidden">
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="text-white focus:outline-none"
                    >
                        {isOpen ? <MdClose className="h-6 w-6" /> : <IoMenuOutline className="h-6 w-6" />}
                    </button>
                </div>
                <div className={`w-full md:w-auto ${isOpen ? 'block' : 'hidden'} md:flex items-center space-x-6`}>
                    <Link href="/" className="text-white hover:text-gray-300 block md:inline-block">Campaigns</Link>
                    <Link href="/createCampaign" className="text-white hover:text-gray-300 block md:inline-block">Raise Funds</Link>
                    <Link href="/my-listed-items" className="text-white hover:text-gray-300 block md:inline-block">My Campaigns</Link>
                </div>
                <Wallet />
            </div>
        </nav>
    );
};

export default Header;
