import React, { useEffect, useState } from 'react';
import helloworld_program from "../../helloworld/build/main.aleo?raw";
import { AleoWorker } from "../workers/AleoWorker";

const aleoWorker = AleoWorker();

interface Proposal {
  id: number;
  title: string;
  content: string;
  expirationDate: string;
}

// set some sameple data for the proposals
const proposals: Proposal[] = [
  {
    id: 1,
    title: "Proposal 1",
    content: "This is the first proposal",
    expirationDate: "2021-10-01",
  },
  {
    id: 2,
    title: "Proposal 2",
    content: "This is the second proposal",
    expirationDate: "2021-10-15",
  },
  {
    id: 3,
    title: "Proposal 3",
    content: "This is the third proposal",
    expirationDate: "2021-11-01",
  },
];

const VotingPage: React.FC = () => {
  const [proposals, setProposals] = useState<Proposal[]>(sampleProposals);
  // const [loading, setLoading] = useState(true);
/**
  useEffect(() => {
    const fetchProposals = async () => {
      setLoading(true);
      try {
        const result = await aleoWorker.localProgramExecution(
          helloworld_program,
          "get_proposals",
          []
        );
        setProposals(result);
      } catch (error) {
        console.error("Error fetching proposals:", error);
      }
      setLoading(false);
    };

    fetchProposals();
  }, []);
*/

  const handleVote = (proposalId: number, voteType: 'agree' | 'disagree') => {
    // Simulate sending the vote to the contract
    console.log(`Voted ${voteType} on proposal ${proposalId}`);
  };

  if (loading) {
    return <div>Loading proposals...</div>;
  }

  return (
    <div>
      <h1>Voting Page</h1>
      {proposals.map((proposal) => (
        <div key={proposal.id} className="proposal">
          <h3>{proposal.title}</h3>
          <p>{proposal.content}</p>
          <p>Voting Deadline: {proposal.expirationDate}</p>
          <button onClick={() => handleVote(proposal.id, 'agree')}>Agree</button>
          <button onClick={() => handleVote(proposal.id, 'disagree')}>Disagree</button>
        </div>
      ))}
    </div>
  );
};

export default VotingPage;