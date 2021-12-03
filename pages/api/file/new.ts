import { NextApiResponse } from 'next'
import connectDB from '../../../middleware/db'
import { AuthNextApiRequest, useJwt } from '../../../middleware/jwt'
import { FileModel } from '../../../model/file'
import { StorageUrl } from '../../../model/storage'

export interface NewFile {
  name: string
  createdBy: string
  college: string
  course: string
  topic: string
  document: StorageUrl
}

const handler = async (req: AuthNextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const payload = req.body as NewFile
    const newFile = new FileModel(payload)

    const created = await newFile.save()

    if (created) {
      return res.status(200).json(created)
    }
  }
}

export default connectDB(useJwt(handler))
