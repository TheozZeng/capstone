import bcrypt from 'bcryptjs'
import { NextApiRequest, NextApiResponse } from 'next'
import connectDB from '../../../middleware/db'
import { useJwt } from '../../../middleware/jwt'
import { UserModel } from '../../../model/user'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const { userId, newPassword, oldPassword } = req.body

    const user = await UserModel.findById(userId)
    if (!user) {
      return res.status(400).json({ message: 'User does not exist' })
    }

    const verified = await bcrypt.compare(oldPassword, user.hash)
    if (verified) {
      const hash = await bcrypt.hash(newPassword, 10)

      const update = await UserModel.findByIdAndUpdate(
        userId,
        { hash },
        { new: true }
      )
      if (update) {
        const { hash, ...rest } = update
        return res.status(200).json(rest)
      }
    } else {
      return res.status(400).json({ message: 'Invalid Old Password' })
    }
  }
}

export default connectDB(useJwt(handler))
