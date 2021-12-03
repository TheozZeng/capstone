import { NextApiResponse } from 'next'
import connectDB from '../../../middleware/db'
import { AuthNextApiRequest, useJwt } from '../../../middleware/jwt'
import { CollegeModel } from '../../../model/college'

const handler = async (req: AuthNextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    const {
      query: { id }
    } = req
    const c = await CollegeModel.findById(id)

    return res.status(200).json(c)
  }

  if (req.method === 'POST') {
    const {
      query: { id }
    } = req
    const payload = req.body

    const updated = await CollegeModel.findByIdAndUpdate(id, payload, {
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

    const c = await CollegeModel.findByIdAndDelete(id)

    if (c) {
      return res.status(200).json(c)
    }
  }
}

export default connectDB(useJwt(handler))
