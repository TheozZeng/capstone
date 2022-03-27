import { NextApiRequest, NextApiResponse } from 'next'
import connectDB from '../../../middleware/db'
import { useJwt } from '../../../middleware/jwt'
import { UserFeedbackModel, IUserFeedback } from '../../../model/userFeedback'

export interface UserFeedbackListRes {
  userFeedbacks: IUserFeedback[]
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    const { keyword } = req.query as {
      [key: string]: string
    }

    const queryObject = {
      ...(keyword ? { name: new RegExp(`${keyword}`, 'i') } : {})
    }

    const userFeedbacks = await UserFeedbackModel.find(queryObject)

    return res.status(200).json({
      userFeedbacks
    })
  }
}

export default connectDB(useJwt(handler))
