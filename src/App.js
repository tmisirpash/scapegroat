import logo from './logo.svg';
import './App.css';
import {ethers} from 'ethers';
import { useEffect, useState, useMemo } from 'react';
import { GameCard } from './components/GameCard';

import linkABI from './artifacts/@chainlink/contracts/src/v0.8/interfaces/LinkTokenInterface.sol/LinkTokenInterface.json';


// const provider = ethers.getDefaultProvider('http://localhost:8545');
// const link_contract = new ethers.Contract(
//   0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266,
//   linkABI.abi
// );




function App() {


  // const [balance, setBalance] = useState('0');
  // const [linkBalance, setLinkBalance] = useState('0');

  // const getBalance = async () => {
  //   const data = await provider.getBalance('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266');
  //   setBalance(ethers.utils.formatEther(data));
  // };
  // const getLinkBalance = async () => {
  //   const data = link_contract.functions.getBalance('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266');
  //   setLinkBalance(ethers.utils.formatEther(data));
  // }

  // useEffect(() => {
  //   getBalance();
  //   getLinkBalance;
  // }, []);


  useEffect(() => {

    const nodes = document.querySelectorAll(".card-node");
    const totalNodes = nodes.length;
    const boxes = [];

    let nodeCnt = 0, resizeWaitID = 0, node = {}, dupe = {};

    for (nodeCnt = 0; nodeCnt < totalNodes; nodeCnt++) {
      node = nodes[nodeCnt];

      dupe = node.cloneNode(true);
      dupe.classList.remove('card-node');
      dupe.classList.add('card-dupe');
      node.parentNode.appendChild(dupe);
      dupe.style.top = node.offsetTop + 'px';
      dupe.style.left = node.offsetLeft + 'px';

      boxes[nodeCnt] = {node, dupe};
    }

    function moveNodes() {
      clearTimeout(resizeWaitID);
      resizeWaitID = setTimeout(() => {
        for (nodeCnt = 0; nodeCnt < totalNodes; nodeCnt++) {
          boxes[nodeCnt].dupe.style.left = boxes[nodeCnt].node.offsetLeft + 'px';
          boxes[nodeCnt].dupe.style.top = boxes[nodeCnt].node.offsetTop + 'px';
        }
      }, 101);
    }

    window.addEventListener("resize", moveNodes);
  });


  return (
    <div 
      className="App"
    >
      <div className="container">
        {[...Array(100).keys()].map((n) => <GameCard key={`${n}`}/>)}
      </div>
    </div>
  );
}

export default App;
