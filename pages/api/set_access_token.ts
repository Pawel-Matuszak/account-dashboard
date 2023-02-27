import { ObjectId } from "mongodb";
import type { NextApiRequest, NextApiResponse } from "next";
import Error from "next/error";
import { LinkTokenCreateResponse } from "plaid";
import { connectToDatabase } from "../../lib/db";
import client from "./client";
import { ErrorHandler } from "./hello";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method != "POST") {
      throw new ErrorHandler(405, "Method not allowed");
    }

    if (!req.body) {
      throw new ErrorHandler(400, "Missing body");
    }

    const publicToken = req.body.public_token;

    const response = await client.itemPublicTokenExchange({
      public_token: publicToken,
    });
    const { db } = await connectToDatabase();
    db.collection("users").updateOne(
      { _id: new ObjectId(response.data.userId) },
      {
        $set: {
          access_token: response.data.access_token,
          itemID: response.data.item_id,
        },
      }
    );
    res.json({ public_token_exchange: "complete" });
  } catch (error) {
    if (error instanceof ErrorHandler) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
}
