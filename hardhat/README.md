# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a script that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat run scripts/deploy.js
```

### Reference
Each NFT would give the user 10 tokens

It needs to be represented as 10 * (10 ** 18) as ERC20 tokens are represented by the smallest denomination possible for the token

By default, ERC20 tokens have the smallest denomination of 10^(-18). This means, having a balance of (1) is actually equal to (10 ^ -18) tokens.

Owning 1 full token is equivalent to owning (10^18) tokens when you account for the decimal places.