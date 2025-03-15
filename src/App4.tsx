import React, { useState } from 'react';
import './App.css';
import helloworld_program from "../helloworld/build/main.aleo?raw";
import { AleoWorker } from "./workers/AleoWorker";

const aleoWorker = AleoWorker();

const App: React.FC = () => {
  // State for proposal creation
  const [title, setTitle] = useState<string>('Test Proposal');
  const [content, setContent] = useState<string>('A sample proposal');
  const [deadline, setDeadline] = useState<number>(1742601600); // March 20, 2025
  const [proposalId, setProposalId] = useState<string>(''); // Will be set after propose

  // State for voting
  const [voterAddress, setVoterAddress] = useState<string>('aleo1youraddress...'); // Replace with your address
  const [voteResult, setVoteResult] = useState<string>('');

  const programId = 'linkgear_mining_dao_voting.aleo';
  const privateAddress = 'aleo1g24j0aa2fw69y7n05aehk3gp7cf8tr9ea2nnpnavx3qdpmc5r5rse08kl2'; // Replace with your key from `aleo account new`

  // Propose a new vote
  const submitProposal = async () => {
    try {
      const info = {
        title: `BHP256::hash_to_field("${title}")`, // Simplified; real hash needed
        content: `BHP256::hash_to_field("${content}")`,
        proposer: 'aleo1g24j0aa2fw69y7n05aehk3gp7cf8tr9ea2nnpnavx3qdpmc5r5rse08kl2', // Your address
        deadline: BigInt(deadline)
      };
      const tx = await aleoWorker.localProgramExecution(
        programId,
        'propose',
        [JSON.stringify(info)],
        privateAddress
      );
      // Mock ID for now (real ID from hash in contract)
      const id = 'field123'; // Replace with actual hash logic later
      setProposalId(id);
      setVoteResult(`Proposal submitted! Tx ID: ${tx}, Proposal ID: ${id}`);
    } catch (error) {
      setVoteResult(`Error: ${(error as Error).message}`);
    }
  };

  // Issue a new ticket
  const issueTicket = async () => {
    try {
      const tx = await client.executeProgram(
        programId,
        'new_ticket',
        [proposalId, voterAddress],
        privateAddress
      );
      setVoteResult(`Ticket issued! Tx ID: ${tx}`);
    } catch (error) {
      setVoteResult(`Error: ${(error as Error).message}`);
    }
  };

  // Vote agree
  const voteAgree = async () => {
    try {
      const ticket = { owner: voterAddress, pid: proposalId }; // Mock ticket; use real one from `new_ticket`
      const tx = await client.executeProgram(
        programId,
        'agree',
        [JSON.stringify(ticket)],
        privateAddress
      );
      setVoteResult(`Agree vote submitted! Tx ID: ${tx}`);
    } catch (error) {
      setVoteResult(`Error: ${(error as Error).message}`);
    }
  };

  // Vote disagree
  const voteDisagree = async () => {
    try {
      const ticket = { owner: voterAddress, pid: proposalId };
      const tx = await client.executeProgram(
        programId,
        'disagree',
        [JSON.stringify(ticket)],
        privateAddress
      );
      setVoteResult(`Disagree vote submitted! Tx ID: ${tx}`);
    } catch (error) {
      setVoteResult(`Error: ${(error as Error).message}`);
    }
  };

  // Query vote totals (assuming getters or direct mapping access)
  const getVoteTotals = async () => {
    try {
      // Simulate querying agree_votes and disagree_votes (no getters in contract yet)
      const agreeResult = await client.executeProgram(
        programId,
        'finalize_agree', // Hack: use finalizer as a getter (not ideal)
        [proposalId]
      ); // This won’t work directly—needs a getter
      const disagreeResult = await client.executeProgram(
        programId,
        'finalize_disagree',
        [proposalId]
      );
      setVoteResult(`Votes for Proposal ${proposalId}: Agree: ${agreeResult}, Disagree: ${disagreeResult}`);
    } catch (error) {
      setVoteResult(`Error querying votes: ${(error as Error).message}. Add getters to contract.`);
    }
  };

  return (
    <div className="App">
      <h1>Linkgear Mining DAO Voting</h1>

      {/* Proposal Form */}
      <h2>Create Proposal</h2>
      <label>
        Title:
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </label>
      <br />
      <label>
        Content:
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </label>
      <br />
      <label>
        Deadline (Unix timestamp):
        <input
          type="number"
          value={deadline}
          onChange={(e) => setDeadline(parseInt(e.target.value))}
        />
      </label>
      <br />
      <button onClick={submitProposal} disabled={executing}>
      {executing
              ? `Executing...check console for details...`
              : `Submit Proposal`}
      </button>

      {/* Voting Section */}
      <h2>Vote on Proposal</h2>
      <label>
        Proposal ID:
        <input
          type="text"
          value={proposalId}
          onChange={(e) => setProposalId(e.target.value)}
        />
      </label>
      <br />
      <label>
        Voter Address:
        <input
          type="text"
          value={voterAddress}
          onChange={(e) => setVoterAddress(e.target.value)}
        />
      </label>
      <br />
      <button onClick={issueTicket}>Issue Ticket</button>
      <button onClick={voteAgree}>Vote Agree</button>
      <button onClick={voteDisagree}>Vote Disagree</button>
      <button onClick={getVoteTotals}>Get Vote Totals</button>

      <p>{voteResult}</p>
    </div>
  );
};

export default App;