import React from 'react';
import helloworld_program from "../../helloworld/build/main.aleo?raw";
import { AleoWorker } from "../workers/AleoWorker";

const aleoWorker = AleoWorker();

interface Proposal {
  id: number;
  title: string;
  content: string;
  deadline: string;
}

async function execute() {
    // get title, content, deadline
    alert("Title: " + title + "\nContent: " + content + "\nExpiration Date: " + deadline);
    setExecuting(true);
    const result = await aleoWorker.localProgramExecution(
      helloworld_program,
      "main",
      ["5u32", "5u32"],
    );
    setExecuting(false);

    alert(JSON.stringify(result));
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
          <p>Voting Deadline: {proposal.deadline}</p>
          <button onClick={() => onVote(proposal.id, 'agree')}>Agree</button>
          <button onClick={() => onVote(proposal.id, 'disagree')}>Disagree</button>
        </div>
      ))}
    </div>
  );
};

export default ProposalList;