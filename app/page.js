'use client';
import Typewriter from 'typewriter-effect'

import React, { useState, useEffect } from 'react';
import CardsList from './components/CardsList';
import { ethers } from 'ethers';
import CampaignCollection from '../artifacts/contracts/Campaign.sol/CampaignCollection.json'; // Adjust the import path

const Home = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [filter, setFilter] = useState('all');
  const [showLandingPage, setShowLandingPage] = useState(true);

  const CATEGORY_HASHES = {
    "0x2efa9d8aaaee861e3c33003a83429b789718741fa73415832ff17eb59a339f13": "Environment",
    "0x5a8f0f21933a12ff8a8e345456cdb0324e83112f6d24ed06b7c3c5e0b4d7e4c3": "Technology",
    "0x6377c45cecbe1f20eaf46bd3f27ae079882e88d579f5eed558666cd6bfd75606": "Education",
    "0xdd8aab326bea0fdf2117dc4f32e8cf0ee59a1177415f6c7bc5e1ac210048bf63": "Health"
    // Add other category hashes as needed
  };
  const THRESHOLD_DATE = new Date('2024-08-02').getTime() / 1000; // Example threshold date
  console.log("THRESHOLD_DATE")
  console.log(THRESHOLD_DATE)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const rpcProvider = new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL);
        const contract = new ethers.Contract(process.env.NEXT_PUBLIC_ADDRESS, CampaignCollection.abi, rpcProvider);

        // Fetch all campaigns
        const allCamps = contract.filters.campaignCreated();
        let allEvents = await contract.queryFilter(allCamps);
        allEvents = allEvents.reverse();
        const allData = allEvents.map((e) => ({
          title: e.args.title,
          category: CATEGORY_HASHES[e.args.category.hash] || e.args.category.hash,
          requiredAmt: ethers.utils.formatEther(e.args.requiredAmt).toString(), // Ensure requiredAmt is a string
          owner: e.args.owner,
          image: e.args.image,
          timeStamp: parseInt(e.args.timestamp).toString(),
          address: e.args.campaignAddress
        })).filter((campaign) => parseInt(campaign.timeStamp) > THRESHOLD_DATE);

        console.log('All Campaigns Data:', allData); // Log the data

        setCampaigns(allData);

        // Filter data based on selected category
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
  }, [filter]);

  return (
    <div className="min-h-screen bg-black ">
      {showLandingPage ? (
        <div className="flex flex-col md:flex-row h-screen">
          {/* Left Part */}
          <div className="flex-1 flex items-center justify-center relative bg-black p-8">
            <h1 className="text-4xl md:text-6xl absolute top-10 font-bold text-center ">
              Decentralised Fundraiser
            </h1>
            <img className='absolute left-0 bottom-0 z-10' src='/blocks_new.png' height="500px" width="500px" />
          </div>

          {/* Right Part */}
          <div className="flex-1 flex flex-col items-center justify-center bg-black text-white p-8 relative">
            <img src='/back-glow.png' width="300px" height="400px" className='opacity-75 absolute right-0 top-0'></img>
            <p className="text-xl md:text-3xl mb-4 text-center">
              Connecting for a cause
            </p>
            <button onClick={() => setShowLandingPage(false)} className="bg-white text-blue-600 py-2 px-4 rounded hover:bg-gray-200 transition duration-300">
              Go to Campaigns
            </button>
          </div>
        </div>
      ) : (
        <div className="container mx-auto p-6 bg-black">
          <div className='flex justify-center items-center m-0 relative'>
            <h1 className="text-8xl md:text-6xl font-bold mb-4 m-0">Campaigns</h1>
            <img src='/security_final.png' width="300px" height="30px" className='absolute right-20'/>
          </div>

          <div className="mb-4">
            <button onClick={() => setFilter('all')} className="mr-2 p-2 bg-blue-500 text-white rounded">All</button>
            <button onClick={() => setFilter('Environment')} className="mr-2 p-2 bg-green-500 text-white rounded">Environment</button>
            <button onClick={() => setFilter('Technology')} className="p-2 bg-yellow-500 text-white rounded">Technology</button>
          </div>
          <CardsList campaigns={campaigns} />
        </div>
      )}
    </div>
  );
};

export default Home;
