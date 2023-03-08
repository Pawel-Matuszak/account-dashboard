import { ObjectId } from "mongodb";
import type { NextApiRequest, NextApiResponse } from "next";
import Error from "next/error";
import { LinkTokenCreateResponse } from "plaid";
import { connectToDatabase } from "../../config/db";
import client from "../../config/client";
import { ErrorHandler } from "../../lib/errorHandler";
import { z } from "zod";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method != "GET") {
      throw new ErrorHandler(405, "Method not allowed");
    }

    if (!req.query) {
      throw new ErrorHandler(400, "Missing query");
    }

    const query = req.query;
    if (!query.userID) {
      throw new ErrorHandler(400, "Missing required parameter: userID");
    }
    const schema = z.coerce.string();
    if (schema.safeParse(query.userID).success === false) {
      throw new ErrorHandler(400, "Parameter: userID has to be a string");
    }

    const { db } = await connectToDatabase();
    var userData = await db
      .collection("users")
      .findOne({ _id: new ObjectId(query.userID as string) });

    if (userData == null) throw new ErrorHandler(400, "User does not exist");
    // if (userData.access_token == null) throw new ErrorHandler(400, "User does not have a access token");

    res.json({
      access_token: userData.access_token,
    });
  } catch (error) {
    if (error instanceof ErrorHandler) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
}
