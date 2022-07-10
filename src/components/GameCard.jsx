import React from 'react';
import {Box} from '@mui/material';
import '../App.css';


export function getProbabilityOfWinning(numberOfPlayers) {
    return Math.round((numberOfPlayers - 1) / numberOfPlayers * 100 * 10000) / 10000;
}

export function getReward(numberOfPlayers, ethToEnter) {
    return Math.round(ethToEnter / (numberOfPlayers - 1) * 10000) / 10000;
}




export function GameCard(props) {
    return (
        <Box className="card">
            <div>
                Max # of players: <span style={{color: "magenta"}}>{props.numberOfPlayers}</span>
            </div>
            <div>
                <span style={{color: "deepskyblue"}}>{props.ethToEnter}</span> ETH, <span style={{color: "deepskyblue"}}>{props.linkToEnter}</span> LINK to enter
            </div>
            <div>
                <span style={{color: "yellow"}}>{getProbabilityOfWinning(props.numberOfPlayers)}%</span> chance of winning
            </div>
            <div>
                <span style={{color: "deepskyblue"}}>{getReward(props.numberOfPlayers, props.ethToEnter)}</span> ETH reward
            </div>

        </Box>
    );
}