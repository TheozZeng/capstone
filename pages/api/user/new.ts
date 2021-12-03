import bcrypt from 'bcryptjs'
import { NextApiResponse } from 'next'
import connectDB from '../../../middleware/db'
import { AuthNextApiRequest, useJwt } from '../../../middleware/jwt'
import { UserModel } from '../../../model/user'

const handler = async (req: AuthNextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const { username, password } = req.body

    const exist = await UserModel.exists({ username })
    if (exist) {
      return res.status(400).send('Username already exists')
    }

    const hash = await bcrypt.hash(password, 10)

    const user = new UserModel({ username, hash })
    const created = await user.save()

    if (created) {
      return res.status(200).json(created)
    }
  }
}

export default connectDB(handler)
