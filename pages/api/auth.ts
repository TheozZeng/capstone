import { NextApiRequest, NextApiResponse } from 'next'
import connectDB from '../../middleware/db'
import { UserModel } from '../../model/user'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export interface AuthRes {
  _id: string
  token: string
  username: string
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const { username, password } = req.body
    const user = await UserModel.findOne({ username })
    if (user) {
      const verified = await bcrypt.compare(password, user.hash)
      if (verified) {
        const { username, _id } = user
        const token = jwt.sign({ username, _id }, process.env.JWT_SECRET, {
          expiresIn: '20d'
        })

        return res.status(200).json({ token, username, _id })
      } else {
        return res
          .status(400)
          .json({ message: 'Username or password does not match' })
      }
    } else {
      return res.status(400).json({ message: 'Username does not exist' })
    }
  }
}

export default connectDB(handler)
