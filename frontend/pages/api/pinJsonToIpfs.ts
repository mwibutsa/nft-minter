import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

// define handler function
export default async function handler(req: NextRequest, res: NextResponse) {
  // parse metadata from request body
  const metadata = req.body;

  // check that method is POST
  if (req.method !== "POST") {
    res.status(405).send({ message: "Only POST requests allowed" });
    return;
  }

  try {
    // pin metadata to IPFS using Pinata API
    const {
      data: { IpfsHash: cid },
    } = await axios.post(
      "https://api.pinata.cloud/pinning/pinJSONToIPFS",
      metadata,
      {
        headers: {
          "Content-Type": "application/json",
          pinata_api_key: process.env.NEXT_PUBLIC_PINATA_API_KEY,
          pinata_secret_api_key: process.env.NEXT_PUBLIC_PINATA_API_SECRET,
        },
      }
    );

    // send metadata URL in response
    if (cid) {
      res
        .status(200)
        .send({ metadataURL: `https://gateway.pinata.cloud/ipfs/${cid}` });
    }
  } catch (e) {
    // handle errors
    console.warn(e);
    res.status(500).send({
      message: "something went wrong, check the log in your terminal",
    });
  }
}
