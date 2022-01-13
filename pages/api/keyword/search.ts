import { NextApiRequest, NextApiResponse } from 'next'
import { DEFAULT_PAGESIZE } from '../../../config/global'
import connectDB from '../../../middleware/db'
import { useJwt } from '../../../middleware/jwt'
import { KeywordModel } from '../../../model/keyword'

export const getPageSize = (
  pageIndex: number,
  pageSize: number,
  total: number
) => {
  const skip = pageSize * (pageIndex - 1)
  return total - skip > pageSize ? pageSize : total - skip
}

export interface KeywordSearchRes {
  pageInfo: { pageSize: number; pageIndex: number; total: number }
  documents: string[]
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    const { keyword, pageIndex, pageSize } = req.query as {
      [key: string]: string
    }

    const index = Number(pageIndex || 1)
    const size = Number(pageSize || DEFAULT_PAGESIZE)
    const skip = (index - 1) * size

    const queryObject = {
      ...(keyword ? { keyname: new RegExp(`${keyword}`, 'i') } : {})
    }

    const total = await KeywordModel.countDocuments(queryObject)

    try {
      const documents = await KeywordModel.find(queryObject, null, {
        skip,
        limit: getPageSize(index, size, total),
        sort: {
          score: -1
        }
      })
      return res.status(200).json({
        pageInfo: { pageSize: size, pageIndex: index, total },
        documents
      })
    } catch (err) {
      return res.status(400).json({
        message: `DB Error: ${err.message}`
      })
    }
  }
}

export default connectDB(useJwt(handler))
