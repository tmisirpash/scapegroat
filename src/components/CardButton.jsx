import React from 'react';



export function CardButton(props) {
    return (
        <div className="control-panel">
            <img src={props.img} height={50} width={50}></img>
            <span style={{paddingLeft: "8px", fontSize: props.fontSize}}>{props.text}</span>
            <img src={require('../images/arrow-icon.png')} height={50} width={50}></img>
        </div>
    );
}



