const ethers = require('ethers');
require('dotenv').config()
let network = 'mainnet'

const contract_address = network =='mainnet' ? process.env.MAINCONTRACTADDRESS : process.env.TESTCONTRACTADDRESS
const address = network =='mainnet' ? process.env.MAINTOADDRESS : process.env.TESTTOADDRESS
const rpc = network =='mainnet' ? process.env.MAINWSS: process.env.TESTWSS
// const provider = new ethers.providers.JsonRpcProvider(rpc)
const provider = new ethers.providers.WebSocketProvider(rpc)
let wallet = [process.env.PK1,process.env.PK2]


async function small_wallet_send_tx(pk, data, value, to, maxPriorityFeePerGas, maxFeePerGas){
    let wallet = new ethers.Wallet(pk, provider)
    let tx = {
        to: to,
        data: data,
        value: value,
        maxPriorityFeePerGas: maxPriorityFeePerGas,
        maxFeePerGas: maxFeePerGas,
        gasLimit: 400000,
    }
    let send_tx = await wallet.sendTransaction(tx)
    console.log(`Wallet address is ${wallet.address}, Hash is ${send_tx.hash}`)
}


async function main(){
    provider.on('pending', async (tx) => {
        let transaction = await provider.getTransaction(tx)
        if(transaction){
            //unpause
            if(transaction.from.toLocaleLowerCase() == address.toLocaleLowerCase() && transaction.data == '0x3f4ba83a' && transaction.to.toLocaleLowerCase() == contract_address.toLocaleLowerCase()){
                for(let i=0; i<wallet.length; i++){
                    // small_wallet_send_tx(wallet[i], '', ethers.utils.parseEther('0.01') , contract_address, parseInt(Number(transaction.maxPriorityFeePerGas)*1.2).toString() , parseInt(Number(transaction.maxFeePerGas)*1.2).toString())
                    small_wallet_send_tx(wallet[i], '', ethers.utils.parseEther('0.9') , contract_address, transaction.maxPriorityFeePerGas , transaction.maxFeePerGas)
                }
            }
        }
    })
}

main()

