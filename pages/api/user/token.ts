import { NextApiResponse } from 'next'
import connectDB from '../../../middleware/db'
import { AuthNextApiRequest, useJwt } from '../../../middleware/jwt'

const handler = async (req: AuthNextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    return res.status(200).json(req.auth)
  }
}

export default connectDB(useJwt(handler))
