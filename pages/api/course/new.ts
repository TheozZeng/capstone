import { NextApiResponse } from 'next'
import connectDB from '../../../middleware/db'
import { AuthNextApiRequest, useJwt } from '../../../middleware/jwt'
import { CourseModel } from '../../../model/course'

export interface NewCourse {
  name: string
  college: string
}

const handler = async (req: AuthNextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const payload = req.body as NewCourse
    const newCourse = new CourseModel(payload)

    const created = await newCourse.save()

    if (created) {
      return res.status(200).json(created)
    }
  }
}

export default connectDB(useJwt(handler))
