import { NextApiResponse } from 'next'
import connectDB from '../../../middleware/db'
import { AuthNextApiRequest, useJwt } from '../../../middleware/jwt'
import { TopicModel } from '../../../model/topic'

export interface NewTopic {
  name: string
  college: string
  course: string
}

const handler = async (req: AuthNextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const payload = req.body as NewTopic
    const newTopic = new TopicModel(payload)

    const created = await newTopic.save()

    if (created) {
      return res.status(200).json(created)
    }
  }
}

export default connectDB(useJwt(handler))
