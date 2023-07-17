# BinnaDevToken Decentralised Application

The BinnaDevToken smart contract is an ERC20 token contract that allows users to mint Binna Dev Tokens by either purchasing them directly or claiming them based on ownership of Binna Dev NFTs. The contract includes functionality for minting tokens, claiming tokens for NFT ownership, and withdrawing Ether from the contract.

## Smart Contract - BinnaDevToken

The BinnaDevToken contract includes the following key features:

- Token minting: Users can mint Binna Dev Tokens by purchasing them or claiming them based on ownership of Binna Dev NFTs.
- Token price and supply limits: The contract specifies the token price, maximum total supply, and the number of tokens per NFT.
- Integration with BinnaDevsNFT: The contract interacts with the BinnaDevsNFT contract to verify NFT ownership and mint tokens.
- Ownership and withdrawal: The contract includes ownership functionality and allows the contract owner to withdraw Ether from the contract.

## Interface - IBinnaDevs

The IBinnaDevs interface defines the functions required to interact with the BinnaDevsNFT contract. It includes functions to retrieve token IDs owned by an address and check the balance of tokens.

## Frontend - Next.js

The frontend of the BinnaDevToken project is built with Next.js, a React framework for server-side rendering and building web applications. The frontend provides a user-friendly interface for interacting with the BinnaDevToken smart contract.

## Technologies Used

The code in this repository utilizes the following technologies:

- Solidity: The programming language used for writing smart contracts.
- Next.js: A React framework for server-side rendering and building web applications.

## How to Use

1. Deploy the BinnaDevToken contract and provide the address of the BinnaDevsNFT contract during deployment.
2. Start the Next.js development server to run the frontend.
3. Access the application through your web browser to interact with the BinnaDevToken contract.
4. Connect a compatible web3-enabled wallet (e.g., MetaMask) to interact with the BinnaDevToken contract.

## Contributions

Contributions to this project are welcome! If you find any issues or have suggestions for improvement, please feel free to create a pull request or submit an issue on the project's repository.

## License

The code in this repository is licensed under the MIT License.
