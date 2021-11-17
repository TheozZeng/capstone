import { NextApiResponse } from 'next'
import connectDB from '../../../middleware/db'
import { AuthNextApiRequest, useJwt } from '../../../middleware/jwt'
import { UserModel } from '../../../model/user'

const handler = async (req: AuthNextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    const {
      query: { id }
    } = req

    const user = await UserModel.findById(id)

    return res.status(200).json(user)
  }
}

export default connectDB(useJwt(handler))
