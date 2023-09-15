import styles from "./minter.module.css";
import { Contract } from "alchemy-sdk";
import React, { useState } from "react";
import { useAccount } from "wagmi";
import { useSigner } from "@/hooks/useEthers";
import { ConnectKitButton } from "connectkit";
type NftMinterProps = {
  contractAddress: string;
  tokenUri: string;
  abi: any;
  contentSrc?: string;
  contentType?: string;
};

// NFT Minter component

const NftMinter: React.FC<NftMinterProps> = ({
  contractAddress,
  tokenUri,
  abi,
  contentSrc,
  contentType,
}) => {
  const { address, isDisconnected } = useAccount();
  const [txHash, setTxHash] = useState("");
  const [isMinting, setIsMinting] = useState(false);
  const signer = useSigner();
  const [amount, setAmount] = useState(1);
  const [tokenId, setTokenId] = useState<string | number>(1);

  // Function to mint a new NFT

  const mintNFT = async () => {
    const nftContract = new Contract(contractAddress, abi, signer);
    try {
      setIsMinting(true);

      const mintTx = await nftContract.mint(address, +tokenId, +amount, []);
      await nftContract.setURI(tokenUri);
      setTxHash(mintTx?.hash);
      await mintTx.wait();
      setIsMinting(false);
      setTxHash("");
    } catch (e) {
      alert(e.message);
      setIsMinting(false);
    }
  };
  return (
    <div className={styles.page_flexBox}>
      <div className={styles.page_container}>
        <div className={styles.nft_media_container}>
          {contentType == "video" ? (
            <video className={styles.nft_media} autoPlay={true}>
              <source src={contentSrc} type="video/mp4" />
            </video>
          ) : (
            <img src={contentSrc} className={styles.nft_media} />
          )}
        </div>

        <div className={styles.nft_info}>
          <h1 className={styles.nft_title}>Create Web3 Dapp NFT</h1>
          <h3 className={styles.nft_author}>By Alchemy.eth</h3>
          <p className={styles.text}>
            Bootstrap a full stack dapp in 5 minutes with customizable
            components and project templates using Create Web3 Dapp.
          </p>
          <hr className={styles.break} />
          <h3 className={styles.nft_instructions_title}>INSTRUCTIONS</h3>
          <p className={styles.text}>
            This NFT is on Sepolia. You’ll need some test Sepolia ETH to mint
            the NFT. <a href="https://sepoliafaucet.com/">Get free test ETH</a>
          </p>
          {!txHash && (
            <>
              <h3 className={styles.input_label}>Token ID</h3>
              <input
                className={styles.input}
                value={tokenId}
                onChange={(e) => setTokenId(e.target.value)}
                type={"text"}
                placeholder="Token Id"
                disabled={!!txHash || isMinting}
              />

              <h3 className={styles.input_label}>Value</h3>
              <input
                className={styles.input}
                value={amount}
                onChange={(e) => setAmount(+e.target.value)}
                type={"number"}
                placeholder="Value"
                disabled={!!txHash || isMinting}
              />
            </>
          )}
          {isDisconnected ? (
            <ConnectKitButton />
          ) : !txHash ? (
            <button
              className={`${styles.button} ${
                isMinting && `${styles.isMinting}`
              }`}
              disabled={isMinting}
              onClick={async () => await mintNFT()}
            >
              {isMinting ? "Minting" : "Mint Now"}
            </button>
          ) : (
            <div>
              <h3 className={styles.attribute_input_label}>TX ADDRESS</h3>
              <a
                href={`https://${String(
                  process.env.NEXT_PUBLIC_DEFAULT_CHAIN
                ).replace("eth-", "")}.etherscan.io/tx/${txHash}`}
                target="_blank"
                rel="noreferrer"
              >
                <div className={styles.address_container}>
                  <div>
                    {txHash?.slice(0, 6)}...{txHash?.slice(6, 10)}
                  </div>
                  <img
                    src={
                      "https://static.alchemyapi.io/images/cw3d/Icon%20Large/etherscan-l.svg"
                    }
                    width="20px"
                    height="20px"
                  />
                </div>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NftMinter;
