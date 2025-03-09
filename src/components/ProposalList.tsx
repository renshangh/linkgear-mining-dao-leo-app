import React from 'react';

interface Proposal {
  id: number;
  title: string;
  content: string;
  expirationDate: string;
}

interface ProposalListProps {
  proposals: Proposal[];
  onVote: (proposalId: number, voteType: 'agree' | 'disagree') => void;
}

const ProposalList: React.FC<ProposalListProps> = ({ proposals, onVote }) => {
  return (
    <div>
      {proposals.map((proposal) => (
        <div key={proposal.id} className="proposal">
          <h3>{proposal.title}</h3>
          <p>{proposal.content}</p>
          <p>Voting Deadline: {proposal.expirationDate}</p>
          <button onClick={() => onVote(proposal.id, 'agree')}>Agree</button>
          <button onClick={() => onVote(proposal.id, 'disagree')}>Disagree</button>
        </div>
      ))}
    </div>
  );
};

export default ProposalList;