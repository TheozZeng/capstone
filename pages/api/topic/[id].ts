import { NextApiResponse } from 'next'
import connectDB from '../../../middleware/db'
import { AuthNextApiRequest, useJwt } from '../../../middleware/jwt'
import { TopicModel } from '../../../model/topic'

const handler = async (req: AuthNextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    const {
      query: { id }
    } = req
    const c = await TopicModel.findById(id)

    return res.status(200).json(c)
  }

  if (req.method === 'POST') {
    const {
      query: { id }
    } = req
    const payload = req.body

    const updated = await TopicModel.findByIdAndUpdate(id, payload, {
      new: true
    })

    if (updated) {
      return res.status(200).json(updated)
    }
  }

  if (req.method === 'DELETE') {
    const {
      query: { id }
    } = req

    const c = await TopicModel.findByIdAndDelete(id)

    if (c) {
      return res.status(200).json(c)
    }
  }
}

export default connectDB(useJwt(handler))
