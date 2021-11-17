import { NextApiRequest, NextApiResponse } from 'next'
import connectDB from '../../../middleware/db'
import { useJwt } from '../../../middleware/jwt'
import { ITopic, TopicModel } from '../../../model/topic'

export interface TopicListRes {
  topics: ITopic[]
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    const { keyword, college, course } = req.query as {
      [key: string]: string
    }

    const queryObject = {
      ...(keyword ? { name: new RegExp(`${keyword}`, 'i') } : {}),
      ...(college ? { college } : {}),
      ...(course ? { course } : {})
    }

    const topics = await TopicModel.find(queryObject)

    return res.status(200).json({
      topics
    })
  }
}

export default connectDB(useJwt(handler))
