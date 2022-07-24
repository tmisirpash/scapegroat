import logo from './logo.svg';
import './App.css';
import {ethers} from 'ethers';
import { useEffect, useState, useCallback } from 'react';
import { GameCardContainer } from './components/GameCardContainer';
import { ConnectWalletButton } from './components/ConnectWalletButton';
import { ChainButton } from './components/ChainButton';
import {React} from 'react';

import linkABI from './artifacts/@chainlink/contracts/src/v0.8/interfaces/LinkTokenInterface.sol/LinkTokenInterface.json';
import groatABI from './artifacts/contracts/GroatGame.sol/GroatGame.json';


const groatAddress = '0x8BE9A57B08Bf2c09197c03240829BC5026E8cb0e';

//const provider = ethers.providers.Web3Provider(window.ethereum, "any");
// const link_contract = new ethers.Contract(
//   0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266,
//   linkABI.abi
// );

const supportedChains = new Set([
  '0x13881', '80001', //Mumbai Testnet
]);


function isMetaMaskInstalled() {
  return Boolean(window.ethereum && window.ethereum.isMetaMask);
}


async function getAccounts() {
  return await window.ethereum.request({method: 'eth_accounts'});
}


async function getGroatData(address) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const groatContract = new ethers.Contract(
        groatAddress,
        groatABI.abi,
        provider
    );
    const groatWithSigner = groatContract.connect(signer);


    const linkContract = new ethers.Contract(
        '0x326C977E6efc84E512bB9C30f76E30c160eD06FB',
        linkABI.abi,
        provider
    );
    const linkContractWithSigner = linkContract.connect(signer);

    const balanceOfGroatEth = await provider.getBalance(groatAddress);
    console.log('contract eth balance', balanceOfGroatEth.toString());
    const balanceOfGroatLink = await linkContract.balanceOf(groatAddress);
    console.log('contract link balance', balanceOfGroatLink.toString());


    const ethInContract = await groatContract.staked_eth(address);
    console.log('staked eth', ethers.utils.formatEther(ethInContract));
    const linkInContract = await groatContract.staked_link(address);
    console.log('staked link', ethers.utils.formatEther(linkInContract));
    const numEntries = await groatContract.num_entries(address);
    console.log('number of entries', numEntries.toString());
    const idEntries = await groatContract.id_entries(0);
    idEntries.forEach((e) => console.log(e));
    const playerEntries = await groatContract.id_player_entries(address, 0);
    playerEntries.forEach((e) => console.log(e));


    // const tx = groatWithSigner.depositEth({
    //   value: ethers.utils.parseEther('0.001')
    // });
 
    // const tx = groatWithSigner.removeLinkEth(
    //   ethers.utils.parseEther('0'),
    //   ethers.utils.parseEther('0.001')
    // );
    //console.log(tx);



        // const tx = linkContractWithSigner.transferAndCall(
        //     groatAddress,
        //     ethers.utils.parseEther('0.00015'),
        //     []
        // );
}



function App() {

  const [balance, setBalance] = useState('0');
  const [accountAddress, setAccountAddress] = useState('0x');
  const [connectionButtonText, setConnectionButtonText] = useState('');
  const [connectionStatusText, setConnectionStatusText] = useState('');
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
    setConnectionButtonText('Connect with MetaMask');
    if (!installed) return;
    try {
      getAccounts().then((res) => {
        if (res && res.length > 0) {
          setIsConnected(true);
          setAccountAddress(res[0]);
          getGroatData(res[0]);
          setConnectionButtonText(res[0]);
          if (supportedChains.has(window.ethereum.networkVersion)) {
            setConnectionStatusText('');
          } else {
            setConnectionStatusText(`Note: You are on an unsupported network. Please switch to Polygon Mumbai Testnet.`);
          }
        }
      });
    } catch (e) {

    }
  }

  async function connectWallet() {

    try {
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
                nativeCurrency: {
                  symbol: 'MATIC',
                  decimals: 18,
                },
                rpcUrls: ['https://rpc-mumbai.maticvigil.com'],
              },
            ],
          });
        } catch (addError) {
          // Do stuff
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
      setConnectionStatusText('')
    });



  }

  function connectionButtonOnClick() {
    if (!isInstalled) {
      setConnectionStatusText('Please refresh the page once MetaMask installation has finished.')
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
    }

    function handleAccountChange() {
      setIsConnected(false);
      getConnectionInfo();
    }

    function handleChainChange(_chainId) {
      if (!supportedChains.has(_chainId)) {
        setConnectionStatusText(`Note: You are on an unsupported network. Please switch to Polygon Mumbai Testnet.`);
      } else {
        setConnectionStatusText('');
      }
    }

   
    window.addEventListener("resize", moveCards);

    if (isMetaMaskInstalled()) {
      window.ethereum.on('accountsChanged', handleAccountChange);
      window.ethereum.on('chainChanged', handleChainChange);
    }

    return () => {
      window.removeEventListener('resize', moveCards);
      if (isMetaMaskInstalled()) {
        window.ethereum.removeListener('accountsChanged', handleAccountChange);
        window.ethereum.removeListener('chainChanged', handleChainChange);
      }
    };

  })


  return (
    <div 
      className="App"
    >
      <div className="header">
        <div style={{fontSize: "40px", marginRight: "40px"}}>
          {connectionStatusText}
        </div>
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
