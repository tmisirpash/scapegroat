import logo from './logo.svg';
import './App.css';
import {ethers} from 'ethers';
import { useEffect, useState, useCallback } from 'react';
import { GameCardContainer } from './components/GameCardContainer';
import { ConnectWalletButton } from './components/ConnectWalletButton';
import {React} from 'react';

import linkABI from './artifacts/@chainlink/contracts/src/v0.8/interfaces/LinkTokenInterface.sol/LinkTokenInterface.json';


//const provider = ethers.providers.Web3Provider(window.ethereum, "any");
// const link_contract = new ethers.Contract(
//   0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266,
//   linkABI.abi
// );

function isMetaMaskInstalled() {
  return Boolean(window.ethereum && window.ethereum.isMetaMask);
}


async function getAccounts() {
  return await window.ethereum.request({method: 'eth_accounts'});
}

function App() {

  const [balance, setBalance] = useState('0');
  const [accountAddress, setAccountAddress] = useState('0x');
  const [connectionButtonText, setConnectionButtonText] = useState('');
  const [isInstalled, setIsInstalled] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  // const [linkBalance, setLinkBalance] = useState('0');

  // const getBalance = async () => {
  //   const data = await provider.getBalance('0xb2D259Fac6601d877E2360AEAE4FE24B99D81239');
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
  const num_elements = 50;
  const [games, setGames] = useState([]);
  const gridPoints = [...Array(num_elements).keys()];
  let resizeWaitID = 0;


  async function getConnectionInfo() {
    const installed = isMetaMaskInstalled();
    setIsInstalled(installed);
    setConnectionButtonText(installed ? 'Connect to MetaMask' : 'Install MetaMask!');
    if (!installed) return;
    try {
      getAccounts().then((res) => {
        if (res && res.length > 0) {
          setIsConnected(true);
          setAccountAddress(res[0]);
          setConnectionButtonText(res[0]);
        }
      });
    } catch (e) {

    }
  }

  async function connectWallet() {

    try {
      console.log("here")
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{chainId: '0x13881'}] //Chain ID of Mumbai in hex
      });
    } catch (switchError) {
      //console.log(switchError);
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: '0x13881',
                chainName: 'Mumbai Testnet',
                rpcUrls: ['https://rpc-mumbai.maticvigil.com'],
              },
            ],
          });
        } catch (addError) {
          // Do stuff
          console.log('what')
        }
      }
      else {
        throw new Error("User journey was interrupted");
      }
    }


    window.ethereum.request({method: 'eth_requestAccounts'})
    .then((res) => {
      setIsConnected(true);
      setAccountAddress(res[0])
      setConnectionButtonText(res[0]);
    });


  }

  function connectionButtonOnClick() {
    if (!isInstalled) {
      return window.open("https://metamask.io/");
    }
    if (!isConnected) {
      connectWallet().catch(console.error);
    }
    return;

  }

  useEffect(() => {

    const newCoords = [...document.querySelectorAll('.card-container-node')]
      .map((node) => {
        return {
          top: node.offsetTop + 80 + 'px',
          left: node.offsetLeft - 65 + 'px',
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

    getConnectionInfo().catch(console.error);

  }, []);


  useEffect(() => {

    function moveCards (){
      clearTimeout(resizeWaitID);
      resizeWaitID = setTimeout(() => {
          const newCoords = [...document.querySelectorAll('.card-container-node')]
            .map((node) => {
              return {
                top: node.offsetTop  + 80 + 'px',
                left: node.offsetLeft - 65 + 'px',
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

    if (isMetaMaskInstalled()) {
      window.ethereum.on('accountsChanged', () => {
        setIsConnected(false);
        getConnectionInfo();
      });
    }
  })


  return (
    <div 
      className="App"
    >
      <div className="header">
        <ConnectWalletButton 
          clickHandler={connectionButtonOnClick}
          text={connectionButtonText}
        /> 
      </div>
      <div className="content">
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
    </div>
  );
}

export default App;
