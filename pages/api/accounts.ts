import { NextApiRequest, NextApiResponse } from "next";
import client from "../../config/client";
import { connectToDatabase } from "../../config/db";
import { ErrorHandler } from "../../lib/errorHandler";

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
    if (!query.access_token) {
      throw new ErrorHandler(400, "Missing required parameter: access_token");
    }

    const accountsResponse = await client.accountsGet({
      access_token: query.access_token as string,
    });

    res.status(200).json(accountsResponse.data.accounts);
  } catch (error) {
    if (error instanceof ErrorHandler) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
}
