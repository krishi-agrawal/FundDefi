import React from 'react';
import Link from 'next/link';

const Card = ({ campaign }) => {
  console.log('Campaign in Card:', campaign); // Log each campaign

  return (
    <div className="bg-white rounded-lg overflow-hidden transition-transform transform hover:scale-105 hover:shadow-xl w-96">
      <img src={campaign.image} alt={campaign.title} className="w-full h-48 object-cover" />
      <div className="p-6 space-y-4">
        <h2 className="text-2xl text-gray-800 font-semibold">{campaign.title}</h2>
        <div className="text-sm text-gray-700 space-y-2">
          <p>
            <span className="inline-block bg-gray-200 text-gray-900 px-2 py-1 rounded-md font-medium">
              Category:
            </span> {campaign.category}
          </p>
          <p>
            <span className="inline-block bg-gray-200 text-gray-900 px-2 py-1 rounded-md font-medium">
              Required Amount:
            </span> {campaign.requiredAmt}
          </p>
          <p>
            <span className="inline-block bg-gray-200 text-gray-900 px-2 py-1 rounded-md font-medium">
              Owner:
            </span> {campaign.owner.slice(0, 6)}...{campaign.owner.slice(39)}
          </p>
          <p>
            <span className="inline-block bg-gray-200 text-gray-900 px-2 py-1 rounded-md font-medium">
              Timestamp:
            </span> {new Date(campaign.timeStamp * 1000).toLocaleString()}
          </p>
        </div>
        <Link passHref href={'/' + campaign.address}  className="block text-center bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
        
            Go to Fundraiser

        </Link>
      </div>
    </div>
  );
};

export default Card;
