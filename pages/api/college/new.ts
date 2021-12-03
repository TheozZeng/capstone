import { NextApiResponse } from 'next'
import connectDB from '../../../middleware/db'
import { AuthNextApiRequest, useJwt } from '../../../middleware/jwt'
import { CollegeModel } from '../../../model/college'

export interface NewCollege {
  name: string
}

const handler = async (req: AuthNextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const payload = req.body as NewCollege
    const newCollege = new CollegeModel(payload)

    const created = await newCollege.save()

    if (created) {
      return res.status(200).json(created)
    }
  }
}

export default connectDB(useJwt(handler))
