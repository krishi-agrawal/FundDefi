'use client'
import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import CampaignCollection from "../../artifacts/contracts/Campaign.sol/CampaignCollection.json";
import Campaign from "../../artifacts/contracts/Campaign.sol/Campaign.json";

export default function Detail({ params }) {
  const [data, setData] = useState(null);
  const [donationsData, setDonationsData] = useState([]);
  const [mydonations, setMydonations] = useState([]);
  const [story, setStory] = useState('');
  const [amount, setAmount] = useState('');
  const [change, setChange] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const provider = new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL);
      const contract = new ethers.Contract(params.address, Campaign.abi, provider);

      const title = await contract.title();
      const requiredAmt = await contract.requiredAmt();
      const image = await contract.image();
      const storyUrl = await contract.story();
      const owner = await contract.owner();
      const receivedAmt = await contract.receivedAmt();

      const data = {
        address: params.address,
        title,
        requiredAmt: ethers.utils.formatEther(requiredAmt),
        image,
        receivedAmt: ethers.utils.formatEther(receivedAmt),
        storyUrl,
        owner,
      };

      setData(data);

      let storyData;
      fetch(data.storyUrl)
        .then(res => res.text()).then(data => storyData = data);
      setStory(storyData);
      console.log(storyData)

      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const Web3provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = Web3provider.getSigner();
      const Address = await signer.getAddress();
      console.log(Address)

      const contractt = new ethers.Contract(data.address, Campaign.abi, provider);
      const MyDonations = contractt.filters.donorEvent(null, Address, null);
      const MyAllDonations = await contractt.queryFilter(MyDonations);

      setMydonations(MyAllDonations.map((e) => {
        return {
          donor: e.args.donor,
          amount: ethers.utils.formatEther(e.args.amount),
          timestamp: parseInt(e.args.timestamp),
        };
      }));
      console.log(mydonations)

      const donations = contractt.filters.donorEvent();
      const AllDonations = await contractt.queryFilter(donations);

      const donationsData = AllDonations.map((e) => {
        return {
          donor: e.args.donor,
          amount: ethers.utils.formatEther(e.args.amount),
          timestamp: parseInt(e.args.timestamp),
        };
      });

      setDonationsData(donationsData);
    };

    fetchData();
  }, [params.address, change]);

  const DonateFunds = async () => {
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      const contract = new ethers.Contract(data.address, Campaign.abi, signer);

      const transaction = await contract.donate({ value: ethers.utils.parseEther(amount) });
      await transaction.wait();

      setChange(true);
      setAmount('');
    } catch (error) {
      console.log(error);
    }
  };

  if (!data) {
    return <div>Loading...</div>;
  }

  const progress = (data.receivedAmt / data.requiredAmt) * 100;

  return (
    <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <img className="w-full h-64 object-cover" src={data.image} alt={data.title} />
        <div className="p-8">
          <h2 className="text-3xl text-gray-800 font-bold mb-4">{data.title}</h2>
          <p className="text-gray-700 mb-6">{story}</p>
          <div className="mb-4 flex flex-col md:flex-row md:items-center">
            <input
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              type="number"
              placeholder="Enter amount to donate"
              className="p-3 text-gray-800 border rounded-md mb-4 md:mb-0 md:mr-4 flex-grow focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button onClick={DonateFunds} className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-all">
              Donate Now
            </button>
          </div>
          <div className="mb-6">
            <p className="text-gray-700 mb-2"><strong>Required Amount:</strong> {data.requiredAmt} ETH</p>
            <p className="text-gray-700 mb-2"><strong>Received Amount:</strong> {data.receivedAmt} ETH</p>
            <div className="w-full bg-gray-300 rounded-full h-6 overflow-hidden">
              <div
                className="bg-blue-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-gray-700 mt-2">{progress.toFixed(2)}% funded</p>
          </div>
        </div>
        <div className="p-8 bg-gray-50">
          <h3 className="text-2xl text-gray-700 font-bold mb-4">Recent Donations</h3>
          <ul className="space-y-3">
            {donationsData.map((e) => (
              <li key={e.timestamp} className="flex justify-between items-center text-gray-700 bg-white p-3 rounded-md shadow-sm">
                <span className="text-gray-700 mt-2">{e.donor}</span>
                <span className="text-gray-700 mt-2">{new Date(e.timestamp * 1000).toLocaleString()}</span>
                <span className="text-gray-700 mt-2 font-bold">{e.amount} ETH</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="p-8 bg-gray-50">
          <h3 className="text-2xl text-gray-700 font-bold mb-4">My Donations</h3>
          <ul className="space-y-3">
            {mydonations.map((e) => (
              <li key={e.timestamp} className="flex justify-between items-center text-gray-700 bg-white p-3 rounded-md shadow-sm">
                <span className="text-gray-700 mt-2">{e.donor}</span>
                <span className="text-gray-700 mt-2">{new Date(e.timestamp * 1000).toLocaleString()}</span>
                <span className="text-gray-700 mt-2 font-bold">{e.amount} ETH</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

// export async function generateStaticParams() {
//   const provider = new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL);
//   const contract = new ethers.Contract(process.env.NEXT_PUBLIC_ADDRESS, CampaignCollection.abi, provider);

//   const allCampaigns = contract.filters.campaignCreated();
//   const AllCampaigns = await contract.queryFilter(allCampaigns);

//   return AllCampaigns.map((e) => ({
//     address: e.args.campaignAddress.toString(),
//   }));
// }
