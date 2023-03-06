import { AxiosResponse } from "axios";
import { z } from "zod";
import type { NextApiRequest, NextApiResponse } from "next";
import { Configuration } from "plaid";
import {
  CountryCode,
  LinkTokenCreateRequest,
  LinkTokenCreateResponse,
  PlaidApi,
  Products,
} from "plaid/dist/api";
import { PlaidEnvironments } from "plaid/dist/configuration";
import client from "../../config/client";
import { connectToDatabase } from "../../lib/db";
import { ObjectId } from "mongodb";
import { ErrorHandler } from "../../lib/errorHandler";

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
    const body = req.body;
    if (!body.userID) {
      throw new ErrorHandler(400, "Missing required parameter: id");
    }
    const schema = z.coerce.string();
    if (schema.safeParse(body.userID).success === false) {
      throw new ErrorHandler(400, "Parameter: id has to be a string");
    }

    const { db } = await connectToDatabase();
    let result = await db
      .collection("users")
      .findOne({ _id: new ObjectId(body.userID) });
    // Get the client_user_id by searching for the current user
    // const user = await User.find(...);
    const clientUserID = result?._id;

    if (clientUserID === undefined) {
      throw new ErrorHandler(400, "User not found");
    }

    const request: LinkTokenCreateRequest = {
      user: {
        client_user_id: clientUserID?.toString(),
      },
      client_name: "Plaid Test App",
      products: ["auth"] as Products[],
      language: "en",
      // webhook: 'https://webhook.example.com',
      // redirect_uri: 'https://domainname.com/oauth-page.html',
      country_codes: ["US"] as CountryCode[],
    };
    const createTokenResponse = await client.linkTokenCreate(request);
    res.json(createTokenResponse.data);
  } catch (error) {
    if (error instanceof ErrorHandler) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
}
