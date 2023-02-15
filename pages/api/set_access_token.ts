import type { NextApiRequest, NextApiResponse } from 'next'
import { LinkTokenCreateResponse } from 'plaid';
import client from './client';

type Data = {
  public_token_exchange: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    if (req.method != 'POST') {
      res.status(405).end();
    }; 
    const publicToken = req.body.public_token;
  try {
    const response = await client.itemPublicTokenExchange({
      public_token: publicToken,
    });
    // These values should be saved to a persistent database and
    // associated with the currently signed-in user
    const accessToken = response.data.access_token;
    const itemID = response.data.item_id;
    res.json({ public_token_exchange: 'complete' });
  } catch (error) {
    // handle error
  }
    
  } catch (error) {
    res.status(500)
  }
}
