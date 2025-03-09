// filepath: /Users/renshan/aleonetwork/linkgear-mining-dao-leo-app/src/components/CreateProposal.tsx
import React, { useState } from 'react';

const CreateProposal: React.FC = () => {
  const [proposal, setProposal] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Proposal created:', proposal);
    // Add logic to handle proposal creation
  };

  return (
    <div>
      <h2>Create Proposal</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={proposal}
          onChange={(e) => setProposal(e.target.value)}
          placeholder="Enter proposal"
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default CreateProposal;