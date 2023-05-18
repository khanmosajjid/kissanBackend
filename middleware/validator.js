const EthJSUtil = require('ethereumjs-util');
const Web3 = require('web3');
let _web3 = new Web3();
const mongoose = require("mongoose");

const validators = {};

validators.isValidWalletAddress = function (walletAddress) {
    return _web3.utils.isAddress(walletAddress);
}

validators.isValidSignature = function (signData) {
    try {
        const msgH = `Signed message${signData.message}`; // adding prefix
        var addrHex = signData.walletAddress;
        addrHex = addrHex.replace("0x", "").toLowerCase();
        var msgSha = EthJSUtil.keccak256(Buffer.from(msgH));
        var sigDecoded = EthJSUtil.fromRpcSig(signData.signature);
        var recoveredPub = EthJSUtil.ecrecover(msgSha, sigDecoded.v, sigDecoded.r, sigDecoded.s);
        var recoveredAddress = EthJSUtil.pubToAddress(recoveredPub).toString("hex");
        return (addrHex === recoveredAddress);
    } catch (e) {
        return false;
    }
}




module.exports = validators;