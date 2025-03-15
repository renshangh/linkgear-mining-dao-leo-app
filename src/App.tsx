import { useState } from "react";
import linkgearLogo from "./assets/linkgear.png";
import "./App.css";
import helloworld_program from '../helloworld/build/main.aleo?raw';
import voting_program from '../linkgear_mining_dao_voting/build/main.aleo?raw';
import { AleoWorker } from './workers/AleoWorker';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import ProposalList from './components/ProposalList';
import VotingPage from './components/VotingPage';
import {stringToBigInt, bigIntToString, stringToFields, fieldsToString} from './util/javascript.js';
import { ProgramManager } from "@provablehq/sdk";

const aleoWorker = AleoWorker();

interface Proposal {
  id: number;
  title: string;
  content: string;
  deadline: string;
}

function App() {
  const [count, setCount] = useState(0);
  const [account, setAccount] = useState<string | null>(null);
  const [executing, setExecuting] = useState(false);
  const [deploying, setDeploying] = useState(false);
  const [language, setLanguage] = useState('en'); // State to manage the current language
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [showCreateProposal, setShowCreateProposal] = useState(false); // State to manage the visibility of CreateProposal
  // State for proposal creation
  const [title, setTitle] = useState<string>('Test Proposal');
  const [content, setContent] = useState<string>('A sample proposal');
  const [deadline, setDeadline] = useState<number>(1742601600); // March 20, 2025
  const [voteResult, setVoteResult] = useState<string>('');
  const [LogMsg, setLogMsg] = useState<string>('');
  const [proposalId, setProposalId] = useState<string>(''); // Will be set after propose

  const generateAccount = async () => {
    const key = await aleoWorker.getPrivateKey();
    setAccount(await key.to_string());
  };

  async function execute() {
    // get title, content, deadline
    alert(helloworld_program)
    setExecuting(true);
    const result = await aleoWorker.localProgramExecution(
      helloworld_program,
      "main",
      ["5u32", "5u32"],
    );
    setExecuting(false);

    alert(JSON.stringify(result));
  }
  
  // Propose a new vote
  const submitProposal = async () => {
    try {
      const ptitle = stringToFields(title,1)+'field';
      const pcontent = stringToFields(content,1) + 'field';
      const pproposer = 'aleo1g24j0aa2fw69y7n05aehk3gp7cf8tr9ea2nnpnavx3qdpmc5r5rse08kl2'; // Replace with your key from `aleo account new`
      const pdeadline = stringToBigInt(deadline.toString(),1) + 'u64';

      const params = '\"{title: ' + ptitle + ', content: '+ pcontent + ', proposer: ' + pproposer + ', deadline:' + pdeadline +'}\"'
/*       let msg = '';
      const info = {
        title: ptitle, // Simplified; real hash needed
        content: pcontent,
        proposer: privateAddress, // Your address
        deadline: pdeadline
      };

      msg = JSON.stringify(info); */
      ProgramManager.setAccount()
      alert(voting_program)
      setLogMsg(`Proposal submitted! Result: ${params}`);
      setExecuting(true);
      const tx = await aleoWorker.localProgramExecution(
        voting_program,
        'propose',
        params
      );
      setExecuting(false);
      setVoteResult(`Proposal submitted! Result: ${tx}`);
    } catch (error) {
      setVoteResult(`Error: ${(error as Error).message}`);
    }
  };

    // Propose a new vote
    const submitVote = async () => {
      try {
        const ptitle = stringToFields(title,1)+'field';
        const pcontent = stringToFields(content,1) + 'field';
        const pproposer = 'aleo1g24j0aa2fw69y7n05aehk3gp7cf8tr9ea2nnpnavx3qdpmc5r5rse08kl2';
        const pdeadline = stringToBigInt(deadline.toString(),1) + 'u64';
  
        //alert(`title: ${ptitle}, content: ${pcontent}, deadline: ${pdeadline}`)
        let msg = '';
        const info = {
          title: ptitle, // Simplified; real hash needed
          content: pcontent,
          proposer: pproposer, // Your address
          deadline: pdeadline
        };
  
        msg = JSON.stringify(info);
        setLogMsg(`Proposal submitted! Result: ${msg}`);
        setExecuting(true);
        const tx = await aleoWorker.localProgramExecution(
          voting_program,
          'propose',
          [JSON.stringify(info)]
        );
        setExecuting(false);
        setVoteResult(`Proposal submitted! Result: ${tx}`);
      } catch (error) {
        setVoteResult(`Error: ${(error as Error).message}`);
      }
    };

  async function deploy() {
    setDeploying(true);
    try {
      const result = await aleoWorker.deployProgram(helloworld_program);
      console.log("Transaction:")
      console.log("https://explorer.hamp.app/transaction?id=" + result)
      alert("Transaction ID: " + result);
    } catch (e) {
      console.log(e)
      alert("Error with deployment, please check console for details");
    }
    setDeploying(false);
  }

  const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(event.target.value);
  };

  const handleVote = (proposalId: number, voteType: 'agree' | 'disagree') => {
    // Simulate sending the vote to the contract
    console.log(`Voted ${voteType} on proposal ${proposalId}`);
  };

  return (
    <Router>
      <div className="header">
        <a href="https://linkgear.org" target="_blank" rel="noopener noreferrer">
          <img src={linkgearLogo} className="logo" alt="Linkgear logo" />
        </a>
        <h1>{language === 'en' ? 'Linkgear Mining DAO' : 'Linkgear 挖矿 DAO'}</h1>
        <select className="language-toggle" value={language} onChange={handleLanguageChange}>
          <option value="en">English</option>
          <option value="zh">中文</option>
        </select>
      </div>      
      <div className="button-row">
        <Link to="/create-proposal">
          <button onClick={() => setShowCreateProposal(true)}>
            {language === 'en' ? 'Create Proposal' : '创建提案'}
          </button>
        </Link>
        <Link to="/voting-page">
          <button>
            {language === 'en' ? 'Vote for Proposal' : '投票提案'}
          </button>
        </Link>
        <button onClick={() => setCount((count) => count + 1)}>
          {language === 'en' ? `count is ${count}` : `计数是 ${count}`}
        </button>
        <button onClick={generateAccount}>
          {account
            ? language === 'en'
              ? `Account private key is ${JSON.stringify(account)}`
              : `账户私钥是 ${JSON.stringify(account)}`
            : language === 'en'
            ? `Click to generate account`
            : `点击生成账户`}
        </button>
         <button disabled={executing} onClick={execute}>
          {executing
              ? `Executing...check console for details...`
              : `Execute helloworld.aleo`}
        </button>
        <button disabled={deploying} onClick={deploy}>
          {deploying
              ? `Deploying...check console for details...`
              : `Deploy helloworld.aleo`}
        </button> 
        
      </div>
      {showCreateProposal && (
        <div>
          <div>
            <label>Title:</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Content:</label>
            <input
              type="text"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Voting Deadline:</label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              required
            />
          </div>
          <div className="button-row">
            <button disabled={executing} onClick={submitProposal}>
              {executing
                ? language === 'en'
                  ? `Executing...check console for details...`
                  : `执行中...查看控制台了解详情...`
                : language === 'en'
                ? `Submit Proposal`
                : `执行 提案提交`}
            </button>      
            <button type="button" onClick={() => setShowCreateProposal(false)}>Close</button>
          </div>
            <div className="log-message">
            <p style={{ whiteSpace: 'pre-wrap' }}>{LogMsg}</p>
            </div>
          <p>{voteResult}</p>
        </div>
      )}
      <div className="content">
        <Routes>
          <Route path="/" element={<ProposalList proposals={proposals} onVote={handleVote} />} />
          <Route path="/vote-proposal" element={<VotingPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
