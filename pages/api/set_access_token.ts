import type { NextApiRequest, NextApiResponse } from 'next'
import Error from 'next/error';
import { LinkTokenCreateResponse } from 'plaid';
import client from './client';
import { ErrorHandler } from './hello';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method != 'POST') {
      throw new ErrorHandler(405, "Method not allowed");
    }; 
    const publicToken = req.body.public_token;
    const response = await client.itemPublicTokenExchange({
      public_token: publicToken,
    });
    // These values should be saved to a persistent database and
    // associated with the currently signed-in user
    const accessToken = response.data.access_token;
    const itemID = response.data.item_id;
    res.json({ public_token_exchange: 'complete' });
    
  } catch (error) {
    if (error instanceof ErrorHandler) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
}
