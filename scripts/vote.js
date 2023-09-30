const { ethers } = require("hardhat");
const { encryptDataField, decryptNodeResponse } = require("@swisstronik/swisstronik.js");

const sendShieldedTransaction = async (signer, destination, data, value) => {
  // Get the RPC link from the Hardhat network configuration
  const rpcLink = hre.network.config.url;

  // Encrypt transaction data
  const [encryptedData] = await encryptDataField(rpcLink, data);

  // Construct and sign the transaction with encrypted data
  return await signer.sendTransaction({
    from: signer.address,
    to: destination,
    data: encryptedData,
    value,
  });
};

// Sends signed encrypted query to the node
const sendSignedShieldedQuery = async (wallet, destination, data) => {
    if (!wallet.provider) {
        throw new Error("wallet doesn't contain connected provider")
    }
  
    // Encrypt call data
    const [encryptedData, usedEncryptedKey] = await encryptDataField(
        wallet.provider.connection.url,
        data
    )
  
    // Get chain id for signature
    const networkInfo = await wallet.provider.getNetwork()
    const nonce = await wallet.getTransactionCount()
  
    // We treat signed call as a transaction, but it will be sent using eth_call
    const callData = {
        nonce: ethers.utils.hexValue(nonce), // We use nonce to create some kind of reuse-protection
        to: destination,
        data: encryptedData,
        chainId: networkInfo.chainId,
    }
  
    // Extract signature values
    const signedRawCallData = await wallet.signTransaction(callData)
    const decoded = ethers.utils.parseTransaction(signedRawCallData)
  
    // Construct call with signature values
    const signedCallData = {
        nonce: ethers.utils.hexValue(nonce), // We use nonce to create some kind of reuse-protection
        to: decoded.to,
        data: decoded.data,
        v: ethers.utils.hexValue(decoded.v),
        r: ethers.utils.hexValue(decoded.r),
        s: ethers.utils.hexValue(decoded.s),
        chainId: ethers.utils.hexValue(networkInfo.chainId)
    }
  
    // Do call
    const response = await wallet.provider.send('eth_call', [signedCallData, "latest"])
  
    // Decrypt call result
    return await decryptNodeResponse(wallet.provider.connection.url, response, usedEncryptedKey)
  }

  async function main() {
    const contractAddress = "0xFa50f9FB7f025BbdfCCbdb6cBC2E3a1Da200f37a";
    const account = new ethers.Wallet(
      process.env.PRIVATE_KEY, 
      new hre.ethers.providers.JsonRpcProvider(hre.network.config.url)
    )
    const contractFactory = await ethers.getContractFactory("Voting");
    const contract = contractFactory.attach(contractAddress);

  }