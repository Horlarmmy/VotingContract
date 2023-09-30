# Basic Private Voting Contract

This project demonstrates a basic private voting contract with the following features
- All state variables are private.
- Allow only the contract owner to add new voters.
- A modifier (e.g. onlyVoter) or a function to check that allows only registered voters interact with the contract.
- Functions for registered voters to cast their votes.
- Function to retrieve the current vote count

### Deployed Contract Address
[0xFa50f9FB7f025BbdfCCbdb6cBC2E3a1Da200f37a](https://explorer-evm.testnet.swisstronik.com/address/0xFa50f9FB7f025BbdfCCbdb6cBC2E3a1Da200f37a)
### Build

To compile contracts, use following command:
```sh 
npm run compile
```

### Testing & Deployment

<b>NOTE</b>: tests are not compatible with hardhat network / ganache, so you have to start Swisstronik local node or use public testnet

Create `.env` file from example
```sh
cp example.env .env
```
Add `PRIVATE_KEY` in `.env` with actual private key to interact with network. If you're using other network than local testnet you also should replace `url` in `hardhat.config.ts`

To run tests, use following command:

```sh
npm run test
```

To deploy contracts, use check `scripts/deploy.ts` script and use following command:
```sh
npm run deploy
```

