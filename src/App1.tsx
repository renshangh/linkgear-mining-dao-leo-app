import React, { useState } from 'react';
import './App.css';
import helloworld_program from "../helloworld/build/main.aleo?raw";
import { AleoWorker } from "./workers/AleoWorker";

const aleoWorker = AleoWorker();

const App: React.FC = () => {
  const [proposalId, setProposalId] = useState<number>(1);
  const [voteChoice, setVoteChoice] = useState<boolean>(true);
  const [voteResult, setVoteResult] = useState<string>('');
  const [executing, setExecuting] = useState<boolean>(false);

  const submitVote = async () => {
    try {
      const stakeRecord = { owner: 'aleo1g24j0aa2fw69y7n05aehk3gp7cf8tr9ea2nnpnavx3qdpmc5r5rse08kl2', amount: 100n }; // Replace with your address
      setExecuting(true);
      const tx = await aleoWorker.localProgramExecution(
        helloworld_program,
        "main",
        ["5u32", "5u32"],
        //programId,
        //'vote',
        //[proposalId.toString() + 'u32', voteChoice.toString(), JSON.stringify(stakeRecord)],
        //'YOUR_PRIVATE_KEY' // Replace with your key
      );
      setExecuting(false);
      setVoteResult(`Vote submitted! Tx ID: ${tx}`);
    } catch (error) {
      setVoteResult(`Error: ${(error as Error).message}`);
      setExecuting(false);
    }
  };

  const getVotes = async () => {
    try {
      const result = await aleoWorker.localProgramExecution(
        helloworld_program,
        'get_votes',
        [proposalId.toString() + 'u32']
      );
      setVoteResult(`Total votes for Proposal ${proposalId}: ${result}`);
    } catch (error) {
      setVoteResult(`Error: ${(error as Error).message}`);
    }
  };

  return (
    <div className="App">
      <h1>Mining DAO Voting</h1>
      <label>
        Proposal ID:
        <input
          type="number"
          value={proposalId}
          onChange={(e) => setProposalId(parseInt(e.target.value))}
        />
      </label>
      <br />
      <label>
        Vote:
        <select
          value={voteChoice.toString()}
          onChange={(e) => setVoteChoice(e.target.value === 'true')}
        >
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
      </label>
      <br />
      <button onClick={submitVote} disabled={executing}>
        {executing ? 'Submitting Vote...' : 'Submit Vote'}
      </button>
      <button onClick={getVotes} disabled={executing}>
        Get Total Votes
      </button>
      <p>{voteResult}</p>
      {executing && <p>Executing...</p>}
    </div>
  );
};

export default App;