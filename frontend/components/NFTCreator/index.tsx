// Import necessary modules and styles
import styles from "./NftCreator.module.css";
import { Contract } from "alchemy-sdk";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useAccount } from "wagmi";
import { useSigner } from "@/hooks/useEthers";
import axios from "axios";
import { ConnectKitButton } from "connectkit";
type NftCreatorProps = {
  contractAddress: string;
  abi: Array<any>;
};

type NFTAttribute = {
  trait_type: "";
  value: "";
};
// React component for NFT creator form
const NftCreator: React.FC<NftCreatorProps> = ({ contractAddress, abi }) => {
  // Hooks for handling form input and submission
  const { address, isDisconnected } = useAccount();
  const signer = useSigner();
  const [txHash, setTxHash] = useState<string>("");
  const [imageURL, setImageURL] = useState<string>("");
  const [imageFile, setImageFile] = useState();
  const [NFTName, setNFTName] = useState<string>("");
  const [NFTDescription, setNFTDescription] = useState("");
  const [NFTAttributes, setNFTAttributes] = useState<Array<NFTAttribute>>([
    { trait_type: "", value: "" },
  ]);
  const [amount, setAmount] = useState(1);
  const [tokenId, setTokenId] = useState<string | number>(1);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(false);

  // Function to check if all required form fields are filled
  const formNotFilled = () => {
    return (
      !imageFile ||
      !NFTName ||
      !NFTDescription ||
      !NFTAttributes[0].trait_type ||
      !NFTAttributes[0].value
    );
  };

  // Callback function for handling file drop
  const onDrop = useCallback((acceptedFiles: Array<any>) => {
    setImageFile(acceptedFiles[0]);
    setImageURL(URL.createObjectURL(acceptedFiles[0]));
  }, []);

  // Hook for handling file upload via drag and drop
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    multiple: false,
    accept: {
      "image/png": [".png", ".PNG"],
      "image/jpeg": [".jpg", ".jpeg"],
    },
    onDrop,
  });

  // Functions for adding, updating, and removing NFT attributes
  const addAttribute = () => {
    const attribute: NFTAttribute = { trait_type: "", value: "" };
    setNFTAttributes([...NFTAttributes, attribute]);
  };

  const subtractAttribute = (index: number) => {
    const attributes = [...NFTAttributes];
    attributes.splice(index, index);
    setNFTAttributes(attributes);
  };

  const updateAttribute = (parameter: string, value: string, index: number) => {
    const attributes: Array<NFTAttribute> = [...NFTAttributes];
    attributes[index][parameter] = value;
    setNFTAttributes(attributes);
  };

  // Function for minting the NFT and generating metadata
  const mintNFT = async () => {
    if (formNotFilled()) {
      setError(true);
      return;
    }

    setError(false);
    setIsSubmitting(true);

    try {
      const NFTContract = new Contract(contractAddress, abi, signer);
      const metadataURL = await generateMetadata();

      const mintTx = await NFTContract.mint(address, tokenId, amount, []);
      await NFTContract.setURI(metadataURL);
      setTxHash(mintTx.hash);
      await mintTx.wait();
      setTxHash("");
    } catch (e) {
      alert(e.message);
      return;
    } finally {
      setIsSubmitting(false);
    }
  };
  // Async function to generate metadata for the NFT
  const generateMetadata = async () => {
    // Create a new instance of a FormData object
    const formData = new FormData();
    // Append the image file to the FormData object
    if (imageFile) {
      formData.append("image", imageFile);

      // Send a POST request to the api/pinFileToIpfs.js to store the NFT image or video on IPFS

      const {
        data: { fileURL },
      } = await axios.post("/api/pinFileToIpfs", formData);

      // Create a metadata object with the NFT's description, image file URL, name, and attributes
      const metadata = {
        description: NFTDescription,
        image: fileURL,
        name: NFTName,
        attributes: NFTAttributes,
      };

      console.log("metadata", metadata);

      // Send a POST request to the api/pinJsonToIpfs.js to store the NFT metadata on IPFS
      const {
        data: { metadataURL },
      } = await axios.post("/api/pinJsonToIpfs", metadata);

      // Return the metadata URL for the NFT
      return metadataURL;
    }
  };

  return (
    // Main page container
    <div className={styles.page_flexBox}>
      <div
        // Check if transaction hash exists to change styling of container
        className={
          !txHash ? styles.page_container : styles.page_container_submitted
        }
      >
        <div className={styles.dropzone_container} {...getRootProps()}>
          <input {...getInputProps()}></input>
          {/* Check if an image is uploaded and display it */}
          {imageURL ? (
            <img
              alt={"NFT Image"}
              className={styles.nft_image}
              src={imageURL}
            />
          ) : isDragActive ? (
            <p className="dropzone-content">Release to drop the files here </p>
          ) : (
            // Default dropzone content
            <div>
              <p className={styles.dropzone_header}>
                Drop your NFT art here, <br /> or{" "}
                <span className={styles.dropzone_upload}>upload</span>
              </p>
              <p className={styles.dropzone_text}>Supports .jpg, .jpeg, .png</p>
            </div>
          )}
        </div>
        <div className={styles.inputs_container}>
          {/* Input field for NFT name */}
          <div className={styles.input_group}>
            <h3 className={styles.input_label}>NAME OF NFT</h3>
            {!txHash ? (
              <input
                className={styles.input}
                value={NFTName}
                onChange={(e) => setNFTName(e.target.value)}
                type={"text"}
                placeholder="NFT Title"
              />
            ) : (
              <p>{NFTName}</p>
            )}
          </div>
          {/* Input field for NFT description */}
          <div className={styles.input_group}>
            <h3 className={styles.input_label}>DESCRIPTION</h3>
            {!txHash ? (
              <input
                className={styles.input}
                onChange={(e) => setNFTDescription(e.target.value)}
                value={NFTDescription}
                placeholder="NFT Description"
              />
            ) : (
              <p>{NFTDescription}</p>
            )}
          </div>
          <div className={styles.input_group}>
            {!txHash && (
              <>
                <h3 className={styles.input_label}>Token ID</h3>
                <input
                  className={styles.input}
                  value={tokenId}
                  onChange={(e) => setTokenId(e.target.value)}
                  type={"text"}
                  placeholder="Token Id"
                  disabled={!!txHash || isSubmitting}
                />

                <h3 className={styles.input_label}>Value</h3>
                <input
                  className={styles.input}
                  value={amount}
                  onChange={(e) => setAmount(+e.target.value)}
                  type={"number"}
                  placeholder="Value"
                  disabled={!!txHash || isSubmitting}
                />
              </>
            )}
          </div>
          {/* Dynamic attribute input fields */}
          <>
            {NFTAttributes &&
              NFTAttributes.map((attribute, index) => {
                return (
                  <div key={index} className={styles.attributes_container}>
                    <div className={styles.attributes_input_container}>
                      <div className={styles.attribute_input_group}>
                        {/* Input field for attribute name */}
                        <h3 className={styles.attribute_input_label}>
                          ATTRIBUTE NAME
                        </h3>
                        <input
                          className={styles.attribute_input}
                          value={attribute.traitType}
                          placeholder={"Background"}
                          onChange={(e) =>
                            updateAttribute("trait_type", e.target.value, index)
                          }
                        ></input>
                      </div>
                      <div className={styles.attribute_input_group}>
                        {/* Input field for attribute value */}
                        <h3 className={styles.attribute_input_label}>
                          ATTRIBUTE VALUE
                        </h3>
                        <input
                          className={styles.attribute_input}
                          value={attribute.value}
                          placeholder={"White"}
                          onChange={(e) =>
                            updateAttribute("value", e.target.value, index)
                          }
                        ></input>
                      </div>
                      {/* Subtract attribute button */}
                      {!txHash ? (
                        <div className={styles.subtract_button_container}>
                          <img
                            onClick={() => subtractAttribute(index)}
                            className={styles.minus_circle}
                            src="https://static.alchemyapi.io/images/cw3d/Icon%20Dark/Small/minus-circle-contained-s.svg"
                            alt=""
                          />
                        </div>
                      ) : null}
                    </div>
                  </div>
                );
              })}
          </>

          {!txHash ? (
            <div className={styles.button_container}>
              <div className={styles.button} onClick={() => addAttribute()}>
                Add attribute
              </div>
            </div>
          ) : null}
          <div>
            {isDisconnected ? (
              <ConnectKitButton />
            ) : !txHash ? (
              <div>
                <button
                  className={
                    isSubmitting
                      ? styles.submit_button_submitting
                      : styles.submit_button
                  }
                  disabled={isSubmitting}
                  onClick={async () => await mintNFT()}
                >
                  {isSubmitting ? "Minting NFT" : "Mint NFT"}
                </button>
                {error ? (
                  <p className={styles.error}>One or more fields is blank</p>
                ) : null}
              </div>
            ) : (
              <div>
                <h3 className={styles.attribute_input_label}>ADDRESS</h3>
                <a
                  href={`https://${String(
                    process.env.NEXT_PUBLIC_DEFAULT_CHAIN
                  ).replace("eth-", "")}.etherscan.io/tx/${txHash}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <div className={styles.address_container}>
                    <div>
                      {txHash.slice(0, 6)}...{txHash.slice(6, 10)}
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
    </div>
  );
};

export default NftCreator;
