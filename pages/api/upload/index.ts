import { NextApiResponse } from 'next'
import { AuthNextApiRequest, useJwt } from '../../../middleware/jwt'
import { getPresignedPutUrl } from '../../../service/storage.service'

const handler = async (req: AuthNextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const { bucket, key } = req.body
    const presigned = await getPresignedPutUrl(bucket, key)
    return res.status(200).json({ url: presigned })
  }
}

export default useJwt(handler)
