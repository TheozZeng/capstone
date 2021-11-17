import { NextApiResponse } from 'next'
import connectDB from '../../../middleware/db'
import { AuthNextApiRequest, useJwt } from '../../../middleware/jwt'
import { FileModel } from '../../../model/file'

const handler = async (req: AuthNextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    const {
      query: { id }
    } = req
    FileModel.findById(id)
      .populate('createdBy college course topic')
      .exec((err, c) => {
        if (err) {
          return res.status(400).json({
            message: `DB Error: ${err.message}`
          })
        }
        return res.status(200).json(c)
      })
  }

  if (req.method === 'POST') {
    const {
      query: { id }
    } = req
    const payload = req.body

    FileModel.findByIdAndUpdate(id, payload, {
      new: true
    })
      .populate('createdBy college course topic')
      .exec((err, updated) => {
        if (err) {
          return res.status(400).json({
            message: `DB Error: ${err.message}`
          })
        }
        return res.status(200).json(updated)
      })
  }

  if (req.method === 'DELETE') {
    const {
      query: { id }
    } = req

    const c = await FileModel.findByIdAndDelete(id)

    if (c) {
      return res.status(200).json(c)
    }
  }
}

export default connectDB(useJwt(handler))
