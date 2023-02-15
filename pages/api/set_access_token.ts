import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  name: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    if (req.method != 'POST') {
      res.status(405).end();
    }; 
    // req.body.public_token
    
  } catch (error) {
    res.status(500)
  }
}
