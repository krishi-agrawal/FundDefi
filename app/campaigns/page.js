'use client';
import React, { useState, useEffect } from 'react';
import CardsList from '../components/CardsList';
import CampaignCollection from '../../artifacts/contracts/Campaign.sol/CampaignCollection.json'; // Adjust the import path
import Image from 'next/image';

import { ethers } from 'ethers';

const Home = () => {
    const [campaigns, setCampaigns] = useState([]);
    const [filter, setFilter] = useState('all');

    const THRESHOLD_DATE = new Date('2024-08-02').getTime() / 1000;

    useEffect(() => {
        const CATEGORY_HASHES = {
            "0x2efa9d8aaaee861e3c33003a83429b789718741fa73415832ff17eb59a339f13": "Environment",
            "0x5a8f0f21933a12ff8a8e345456cdb0324e83112f6d24ed06b7c3c5e0b4d7e4c3": "Technology",
            "0x6377c45cecbe1f20eaf46bd3f27ae079882e88d579f5eed558666cd6bfd75606": "Education",
            "0xdd8aab326bea0fdf2117dc4f32e8cf0ee59a1177415f6c7bc5e1ac210048bf63": "Health"
        };
        const fetchData = async () => {
            try {
                // if (typeof window === 'undefined') return; // Ensure client-side only

                const rpcProvider = new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL);
                const contract = new ethers.Contract(process.env.NEXT_PUBLIC_ADDRESS, CampaignCollection.abi, rpcProvider);

                // Fetch all campaigns
                const allCamps = contract.filters.campaignCreated();
                let allEvents = await contract.queryFilter(allCamps);
                allEvents = allEvents.reverse();

                const allData = allEvents.map((e) => ({
                    title: e.args.title,
                    category: CATEGORY_HASHES[e.args.category.hash] || e.args.category.hash,
                    requiredAmt: ethers.utils.formatEther(e.args.requiredAmt).toString(),
                    owner: e.args.owner,
                    image: e.args.image,
                    timeStamp: parseInt(e.args.timestamp).toString(),
                    address: e.args.campaignAddress
                })).filter((campaign) => parseInt(campaign.timeStamp) > THRESHOLD_DATE);

                setCampaigns(allData);

                const filterCampaigns = (category) => {
                    if (category === 'all') {
                        setCampaigns(allData);
                    } else {
                        const filteredData = allData.filter((camp) => camp.category === category);
                        setCampaigns(filteredData);
                    }
                };

                filterCampaigns(filter);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [filter, THRESHOLD_DATE]);

    return (
        <div className="min-h-screen bg-black">

            <div className="container mx-auto p-6 bg-black">
                <div className='flex justify-center items-center m-0 mb-8 py-4 relative bg-zinc-700'>
                    <h1 className="text-8xl md:text-6xl font-bold m-0 blur-none">Campaigns</h1>
                </div>

                <div className="mb-4">
                    <button onClick={() => setFilter('all')} className="mr-2 p-2 bg-purple-700 text-white rounded">All</button>
                    <button onClick={() => setFilter('Environment')} className="mr-2 p-2 bg-purple-700 text-white rounded">Environment</button>
                    <button onClick={() => setFilter('Technology')} className="mr-2 p-2 bg-purple-700 text-white rounded">Technology</button>
                    <button onClick={() => setFilter('Health')} className="mr-2 p-2 bg-purple-700 text-white rounded">Health</button>
                    <button onClick={() => setFilter('Education')} className="mr-2 p-2 bg-purple-700 text-white rounded">Education</button>
                </div>
                <CardsList campaigns={campaigns} />
            </div>

        </div>
    );
};

export default Home;
