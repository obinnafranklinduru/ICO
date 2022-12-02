import { BigNumber, Contract, providers, utils } from "ethers";
import React, { useEffect, useRef, useState } from "react";
import Web3Modal from "web3modal";

import Footer from '../components/Footer'
import Main from '../components/Main'
import Meta from '../components/Meta'
import styles from '../styles/Home.module.css'
import {
  NFT_CONTRACT_ADDRESS,
  NFT_CONTRACT_ABI,
  TOKEN_CONTRACT_ADDRESS,
  TOKEN_CONTRACT_ABI,
} from "../constants";


export default function Home() {
  // Create a BigNumber `0`
  const zero = BigNumber.from(0);

  // loading is set to true when we are waiting for a transaction to get mined
  const [loading, setLoading] = useState(false);
  // walletConnected keeps track of whether the user's wallet is connected or not
  const [walletConnected, setWalletConnected] = useState(false);
  // tokensMinted is the total number of tokens that have been minted till now out of 10000(max total supply)
  const [tokensMinted, setTokensMinted] = useState(zero);
  // balanceOfBinnaDevTokens keeps track of number of Binna Dev tokens owned by an address
  const [balanceOfBinnaDevTokens, setBalanceOfBinnaDevTokens] = useState(zero);
  // amount of the tokens that the user wants to mint
  const [tokenAmount, setTokenAmount] = useState(zero);
  // tokensToBeClaimed keeps track of the number of tokens that can be claimed
  // based on the Binna Dev NFT's held by the user for which they havent claimed the tokens
  const [tokensToBeClaimed, setTokensToBeClaimed] = useState(zero);
  // isOwner gets the owner of the contract through the signed address
  const [isOwner, setIsOwner] = useState(false);
  // Create a reference to the Web3 Modal which persists as long as the page is open
  const web3ModalRef = useRef();

  useEffect(() => {
    web3ModalRef.current = new Web3Modal({
      network: "goerli",
      providerOptions: {},
      disableInjectedProvider: false
    });

    connectWallet();
    getBalanceOfBinnaDevTokens();
    getTotalTokensMinted();
    getTokensToBeClaimed();
    getOwner();
  }, [walletConnected])

   /**
   * Returns a Provider or Signer object representing the Ethereum RPC with or without the
   * signing capabilities of metamask attached
   *
   * A `Provider` is needed to interact with the blockchain - reading transactions, reading balances, reading state, etc.
   *
   * A `Signer` is a special type of Provider used in case a `write` transaction needs to be made to the blockchain, which involves the connected account
   * needing to make a digital signature to authorize the transaction being sent. Metamask exposes a Signer API to allow your website to
   * request signatures from the user using Signer functions.
   *
   * @param {*} needSigner - True if you need the signer, default false otherwise
   */
  const getProviderOrSigner = async (needSigner = false) => {
    // provider will be used to determine which kind of provider we are passing
    const provider = await web3ModalRef.current.connect();
    // web3provider will become the node or hook to connect to the blockchain.
    const web3Provider = new providers.Web3Provider(provider);

    // If user is not connected to the Goerli network, let them know and throw an error
    const { chainId } = await web3Provider.getNetwork();
    if (chainId !== 5) {
      window.alert("Change the network to Goerli")
      throw new Error("Change the network to Goerli")
    }

    // If the function is called with a true argument, return signer. 
    if (needSigner) {
      const signer = web3Provider.getSigner();
      return signer;
    }

    return web3Provider;
  }

  // connectWallet: Connects the MetaMask wallet
  const connectWallet = async () => {
    try {
      await getProviderOrSigner();
      setWalletConnected(true);
    } catch (error) {
      console.error(error);
    }
  }
  
//========================Functions to Update the UI=======================================

  const mintBinnaDevToken = async (amount) => {
    try {
      const signer = await getProviderOrSigner(true);
      const tokenContract = new Contract(
        TOKEN_CONTRACT_ADDRESS, TOKEN_CONTRACT_ABI, signer
      )
      
      // value signifies the cost of one Binna dev token which is "0.001" eth.
      const value = 0.001 * amount;
      // value is represented as a number, so we need to convert it to a string when passing
      // Reason: BinnaDevToken is represented by BigNumber. 
      const tx = await tokenContract.mint(amount,
        { value: utils.parseEther(value.toString()) });
      
      // wait for the transaction to get mined
      setLoading(true);
      await tx.wait();

      setLoading(false);
      window.alert("Sucessfully minted Binna Dev Tokens");
      await getBalanceOfBinnaDevTokens();
      await getTotalTokensMinted();
      await getTokensToBeClaimed();
    } catch (error) {
      console.error(error);
    }
  }

  // getBalanceOfBinnaDevTokens: checks the balance of Binna Dev Tokens's held by an address
  const getBalanceOfBinnaDevTokens = async () => {
    try {
      const provider = await getProviderOrSigner();
      const tokenContract = new Contract(
        TOKEN_CONTRACT_ADDRESS,
        TOKEN_CONTRACT_ABI,
        provider
      );
      
      // We want to get the address in order to get the balance of the address.
      // So, we need the signer so that from the signer, we can get the address.
      const signer = await getProviderOrSigner(true);
      const address = await signer.getAddress();
      const balance = await tokenContract.balanceOf(address);
      setBalanceOfBinnaDevTokens(balance);
    } catch (error) {
      console.error(error);
    }
  }

  // getTotalTokensMinted: Retrieves how many tokens have been minted till now out of the total supply
  const getTotalTokensMinted = async () => {
    try {
      const provider = await getProviderOrSigner();
      const tokenContract = new Contract(
        TOKEN_CONTRACT_ADDRESS,
        TOKEN_CONTRACT_ABI,
        provider
      );
      const _tokensMinted = await tokenContract.totalSupply();
      setTokensMinted(_tokensMinted);
    } catch (error) {
      console.error(error);
    }
  }

  // getTokensToBeClaimed: checks the balance of tokens that can be claimed by the user
  const getTokensToBeClaimed = async () => {
    try {
      const provider = await getProviderOrSigner();
      // We call the nft contract here to determine how many tokens are 
      // to be claimed by the user based on the number of nfts he has.
      // Create an instance of NFT Contract
      const nftContract = new Contract(
        NFT_CONTRACT_ADDRESS,
        NFT_CONTRACT_ABI,
        provider
      );

      // Create an instance of tokenContract
      const tokenContract = new Contract(
        TOKEN_CONTRACT_ADDRESS,
        TOKEN_CONTRACT_ABI,
        provider
      );

      const signer = await getProviderOrSigner(true);
      const address = await signer.getAddress();
      const balance = await nftContract.balanceOf(address);
      
      if (balance === zero) {
        setTokensToBeClaimed(zero);
      } else {
        var amount = 0;
        for (var i = 0; i < balance; i++){
          const tokenId = await nftContract.tokenOfOwnerByIndex(address, i);
          const claimed = await tokenContract.tokenIdsClaimed(tokenId);
          if (!claimed) {
            amount++;
          }
        }
      setTokensToBeClaimed(BigNumber.from(amount));
      }
    } catch (error) {
      console.error(error);
      setTokensToBeClaimed(zero);
    }
  }

  const claimBinnaDevTokens = async () => {
    try {
      const signer = await getProviderOrSigner(true);
      const tokenContract = new Contract(
        TOKEN_CONTRACT_ADDRESS,
        TOKEN_CONTRACT_ABI,
        signer
      );

      const tx = await tokenContract.claim();
      
      setLoading(true);
      await tx.wait();
      setLoading(false);
      window.alert("Sucessfully claimed Binna Dev Tokens");
      await getBalanceOfBinnaDevTokens();
      await getTotalTokensMinted();
      await getTokensToBeClaimed();
    } catch (error) {
      console.error(error);
      window.alert("You have already claimed all the tokens");
    }
  }

  // getOwner: gets the contract owner by connected address
  const getOwner = async () => {
    try {
      const provider = await getProviderOrSigner();
      const tokenContract = new Contract(
        TOKEN_CONTRACT_ADDRESS,
        TOKEN_CONTRACT_ABI,
        provider
      );
      // call the owner function from the contract
      const _owner = await tokenContract.owner();
      // we get signer to extract address of currently connected Metamask account
      const signer = await getProviderOrSigner(true);
      // Get the address associated to signer which is connected to Metamask
      const address = await signer.getAddress();
      // check if the connected address is the owner
       if (address.toLowerCase() === _owner.toLowerCase()) {
        setIsOwner(true);
      }
    } catch (error) {
      console.log(error)
    }
  }

  // withdrawCoins: withdraws ether by calling the withdraw function in the contract
  const withdrawCoins = async () => {
    try {
      const signer = await getProviderOrSigner(true);
      const tokenContract = new Contract(
        TOKEN_CONTRACT_ADDRESS,
        TOKEN_CONTRACT_ABI,
        signer
      );

      const tx = await tokenContract.withdraw();

      setLoading(true);
      await tx.wait();
      setLoading(false);
      getOwner();
    } catch (error) {
      console.error(error);
      window.alert(error.reason);
    }
  }

  const renderButton = () => {

    if (loading) {
      return (
        <div>
          <button className={styles.button}> Loading... </button>
        </div>
      )
    }

    if (tokensToBeClaimed) {
      return (
        <div>
          <div className={styles.description}>
            {tokensToBeClaimed * 10} Token can be claimed!
          </div>

          <button
            className={styles.button}
            onClick={claimBinnaDevTokens}
          >
            Claim Tokens
          </button>
        </div>
      )
    }
    
    return (
      <div style={{ display: "flex-col" }}>
        <div>
          <input
            type='number'
            placeholder='Amount of Token'
            onChange={(e) => setTokenAmount(BigNumber.from(e.target.value))}
          />

          <button
            className={styles.button}
            disabled={!(tokenAmount > 0)}
            onClick={() => mintBinnaDevToken(tokenAmount)}
          >
            Mint Tokens
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      <Meta />
      <Main
        walletConnected = {walletConnected} 
        balanceOfBinnaDevTokens = {balanceOfBinnaDevTokens} 
        tokensMinted = {tokensMinted} 
        withdrawCoins = {withdrawCoins}
        connectWallet = {connectWallet}
        renderButton = {renderButton}
        isOwner= {isOwner}
        loading= {loading}
      />
      <Footer />
    </>
  )
}
