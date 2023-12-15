const Web3 = require('web3');
const fs = require('fs');

// Load ABIs
const yourContractABI = JSON.parse(fs.readFileSync('your_contract_abi.json', 'utf-8'));
const tokenContractABI = JSON.parse(fs.readFileSync('token_contract_abi.json', 'utf-8'));
// Just put ABI files in the same directory

// Contract addresses
const yourContractAddress = '0xsomething'; // Your contract address
const tokenContractAddress = '0xsomething'; // Token contract address you approving to spend

// Your Web3 provider
const yourRpcUrl = 'wss://wss.api.moonriver.moonbeam.network'; // Moonriver's public RPC as example
const web3 = new Web3(yourRpcUrl); 

// Wallet setup
const privateKey = 'your tester address private key'; // Your private key of the address from which transaction comes from
const account = web3.eth.accounts.privateKeyToAccount(privateKey);
web3.eth.accounts.wallet.add(account);

// Contract instances
const yourContract = new web3.eth.Contract(yourContractABI, yourContractAddress);
const tokenContract = new web3.eth.Contract(tokenContractABI, tokenContractAddress);

// Approve your contract to spend tokens
async function approveTokens() {
    try {
     
        const approvalAmount = web3.utils.toWei('10', 'Tokens'); // Example amount is set for 10 tokens
        const estimatedGas = await yourContract.methods.deposit(approvalAmount).estimateGas({ from: account.address });
        console.log('Estimated Gas:', estimatedGas);
        const gasLimit = Math.floor(estimatedGas * 1.2); // Estimated gas is multiplied by 1.2 to make actual gas limit 20% higher
   
        const approvalResult = await tokenContract.methods.approve(yourContractAddress, approvalAmount).send({ 
            from: account.address,
            gasLimit: gasLimit
        });
        console.log('Token approval result:', approvalResult);
    } catch (error) {
        console.error('Error in token approval:', error);
    }
}

// Deposit approved tokens into your contract
async function testDeposit() {
    try {
        await approveTokens(); 

        const depositAmount = web3.utils.toWei('10', 'Tokens');
        const estimatedGas = await yourContract.methods.deposit(depositAmount).estimateGas({ from: account.address });
        console.log('Estimated Gas:', estimatedGas);
        const gasLimit = Math.floor(estimatedGas * 1.2);

        const depositResult = await yourContract.methods.deposit(depositAmount).send({
            from: account.address,
            gasLimit: gasLimit
        });

        console.log('Deposit result:', depositResult);
    } catch (error) {
        console.error('Error in deposit:', error);
    }
}

testDeposit();

// run with npm start