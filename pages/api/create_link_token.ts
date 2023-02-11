import { AxiosResponse } from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next'
import { Configuration } from 'plaid';
import { CountryCode, LinkTokenCreateRequest, LinkTokenCreateResponse, PlaidApi, Products } from 'plaid/dist/api';
import { PlaidEnvironments } from 'plaid/dist/configuration';

const PLAID_CLIENT_ID = process.env.PLAID_CLIENT_ID;
const PLAID_SECRET = process.env.PLAID_SECRET;
const PLAID_ENV = process.env.PLAID_ENV || 'sandbox';


const configuration = new Configuration({
  basePath: PlaidEnvironments[PLAID_ENV],
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': PLAID_CLIENT_ID,
      'PLAID-SECRET': PLAID_SECRET,
      'Plaid-Version': '2020-09-14',
    },
  },
});

const client = new PlaidApi(configuration);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<LinkTokenCreateResponse>
) {
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
  try {
    const createTokenResponse = await client.linkTokenCreate(request);
    res.json(createTokenResponse.data);
  } catch (error) {
    // handle error
  }
}
