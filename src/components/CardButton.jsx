import React from 'react';



export function CardButton(props) {

    const [backgroundColor, setBackgroundColor ]  = React.useState('#161522');

    return (
        <div 
            className="control-panel" 
            style={{backgroundColor: backgroundColor}}
            onMouseEnter={() => setBackgroundColor('#7672a8')}
            onMouseLeave={() => setBackgroundColor('#161522')}
        >
            <img src={props.img} height={50} width={50}></img>
            <span style={{paddingLeft: "8px", fontSize: props.fontSize}}>{props.text}</span>
            <img src={require('../images/arrow-icon.png')} height={50} width={50}></img>
        </div>
    );
}



