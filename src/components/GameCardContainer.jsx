import React from 'react';
import '../App.css';
import {GameCard} from './GameCard'


export function GameCardContainer(props) {

    function logMessage() {
        console.log('click');
    }


    return (
        <div className="card-container card-container-node">
            <GameCard 
                numberOfPlayers={props.numberOfPlayers}
                ethToEnter={props.ethToEnter}
                linkToEnter={props.linkToEnter}
            />
            <div className="button-list" id="button-list">
                <div className="control-panel" id="deposit-eth">
                    <img src={require("../images/eth-icon.png")} height={50} width={50} margin={"25px"}></img>
                    <span style={{paddingLeft: "20px"}}>Deposit ETH</span>
                </div>
                <div className="control-panel" id="withdraw-eth">
                    <img src={require("../images/eth-icon.png")} height={50} width={50}></img>
                    <span style={{paddingLeft: "20px"}}>Withdraw ETH</span>
                </div>
                <div className="control-panel" id="deposit-link">
                    <img src={require("../images/chainlink-icon.png")} height={50} width={50}></img>
                    <span style={{paddingLeft: "20px"}}>Deposit LINK</span>
                </div>
                <div className="control-panel" id="withdraw-link">
                    <img src={require("../images/chainlink-icon.png")} height={50} width={50}></img>
                    <span style={{paddingLeft: "20px"}}>Withdraw LINK</span>
                </div>
            </div>
        </div>
    );
}
