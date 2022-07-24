const ethers = require('ethers');

const linkABI = require('../src/artifacts/@chainlink/contracts/src/v0.8/interfaces/LinkTokenInterface.sol/LinkTokenInterface.json');

const groatAddress = '0xb36d8928E3FD57Fe1aEf6DB35EF3D5729939F20C';

async function main() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const groatContract = new ethers.Contract(
        groatAddress,
        groatABI.abi,
        provider
    );
    const groatWithSigner = groatContract.connect(signer);


    const linkContract = new ethers.Contract(
        '0x326C977E6efc84E512bB9C30f76E30c160eD06FB',
        linkABI.abi,
        provider
    );
    const linkContractWithSigner = linkContract.connect(signer);



    for (let i = 0; i < 15; i++) {
        const tx = groatWithSigner.depositEth({
          value: ethers.utils.parseEther('0.002')
        });
    }
    for (let i = 0; i < 15; i++) {
        const tx = linkContractWithSigner.transferAndCall(
            groatAddress,
            ethers.utils.parseEther('0.25')
        );
    }


}


main().catch(console.error);