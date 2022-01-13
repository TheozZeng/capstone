import { NextApiRequest, NextApiResponse } from 'next'
import connectDB from '../../../middleware/db'
import { useJwt } from '../../../middleware/jwt'
import { KeywordModel } from '../../../model/keyword'

export interface KeywordAutoComplete {
  keyword?: string
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    const { keyword } = req.query as {
      [key: string]: string
    }

    const queryObject = {
      ...(keyword ? { keyname: new RegExp(`${keyword}`, 'i') } : {})
    }

    try {
      const keywords = await KeywordModel.find(queryObject, 'keyname -_id')
      return res.status(200).json({
        keywords
      })
    } catch (err) {
      return res.status(400).json({
        message: `DB Error: ${err.message}`
      })
    }
  }
}

export default connectDB(useJwt(handler))
