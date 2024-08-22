import React from 'react';
import Card from './Card';

const CardsList = ({ campaigns }) => {
  console.log('Campaigns in CardsList:', campaigns); // Log campaigns data

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {campaigns.map((campaign, index) => (
        <Card key={index} campaign={campaign} />
      ))}
    </div>
  );
};

export default CardsList;
