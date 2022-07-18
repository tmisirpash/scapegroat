import React from 'react';



export function CardButton(props) {

    const [backgroundColor, setBackgroundColor ]  = React.useState('#161522');
    const [cursor, setCursor] = React.useState('default');

    return (
        <div 
            className="control-panel" 
            style={{
                backgroundColor: backgroundColor,
                cursor: cursor,
            }}
            onMouseEnter={() => {
                setBackgroundColor('#7672a8');
                setCursor('pointer');
            }}
            onMouseLeave={() => {
                setBackgroundColor('#161522');
                setCursor('default');
            }}
        >
            <img src={props.img} height={50} width={50}></img>
            <span style={{paddingLeft: "8px", fontSize: props.fontSize}}>{props.text}</span>
            <img src={require('../images/arrow-icon.png')} height={50} width={50}></img>
        </div>
    );
}



