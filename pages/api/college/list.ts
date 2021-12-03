import { NextApiRequest, NextApiResponse } from 'next'
import connectDB from '../../../middleware/db'
import { useJwt } from '../../../middleware/jwt'
import { CollegeModel, ICollege } from '../../../model/college'

export interface CollegeListRes {
  colleges: ICollege[]
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    const { keyword } = req.query as {
      [key: string]: string
    }

    const queryObject = {
      ...(keyword ? { name: new RegExp(`${keyword}`, 'i') } : {})
    }

    const colleges = await CollegeModel.find(queryObject)

    return res.status(200).json({
      colleges
    })
  }
}

export default connectDB(useJwt(handler))
