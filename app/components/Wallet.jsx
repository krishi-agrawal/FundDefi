import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

const Wallet = () => {
    const [address, setAddress] = useState('');
    const [balance, setBalance] = useState('');

    const connectWallet = async () => {
        if (typeof window !== 'undefined' && window.ethereum) { // Check if window and ethereum are available
            try {
                const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
                const provider = new ethers.providers.Web3Provider(window.ethereum, 'any');
                const signer = provider.getSigner();
                const newAddress = await signer.getAddress();
                setAddress(newAddress);
                let newBalance = await signer.getBalance();
                setBalance(ethers.utils.formatEther(newBalance));
            } catch (error) {
                console.error('Error connecting to wallet:', error);
            }

            window.ethereum.on('chainChanged', (chainId) => {
                window.location.reload();
            });

            window.ethereum.on('accountsChanged', async function (accounts) {
                setAddress(accounts[0]);
                await connectWallet();
            });
        } else {
            console.error('Ethereum wallet is not available');
        }
    };

    useEffect(() => {
        if (typeof window !== 'undefined' && window.ethereum) {
            connectWallet();
        }
    }, []);

    return (
        <div>
            <button
                onClick={connectWallet}
                className="text-white bg-transparent border border-white rounded px-4 py-2 hover:bg-white hover:text-blue-600 transition-colors duration-300"
            >
                {address ? `${address.slice(0, 5)}...${address.slice(-4)}` : `Connect`}
            </button>
            {balance && <span>{balance.slice(0, 5)} ETH</span>}
        </div>
    );
};

export default Wallet;
