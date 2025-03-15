import React, { useState } from 'react';

interface Proposal {
  id: number;
  title: string;
  content: string;
  deadline: string;
}

// Set some sample data for the proposals
const sampleProposals: Proposal[] = [
  {
    id: 1,
    title: "Proposal 1",
    content: "This is the first proposal",
    deadline: "2021-10-01",
  },
  {
    id: 2,
    title: "Proposal 2",
    content: "This is the second proposal",
    deadline: "2021-10-15",
  },
  {
    id: 3,
    title: "Proposal 3",
    content: "This is the third proposal",
    deadline: "2021-11-01",
  },
];

const VotingPage: React.FC = () => {
  const [proposals, setProposals] = useState<Proposal[]>(sampleProposals);

  const handleVote = (proposalId: number, voteType: 'agree' | 'disagree') => {
    // Simulate sending the vote to the contract
    console.log(`Voted ${voteType} on proposal ${proposalId}`);
  };

  return (
    <div>
      <h1>Voting Page</h1>
      {proposals.map((proposal) => (
        <div key={proposal.id} className="proposal">
          <h3>{proposal.title}</h3>
          <p>{proposal.content}</p>
          <p>Voting Deadline: {proposal.deadline}</p>
          <button onClick={() => handleVote(proposal.id, 'agree')}>Agree</button>
          <button onClick={() => handleVote(proposal.id, 'disagree')}>Disagree</button>
        </div>
      ))}
    </div>
  );
};

export default VotingPage;