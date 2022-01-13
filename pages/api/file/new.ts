import { NextApiResponse } from 'next'
import connectDB from '../../../middleware/db'
import { AuthNextApiRequest, useJwt } from '../../../middleware/jwt'
import { FileModel } from '../../../model/file'
import KeywordModel, { NewKeyword } from '../../../model/keyword'
import { StorageUrl } from '../../../model/storage'

export interface NewFile {
  name: string
  createdBy: string
  college: string
  course: string
  topic: string
  document: [StorageUrl]
}

export interface NewFilePayload {
  file: NewFile
  keywords: NewKeyword[]
}

const handler = async (req: AuthNextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const payload = req.body as NewFilePayload
    const file = payload.file

    const newFile = new FileModel(file)

    try {
      const created = await newFile.save()

      await KeywordModel.insertMany(payload.keywords)

      return res.status(200).json(created)
    } catch (err) {
      return res.status(400).json({
        message: `DB Error: ${err.message}`
      })
    }
  }
}

export default connectDB(useJwt(handler))
