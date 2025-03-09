import { useState } from "react";
import linkgearLogo from "./assets/linkgear.png";
import "./App.css";
import helloworld_program from "../helloworld/build/main.aleo?raw";
import { AleoWorker } from "./workers/AleoWorker";
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import CreateProposal from './components/CreateProposal';
import VoteProposal from './components/VoteProposal';

const aleoWorker = AleoWorker();
function App() {
  const [count, setCount] = useState(0);
  const [account, setAccount] = useState(null);
  const [executing, setExecuting] = useState(false);
  const [deploying, setDeploying] = useState(false);
  const [language, setLanguage] = useState('en'); // State to manage the current language

  const generateAccount = async () => {
    const key = await aleoWorker.getPrivateKey();
    setAccount(await key.to_string());
  };

  async function execute() {
    setExecuting(true);
    const result = await aleoWorker.localProgramExecution(
      helloworld_program,
      "main",
      ["5u32", "5u32"],
    );
    setExecuting(false);

    alert(JSON.stringify(result));
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

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  return (
    <Router>
      <div className="header">
        <a href="https://linkgear.org" target="_blank">
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
          <button>{language === 'en' ? 'Create Proposal' : '创建提案'}</button>
        </Link>
        <Link to="/vote-proposal">
          <button>{language === 'en' ? 'Vote for Proposal' : '投票提案'}</button>
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
            ? language === 'en'
              ? `Executing...check console for details...`
              : `执行中...查看控制台了解详情...`
            : language === 'en'
            ? `Execute helloworld.aleo`
            : `执行 helloworld.aleo`}
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
      <Routes>
        <Route path="/create-proposal" element={<CreateProposal />} />
        <Route path="/vote-proposal" element={<VoteProposal />} />
      </Routes>
    </Router>
  );
}

export default App;
