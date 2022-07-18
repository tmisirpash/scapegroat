import React from 'react';



export function ConnectWalletButton(props) {

    const [backgroundColor, setBackgroundColor] = React.useState('#a754af');
    const [cursor, setCursor] = React.useState('default');

    const isAddress = props.text.includes('0x');

    return (
        <div 
            className="connect-wallet-button"
            onMouseEnter = {() => {
                setBackgroundColor('#d3a9d7');
                isAddress ? setCursor('default') : setCursor('pointer');
            }}
            onMouseLeave = {() => {
                setBackgroundColor('#a754af');
                setCursor('default');
            }}
            onClick = {() => {
                props.clickHandler()
            }}
            style={{
                backgroundColor: backgroundColor,
                cursor: cursor,
            }}
        >
            {isAddress ? props.text.slice(0,20).concat('...') : props.text}
        </div>
    )
}
