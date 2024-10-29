'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import CardsList from "../components/CardsList.jsx";
import CampaignCollection from '../../artifacts/contracts/Campaign.sol/CampaignCollection.json';

const ethers = dynamic(() => import('ethers'), { ssr: false });

const Page = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [allCampaigns, setAllCampaigns] = useState([]);
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
        if (typeof window === 'undefined' || !window.ethereum) return;

        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const Web3provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = Web3provider.getSigner();
        const Address = await signer.getAddress();

        const rpcProvider = new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL);
        const contract = new ethers.Contract(process.env.NEXT_PUBLIC_ADDRESS, CampaignCollection.abi, rpcProvider);

        const allCamps = contract.filters.campaignCreated(null, null, Address);
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

        console.log('All Campaigns Data:', allData);
        setAllCampaigns(allData);
        setCampaigns(allData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [ THRESHOLD_DATE]);

  useEffect(() => {
    const filterCampaigns = () => {
      if (filter === 'all') {
        setCampaigns(allCampaigns);
      } else {
        const filteredData = allCampaigns.filter((camp) => camp.category === filter);
        setCampaigns(filteredData);
      }
    };

    filterCampaigns();
  }, [filter, allCampaigns]);

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto p-6 bg-black">
        <div className='flex justify-center items-center m-0 mb-8 py-4 relative bg-zinc-700'>
          <h1 className="text-8xl md:text-6xl font-bold m-0 blur-none">My Campaigns</h1>
        </div>
        
        <div className="mb-4 flex justify-center">
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

export default Page;
