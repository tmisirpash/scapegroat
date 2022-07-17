import React from 'react';



export function ConnectWalletButton(props) {

    const [backgroundColor, setBackgroundColor] = React.useState('#a754af')

    const isAddress = props.text.includes('0x');

    return (
        <div 
            className="connect-wallet-button"
            onMouseEnter = {() => setBackgroundColor('#d3a9d7')}
            onMouseLeave = {() => setBackgroundColor('#a754af')}
            onClick = {() => {
                props.clickHandler()
            }}
            style={{
                backgroundColor: backgroundColor,
            }}
        >
            {isAddress ? props.text.slice(0,20).concat('...') : props.text}
        </div>
    )
}
