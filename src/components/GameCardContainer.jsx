import React from 'react';
import {Box} from '@mui/material';
import '../App.css';
import {GameCard} from './GameCard'


export function GameCardContainer(props) {
    return (
        <div className="card-container card-container-node">
            <GameCard 
                numberOfPlayers={props.numberOfPlayers}
                ethToEnter={props.ethToEnter}
                linkToEnter={props.linkToEnter}
            />
            <div className="button-list">
                <Box className="control-panel">
                    <img src={require("../images/eth-icon.png")} height={50} width={50} margin={"25px"}></img>
                    <span style={{paddingLeft: "20px"}}>Deposit ETH</span>
                </Box>
                <Box className="control-panel">
                    <img src={require("../images/eth-icon.png")} height={50} width={50}></img>
                    <span style={{paddingLeft: "20px"}}>Withdraw ETH</span>
                </Box>
                <Box className="control-panel">
                    <img src={require("../images/chainlink-icon.png")} height={50} width={50}></img>
                    <span style={{paddingLeft: "20px"}}>Deposit LINK</span>
                </Box>
                <Box className="control-panel">
                    <img src={require("../images/chainlink-icon.png")} height={50} width={50}></img>
                    <span style={{paddingLeft: "20px"}}>Withdraw LINK</span>
                </Box>

            </div>
        </div>
    );
}
