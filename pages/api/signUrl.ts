import { NextApiResponse } from 'next'
import { AuthNextApiRequest, useJwt } from '../../middleware/jwt'
import { getPresignedGetUrl } from '../../service/storage.service'

const handler = async (req: AuthNextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const { url } = req.body
    try {
      const presigned = await getPresignedGetUrl(url as string)
      return res.status(200).json({ url: presigned })
    } catch (err) {
      return res.status(400).json({ message: err })
    }
  }
}

export default useJwt(handler)
