import { NextApiRequest, NextApiResponse } from 'next'
import connectDB from '../../../middleware/db'
import { useJwt } from '../../../middleware/jwt'
import { CourseModel, ICourse } from '../../../model/course'

export interface CourseListRes {
  courses: ICourse[]
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    const { keyword, college } = req.query as {
      [key: string]: string
    }

    const queryObject = {
      ...(keyword ? { name: new RegExp(`${keyword}`, 'i') } : {}),
      ...(college ? { college } : {})
    }

    const courses = await CourseModel.find(queryObject)

    return res.status(200).json({
      courses
    })
  }
}

export default connectDB(useJwt(handler))
