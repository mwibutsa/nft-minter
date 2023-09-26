interface IResponseData {
  message?: string;
  metadataURL?: string;
}
import formidable from "formidable";
import fs from "fs";
import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export const config = {
  api: {
    bodyParser: false,
  },
};
interface IFormData {
  files: {
    image?: Array<{
      filepath: string;
    }>;
  };
  fields: Record<string, any>;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Check if request method is POST
  if (req.method !== "POST") {
    res.status(405).send({ message: "Only POST requests allowed" });
    return;
  }
  const FormData = require("form-data");
  // Parse the incoming form data
  const data = await new Promise<IFormData>((resolve, reject) => {
    const form = formidable({});
    form.parse(req, (err, fields, files) => {
      if (err) reject({ err });
      resolve({ files, fields });
    });
  });

  // Check if an image was uploaded
  const image = data.files?.image?.[0];

  if (image) {
    try {
      // Create a new form data object
      const formData = new FormData();
      // Append the image file to the form data object
      formData.append("file", fs.createReadStream(image.filepath));

      // Create a metadata object for the image
      const metadata = JSON.stringify({
        name: "File name",
      });
      // Append the metadata object to the form data object
      formData.append("pinataMetadata", metadata);

      // Create an options object for the image
      const options = JSON.stringify({
        cidVersion: 0,
      });

      // Append the options object to the form data object
      formData.append("pinataOptions", options);

      // Send a POST request to pin the file to IPFS using Pinata API
      const {
        data: { IpfsHash },
      } = await axios.post(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        formData,
        {
          maxContentLength: Number.POSITIVE_INFINITY,
          headers: {
            "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
            pinata_api_key: process.env.NEXT_PUBLIC_PINATA_API_KEY,
            pinata_secret_api_key: process.env.NEXT_PUBLIC_PINATA_API_SECRET,
          },
        }
      );

      // Return the file URL for the pinned image
      res
        .status(200)
        .send({ fileURL: `https://gateway.pinata.cloud/ipfs/${IpfsHash}` });
    } catch (e) {
      alert((e as Error).message);
      res.status(500).send({
        message: "something went wrong, check the log in your terminal",
      });
    }
  } else {
    console.warn("No image uploaded");
    res.status(403).send({
      message: "No image uploaded",
    });
  }
}
