import { AxiosResponse } from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next'
import { Configuration } from 'plaid';
import { CountryCode, LinkTokenCreateRequest, LinkTokenCreateResponse, PlaidApi, Products } from 'plaid/dist/api';
import { PlaidEnvironments } from 'plaid/dist/configuration';
import client from './client';
import { ErrorHandler } from './hello';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method != 'POST') {
      throw new ErrorHandler(405, "Method not allowed")
    }; 
    // Get the client_user_id by searching for the current user
    // const user = await User.find(...);
    const clientUserId = 1;

    const request: LinkTokenCreateRequest = {
      user: {
        client_user_id: clientUserId.toString(),
      },
      client_name: 'Plaid Test App',
      products: ['auth'] as Products[],
      language: 'en',
      // webhook: 'https://webhook.example.com',
      // redirect_uri: 'https://domainname.com/oauth-page.html',
      country_codes: ['US'] as CountryCode[],
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
