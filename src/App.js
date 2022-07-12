import logo from './logo.svg';
import './App.css';
import {ethers} from 'ethers';
import { useEffect, useState, useCallback } from 'react';
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
  const num_elements = 100;
  const [games, setGames] = useState([]);
  const gridPoints = [...Array(num_elements).keys()];
  let resizeWaitID = 0;
  

  useEffect(() => {

    const newCoords = [...document.querySelectorAll('.card-container-node')]
      .map((node) => {
        return {
          top: node.offsetTop -50 + 'px',
          left: node.offsetLeft - 90 + 'px',
        }
    });

    const initialGames = [...Array(num_elements).keys()].map((n, i) => {
      return { 
        key: `${n}`,
        numberOfPlayers: 101,
        ethToEnter: 5,
        linkToEnter: 0.25,
        top: newCoords[i].top,
        left: newCoords[i].left,
      }
    });

    setGames(oldArray => {
      return initialGames
    });

  }, []);


  useEffect(() => {

    function moveCards (){
      clearTimeout(resizeWaitID);
      resizeWaitID = setTimeout(() => {
          const newCoords = [...document.querySelectorAll('.card-container-node')]
            .map((node) => {
              return {
                top: node.offsetTop -50 + 'px',
                left: node.offsetLeft -90 + 'px',
              }
            });
          const updated = games.map((g, i) => {
            return {
              key: g.key,
              numberOfPlayers: g.numberOfPlayers,
              ethToEnter: g.ethToEnter,
              linkToEnter: g.linkToEnter,
              top: newCoords[i].top,
              left: newCoords[i].left,
            }
          });
          setGames(oldArray => updated);

        }, 101);
    };

    window.addEventListener("resize", moveCards);
  })




  return (
    <div 
      className="App"
    >
      <div className="container">
        {gridPoints.map((n) => <div key={`${n}`} className="card-container-node"></div>)}
      </div>
      <div>
        {games.map((g) => <GameCardContainer 
          key={`${g.key}`}
          numberOfPlayers={g.numberOfPlayers} 
          ethToEnter={g.ethToEnter} 
          linkToEnter={g.linkToEnter} 
          top={g.top} 
          left={g.left} 
          position={"absolute"}/>)}
      </div>
    </div>
  );
}

export default App;
