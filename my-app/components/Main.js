import styles from '../styles/Home.module.css'
import { utils} from "ethers";

const Main = ({ walletConnected, balanceOfBinnaDevTokens, tokensMinted, withdrawCoins, connectWallet, renderButton, isOwner, loading }) =>
{
  return (
    <>
      <div className={styles.main}>
        <div>
          <h1 className={styles.title}>Welcome to Binna Devs ICO!</h1>

          <div className={styles.description}>
            You can claim or mint Binna Dev tokens here
          </div>

          {walletConnected ? (
            <div>
              <div className={styles.description}>
                {/* Format Ether helps us in converting a BigNumber to string */}
                You have minted {utils.formatEther(balanceOfBinnaDevTokens)} Binna Dev tokens
              </div>
              
              <div className={styles.description}>
                {/* Format Ether helps us in converting a BigNumber to string */}
                Overall {utils.formatEther(tokensMinted)}/10000 have been minted!!!
              </div>

              {renderButton()}

              {/* Display additional withdraw button if connected wallet is owner */}
              
              {isOwner ? (
                <div>
                  {loading ? <button className={styles.button}>Loading...</button> :
                    <button className={styles.button} onClick={withdrawCoins}> Withdraw Coins </button>}
                </div>) : ("")}
            </div>) :
            (<button onClick={connectWallet} className={styles.button}> Connect your wallet </button>)}
        </div>
        
        <div>
          <img className={styles.image} src="./0.svg" />
        </div>
      
      </div>
    </>
  );
}

export default Main