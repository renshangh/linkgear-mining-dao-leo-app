// filepath: /Users/renshan/aleonetwork/linkgear-mining-dao-leo-app/src/components/VoteProposal.tsx
import React, { useState } from 'react';

const VoteProposal: React.FC = () => {
  const [vote, setVote] = useState('');

  const handleVote = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Vote submitted:', vote);
    // Add logic to handle voting
  };

  return (
    <div>
      <h2>Vote for Proposal</h2>
      <form onSubmit={handleVote}>
        <input
          type="text"
          value={vote}
          onChange={(e) => setVote(e.target.value)}
          placeholder="Enter your vote"
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default VoteProposal;