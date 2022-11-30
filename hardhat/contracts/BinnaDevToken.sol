// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./IBinnaDevs.sol";

contract BinnaDevToken is ERC20, Ownable {

    uint256 public constant tokenPrice = 0.001 ether;
    uint256 public constant maxTotalSupply = 10000 * 10**18;
    uint256 public constant tokensPerNFT = 10 * 10**18;

    // BinnaDevsNFT contract instance
    IBinnaDevs BinnaDevsNFT;
    
    // Mapping to keep track of which tokenIds have been claimed
    mapping(uint => bool) tokenIds;

    // The constructor accepts an argument of an address to initialize 
    // the BinnaDevsNFT interface and set the value of the token's name and symbol.
    constructor(address _BinnaDevsContract) ERC20("Binna Dev Token", "BDT") {
        BinnaDevsNFT = IBinnaDevs(_BinnaDevsContract);
    }

    /**
     * The mint function is used by a user who is neither an NFT holder nor 
     * an NFT holder who has mint tokens for their NFTs.
     * @dev Mints `amount` number of BinnaDevTokens
     * msg.value` should be equal or greater than the tokenPrice * amount
     */
    function mint(uint amount) payable public {
        uint _requiredAmount = amount * tokenPrice;
        require(msg.value >= _requiredAmount,"Ether sent is incorrect");

        uint amountWithDecimals = _requiredAmount * 10**18;
        require(totalSupply() + amountWithDecimals < maxTotalSupply, "Exceeds the max total supply available.");

        // call the internal function from Openzeppelin's ERC20 contract
        _mint(msg.sender, amountWithDecimals);
    }

    /**
     * The claim function is used by an NFT holder who has yet to mint tokens for their NFTs. 
     * @dev Mints tokens based on the number of NFT's held by the sender
     *  Requirements
     *  balance of Binna Dev NFT's owned by the sender should be greater than 0
     *  Tokens should have not been claimed for all the NFTs owned by the sender
     */
    function claim() public {
        address sender = msg.sender;
        uint256 balance = BinnaDevsNFT.balanceOf(sender);
        uint256 amount;
        require(balance > 0, "You do not own any Binna Dev NFT's");
        
        for(uint i; i < balance; i++){
            uint tokenId = BinnaDevsNFT.tokenOfOwnerByIndex(sender, i);
            if(!tokenIds[tokenId]){
                amount++;
                tokenIds[tokenId] = true;
            }
        }

        require(amount > 0, "You have already claimed all the tokens");
        _mint(sender, amount * tokensPerNFT);
    }

    /**
        * @dev withdraws all ETH sent to this contract
        * Requirements:
        * wallet connected must be owner's address
        */
    function withdraw() public {
        uint amount = address(this).balance;
        require(amount > 0, "Nothing to withdraw; contract balance empty");

        address _owner = owner();
        (bool sent, ) = _owner.call{value: amount}("");
        require(sent, "Failed to send Ether");
    }

    // Function to receive Ether. msg.data must be empty
    receive() payable external{}
     // Fallback function is called when msg.data is not empty
    fallback() payable external{}
}