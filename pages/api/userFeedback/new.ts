import { NextApiResponse } from 'next'
import connectDB from '../../../middleware/db'
import { AuthNextApiRequest, useJwt } from '../../../middleware/jwt'
import { UserFeedbackModel } from '../../../model/userFeedback'

export interface NewUserFeedback {
  username: string
  name: string
  email: string
  title: string
  description: string
}

const handler = async (req: AuthNextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const payload = req.body as NewUserFeedback
    const newUserFeedback = new UserFeedbackModel(payload)

    const created = await newUserFeedback.save()

    if (created) {
      return res.status(200).json(created)
    }
  }
}

export default connectDB(useJwt(handler))
