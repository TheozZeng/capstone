import { NextApiResponse } from 'next'
import { exposeObjectAcl } from '../../../service/storage.service'
import { AuthNextApiRequest, useJwt } from '../../../middleware/jwt'

const handler = async (req: AuthNextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const { signedUrl, bucket, key } = req.body
    const publicUrl = await exposeObjectAcl(signedUrl, bucket, key).catch((e) =>
      console.log(e.message)
    )
    return res.status(200).json({ url: publicUrl })
  }
}

export default useJwt(handler)
