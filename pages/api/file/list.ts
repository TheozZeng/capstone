import connectDB from '../../../middleware/db'
import { FileModel, IFile } from '../../../model/file'
import { NextApiRequest, NextApiResponse } from 'next'
import { useJwt } from '../../../middleware/jwt'
import { DEFAULT_PAGESIZE } from '../../../config/global'

export const getPageSize = (
  pageIndex: number,
  pageSize: number,
  total: number
) => {
  const skip = pageSize * (pageIndex - 1)
  return total - skip > pageSize ? pageSize : total - skip
}

export interface FileListRes {
  pageInfo: { pageSize: number; pageIndex: number; total: number }
  files: IFile[]
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    const { keyword, pageIndex, pageSize, college, course, topic } =
      req.query as {
        [key: string]: string
      }

    const index = Number(pageIndex || 1)
    const size = Number(pageSize || DEFAULT_PAGESIZE)
    const skip = (index - 1) * size

    const queryObject = {
      ...(keyword ? { name: new RegExp(`${keyword}`, 'i') } : {}),
      ...(college ? { college } : {}),
      ...(course ? { course } : {}),
      ...(topic ? { topic } : {})
    }

    const total = await FileModel.countDocuments(queryObject)

    FileModel.find(queryObject, null, {
      skip,
      limit: getPageSize(index, size, total),
      sort: {
        likes: -1
      }
    })
      .populate('createdBy college course topic')
      .exec((err, files) => {
        if (err) {
          return res.status(400).json({
            message: `DB Error: ${err.message}`
          })
        }
        return res.status(200).json({
          pageInfo: { pageSize: size, pageIndex: index, total },
          files
        })
      })
  }
}

export default connectDB(useJwt(handler))
