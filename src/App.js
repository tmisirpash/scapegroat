import logo from './logo.svg';
import './App.css';
import {ethers} from 'ethers';
import { useEffect, useState, useMemo } from 'react';
import { GameCardContainer } from './components/GameCardContainer';
import {React} from 'react';

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

 


  const games = [...Array(5).keys()].map((n) => <GameCardContainer 
    key={`${n}`}
    numberOfPlayers={101}
    ethToEnter={5}
    linkToEnter={0.25}
    onClick={() => console.log('click')}
  />);


  useEffect(() => {

    const nodes = document.querySelectorAll(".card-container-node");
    const totalNodes = nodes.length;
    const boxes = [];

    let nodeCnt = 0, resizeWaitID = 0, node = {}, dupe = {};

    for (nodeCnt = 0; nodeCnt < totalNodes; nodeCnt++) {
      node = nodes[nodeCnt];
      console.log(node)

      dupe = node.cloneNode(true);

      //Add event listeners to buttons (definitely better way to do this)
      let deposit_eth_node = dupe.querySelector("#button-list").querySelector("#deposit-eth")
      let withdraw_eth_node = dupe.querySelector("#button-list").querySelector("#withdraw-eth")
      let deposit_link_node = dupe.querySelector("#button-list").querySelector("#deposit-link")
      let withdraw_link_node = dupe.querySelector("#button-list").querySelector("#withdraw-link")

      deposit_eth_node.addEventListener("click", () => console.log("click"))
      withdraw_eth_node.addEventListener("click", () => console.log("click"))
      deposit_link_node.addEventListener("click", () => console.log("click"))
      withdraw_link_node.addEventListener("click", () => console.log("click"))


      dupe.classList.remove('card-container-node');
      dupe.classList.add('card-container-dupe');
      node.parentNode.appendChild(dupe);
      dupe.style.top = node.offsetTop - 50 + 'px';
      dupe.style.left = node.offsetLeft  - 50 + 'px';

      boxes[nodeCnt] = {node, dupe};
    }

    function moveNodes() {
      clearTimeout(resizeWaitID);
      resizeWaitID = setTimeout(() => {
        for (nodeCnt = 0; nodeCnt < totalNodes; nodeCnt++) {
          boxes[nodeCnt].dupe.style.left = boxes[nodeCnt].node.offsetLeft - 50 + 'px';
          boxes[nodeCnt].dupe.style.top = boxes[nodeCnt].node.offsetTop - 50 + 'px';
        }
      }, 101);
    }

    window.addEventListener("resize", moveNodes);
  });


  return (
    <div 
      className="App"
    >
      <div className="container" style={{position: "absolute"}}>
        {games}
      </div>
    </div>
  );
}

export default App;
