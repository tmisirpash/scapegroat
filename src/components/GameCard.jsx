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
        <Box className="card card-node">
            <div>
                Max # of players: <span style={{color: "red"}}>{props.numberOfPlayers}</span>
            </div>
            <div>
                <span style={{color: "green"}}>{props.ethToEnter}</span> ETH, <span style={{color: "blue"}}>{props.linkToEnter}</span> LINK to enter
            </div>
            <div>
                <span style={{color: "purple"}}>{getProbabilityOfWinning(props.numberOfPlayers)} %</span> chance of winning
            </div>
            <div>
                <span style={{color: "green"}}>{getReward(props.numberOfPlayers, props.ethToEnter)}</span> ETH reward
            </div>

        </Box>
    );
}