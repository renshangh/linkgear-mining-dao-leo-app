import { useState } from "react";
import linkgearLogo from "./assets/linkgear.png";
import "./App.css";
import helloworld_program from "../helloworld/build/main.aleo?raw";
import { AleoWorker } from "./workers/AleoWorker";
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import ProposalList from './components/ProposalList';

const aleoWorker = AleoWorker();

interface Proposal {
  id: number;
  title: string;
  content: string;
  expirationDate: string;
}

function App() {
  const [count, setCount] = useState(0);
  const [account, setAccount] = useState<string | null>(null);
  const [executing, setExecuting] = useState(false);
  const [deploying, setDeploying] = useState(false);
  const [language, setLanguage] = useState('en'); // State to manage the current language
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [showCreateProposal, setShowCreateProposal] = useState(false); // State to manage the visibility of CreateProposal
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [expirationDate, setExpirationDate] = useState('');

  const generateAccount = async () => {
    const key = await aleoWorker.getPrivateKey();
    setAccount(await key.to_string());
  };

  async function execute() {
    // get title, content, expirationDate
    alert("Title: " + title + "\nContent: " + content + "\nExpiration Date: " + expirationDate);
    setExecuting(true);
    const result = await aleoWorker.localProgramExecution(
      helloworld_program,
      "main",
      ["5u32", "5u32"],
    );
    setExecuting(false);

    alert(JSON.stringify(result));
  }

  async function execute_proposal() {
    // get title, content, expirationDate
    alert("Title: " + title + "\nContent: " + content + "\nExpiration Date: " + expirationDate);
    setExecuting(true);
    const result = await aleoWorker.localProgramExecution(
      helloworld_program,
      "main",
      ["5u32", "5u32"],
    );
    setExecuting(false);

    alert(JSON.stringify(result));
    handleProposalSubmit()
  }

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

  const handleProposalSubmit = () => {
    // Simulate sending the proposal to the contract and getting an ID
    const newProposal = { title, content, expirationDate, id: proposals.length + 1 };
    setProposals([...proposals, newProposal]);
    setShowCreateProposal(false); // Hide the CreateProposal component after submission
    setTitle('');
    setContent('');
    setExpirationDate('');
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
        <button onClick={() => setShowCreateProposal(true)}>
          {language === 'en' ? 'Create Proposal' : '创建提案'}
        </button>
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
            ? language === 'en'
              ? `Executing...check console for details...`
              : `执行中...查看控制台了解详情...`
            : language === 'en'
            ? `Execute helloworld.aleo`
            : `执行 提案提交`}
        </button>
        <button disabled={deploying} onClick={deploy}>
          {deploying
            ? language === 'en'
              ? `Deploying...check console for details...`
              : `部署中...查看控制台了解详情...`
            : language === 'en'
            ? `Deploy helloworld.aleo`
            : `部署 helloworld.aleo`}
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
              value={expirationDate}
              onChange={(e) => setExpirationDate(e.target.value)}
              required
            />
          </div>
          <div className="button-row">
          <button disabled={executing} onClick={execute_proposal}>
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
        </div>
      )}
      <div className="content">
        <ProposalList proposals={proposals} onVote={handleVote} />
      </div>
    </Router>
  );
}

export default App;
