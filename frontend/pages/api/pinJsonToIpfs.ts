import { NextRequest, NextResponse } from "next/server";

// define handler function
export default async function handler(req: NextRequest, res: NextResponse) {
  console.log("req.body", req.body);
  // parse metadata from request body
  const metadata = req.body;

  // check that method is POST
  if (req.method !== "POST") {
    res.status(405).send({ message: "Only POST requests allowed" });
    return;
  }

  try {
    // pin metadata to IPFS using Pinata API
    const { IpfsHash: cid } = await fetch(
      "https://api.pinata.cloud/pinning/pinJSONToIPFS",
      {
        method: "POST",
        body: JSON.stringify(metadata),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`,
        },
      }
    ).then((res) => {
      return res.json();
    });

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
