import React from 'react';
import '../App.css';
import {GameCard} from './GameCard'
import {CardButton} from './CardButton'


export function GameCardContainer(props) {

    return (
        <div className="card-container" style={{position: props.position, left: props.left, top: props.top}}>
            <GameCard 
                numberOfPlayers={props.numberOfPlayers}
                ethToEnter={props.ethToEnter}
                linkToEnter={props.linkToEnter}
            />
            <div className="button-list">
                <CardButton 
                    img={require("../images/eth-icon.png")} 
                    text={"Deposit ETH"}
                    fontSize={20}
                />
                <CardButton 
                    img={require("../images/chainlink-icon.png")}
                    text={"Deposit LINK"}
                    fontSize={19.5}
                />

                <CardButton 
                    img={require("../images/eth-icon.png")}
                    text={"Withdraw ETH"}
                    style={{fontSize: "5px"}}
                    fontSize={17}
                />
                <CardButton 
                    img={require("../images/chainlink-icon.png")}
                    text={"Withdraw LINK"}
                    fontSize={17}
                />
            </div>
        </div>
    );
}
