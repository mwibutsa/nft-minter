# [NFT Minter](https://koinect-nft-minter-dev.k8s-v2.trykoin.com/)

This is a smart contract for minting NFTs.
It allows users to create unique, one-of-a-kind digital assets that can be bought, sold, and traded on the blockchain.

## Technologies

- [Node](https://nodejs.org/en/)
- [React](https://reactjs.org/)
- [Next.js](https://nextjs.org/)
- [Typescript](https://www.typescriptlang.org/)
- A package manager - [Yarn](https://yarnpkg.com/lang/en/) (preferred) or [NPM](https://www.npmjs.com/)
- [Tailwind-css](https://tailwindcss.com/) as the css style library
- [Solidity](https://soliditylang.org/)
- [Hardhat](https://hardhat.org/) for testing , compiling & deploying the smart contract

## Prerequisites

- NodeJS and a package manager should be installed on your system together with the following applications for use in development

- A web browser (prefer [Chrome](https://www.google.com/chrome/))
- A Crypto (blockchain) wallet like [Metamask](https://metamask.io/)

## Setup

After installing the prerequisites, clone the repository:

```ch
    $ git clone https://github.com/mwibutsa/nft-minter.git
```

Then change the directory to the cloned repository:

```ch
    $ cd nft-minter
```

To install dependencies defined in the `package.json` file run:

```ch
    $ cd frontend
    $ yarn install
```

```ch
    $ cd ..
```

```ch
    $ cd backend
    $ yarn install
```

```ch
    $ cd ..
```

Create a `.env` file and add all variables as defined in the `.env.sample` file

```ch
    $ touch frontend/.env backend/.env
```

Start the local development for the frontend app run

```ch
    $ cd frontend
    $ yarn dev
```

To access the development version of the nft-minter web app:

- Open [localhost:3000](http://localhost:3000/) in your browser

This will load the development version of the nft-minter web app.

## Development standards and Guidelines

- [Commit message](https://www.conventionalcommits.org/en/v1.0.0/)
- [ESLint](https://eslint.org/) for Typescript and Javascript

## Deployment

- Raise a PR on `dev` branch
- When the PR is merged, GitLab CI will build and deploy the project
- Branch naming `<type>-short-description` where type can be [feat,fix,chore]

## Sources and other info

- [NFT Minter](https://koinect-nft-minter-dev.k8s-v2.trykoin.com/)
- [Sepolia Faucet](https://sepoliafaucet.com/)

## Troubleshooting

- Check the error in console log for errors

## Maintainers

- [Mwibutsa Floribert](https://github.com/mwibutsa)
